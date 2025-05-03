import express from 'express'
import { defaultDb } from '../lib/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const [rows] = await defaultDb.query('SELECT * FROM accounts WHERE username = ?', [username])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User does not exist' })
    }
    const isMatch = await bcrypt.compare(password, rows[0].password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    const token = jwt.sign({ id: rows[0].account_id }, process.env.JWT_KEY, { expiresIn: '24h' })

    return res.status(201).json({ token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  }
})

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
      return res.status(403).json({ message: 'No token provided' })
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userId = decoded.id
    next()
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

router.get('/home', verifyToken, async (req, res) => {
  try {
    const [rows] = await defaultDb.query('SELECT * FROM accounts WHERE account_id = ?', [req.userId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User does not exist' })
    }

    return res.status(201).json({ user: rows[0] })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router