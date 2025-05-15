import React from "react"
import { Input } from "@/components/ui/input"

export default function TableSearch({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <Input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`inline-flex items-center gap-2 h-9 whitespace-nowrap transition-colors focus-visible:outline-none
        focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
        [&_svg]:size-4 [&_svg]:shrink-0 border border-input px-4 py-2
        relative w-1/3 justify-start rounded-xl text-sm font-normal shadow-none sm:pr-12
        bg-[var(--input-background)] text-[var(--input-foreground)] ${className}`}
    />
  )
}
