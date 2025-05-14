import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

export const defaultDb = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DEFAULT_NAME,
})

export const backupDb = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_BACKUP_NAME,
})