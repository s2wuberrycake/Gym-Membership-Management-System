// src/components/Chart/AnalyticsHome.jsx
import React, { useState, useEffect } from "react"
import axios from "axios"
import MemberGrowth from "./MemberGrowth"

export default function AnalyticsHome({ period }) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await axios.get(
          "/api/analytics/member-growth",
          { params: { period } }
        )
        console.log("DEBUG >> member growth raw data", res.data)
        setData(res.data)
      } catch (error) {
        console.log("DEBUG >> fetch analytics error", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [period])

  if (loading) {
    return <div>Loading...</div>
  }

  return <MemberGrowth data={data} />
}
