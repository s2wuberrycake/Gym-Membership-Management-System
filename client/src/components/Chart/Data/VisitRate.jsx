import React from "react"
import ChartSingleBar from "@/components/ui/chart-single-bar"
import { ChartContainer } from "@/components/ui/chart"

export default function VisitRate({ data }) {
  return (
    <ChartContainer
      config={{ visits: { label: "Visits", color: "var(--chart-1)" } }}
      className="min-h-[200px] w-full"
    >
      <ChartSingleBar
        data={data}
        dataKey="visits"
        color="var(--chart-1)"
      />
    </ChartContainer>
  )
}
