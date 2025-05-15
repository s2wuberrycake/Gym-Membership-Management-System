// src/components/table/updateLogColumns.jsx
import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

const columnHelper = createColumnHelper()

const formatDate = value =>
  value ? format(new Date(value), "MMM dd, yyyy") : "-"

const actionStyles = {
  enrollment: "bg-green-100 text-green-800",
  "member info update": "bg-gray-100 text-gray-800",
  "membership extension": "bg-blue-100 text-blue-800",
  cancellation: "bg-red-100 text-red-800",
  expiration: "bg-yellow-100 text-yellow-800", 
  "re-enrollment": "bg-green-100 text-green-800"
}

export const updateLogColumns = () => [
  // Update ID
  columnHelper.accessor("update_id", {
    header: "Update ID",
    cell: info => info.getValue()
  }),

  // UUID
  columnHelper.accessor("member_id", {
    header: "UUID",
    cell: info => info.getValue()
  }),

  // Name (first + last)
  columnHelper.accessor(
    row => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
    {
      id: "name",
      header: "Name",
      cell: info => info.getValue()
    }
  ),

  // Authorization (account username)
  columnHelper.accessor("account_username", {
    header: "Authorization",
    cell: info => info.getValue()
  }),

  // Log Date
  columnHelper.accessor("log_date", {
    header: "Log Date",
    cell: info => formatDate(info.getValue())
  }),

  // Action as a colored Badge
  columnHelper.accessor("action_label", {
    header: "Action",
    cell: info => {
      const action = info.getValue()?.toLowerCase() ?? ""
      const badgeClass = actionStyles[action] || "bg-gray-100 text-gray-800"
      const label = action.charAt(0).toUpperCase() + action.slice(1)
      return <Badge className={badgeClass}>{label}</Badge>
    }
  })
]
