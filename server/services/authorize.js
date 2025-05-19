import { defaultDb } from "../config/db.js"
import bcrypt from "bcryptjs"

export const authenticateAccount = async (username, password) => {
  const sql = `
    SELECT
      a.account_id,
      a.username,
      a.password,
      r.role
    FROM accounts a
    JOIN role_types r
      ON a.role_id = r.role_id
    WHERE a.username = ?
  `
  const [rows] = await defaultDb.query(sql, [username])
  if (!rows.length) return null

  const user = rows[0]
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return null

  return { id: user.account_id, username: user.username, role: user.role }
}

export const getUserById = async (id) => {
  const sql = `
    SELECT
      account_id,
      username
    FROM accounts
    WHERE account_id = ?
  `
  const [rows] = await defaultDb.query(sql, [id])
  return rows[0] || null
}

export const getAccounts = async () => {
  const sql = `
    SELECT
      a.account_id,
      a.username,
      r.role
    FROM accounts a
    JOIN role_types r
      ON a.role_id = r.role_id
    WHERE a.account_id <> 0
    ORDER BY a.account_id
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}

export const getAccountById = async (id) => {
  const sql = `
    SELECT
      a.account_id,
      a.username,
      a.password,
      r.role_id,
      r.role
    FROM accounts a
    JOIN role_types r
      ON a.role_id = r.role_id
    WHERE a.account_id = ?
  `
  const [rows] = await defaultDb.query(sql, [id])
  return rows[0] || null
}

export const insertAccount = async ({ username, password, role_id }) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const sql = `
    INSERT INTO accounts (
      username,
      password,
      role_id
    ) VALUES (?, ?, ?)
  `
  const [result] = await defaultDb.query(sql, [username, hashedPassword, role_id])
  return { account_id: result.insertId }
}

export const updateAccount = async ({ account_id, username, password, role_id }) => {
  const checkSql = `
    SELECT username
    FROM accounts
    WHERE account_id = ?
  `
  const [existingRows] = await defaultDb.query(checkSql, [account_id])
  const existing = existingRows[0]
  if (existing?.username === "admin") {
    throw new Error("The 'admin' account cannot be edited")
  }

  if (password) {
    const hashed = await bcrypt.hash(password, 10)
    const sql = `
      UPDATE accounts
        SET username = ?,
            password = ?,
            role_id  = ?
      WHERE account_id = ?
    `
    await defaultDb.query(sql, [username, hashed, role_id, account_id])
  } else {
    const sql = `
      UPDATE accounts
        SET username = ?,
            role_id  = ?
      WHERE account_id = ?
    `
    await defaultDb.query(sql, [username, role_id, account_id])
  }
}

export const removeAccount = async (id) => {
  const checkSql = `
    SELECT username
    FROM accounts
    WHERE account_id = ?
  `
  const [existingRows] = await defaultDb.query(checkSql, [id])
  const existing = existingRows[0]
  if (existing?.username === "admin") {
    throw new Error("The 'admin' account cannot be deleted")
  }

  const sql = `
    DELETE FROM accounts
    WHERE account_id = ?
  `
  await defaultDb.query(sql, [id])
}

export const checkUsernameExists = async (username) => {
  const sql = `
    SELECT COUNT(*) AS count
    FROM accounts
    WHERE username = ?
  `
  const [rows] = await defaultDb.query(sql, [username])
  return rows[0].count > 0
}

export const getRoles = async () => {
  const sql = `
    SELECT
      role_id,
      role
    FROM role_types
  `
  const [rows] = await defaultDb.query(sql)
  return rows
}
