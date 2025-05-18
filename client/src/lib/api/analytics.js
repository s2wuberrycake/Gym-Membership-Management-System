import axios from "axios"
import { API_BASE } from "./index"

export const getMemberGrowth = async period => {
  const res = await axios.get(`${API_BASE}/api/analytics/member-growth`, { params: { period } })
  return res.data
}