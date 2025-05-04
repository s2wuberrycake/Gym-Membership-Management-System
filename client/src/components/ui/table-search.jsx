import React from "react"
import { Input } from "@/components/ui/input"

export default function TableSearch({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <Input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none
        focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
        [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2
        relative w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground
        shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64 ${className}`}
    />
  )
}
