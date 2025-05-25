import React from "react"
import ChartMultiBar from "@/components/ui/chart-multi-bar"
import { ChartContainer } from "@/components/ui/chart"

export default function MemberGrowth({ data }) {
  const dataKeys = ["enrolled", "cancelled"]
  const colors   = {
    enrolled: "var(--chart-1)",
    cancelled: "var(--chart-3)"
  }

  return (
    <ChartContainer
      config={{
        enrolled: { label: "Enrolled", color: "var(--chart-1)" },
        cancelled: { label: "Cancelled", color: "var(--chart-2)" }
      }}
      className="min-h-[200px] w-full"
    >
      <ChartMultiBar
        data={data}
        dataKeys={dataKeys}
        colors={colors}
      />
    </ChartContainer>
  )
}
