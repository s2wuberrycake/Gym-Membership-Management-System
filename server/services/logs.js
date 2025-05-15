import { defaultDb } from "../config/db.js"

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
    FROM update_log AS ul
    JOIN members AS m
      ON ul.member_id = m.member_id
    JOIN accounts AS ac
      ON ul.account_id = ac.account_id
    JOIN action_types AS at
      ON ul.action_id = at.action_id
    ORDER BY ul.log_date DESC, ul.update_id DESC
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}