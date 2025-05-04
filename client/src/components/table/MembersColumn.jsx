import { createColumnHelper } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

const columnHelper = createColumnHelper()

export const membersColumns = [
  columnHelper.accessor("id", {
    header: "UUID",
    cell: info => info.getValue(),
  }),

  columnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
    id: "name",
    header: "Name",
    cell: info => {
      const name = info.getValue()
      return name.length > 16 ? name.slice(0, 32) + "..." : name
    },
  }),

  columnHelper.accessor("contact_number", {
    header: "Contact No.",
  }),

  columnHelper.accessor("join_date", {
    header: "Join Date",
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),

  columnHelper.accessor("expiration_date", {
    header: "Expiration Date",
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: info => {
      const status = info.getValue()
      const statusMap = {
        active: "bg-green-100 text-green-800",
        expired: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800",
      }

      const badgeStyle = statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-800"

      return (
        <Badge className={badgeStyle}>
          {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
        </Badge>
      )
    },
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button className="btn btn-xs btn-info">Edit</button>
        <button className="btn btn-xs btn-error">Cancel</button>
      </div>
    ),
  }),
]