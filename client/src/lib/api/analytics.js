import axios from "axios"
import { API_BASE } from "./index"
import { ANALYTICS_API } from "./index"

export const getMemberGrowth = async period => {
  const res = await axios.get(
    `${API_BASE}/api/analytics/member-growth`,
    { params: { period } }
  )
  return res.data
}

export const getVisitRate = async period => {
  const res = await axios.get(
    `${API_BASE}/api/analytics/visit-rate`,
    { params: { period } }
  )
  return res.data
}

export const getMemberRatio = async () => {
  const res = await axios.get(
    `${API_BASE}/api/analytics/member-ratio`
  )
  return res.data
}

export const downloadAnalyticsReportUrl = period =>
  `${ANALYTICS_API}/analytics-report.xlsx?period=${period}`

export const getDashboardStats = async () => {
  const res = await axios.get(`${ANALYTICS_API}/dashboard-stats`)
  return res.data
}

export const getMostRecentVisit = async () => {
  const res = await axios.get(`${ANALYTICS_API}/most-recent-visit`)
  return res.data
}
