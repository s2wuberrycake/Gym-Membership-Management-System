import { defaultDb } from "../config/db.js"

export const getAllUpdateLogs = async () => {
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
    JOIN members m
      ON ul.member_id = m.member_id
    JOIN accounts ac
      ON ul.account_id = ac.account_id
    JOIN action_types at
      ON ul.action_id = at.action_id
    ORDER BY
      ul.log_date DESC,
      ul.update_id DESC
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}

export const logUpdate = async (member_id, action_id, account_id) => {
  const sql = `
    INSERT INTO update_log (
      member_id,
      action_id,
      account_id,
      log_date
    ) VALUES (?, ?, ?, NOW())
  `
  const [result] = await defaultDb.query(sql, [member_id, action_id, account_id])
  console.log(`DEBUG >> logged action ${action_id} for member ${member_id}`)
  return result
}

export const getAllVisitLogs = async () => {
  const sql = `
    SELECT
      vl.visit_id,
      vl.member_id,
      m.first_name,
      m.last_name,
      vl.visit_date
    FROM visit_log vl
    JOIN members m
      ON vl.member_id = m.member_id
    WHERE m.expiration_date >= CURDATE()
    ORDER BY
      vl.visit_id DESC
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}

export const logVisit = async (member_id) => {
  const sql1 = `SELECT expiration_date, status_id
    FROM members
    WHERE member_id = ?`
  const [memberRows] = await defaultDb.query(sql1, [member_id])
  if (!memberRows.length) throw new Error("Member not found")
  const { expiration_date, status_id } = memberRows[0]

  const sql2 = `SELECT status_label
    FROM status_types
    WHERE status_id = ?`
  const [statusRows] = await defaultDb.query(sql2, [status_id])
  const statusLabel = statusRows[0]?.status_label?.toLowerCase()
  if (statusLabel === "cancelled") throw new Error("Membership cancelled")
  if (new Date(expiration_date) < new Date()) throw new Error("Membership expired")

  const sql3 = `SELECT visit_id
    FROM visit_log
    WHERE member_id = ?
      AND DATE(visit_date) = CURDATE()`
  const [[existingVisit]] = await defaultDb.query(sql3, [member_id])
  if (existingVisit) return null

  const sql4 = `INSERT INTO visit_log (member_id, visit_date) VALUES (?, NOW())`
  const [insertResult] = await defaultDb.query(sql4, [member_id])
  const visitId = insertResult.insertId

  const sql5 = `
    SELECT
      vl.visit_id,
      vl.member_id,
      m.first_name,
      m.last_name,
      vl.visit_date
    FROM visit_log vl
    JOIN members m
      ON vl.member_id = m.member_id
    WHERE vl.visit_id = ?
  `
  const [[newVisit]] = await defaultDb.query(sql5, [visitId])
  return newVisit
}
