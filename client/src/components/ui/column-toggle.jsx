import React from "react"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export default function ColumnToggle({ table }) {
  if (!table) return null

  const nonToggleable = ["id", "first_name", "last_name", "status"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="" variant="outline">
          <Settings2 className="w-4 h-4 mr-1" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-[180px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            column =>
              typeof column.accessorFn !== "undefined" &&
              column.getCanHide() &&
              !nonToggleable.includes(column.id)
          )
          .map(column => (
            <DropdownMenuItem
              key={column.id}
              className="capitalize cursor-pointer"
              onSelect={e => {
                e.preventDefault()
                column.toggleVisibility(!column.getIsVisible())
              }}
            >
              {column.columnDef.header || column.id}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
