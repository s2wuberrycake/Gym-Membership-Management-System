// client/src/lib/api/log.js
import axios from "axios"
import { HOME_API } from "."

/**
 * Fetch the full update log (for Home page).
 * @returns {Promise<Array>} Array of update‐log rows from your /api/home backend.
 */
export const getAllUpdateLogs = async () => {
  const res = await axios.get(HOME_API)
  return res.data
}
