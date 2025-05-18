import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts"

export default function ChartMultiBar({
  data,
  dataKeys,
  colors,
  height = 300
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid vertical={false}/>
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <Tooltip
          // gives you a semi‐transparent overlay on hover:
          cursor={{ fill: "var(--color-muted-foreground)", opacity: 0.1 }}
          // style the box to match your cards:
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "none",
            borderRadius: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
          // text colors
          labelStyle={{ color: "var(--color-card-foreground)" }}
          itemStyle={{ color: "inherit" }}
        />
        <Legend formatter={value => value} />
        {dataKeys.map(key => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[key]}
            radius={4}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
