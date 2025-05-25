import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Undo2 } from "lucide-react"

const columnHelper = createColumnHelper()

const truncate = (text, max = 16) =>
  text && text.length > max ? text.slice(0, max) + "..." : text || ""

const formatDate = value =>
  value ? format(new Date(value), "MMM dd, yyyy") : "-"

const statusStyles = {
  cancelled: "bg-red-100 text-red-800"
}

export const archiveColumns = (visibleColumns = {}, actions = {}) => {
  const columns = [
    columnHelper.accessor("id", {
      header: "Member ID",
      cell: info => `MEM-${info.getValue()}`
    }),

    columnHelper.accessor(
      row => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
      {
        id: "name",
        header: "Name",
        cell: info => truncate(info.getValue())
      }
    )
  ]

  if (visibleColumns.contactNumber) {
    columns.push(
      columnHelper.accessor("contact_number", {
        header: "Contact No.",
        cell: info => info.getValue()
      })
    )
  }

  if (visibleColumns.cancelDate) {
    columns.push(
      columnHelper.accessor("cancel_date", {
        header: "Cancel Date",
        cell: info => formatDate(info.getValue())
      })
    )
  }

  columns.push(
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
    })
  )

  columns.push(
    columnHelper.display({
      id: "actions",
      header: "Restore",
      cell: ({ row }) => {
        const member = row.original

        const handleRestore = () => {
          if (actions.openRestore) {
            actions.openRestore(member.id)
          }
        }

        return (
          <Button
            variant="ghost"
            className="h-full py-1 px-2"
            onClick={handleRestore}
          >
            <span className="sr-only">Restore</span>
            <Undo2 />
          </Button>
        )
      }
    })
  )

  return columns
}
