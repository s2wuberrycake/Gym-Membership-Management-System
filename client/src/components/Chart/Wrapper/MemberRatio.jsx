import React, { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getMemberRatio } from "@/lib/api/analytics"
import MemberRatio from "../Data/MemberRatio"

export default function MemberRatioChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const rows = await getMemberRatio()
        setData(rows)
      } catch (err) {
        console.error("DEBUG >> fetch member ratio error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  return <MemberRatio data={data} />
}
