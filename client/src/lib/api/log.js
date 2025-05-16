import axios from "axios"
import { HOME_API } from "."

export const getAllUpdateLogs = async () => {
  const res = await axios.get(HOME_API)
  return res.data
}
