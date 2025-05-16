import { defaultDb } from "../config/db.js"

// Get all update log entries
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

// Record a new update log entry
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
