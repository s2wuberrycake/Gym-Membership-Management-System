import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid
} from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ChartSingleBar({
  data,
  dataKey,
  color,
  height = 300
}) {
  const maxValue = data.reduce(
    (mx, row) => Math.max(mx, row[dataKey] || 0),
    0
  )
  const maxTick = Math.ceil(maxValue / 5) * 5
  const ticks = Array.from(
    { length: maxTick / 5 + 1 },
    (_, i) => i * 5
  )

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          ticks={ticks}
          domain={[0, maxTick]}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Legend
          payload={[
            { value: "Visits", type: "circle", id: dataKey, color }
          ]}
          layout="horizontal"
          verticalAlign="bottom"
          align="left"
          wrapperStyle={{ marginTop: 16, paddingLeft: 0 }}
        />

        <Bar
          dataKey={dataKey}
          fill={color}
          radius={[4, 4, 4, 4]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
