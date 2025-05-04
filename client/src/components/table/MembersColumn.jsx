import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const columnHelper = createColumnHelper()

const truncate = (text, max = 16) =>
  text.length > max ? text.slice(0, max) + "..." : text

const formatDate = value =>
  value ? format(new Date(value), "MMM dd, yyyy") : "-"

const statusStyles = {
  active: "bg-green-100 text-green-800",
  expired: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800"
}

export const membersColumns = [
  columnHelper.accessor("id", {
    header: "UUID",
    cell: info => info.getValue()
  }),

  columnHelper.accessor("first_name", {
    header: "First Name",
    cell: info => truncate(info.getValue())
  }),

  columnHelper.accessor("last_name", {
    header: "Last Name",
    cell: info => truncate(info.getValue())
  }),

  columnHelper.accessor("contact_number", {
    header: "Contact No.",
    cell: info => info.getValue()
  }),

  columnHelper.accessor("join_date", {
    header: "Join Date",
    cell: info => formatDate(info.getValue())
  }),

  columnHelper.accessor("expiration_date", {
    header: "Expiration Date",
    cell: info => formatDate(info.getValue())
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: info => {
      const status = info.getValue()?.toLowerCase()
      const badgeClass = statusStyles[status] || "bg-gray-100 text-gray-800"
      const label = status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Unknown"

      return <Badge className={badgeClass}>{label}</Badge>
    }
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const member = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("View", member)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Edit", member)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("Cancel", member)}
              className="text-red-600"
            >
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  })
]