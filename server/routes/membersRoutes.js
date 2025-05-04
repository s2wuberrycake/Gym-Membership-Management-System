import express from "express"
import { defaultDb } from "../config/dbConfig.js"

const router = express.Router()

// GET: Fetch membership durations for duration selection
router.get("/durations", async (req, res) => {
  try {
    const [rows] = await defaultDb.query("SELECT * FROM extend_date")
    res.json(rows)
  } catch (err) {
    console.error("Error fetching durations:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})


// GET: Fetch mmbers
router.get("/", async (req, res) => {
  try {
    const [rows] = await defaultDb.query(`
      SELECT 
        m.member_id AS id,
        m.first_name,
        m.last_name,
        m.contact_number,
        m.address,
        m.join_date,
        m.expiration_date,
        st.status_label AS status
      FROM members m
      LEFT JOIN status_types st ON m.status_id = st.status_id
    `)

    res.json(rows)
  } catch (err) {
    console.error("Error fetching members:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// POST: Create new member
router.post("/", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      contact_number,
      address,
      expiration_date,
      status_id = 1,
      join_date = new Date(),
    } = req.body

    const [result] = await defaultDb.query(
      `INSERT INTO members (
        first_name, last_name, contact_number, address,
        join_date, expiration_date, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        contact_number,
        address,
        join_date,
        expiration_date,
        status_id,
      ]
    )
    

    res.json({ success: true, member_id: result.insertId })
  } catch (err) {
    console.error("Error creating member:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// PUT: Edit member (TO USE LATER)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const {
      first_name,
      last_name,
      contact_number,
      address,
      expiration_date,
      status_id,
    } = req.body

    await defaultDb.query(
      `UPDATE members
       SET first_name = ?, last_name = ?, contact_number = ?, address = ?, expiration_date = ?, status_id = ?
       WHERE member_id = ?`,
      [
        first_name,
        last_name,
        contact_number,
        address,
        expiration_date,
        status_id,
        id,
      ]
    )

    res.json({ success: true })
  } catch (err) {
    console.error("Error updating member:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router