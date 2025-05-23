import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderOpen } from "lucide-react"

const columnHelper = createColumnHelper()

const roleStyles = {
  admin: "bg-blue-100 text-blue-800",
  staff: "bg-purple-100 text-purple-800"
}

export const accountsColumns = (navigate) => [
  columnHelper.accessor("username", {
    header: "Username",
    cell: info => info.getValue()
  }),

  columnHelper.accessor("role", {
    header: "Role",
    cell: info => {
      const role = info.getValue()?.toLowerCase()
      const badgeClass = roleStyles[role] || "bg-gray-100 text-gray-800"
      const label = role.charAt(0).toUpperCase() + role.slice(1)
      return <Badge className={badgeClass}>{label}</Badge>
    }
  }),

  columnHelper.display({
    id: "actions",
    header: "View",
    cell: ({ row }) => {
      const account = row.original
      return (
        <Button
          variant="ghost"
          className="h-full py-1 px-2"
          onClick={() => navigate(`/accounts/${account.account_id}`)}
        >
          <span className="sr-only">View</span>
          <FolderOpen />
        </Button>
      )
    }
  })
]
