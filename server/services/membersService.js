import { defaultDb } from "../config/dbConfig.js"

// Pulling list of selectable membership durations
export const fetchDurations = async () => {
  const [rows] = await defaultDb.query("SELECT * FROM extend_date")
  return rows
}

// Pulling all rows from members table
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

// Pushing new member row into members table
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

  console.log("DEBUG >> Final insert values:", {
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

// Pulling a member by ID
export const fetchMemberById = async (id) => {
  const [rows] = await defaultDb.query(
    `SELECT 
      m.member_id AS id,
      m.first_name,
      m.last_name,
      m.email,
      m.contact_number,
      m.address,
      m.join_date,
      m.expiration_date,
      m.status_id,
      st.status_label AS status
    FROM members m
    LEFT JOIN status_types st ON m.status_id = st.status_id
    WHERE m.member_id = ?`,
    [id]
  )

  if (!rows.length) return null
  return rows[0]
}

// Editing existing member info
export const editMember = async (id, data) => {
  const {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    join_date,
    expiration_date,
    status_id
  } = data

  console.log("DEBUG >> Editing member:", {
    id,
    first_name,
    last_name,
    email,
    contact_number,
    address,
    join_date,
    expiration_date,
    status_id
  })

  await defaultDb.query(
    `UPDATE members
     SET first_name = ?, last_name = ?, email = ?, contact_number = ?, address = ?, join_date = ?, expiration_date = ?, status_id = ?
     WHERE member_id = ?`,
    [
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      join_date,
      expiration_date,
      status_id,
      id
    ]
  )
}