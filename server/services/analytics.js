import { defaultDb } from "../config/db.js"

export const getMemberGrowth = async period => {
  const conn = await defaultDb
  let query

  switch (period) {
    case "default":
      query = `
        SELECT
          DATE_FORMAT(log_date, '%H:00')        AS label
        , SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled
        , SUM(CASE WHEN action_id = 4      THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE DATE(log_date) = CURDATE()
        GROUP BY DATE_FORMAT(log_date, '%H:00')
        ORDER BY DATE_FORMAT(log_date, '%H:00')
      `
      break

    case "week":
      query = `
        SELECT
          DATE_FORMAT(log_date, '%m-%d')        AS label
        , SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled
        , SUM(CASE WHEN action_id = 4      THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE DATE(log_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
        GROUP BY DATE_FORMAT(log_date, '%m-%d')
        ORDER BY DATE_FORMAT(log_date, '%m-%d')
      `
      break

    case "year":
      query = `
        SELECT
          DATE_FORMAT(log_date, '%y-%m')        AS label
        , SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled
        , SUM(CASE WHEN action_id = 4      THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE log_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(log_date, '%y-%m')
        ORDER BY DATE_FORMAT(log_date, '%y-%m')
      `
      break

    default:
      query = `
        SELECT
          DATE_FORMAT(log_date, '%H:00')        AS label
        , SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled
        , SUM(CASE WHEN action_id = 4      THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE DATE(log_date) = CURDATE()
        GROUP BY DATE_FORMAT(log_date, '%H:00')
        ORDER BY DATE_FORMAT(log_date, '%H:00')
      `
  }

  const [rows] = await conn.query(query)
  return rows
}

export const getVisitRate = async period => {
  const conn = await defaultDb
  let query

  switch (period) {
    case "default":
      query = `
        SELECT
          DATE_FORMAT(visit_date, '%H:00') AS label
        , COUNT(*)                       AS visits
        FROM visit_log
        WHERE DATE(visit_date) = CURDATE()
        GROUP BY DATE_FORMAT(visit_date, '%H:00')
        ORDER BY DATE_FORMAT(visit_date, '%H:00')
      `
      break

    case "week":
      query = `
        SELECT
          DATE_FORMAT(visit_date, '%m-%d') AS label
        , COUNT(*)                       AS visits
        FROM visit_log
        WHERE DATE(visit_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
        GROUP BY DATE_FORMAT(visit_date, '%m-%d')
        ORDER BY DATE_FORMAT(visit_date, '%m-%d')
      `
      break

    case "year":
      query = `
        SELECT
          DATE_FORMAT(visit_date, '%y-%m') AS label
        , COUNT(*)                       AS visits
        FROM visit_log
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(visit_date, '%y-%m')
        ORDER BY DATE_FORMAT(visit_date, '%y-%m')
      `
      break

    default:
      query = `
        SELECT
          DATE_FORMAT(visit_date, '%H:00') AS label
        , COUNT(*)                       AS visits
        FROM visit_log
        WHERE DATE(visit_date) = CURDATE()
        GROUP BY DATE_FORMAT(visit_date, '%H:00')
        ORDER BY DATE_FORMAT(visit_date, '%H:00')
      `
  }

  const [rows] = await conn.query(query)
  return rows
}

export const getMemberRatio = async () => {
  const conn = await defaultDb
  const query = `
    SELECT
      status_id,
      COUNT(*) AS value
    FROM members
    GROUP BY status_id
    ORDER BY status_id
  `
  const [rows] = await conn.query(query)
  return rows
}
