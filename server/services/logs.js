import { defaultDb } from "../config/db.js"

// Get all update logs
export async function getAllUpdateLogs() {
  const sql = `
    SELECT
      ul.update_id,
      ul.member_id,
      m.first_name,
      m.last_name,
      ac.username AS account_username,
      ul.log_date,
      at.action_label
    FROM update_log ul
    JOIN members m ON ul.member_id  = m.member_id
    JOIN accounts ac ON ul.account_id = ac.account_id
    JOIN action_types at ON ul.action_id  = at.action_id
    ORDER BY
      ul.log_date DESC,
      ul.update_id DESC
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}

// Add new update
export async function logUpdate(member_id, action_id, account_id) {
  const sql = `
    INSERT INTO update_log (
      member_id,
      action_id,
      account_id,
      log_date
    ) VALUES (?, ?, ?, NOW())
  `
  await defaultDb.query(sql, [member_id, action_id, account_id])
  console.log(`DEBUG >> logged action ${action_id} for member ${member_id}`)
}

// Get all visit log
export async function getAllVisitLogs() {
  const sql = `
    SELECT
      vl.visit_id,
      vl.member_id,
      m.first_name,
      m.last_name,
      vl.visit_date
    FROM visit_log vl
    JOIN members m ON vl.member_id = m.member_id
    WHERE m.expiration_date >= CURDATE()
    ORDER BY
      vl.visit_id DESC
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}

// Add new visit
export async function logVisit(member_id) {
  const [memberRows] = await defaultDb.query(
    "SELECT expiration_date, status_id FROM members WHERE member_id = ?",
    [member_id]
  )
  if (memberRows.length === 0) {
    throw new Error("Member not found")
  }
  const member = memberRows[0]

  const [statusRows] = await defaultDb.query(
    "SELECT status_label FROM status_types WHERE status_id = ?",
    [member.status_id]
  )
  const statusLabel = statusRows[0]?.status_label?.toLowerCase()

  if (statusLabel === "cancelled") {
    throw new Error("Membership cancelled")
  }
  if (new Date(member.expiration_date) < new Date()) {
    throw new Error("Membership expired")
  }

  const [[existing]] = await defaultDb.query(
    "SELECT visit_id FROM visit_log WHERE member_id = ? AND DATE(visit_date) = CURDATE()",
    [member_id]
  )
  if (existing) {
    return null
  }

  const [result] = await defaultDb.query(
    "INSERT INTO visit_log (member_id, visit_date) VALUES (?, NOW())",
    [member_id]
  )
  const visitId = result.insertId

  const [[newVisit]] = await defaultDb.query(
    `SELECT
       vl.visit_id,
       vl.member_id,
       m.first_name,
       m.last_name,
       vl.visit_date
     FROM visit_log vl
     JOIN members m ON vl.member_id = m.member_id
     WHERE vl.visit_id = ?`,
    [visitId]
  )
  return newVisit
}
