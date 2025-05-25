import { defaultDb } from "../config/db.js"
import { getToday, formatDate } from "../utils/date.js"

export const getMemberGrowth = async (period) => {
  let query
  switch (period) {
    case "week":
      query = `
        SELECT
          DATE_FORMAT(log_date, '%m-%d') AS label,
          SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled,
          SUM(CASE WHEN action_id = 4 THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE DATE(log_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
        GROUP BY DATE_FORMAT(log_date, '%m-%d')
        ORDER BY DATE_FORMAT(log_date, '%m-%d')
      `
      break

    case "year":
      query = `
        SELECT
          DATE_FORMAT(log_date, '%y-%m') AS label,
          SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled,
          SUM(CASE WHEN action_id = 4 THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE log_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(log_date, '%y-%m')
        ORDER BY DATE_FORMAT(log_date, '%y-%m')
      `
      break

    default:
      query = `
        SELECT
          DATE_FORMAT(log_date, '%H:00') AS label,
          SUM(CASE WHEN action_id IN (1,6) THEN 1 ELSE 0 END) AS enrolled,
          SUM(CASE WHEN action_id = 4 THEN 1 ELSE 0 END) AS cancelled
        FROM update_log
        WHERE DATE(log_date) = CURDATE()
        GROUP BY DATE_FORMAT(log_date, '%H:00')
        ORDER BY DATE_FORMAT(log_date, '%H:00')
      `
  }
  const [rows] = await defaultDb.query(query)
  return rows
}

export const getVisitRate = async (period) => {
  let query
  switch (period) {
    case "week":
      query = `
        SELECT
          DATE_FORMAT(visit_date, '%m-%d') AS label,
          COUNT(*) AS visits
        FROM visit_log
        WHERE DATE(visit_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
        GROUP BY DATE_FORMAT(visit_date, '%m-%d')
        ORDER BY DATE_FORMAT(visit_date, '%m-%d')
      `
      break

    case "year":
      query = `
        SELECT
          DATE_FORMAT(visit_date, '%y-%m') AS label,
          COUNT(*) AS visits
        FROM visit_log
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(visit_date, '%y-%m')
        ORDER BY DATE_FORMAT(visit_date, '%y-%m')
      `
      break

    default:
      query = `
        SELECT
          DATE_FORMAT(visit_date, '%H:00') AS label,
          COUNT(*) AS visits
        FROM visit_log
        WHERE DATE(visit_date) = CURDATE()
        GROUP BY DATE_FORMAT(visit_date, '%H:00')
        ORDER BY DATE_FORMAT(visit_date, '%H:00')
      `
  }
  const [rows] = await defaultDb.query(query)
  return rows
}

export const getMemberRatio = async () => {
  const sql = `
    SELECT
      status_id,
      COUNT(*) AS value
    FROM members
    GROUP BY status_id
    ORDER BY status_id
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}

export const getDashboardStats = async () => {
  const ratioRows = await getMemberRatio()
  const totalMembers     = ratioRows.reduce((sum, r) => sum + Number(r.value), 0)
  const activeMembers    = ratioRows.find(r => r.status_id === 1)?.value || 0
  const expiredMembers   = ratioRows.find(r => r.status_id === 2)?.value || 0
  const cancelledMembers = ratioRows.find(r => r.status_id === 3)?.value || 0

  const sumVisits = rows => rows.reduce((sum, r) => sum + Number(r.visits || 0), 0)
  const todayRows = await getVisitRate("default")
  const weekRows  = await getVisitRate("week")
  const yearRows  = await getVisitRate("year")

  const [last30Row] = await defaultDb.query(`
    SELECT COUNT(*) AS last30
    FROM visit_log
    WHERE DATE(visit_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 29 DAY) AND CURDATE()
  `)
  const last30 = last30Row[0]?.last30 || 0

  return {
    totalMembers,
    activeMembers,
    expiredMembers,
    cancelledMembers,
    visits: {
      today: sumVisits(todayRows),
      week:  sumVisits(weekRows),
      last30,
      year:  sumVisits(yearRows),
    }
  }
}

export const getMostRecentVisit = async () => {
  const todayStr = formatDate(getToday())

  const sql = `
    SELECT
      m.first_name,
      m.last_name,
      m.profile_picture,
      vl.visit_date
    FROM visit_log vl
    JOIN members m
      ON vl.member_id = m.member_id
    WHERE DATE(vl.visit_date) = ?
    ORDER BY vl.visit_date DESC
    LIMIT 1
  `
  const [rows] = await defaultDb.query(sql, [todayStr])
  return rows[0] || null
}
