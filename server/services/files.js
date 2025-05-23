// server/services/files.js
import fs from "fs/promises"
import path from "path"
import { defaultDb } from "../config/db.js"

export const saveProfilePic = async (member_id, file) => {
  if (!file) return null

  const ext = path.extname(file.originalname)
  const filename = `${member_id}${ext}`
  const destDir = path.resolve("uploads", "profiles")
  const dest = path.join(destDir, filename)

  // Ensure the profiles directory exists
  await fs.mkdir(destDir, { recursive: true })

  // Write the file to disk
  await fs.writeFile(dest, file.buffer)

  // Update the database record
  const [result] = await defaultDb.query(
    `UPDATE members
     SET profile_picture = ?
     WHERE member_id = ?`,
    [filename, member_id]
  )
  console.log(`DEBUG >> saved profile pic for member ${member_id}`)
  return result
}

export const restoreProfilePic = async (member_id, filename) => {
  const sql = `
    UPDATE members
    SET profile_picture = ?
    WHERE member_id = ?
  `
  const [result] = await defaultDb.query(sql, [filename, member_id])
  console.log(`DEBUG >> restored profile pic for member ${member_id}`)
  return result
}
