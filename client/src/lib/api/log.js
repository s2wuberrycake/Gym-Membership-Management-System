import axios from "axios"
import { HOME_API, VISITS_API } from "."

export const getAllUpdateLogs = async () => {
  const res = await axios.get(HOME_API)
  return res.data
}

export const getAllVisitLogs = async () => {
  const res = await axios.get(VISITS_API)
  return res.data
}
