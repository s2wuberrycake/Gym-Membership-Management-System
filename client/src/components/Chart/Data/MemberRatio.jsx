import React from "react"
import ChartPie from "@/components/ui/chart-pie"

export default function MemberRatio({ data }) {
  const config = {
    "1": { label: "Active",    color: "var(--chart-1)" },
    "2": { label: "Expired",   color: "var(--chart-2)" },
    "3": { label: "Cancelled", color: "var(--chart-3)" }
  }

  return (
    <ChartPie
      data={data}
      dataKey="value"
      nameKey="status_id"
      config={config}
      totalLabel="Members"
      className="mx-auto aspect-square max-h-[350px] w-full"
    />
  )
}
