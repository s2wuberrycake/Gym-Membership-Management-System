import { defaultDb } from "../config/db.js"
import { getToday, formatDate, TIMEZONE } from "../utils/date.js"
import { DateTime } from "luxon"

const todayStr = formatDate(getToday())

const nowStr = () =>
  DateTime.now()
    .setZone(TIMEZONE)
    .toFormat("yyyy-MM-dd HH:mm:ss")

const fmtLocal = dt => dt.toFormat("yyyy-MM-dd HH:mm:ss")

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
    ) VALUES (?, ?, ?, ?)
  `
  const [result] = await defaultDb.query(sql, [
    member_id,
    action_id,
    account_id,
    nowStr(),
  ])
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
    WHERE m.expiration_date >= ?
    ORDER BY
      vl.visit_id DESC
  `
  const [rows] = await defaultDb.query(sql, [todayStr])
  return rows
}

export const logVisit = async (member_id) => {
  const sqlMember = `
    SELECT expiration_date, status_id
    FROM members
    WHERE member_id = ?
  `
  const [memberRows] = await defaultDb.query(sqlMember, [member_id])
  if (!memberRows.length) throw new Error("Member not found")

  const { expiration_date, status_id } = memberRows[0]
  if (status_id === 3) throw new Error("Membership cancelled")
  if (new Date(expiration_date) < new Date()) throw new Error("Membership expired")

  const nowManila        = DateTime.now().setZone(TIMEZONE)
  const startOfToday    = nowManila.startOf("day")
  const startOfTomorrow = startOfToday.plus({ days: 1 })

  const startStr = fmtLocal(startOfToday)
  const endStr   = fmtLocal(startOfTomorrow)

  const sqlCheck = `
    SELECT visit_id
    FROM visit_log
    WHERE member_id = ?
      AND visit_date >= ?
      AND visit_date <  ?
  `
  const [existingRows] = await defaultDb.query(sqlCheck, [
    member_id,
    startStr,
    endStr,
  ])
  if (existingRows.length) {
    return null
  }

  const nowStr = fmtLocal(nowManila)
  const sqlInsert = `
    INSERT INTO visit_log (member_id, visit_date)
    VALUES (?, ?)
  `
  const [insertResult] = await defaultDb.query(sqlInsert, [
    member_id,
    nowStr,
  ])
  const visitId = insertResult.insertId

  const sqlFetch = `
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
  const [[newVisit]] = await defaultDb.query(sqlFetch, [visitId])
  return newVisit
}
