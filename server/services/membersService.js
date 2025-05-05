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
      m.original_join_date,
      m.recent_join_date,
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
    status_id = 1
  } = data
  
  const today = new Date().toISOString().split("T")[0]
  const formattedExpiration = new Date(expiration_date).toISOString().split("T")[0]
  
  console.log("DEBUG >> Final insert values:", {
    first_name,
    last_name,
    email,
    contact_number,
    address,
    original_join_date: today,
    recent_join_date: today,
    expiration_date: formattedExpiration,
    status_id
  })
  
  const [result] = await defaultDb.query(
    `INSERT INTO members (
      first_name, last_name, email, contact_number, address,
      original_join_date, recent_join_date, expiration_date, status_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      today,
      today,
      formattedExpiration,
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
    m.original_join_date,
    m.recent_join_date,
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
    recent_join_date,
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
    recent_join_date,
    expiration_date,
    status_id
  })
  
  await defaultDb.query(
    `UPDATE members
    SET first_name = ?, last_name = ?, email = ?, contact_number = ?, address = ?, recent_join_date = ?, expiration_date = ?, status_id = ?
    WHERE member_id = ?`,
    [
      first_name,
      last_name,
      email || null,
      contact_number,
      address,
      recent_join_date,
      expiration_date,
      status_id,
      id
    ]
  )
}

export const updateMemberExpiration = async (id, expiration_date, statusLabel) => {
  const [rows] = await defaultDb.query(
    "SELECT status_id FROM status_types WHERE status_label = ?",
    [statusLabel]
  )
  
  if (!rows.length) {
    throw new Error(`Status label "${statusLabel}" not found`)
  }
  
  const status_id = rows[0].status_id
  
  const [result] = await defaultDb.query(
    "UPDATE members SET expiration_date = ?, status_id = ? WHERE member_id = ?",
    [expiration_date, status_id, id]
  )
  
  return result
}

// Pulling all rows from cancelled members table
export const fetchCancelledMembers = async () => {
  const [rows] = await defaultDb.query(`
    SELECT 
      cm.member_id AS id,
      cm.first_name,
      cm.last_name,
      cm.email,
      cm.contact_number,
      cm.address,
      cm.original_join_date,
      cm.cancel_date,
      st.status_label AS status
    FROM cancelled_members cm
    LEFT JOIN status_types st ON cm.status_id = st.status_id
  `)

  return rows
}

export const cancelMember = async (id) => {
  const connection = await defaultDb.getConnection()
  try {
    await connection.beginTransaction()

    const [rows] = await connection.query("SELECT * FROM members WHERE member_id = ?", [id])
    if (!rows.length) throw new Error("Member not found")

    const member = rows[0]
    const cancelDate = new Date().toISOString().split("T")[0]

    await connection.query(
      `INSERT INTO cancelled_members (
        member_id, first_name, last_name, email, contact_number, address,
        original_join_date, cancel_date, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        member.member_id,
        member.first_name,
        member.last_name,
        member.email,
        member.contact_number,
        member.address,
        member.original_join_date,
        cancelDate,
        3
      ]
    )

    await connection.query("DELETE FROM members WHERE member_id = ?", [id])

    await connection.commit()
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
}


export const restoreMember = async (id, expiration_date) => {
  const connection = await defaultDb.getConnection()
  try {
    await connection.beginTransaction()

    const [rows] = await connection.query("SELECT * FROM cancelled_members WHERE member_id = ?", [id])
    if (!rows.length) throw new Error("Cancelled member not found")

    const cancelledMember = rows[0]
    const today = new Date().toISOString().split("T")[0]
    const formattedExpiration = new Date(expiration_date).toISOString().split("T")[0]

    await connection.query(
      `INSERT INTO members (
        member_id, first_name, last_name, email, contact_number, address,
        original_join_date, recent_join_date, expiration_date, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cancelledMember.member_id,
        cancelledMember.first_name,
        cancelledMember.last_name,
        cancelledMember.email,
        cancelledMember.contact_number,
        cancelledMember.address,
        cancelledMember.original_join_date,
        today,
        formattedExpiration,
        1 // status_id for "Active"
      ]
    )

    await connection.query("DELETE FROM cancelled_members WHERE member_id = ?", [id])

    await connection.commit()
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
}

export const fetchCancelledMemberById = async (id) => {
  const [rows] = await defaultDb.query(
    `SELECT 
      cm.member_id AS id,
      cm.first_name,
      cm.last_name,
      cm.email,
      cm.contact_number,
      cm.address,
      cm.original_join_date,
      cm.cancel_date,
      cm.status_id,
      st.status_label AS status
    FROM cancelled_members cm
    LEFT JOIN status_types st ON cm.status_id = st.status_id
    WHERE cm.member_id = ?`,
    [id]
  )

  return rows[0] || null
}
