import { defaultDb } from "../config/db.js"
import { DateTime } from "luxon"
import { logUpdate } from "./logs.js"
import { TIMEZONE, getToday, formatDate } from "../utils/date.js"

const getDaysToAdd = async extend_date_id => {
  const sql = `
    SELECT days
    FROM extend_date
    WHERE extend_date_id = ?
  `
  const [rows] = await defaultDb.query(sql, [extend_date_id])
  if (!rows.length) throw new Error("Invalid extend_date_id")
  return rows[0].days
}

export const insertMember = async (data, account_id) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    profile_picture = null,
    rfid = null,
    extend_date_id,
    status_id = 1
  } = data

  const daysToAdd  = await getDaysToAdd(extend_date_id)
  const today      = getToday()
  const expiration = today.plus({ days: daysToAdd })

  const sql = `
    INSERT INTO members (
      rfid, first_name, last_name, email,
      contact_number, address, profile_picture,
      original_join_date, recent_join_date,
      expiration_date, status_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  const [result] = await defaultDb.query(sql, [
    rfid,
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
  ])

  const member_id = result.insertId

  await logUpdate(member_id, 1, account_id)
  return member_id
}

export const restoreMember = async (memberId, extend_date_id, account_id) => {
  const conn = await defaultDb.getConnection()
  try {
    await conn.beginTransaction()

    const days      = await getDaysToAdd(extend_date_id)
    const today     = getToday()
    const fmtToday  = formatDate(today)
    const fmtExpiry = formatDate(today.plus({ days }))

    const updateSql = `
      UPDATE members
        SET recent_join_date = ?, expiration_date = ?, status_id = 1
      WHERE member_id = ?
    `
    await conn.query(updateSql, [fmtToday, fmtExpiry, memberId])

    const deleteSql = `
      DELETE FROM cancelled_members
      WHERE member_id = ?
    `
    await conn.query(deleteSql, [memberId])

    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }

  await logUpdate(memberId, 6, account_id)
  return memberId
}

export const extendMember = async (memberId, extend_date_id, account_id) => {
  const [rows] = await defaultDb.query(
    "SELECT expiration_date FROM members WHERE member_id = ?",
    [memberId]
  )
  if (!rows.length) throw new Error("Member not found")

  const existing = DateTime.fromJSDate(rows[0].expiration_date, { zone: TIMEZONE })
  const today    = getToday()
  const base     = existing < today ? today : existing
  const days     = await getDaysToAdd(extend_date_id)
  const newExp   = base.plus({ days })
  const fmtExp   = formatDate(newExp)

  const label = newExp < today ? "expired" : "active"
  const [[{ status_id }]] = await defaultDb.query(
    "SELECT status_id FROM status_types WHERE status_label = ?",
    [label]
  )

  const sql = `
    UPDATE members
      SET expiration_date = ?, status_id = ?
    WHERE member_id = ?
  `
  const [result] = await defaultDb.query(sql, [fmtExp, status_id, memberId])

  await logUpdate(memberId, 3, account_id)
  return { memberId, affectedRows: result.affectedRows, newExpiration: fmtExp }
}

export const updateMember = async (memberId, data, account_id) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    recent_join_date,
    expiration_date,
    profile_picture = null,
    rfid = null
  } = data

  const recent = DateTime.fromISO(recent_join_date, { zone: TIMEZONE })
  const exp    = DateTime.fromISO(expiration_date,   { zone: TIMEZONE })

  const sql = `
    UPDATE members
      SET first_name       = ?,
          last_name        = ?,
          email            = ?,
          contact_number   = ?,
          address          = ?,
          recent_join_date = ?,
          expiration_date  = ?,
          profile_picture  = ?,
          rfid             = ?
    WHERE member_id = ?
  `
  const [result] = await defaultDb.query(sql, [
    first_name,
    last_name,
    email || null,
    contact_number,
    address,
    formatDate(recent),
    formatDate(exp),
    profile_picture,
    rfid,
    memberId
  ])

  await logUpdate(memberId, 2, account_id)

  const selectSql = `
    SELECT *
      FROM members
    WHERE member_id = ?
  `
  const [rows] = await defaultDb.query(selectSql, [memberId])
  return rows[0] || null
}

export const cancelMember = async (memberId, account_id) => {
  const conn = await defaultDb.getConnection()
  try {
    await conn.beginTransaction()

    const updateSql = `
      UPDATE members
        SET status_id = 3
      WHERE member_id = ?
    `
    await conn.query(updateSql, [memberId])

    const insertSql = `
      INSERT INTO cancelled_members (
        member_id, first_name, last_name, email,
        contact_number, address, original_join_date,
        cancel_date, status_id
      )
      SELECT
        member_id, first_name, last_name, email,
        contact_number, address, original_join_date,
        CURDATE(), status_id
      FROM members
      WHERE member_id = ?
    `
    await conn.query(insertSql, [memberId])

    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }

  await logUpdate(memberId, 4, account_id)
  return { memberId }
}

export async function expireMembers(systemAccountId) {
  const selectSql = `
    SELECT member_id
      FROM members
    WHERE status_id = 1
      AND expiration_date <= CURDATE()
  `
  const [rows] = await defaultDb.query(selectSql)
  const expiredIds = rows.map(r => r.member_id)
  if (!expiredIds.length) {
    console.log("DEBUG >> No members to expire")
    return []
  }

  const updateSql = `
    UPDATE members
      SET status_id = 2
    WHERE member_id IN (?)
  `
  const [result] = await defaultDb.query(updateSql, [expiredIds])
  console.log(`DEBUG >> ${result.affectedRows} member(s) marked expired`)

  for (const member_id of expiredIds) {
    await logUpdate(member_id, 5, systemAccountId)
  }
  console.log(`DEBUG >> Logged expiration for ${expiredIds.length} member(s)`)

  return expiredIds
}

export const getDurations = async () => {
  const sql = `SELECT * FROM extend_date`
  const [rows] = await defaultDb.query(sql)
  return rows
}

export const getMembers = async () => {
  const sql = `
    SELECT
      m.member_id       AS id,
      m.rfid,
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
    ORDER BY m.recent_join_date DESC, m.member_id DESC
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}

export const getMemberById = async memberId => {
  const sql = `
    SELECT
      m.member_id       AS id,
      m.rfid,
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
  `
  const [rows] = await defaultDb.query(sql, [memberId])
  return rows[0] || null
}

export const getCancelledMembers = async () => {
  const sql = `
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
    ORDER BY cm.cancel_date DESC, cm.member_id DESC
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}

export const getCancelledMemberById = async memberId => {
  const sql = `
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
  `
  const [rows] = await defaultDb.query(sql, [memberId])
  return rows[0] || null
}

export const getMemberByRFID = async (rfid) => {
  const sql = `
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
      m.rfid,
      st.status_label   AS status
    FROM members m
    LEFT JOIN status_types st
      ON m.status_id = st.status_id
    WHERE m.rfid = ?
    LIMIT 1
  `
  const [rows] = await defaultDb.query(sql, [rfid])
  return rows[0] || null
}
