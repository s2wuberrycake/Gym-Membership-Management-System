import React, { useState, useEffect } from "react"
import MemberGrowth from "../Data/MemberGrowth"
import { format, subDays, subMonths } from "date-fns"
import { getMemberGrowth } from "@/lib/api/analytics"
import { Skeleton } from "@/components/ui/skeleton"

export default function MemberGrowthChart({ period }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const resData = await getMemberGrowth(period)
        const now = new Date()
        let formatted = []

        if (period === "default") {
          formatted = Array.from({ length: 24 }, (_, i) => {
            const label = `${String(i).padStart(2, "0")}:00`
            const found = resData.find(r => r.label === label)
            return {
              label,
              enrolled: found ? found.enrolled : 0,
              cancelled: found ? found.cancelled : 0
            }
          })
        } else if (period === "week") {
          formatted = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(now, 6 - i)
            const label = format(date, "MM-dd")
            const found = resData.find(r => r.label === label)
            return {
              label,
              enrolled: found ? found.enrolled : 0,
              cancelled: found ? found.cancelled : 0
            }
          })
        } else if (period === "year") {
          formatted = Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(now, 11 - i)
            const key = format(date, "yy-MM")
            const yy = format(date, "yy")
            const monthName = format(date, "MMM")
            const label = `${yy}' ${monthName}`
            const found = resData.find(r => r.label === key)
            return {
              label,
              enrolled: found ? found.enrolled : 0,
              cancelled: found ? found.cancelled : 0
            }
          })
        } else {
          formatted = resData
        }

        setData(formatted)
      } catch (error) {
        console.error("DEBUG >> fetch analytics error", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  return <MemberGrowth data={data} />
}
