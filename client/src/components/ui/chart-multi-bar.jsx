import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Cell
} from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ChartMultiBar({
  data,
  dataKeys,
  colors,
  height = 300
}) {
  const maxValue = data.reduce(
    (mx, row) =>
      Math.max(mx, ...dataKeys.map(key => row[key] || 0)),
    0
  )
  const maxTick = Math.ceil(maxValue / 5) * 5
  const ticks = Array.from(
    { length: maxTick / 5 + 1 },
    (_, i) => i * 5
  )

  const legendPayload = dataKeys.map(key => ({
    value: key.charAt(0).toUpperCase() + key.slice(1),
    type: "circle",
    id: key,
    color: colors[key]
  }))

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
          payload={legendPayload}
          layout="horizontal"
          verticalAlign="bottom"
          align="left"
          wrapperStyle={{ marginTop: 16, paddingLeft: 0 }}
        />

        {dataKeys.map((key, idx) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={colors[key]}
          >
            {data.map((entry, i) => {
              if (idx === 0) {
                const hasTop = entry[dataKeys[1]] > 0
                const radius = hasTop
                  ? [0, 0, 4, 4]
                  : [4, 4, 4, 4]
                return <Cell key={i} radius={radius} />
              }
              const hasBottom = entry[dataKeys[0]] > 0
              const radius = hasBottom
                ? [4, 4, 0, 0]
                : [4, 4, 4, 4]
              return <Cell key={i} radius={radius} />
            })}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
