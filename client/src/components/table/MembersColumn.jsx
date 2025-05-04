import { createColumnHelper } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const columnHelper = createColumnHelper()

export const membersColumns = [
  columnHelper.accessor("id", {
    header: "UUID",
    cell: info => info.getValue()
  }),

  columnHelper.accessor("first_name", {
    header: "First Name",
    cell: info => {
      const firstName = info.getValue()
      return firstName.length > 16 ? firstName.slice(0, 16) + "..." : firstName
    }
  }),

  columnHelper.accessor("last_name", {
    header: "Last Name",
    cell: info => {
      const lastName = info.getValue()
      return lastName.length > 16 ? lastName.slice(0, 16) + "..." : lastName
    }
  }),

  columnHelper.accessor("contact_number", {
    header: "Contact No.",
    cell: info => info.getValue()
  }),

  columnHelper.accessor("join_date", {
    header: "Join Date",
    cell: info => {
      const value = info.getValue()
      if (!value) return "-"
      return format(new Date(value), "MMM dd, yyyy")
    }
  }),

  columnHelper.accessor("expiration_date", {
    header: "Expiration Date",
    cell: info => {
      const value = info.getValue()
      if (!value) return "-"
      return format(new Date(value), "MMM dd, yyyy")
    }
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: info => {
      const status = info.getValue()
      const statusMap = {
        active: "bg-green-100 text-green-800",
        expired: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800"
      }

      const badgeStyle = statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-800"

      return (
        <Badge className={badgeStyle}>
          {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
        </Badge>
      )
    }
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button className="btn btn-xs btn-info">Edit</button>
        <button className="btn btn-xs btn-error">Cancel</button>
      </div>
    )
  })
]
