import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderOpen } from "lucide-react"

const columnHelper = createColumnHelper()

const truncate = (text, maxLength = 25) => {
  if (!text) return ""
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
}

const formatDate = value =>
  value ? format(new Date(value), "MMM dd, yyyy") : "-"

const statusStyles = {
  active: "bg-green-100 text-green-800",
  expired: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800"
}

export const membersColumns = (navigate, visibleColumns = {}) => {
  const columns = [
    // UUID column
    columnHelper.accessor("id", {
      header: "UUID",
      cell: info => info.getValue()
    }),

    // Combined Name column
    columnHelper.accessor(
      row => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
      {
        id: "name",
        header: "Name",
        cell: info => truncate(info.getValue())
      }
    ),

    // Contact Number (optional)
    visibleColumns.contactNumber &&
      columnHelper.accessor("contact_number", {
        header: "Contact No.",
        cell: info => info.getValue()
      }),

    // Recent Join Date (optional)
    visibleColumns.joinDate &&
      columnHelper.accessor("recent_join_date", {
        header: "Recent Join Date",
        cell: info => formatDate(info.getValue())
      }),

    // Expiration Date (optional)
    visibleColumns.expireDate &&
      columnHelper.accessor("expiration_date", {
        header: "Expiration Date",
        cell: info => formatDate(info.getValue())
      }),

    // Status badge
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

    // Actions
    columnHelper.display({
      id: "actions",
      header: "View",
      cell: ({ row }) => {
        const member = row.original

        return (
          <Button
            variant="ghost"
            className="h-0.5 p-0"
            onClick={() => navigate(`/members/${member.id}`)}
          >
            <span className="sr-only">View</span>
            <FolderOpen className="" />
          </Button>
        )
      }
    })
  ]

  return columns.filter(Boolean)
}