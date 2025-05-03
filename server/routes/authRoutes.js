import express from "express"
import { defaultDb } from "../lib/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    const [rows] = await defaultDb.query(
      `SELECT a.account_id, a.username, a.password, r.role
       FROM accounts a
       JOIN role_types r ON a.role_id = r.role_id
       WHERE a.username = ?`,
      [username]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "User does not exist" })
    }

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" })
    }

    const token = jwt.sign(
      {
        id: user.account_id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    )

    return res.status(200).json({ token })

  } catch (err) {
    console.error("Login error:", err)
    return res.status(500).json({ message: "Internal server error", error: err.message })
  }
})

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) {
      return res.status(403).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = decoded
    next()
  } catch (err) {
    console.error("Token verification failed:", err)
    return res.status(401).json({ message: "Unauthorized: Invalid token" })
  }
}

router.get("/home", verifyToken, async (req, res) => {
  try {
    const [rows] = await defaultDb.query(
      "SELECT account_id, username FROM accounts WHERE account_id = ?",
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      },
    })
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message })
  }
})

export default router
