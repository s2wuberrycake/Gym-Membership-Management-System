import { defaultDb } from "../config/db.js"
import { DateTime } from "luxon"

const TIMEZONE = "Asia/Manila"

const getToday = () => DateTime.now().setZone(TIMEZONE).startOf("day")
const formatDate = (dt) => dt.toFormat("yyyy-MM-dd")

const getDaysToAdd = async (extend_date_id) => {
  const [rows] = await defaultDb.query("SELECT days FROM extend_date WHERE extend_date_id = ?", [extend_date_id])
  if (!rows.length) throw new Error("Invalid extend_date_id")
  return rows[0].days
}

// Insert new member
export const insertMember = async (data) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    extend_date_id,
    status_id = 1
  } = data

  const daysToAdd = await getDaysToAdd(extend_date_id)
  const today = getToday()
  const expiration = today.plus({ days: daysToAdd })

  const [result] = await defaultDb.query(
    `INSERT INTO members (
      first_name, last_name, email, contact_number, address,
      original_join_date, recent_join_date, expiration_date, status_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      formatDate(today),
      formatDate(today),
      formatDate(expiration),
      status_id
    ]
  )

  return result.insertId
}

// Move member from cancelled members to active members
export const restoreMember = async (id, extend_date_id) => {
  const connection = await defaultDb.getConnection()
  try {
    await connection.beginTransaction()

    const [rows] = await connection.query("SELECT * FROM cancelled_members WHERE member_id = ?", [id])
    if (!rows.length) throw new Error("Cancelled member not found")

    const cancelledMember = rows[0]
    const daysToAdd = await getDaysToAdd(extend_date_id)
    const today = getToday()
    const expiration = today.plus({ days: daysToAdd })

    await connection.query(
      `INSERT INTO members (
        member_id, first_name, last_name, email, contact_number, address,
        original_join_date, recent_join_date, expiration_date, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cancelledMember.member_id,
        cancelledMember.first_name,
        cancelledMember.last_name,
        cancelledMember.email,
        cancelledMember.contact_number,
        cancelledMember.address,
        cancelledMember.original_join_date,
        formatDate(today),
        formatDate(expiration),
        1
      ]
    )

    await connection.query("DELETE FROM cancelled_members WHERE member_id = ?", [id])
    await connection.commit()
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
}


// Extend membership duration
export const extendMember = async (id, extend_date_id) => {
  const [rows] = await defaultDb.query("SELECT expiration_date FROM members WHERE member_id = ?", [id])
  if (!rows.length) throw new Error("Member not found")

    const expirationRaw = rows[0].expiration_date
    if (!expirationRaw) throw new Error("Missing expiration_date from database")
    
    const existingExpiration = DateTime.fromJSDate(expirationRaw, { zone: TIMEZONE })
    if (!existingExpiration.isValid) {
      throw new Error(`Invalid expiration_date: ${expirationRaw}`)
    }    

  const today = getToday()
  const baseDate = existingExpiration < today ? today : existingExpiration

  const daysToAdd = await getDaysToAdd(extend_date_id)
  const newExpiration = baseDate.plus({ days: daysToAdd })
  const formattedExpiration = formatDate(newExpiration)

  let statusLabel = newExpiration < today ? "expired" : "active"

  const [statusRow] = await defaultDb.query("SELECT status_id FROM status_types WHERE status_label = ?", [statusLabel])
  if (!statusRow.length) throw new Error(`Status label "${statusLabel}" not found`)

  const status_id = statusRow[0].status_id

  const [result] = await defaultDb.query(
    "UPDATE members SET expiration_date = ?, status_id = ? WHERE member_id = ?",
    [formattedExpiration, status_id, id]
  )

  return result
}

// Update existing member info
export const updateMember = async (id, data) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    recent_join_date,
    expiration_date
  } = data

  const recentJoin = DateTime.fromISO(recent_join_date, { zone: TIMEZONE })
  const expiration = DateTime.fromISO(expiration_date, { zone: TIMEZONE })

  await defaultDb.query(
    `UPDATE members
     SET first_name = ?, last_name = ?, email = ?, contact_number = ?, address = ?, recent_join_date = ?, expiration_date = ?
     WHERE member_id = ?`,
    [
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      formatDate(recentJoin),
      formatDate(expiration),
      id
    ]
  )
}

// cancel and move a member to cancelled members table
export const cancelMember = async (id) => {
  const connection = await defaultDb.getConnection()
  try {
    await connection.beginTransaction()

    const [rows] = await connection.query("SELECT * FROM members WHERE member_id = ?", [id])
    if (!rows.length) throw new Error("Member not found")

    const member = rows[0]
    const cancelDate = formatDate(getToday())

    await connection.query(
      `INSERT INTO cancelled_members (
        member_id, first_name, last_name, email, contact_number, address,
        original_join_date, cancel_date, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        member.member_id,
        member.first_name,
        member.last_name,
        member.email,
        member.contact_number,
        member.address,
        member.original_join_date,
        cancelDate,
        3
      ]
    )

    await connection.query("DELETE FROM members WHERE member_id = ?", [id])
    await connection.commit()
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
}

// Get membership durations
export const getDurations = async () => {
  const [rows] = await defaultDb.query("SELECT * FROM extend_date")
  return rows
}

// Get all active members
export const getMembers = async () => {
  const [rows] = await defaultDb.query(`
    SELECT 
      m.member_id AS id,
      m.first_name,
      m.last_name,
      m.contact_number,
      m.address,
      m.original_join_date,
      m.recent_join_date,
      m.expiration_date,
      st.status_label AS status
    FROM members m
    LEFT JOIN status_types st ON m.status_id = st.status_id
    ORDER BY m.recent_join_date DESC, m.last_name ASC
  `)
  return rows
}

// Get single member by ID
export const getMemberById = async (id) => {
  const [rows] = await defaultDb.query(`
    SELECT 
      m.member_id AS id,
      m.first_name,
      m.last_name,
      m.email,
      m.contact_number,
      m.address,
      m.original_join_date,
      m.recent_join_date,
      m.expiration_date,
      m.status_id,
      st.status_label AS status
    FROM members m
    LEFT JOIN status_types st ON m.status_id = st.status_id
    WHERE m.member_id = ?
  `, [id])
  
  return rows[0] || null
}

// Get all cancelled members
export const getCancelledMembers = async () => {
  const [rows] = await defaultDb.query(`
    SELECT 
      cm.member_id AS id,
      cm.first_name,
      cm.last_name,
      cm.email,
      cm.contact_number,
      cm.address,
      cm.original_join_date,
      cm.cancel_date,
      st.status_label AS status
    FROM cancelled_members cm
    LEFT JOIN status_types st ON cm.status_id = st.status_id
    ORDER BY cm.cancel_date DESC, cm.last_name ASC
  `)
  return rows
}

// Get single cancelled member
export const getCancelledMemberById = async (id) => {
  const [rows] = await defaultDb.query(`
    SELECT 
      cm.member_id AS id,
      cm.first_name,
      cm.last_name,
      cm.email,
      cm.contact_number,
      cm.address,
      cm.original_join_date,
      cm.cancel_date,
      cm.status_id,
      st.status_label AS status
    FROM cancelled_members cm
    LEFT JOIN status_types st ON cm.status_id = st.status_id
    WHERE cm.member_id = ?
  `, [id])

  return rows[0] || null
}
