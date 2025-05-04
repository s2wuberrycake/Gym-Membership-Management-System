import { defaultDb } from "../config/dbConfig.js"

export const fetchDurations = async () => {
  const [rows] = await defaultDb.query("SELECT * FROM extend_date")
  return rows
}

export const fetchMembers = async () => {
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
  return rows
}

export const insertMember = async (data) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    expiration_date,
    status_id = 1,
    join_date = new Date()
  } = data

  console.log("📦 Final insert values:", {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    join_date,
    expiration_date,
    status_id
  })

  const [result] = await defaultDb.query(
    `INSERT INTO members (
      first_name, last_name, email, contact_number, address,
      join_date, expiration_date, status_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      join_date,
      expiration_date,
      status_id
    ]
  )

  return result.insertId
}

export const editMember = async (id, data) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    expiration_date,
    status_id
  } = data

  console.log("✏️ Editing member:", {
    id,
    first_name,
    last_name,
    email,
    contact_number,
    address,
    expiration_date,
    status_id
  })

  await defaultDb.query(
    `UPDATE members
     SET first_name = ?, last_name = ?, email = ?, contact_number = ?, address = ?, expiration_date = ?, status_id = ?
     WHERE member_id = ?`,
    [
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      expiration_date,
      status_id,
      id
    ]
  )
}