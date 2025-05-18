import React, { useMemo } from "react"
import { PieChart, Pie, Cell, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ChartPie({
  data,
  dataKey,
  nameKey,
  config,
  innerRadius = 60,
  strokeWidth = 5,
  totalLabel = ""
}) {
  const total = useMemo(
    () => data.reduce((sum, entry) => sum + (entry[dataKey] || 0), 0),
    [data, dataKey]
  )

  return (
    <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={innerRadius}
          strokeWidth={strokeWidth}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={config[entry[nameKey]].color}
            />
          ))}
          <Label
            content={({ viewBox }) => {
              if (!viewBox || typeof viewBox.cx !== "number" || typeof viewBox.cy !== "number") return null
              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-3xl font-bold"
                  >
                    {total.toLocaleString()}
                  </tspan>
                  {totalLabel && (
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy + 24}
                      className="fill-muted-foreground"
                    >
                      {totalLabel}
                    </tspan>
                  )}
                </text>
              )
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
