import React, { useState, useEffect } from "react"
import { getMemberRatio } from "@/lib/api/analytics"
import MemberRatio from "../Data/MemberRatio"

export default function MemberRatioChart() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const rows = await getMemberRatio()
        console.log("DEBUG >> member ratio raw data", rows)
        setData(rows)
      } catch (err) {
        console.log("DEBUG >> fetch member ratio error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  return <MemberRatio data={data} />
}
