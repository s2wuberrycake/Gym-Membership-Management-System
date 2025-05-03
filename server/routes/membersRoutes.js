import express from 'express'
import { defaultDb } from '../lib/db.js'  // ✅ Updated

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await defaultDb.query(`
      SELECT 
        m.member_id AS id,
        CONCAT(m.first_name, ' ', m.last_name) AS name,
        m.contact_number AS contactnumber,
        m.address,
        m.join_date AS joindate,
        e.expiration_date AS expirationdate,
        s.status
      FROM members m
      LEFT JOIN expiration_date e ON m.expiration_date_id = e.expiration_date_id
      LEFT JOIN status_types s ON m.status_id = s.status_id
    `)

    res.json(rows)
  } catch (err) {
    console.error('Error fetching members:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const {
      firstName, lastName, contactNumber, address, rfid,
      joinDate = new Date(),
      statusId = 1
    } = req.body

    const [result] = await defaultDb.query(`
      INSERT INTO members (first_name, last_name, contact_number, address, rfid, join_date, status_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [firstName, lastName, contactNumber, address, rfid, joinDate, statusId])

    res.json({ success: true, memberId: result.insertId })
  } catch (err) {
    console.error('Error creating member:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      firstName, lastName, contactNumber, address, rfid,
    } = req.body

    await defaultDb.query(`
      UPDATE members
      SET first_name = ?, last_name = ?, contact_number = ?, address = ?, rfid = ?
      WHERE member_id = ?
    `, [firstName, lastName, contactNumber, address, rfid, id])

    res.json({ success: true })
  } catch (err) {
    console.error('Error updating member:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
