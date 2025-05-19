import React, { useState, useEffect } from "react"
import axios from "axios"
import VisitRate from "../Data/VisitRate"
import { format, subDays, subMonths } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export default function VisitRateChart({ period }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await axios.get(
          "/api/analytics/visit-rate",
          { params: { period } }
        )
        const now = new Date()
        let formatted = []

        if (period === "default") {
          formatted = Array.from({ length: 24 }, (_, i) => {
            const label = `${String(i).padStart(2, "0")}:00`
            const found = res.data.find(r => r.label === label)
            return { label, visits: found ? found.visits : 0 }
          })
        } else if (period === "week") {
          formatted = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(now, 6 - i)
            const label = format(date, "MM-dd")
            const found = res.data.find(r => r.label === label)
            return { label, visits: found ? found.visits : 0 }
          })
        } else if (period === "year") {
          formatted = Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(now, 11 - i)
            const key = format(date, "yy-MM")
            const yy = format(date, "yy")
            const monthName = format(date, "MMM")
            const label = `${yy}' ${monthName}`
            const found = res.data.find(r => r.label === key)
            return { label, visits: found ? found.visits : 0 }
          })
        } else {
          formatted = res.data
        }

        setData(formatted)
      } catch (error) {
        console.error("DEBUG >> fetch visit rate error", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  return <VisitRate data={data} />
}
