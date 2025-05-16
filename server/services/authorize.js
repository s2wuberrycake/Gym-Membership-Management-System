import { defaultDb } from "../config/db.js"
import bcrypt from "bcrypt"

// Authenticate account by username and password
export const authenticateAccount = async (username, password) => {
  const [rows] = await defaultDb.query(
    `SELECT
       a.account_id,
       a.username,
       a.password,
       r.role
     FROM accounts a
     JOIN role_types r ON a.role_id = r.role_id
     WHERE a.username = ?`,
    [username]
  )
  if (!rows.length) return null

  const user = rows[0]
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return null

  return { id: user.account_id, username: user.username, role: user.role }
}

// Get user by ID
export const getUserById = async id => {
  const [rows] = await defaultDb.query(
    `SELECT
       account_id,
       username
     FROM accounts
     WHERE account_id = ?`,
    [id]
  )
  return rows[0] || null
}

// Get all accounts except the system account (0)
export const getAccounts = async () => {
  const [rows] = await defaultDb.query(
    `SELECT
       a.account_id,
       a.username,
       r.role
     FROM accounts a
     JOIN role_types r ON a.role_id = r.role_id
     WHERE a.account_id <> 0
     ORDER BY a.account_id`
  )
  return rows
}

// Get full account info by ID
export const getAccountById = async id => {
  const [rows] = await defaultDb.query(
    `SELECT
       a.account_id,
       a.username,
       a.password,
       r.role_id,
       r.role
     FROM accounts a
     JOIN role_types r ON a.role_id = r.role_id
     WHERE a.account_id = ?`,
    [id]
  )
  return rows[0] || null
}

// Insert a new account
export const insertAccount = async ({ username, password, role_id }) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const [result] = await defaultDb.query(
    `INSERT INTO accounts (
       username,
       password,
       role_id
     ) VALUES (?, ?, ?)`,
    [username, hashedPassword, role_id]
  )
  return { account_id: result.insertId }
}

// Update an existing account (cannot modify "admin")
export const updateAccount = async ({ account_id, username, password, role_id }) => {
  // fetch existing username
  const [existingRows] = await defaultDb.query(
    `SELECT username
       FROM accounts
      WHERE account_id = ?`,
    [account_id]
  )
  const existing = existingRows[0]
  if (existing?.username === "admin") {
    throw new Error(`The 'admin' account cannot be edited`)
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    await defaultDb.query(
      `UPDATE accounts
         SET username    = ?,
             password    = ?,
             role_id     = ?
       WHERE account_id = ?`,
      [username, hashedPassword, role_id, account_id]
    )
  } else {
    await defaultDb.query(
      `UPDATE accounts
         SET username    = ?,
             role_id     = ?
       WHERE account_id = ?`,
      [username, role_id, account_id]
    )
  }
}

// Remove an account (cannot delete "admin")
export const removeAccount = async id => {
  // fetch existing username
  const [existingRows] = await defaultDb.query(
    `SELECT username
       FROM accounts
      WHERE account_id = ?`,
    [id]
  )
  const existing = existingRows[0]
  if (existing?.username === "admin") {
    throw new Error(`The 'admin' account cannot be deleted`)
  }

  await defaultDb.query(
    `DELETE FROM accounts
     WHERE account_id = ?`,
    [id]
  )
}

// Check if a username already exists
export const checkUsernameExists = async username => {
  const [rows] = await defaultDb.query(
    `SELECT
       COUNT(*) AS count
     FROM accounts
     WHERE username = ?`,
    [username]
  )
  return rows[0].count > 0
}

// Get all role types
export const getRoles = async () => {
  const [rows] = await defaultDb.query(
    `SELECT
       role_id,
       role
     FROM role_types`
  )
  return rows
}
