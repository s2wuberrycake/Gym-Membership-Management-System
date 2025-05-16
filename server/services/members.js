import fs from "fs/promises"
import path from "path"
import { defaultDb } from "../config/db.js"
import { DateTime } from "luxon"
import { logUpdate } from "./logs.js"

const TIMEZONE = "Asia/Manila"
const getToday   = () => DateTime.now().setZone(TIMEZONE).startOf("day")
const formatDate = dt => dt.toFormat("yyyy-MM-dd")

const getDaysToAdd = async extend_date_id => {
  const [rows] = await defaultDb.query(
    "SELECT days FROM extend_date WHERE extend_date_id = ?",
    [extend_date_id]
  )
  if (!rows.length) throw new Error("Invalid extend_date_id")
  return rows[0].days
}

// 1) Enrollment
export const insertMember = async (data, account_id) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    profile_picture = null,
    extend_date_id,
    status_id = 1
  } = data

  const [[{ member_id }]] = await defaultDb.query(
    "SELECT UUID() AS member_id"
  )

  const daysToAdd  = await getDaysToAdd(extend_date_id)
  const today      = getToday()
  const expiration = today.plus({ days: daysToAdd })

  await defaultDb.query(
    `INSERT INTO members (
       member_id,
       first_name,
       last_name,
       email,
       contact_number,
       address,
       profile_picture,
       original_join_date,
       recent_join_date,
       expiration_date,
       status_id
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      member_id,
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      profile_picture,
      formatDate(today),
      formatDate(today),
      formatDate(expiration),
      status_id
    ]
  )

  await logUpdate(member_id, 1, account_id)
  return member_id
}

// 6) Re-enrollment (restore with new expiration)
export const restoreMember = async (id, extend_date_id, account_id) => {
  const conn = await defaultDb.getConnection()
  try {
    await conn.beginTransaction()

    const days      = await getDaysToAdd(extend_date_id)
    const today     = getToday()
    const fmtToday  = formatDate(today)
    const fmtExpiry = formatDate(today.plus({ days }))

    await conn.query(
      `UPDATE members
         SET recent_join_date = ?,
             expiration_date  = ?,
             status_id        = 1
       WHERE member_id = ?`,
      [fmtToday, fmtExpiry, id]
    )

    await conn.query(
      `DELETE FROM cancelled_members
       WHERE member_id = ?`,
      [id]
    )

    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }

  await logUpdate(id, 6, account_id)
}

// 3) Membership extension
export const extendMember = async (id, extend_date_id, account_id) => {
  const [rows] = await defaultDb.query(
    "SELECT expiration_date FROM members WHERE member_id = ?",
    [id]
  )
  if (!rows.length) throw new Error("Member not found")

  const existing = DateTime.fromJSDate(rows[0].expiration_date, { zone: TIMEZONE })
  const today    = getToday()
  const base     = existing < today ? today : existing
  const days     = await getDaysToAdd(extend_date_id)
  const newExp   = base.plus({ days })
  const fmtExp   = formatDate(newExp)

  const labelSql = newExp < today ? "expired" : "active"
  const [[{ status_id }]] = await defaultDb.query(
    "SELECT status_id FROM status_types WHERE status_label = ?",
    [labelSql]
  )

  await defaultDb.query(
    `UPDATE members
       SET expiration_date = ?,
           status_id       = ?
     WHERE member_id = ?`,
    [fmtExp, status_id, id]
  )

  await logUpdate(id, 3, account_id)
}

// 2) Member info update
export const updateMember = async (id, data, account_id) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    profile_picture = null,
    recent_join_date,
    expiration_date
  } = data

  const recent = DateTime.fromISO(recent_join_date, { zone: TIMEZONE })
  const exp    = DateTime.fromISO(expiration_date,   { zone: TIMEZONE })

  await defaultDb.query(
    `UPDATE members
       SET first_name        = ?,
           last_name         = ?,
           email             = ?,
           contact_number    = ?,
           address           = ?,
           profile_picture   = ?,
           recent_join_date  = ?,
           expiration_date   = ?
     WHERE member_id = ?`,
    [
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      profile_picture,
      formatDate(recent),
      formatDate(exp),
      id
    ]
  )

  await logUpdate(id, 2, account_id)
}

// 4) Cancellation (soft-delete & archive)
export const cancelMember = async (id, account_id) => {
  const conn = await defaultDb.getConnection()
  try {
    await conn.beginTransaction()

    await conn.query(
      "UPDATE members SET status_id = 3 WHERE member_id = ?",
      [id]
    )

    await conn.query(
      `INSERT INTO cancelled_members (
         member_id,
         first_name,
         last_name,
         email,
         contact_number,
         address,
         original_join_date,
         cancel_date,
         status_id
       )
       SELECT
         member_id,
         first_name,
         last_name,
         email,
         contact_number,
         address,
         original_join_date,
         CURDATE(),
         status_id
       FROM members
       WHERE member_id = ?`,
      [id]
    )

    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }

  await logUpdate(id, 4, account_id)
}

// 5) Expiration logging
export async function expireMembers(systemAccountId) {
  const [rows] = await defaultDb.query(
    `SELECT member_id
       FROM members
      WHERE status_id = 1
        AND expiration_date <= CURDATE()`
  )
  const expiredIds = rows.map(r => r.member_id)
  if (!expiredIds.length) {
    console.log("DEBUG >> No members to expire")
    return
  }

  const [result] = await defaultDb.query(
    `UPDATE members
       SET status_id = 2
     WHERE member_id IN (?)`,
    [expiredIds]
  )
  console.log(`DEBUG >> ${result.affectedRows} member(s) marked expired`)

  for (const member_id of expiredIds) {
    await logUpdate(member_id, 5, systemAccountId)
  }
  console.log(`DEBUG >> Logged expiration for ${expiredIds.length} member(s)`)
}

// Get extension durations
export const getDurations = async () => {
  const [rows] = await defaultDb.query("SELECT * FROM extend_date")
  return rows
}

// Get all active or expired members
export const getMembers = async () => {
  const [rows] = await defaultDb.query(`
    SELECT
      m.member_id       AS id,
      m.first_name,
      m.last_name,
      m.contact_number,
      m.address,
      m.profile_picture,
      m.original_join_date,
      m.recent_join_date,
      m.expiration_date,
      st.status_label   AS status
    FROM members m
    LEFT JOIN status_types st
      ON m.status_id = st.status_id
    WHERE m.status_id IN (1, 2)
    ORDER BY m.recent_join_date DESC,
             m.last_name ASC
  `)
  return rows
}

// Get a member by ID
export const getMemberById = async id => {
  const [rows] = await defaultDb.query(`
    SELECT
      m.member_id       AS id,
      m.first_name,
      m.last_name,
      m.email,
      m.contact_number,
      m.address,
      m.profile_picture,
      m.original_join_date,
      m.recent_join_date,
      m.expiration_date,
      m.status_id,
      st.status_label   AS status
    FROM members m
    LEFT JOIN status_types st
      ON m.status_id = st.status_id
    WHERE m.member_id = ?
  `, [id])
  return rows[0] || null
}

// Get all archived members
export const getCancelledMembers = async () => {
  const [rows] = await defaultDb.query(`
    SELECT
      cm.member_id     AS id,
      cm.first_name,
      cm.last_name,
      cm.email,
      cm.contact_number,
      cm.address,
      cm.original_join_date,
      cm.cancel_date,
      st.status_label  AS status
    FROM cancelled_members cm
    LEFT JOIN status_types st
      ON cm.status_id = st.status_id
    ORDER BY cm.cancel_date DESC,
             cm.last_name ASC
  `)
  return rows
}

// Get an archived member by ID
export const getCancelledMemberById = async id => {
  const [rows] = await defaultDb.query(`
    SELECT
      cm.member_id     AS id,
      cm.first_name,
      cm.last_name,
      cm.email,
      cm.contact_number,
      cm.address,
      cm.original_join_date,
      cm.cancel_date,
      cm.status_id,
      st.status_label  AS status
    FROM cancelled_members cm
    LEFT JOIN status_types st
      ON cm.status_id = st.status_id
    WHERE cm.member_id = ?
  `, [id])
  return rows[0] || null
}

export async function saveProfilePic(member_id, file) {
  if (!file) return
  const ext      = path.extname(file.originalname)
  const filename = `${member_id}${ext}`
  const dest     = path.resolve("uploads", "profiles", filename)
  await fs.writeFile(dest, file.buffer)
  await defaultDb.query(
    "UPDATE members SET profile_picture = ? WHERE member_id = ?",
    [filename, member_id]
  )
}