// server/services/analytics.js
import { defaultDb } from "../config/db.js"

export const getMemberGrowth = async period => {
  const conn = await defaultDb
  let query

  switch (period) {
    case "day":
      query = `
        SELECT
          DATE_FORMAT(log_date, '%m-%d')        AS label
        , SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled
        , SUM(CASE WHEN action_id = 4 THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE DATE(log_date) = CURDATE()
        GROUP BY DATE_FORMAT(log_date, '%m-%d')
        ORDER BY DATE_FORMAT(log_date, '%m-%d')
      `
      break

    case "week":
      query = `
        SELECT
          DATE_FORMAT(log_date, '%m-%d')        AS label
        , SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled
        , SUM(CASE WHEN action_id = 4 THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE DATE(log_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
        GROUP BY DATE_FORMAT(log_date, '%m-%d')
        ORDER BY DATE_FORMAT(log_date, '%m-%d')
      `
      break

    default:  // Last Year (last 12 months)
      query = `
        SELECT
          DATE_FORMAT(log_date, '%y-%m')        AS label
        , SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled
        , SUM(CASE WHEN action_id = 4 THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE log_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(log_date, '%y-%m')
        ORDER BY DATE_FORMAT(log_date, '%y-%m')
      `
  }

  const [rows] = await conn.query(query)
  return rows
}
