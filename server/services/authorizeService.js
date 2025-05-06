import { defaultDb } from "../config/dbConfig.js"
import bcrypt from "bcrypt"

export const authenticateUser = async (username, password) => {
  const [rows] = await defaultDb.query(
    `SELECT a.account_id, a.username, a.password, r.role
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

export const getUserById = async (id) => {
  const [rows] = await defaultDb.query(
    "SELECT account_id, username FROM accounts WHERE account_id = ?",
    [id]
  )
  return rows[0] || null
}