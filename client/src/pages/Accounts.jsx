import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllAccounts } from "@/lib/api/accounts"

import { ListRestart } from "lucide-react"
import DataTable from "@/components/ui/data-table"
import { accountsColumns } from "@/components/table/AccountsColumn"
import TableSearch from "@/components/ui/table-search"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import AddAccount from "@/components/Account/Add"

const roleLabel = {
  all: "All Roles",
  admin: "Admin Only",
  staff: "Staff Only"
}

const nextRole = {
  all: "admin",
  admin: "staff",
  staff: "all"
}

const Accounts = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [tableRef, setTableRef] = useState(null)

  const [globalFilter, setGlobalFilter] = useState(() => {
    return localStorage.getItem("accountsGlobalFilter") || ""
  })

  const [roleFilter, setRoleFilter] = useState(() => {
    return localStorage.getItem("accountsRoleFilter") || "all"
  })

  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("accountsGlobalFilter", globalFilter)
  }, [globalFilter])

  useEffect(() => {
    localStorage.setItem("accountsRoleFilter", roleFilter)
  }, [roleFilter])

  const fetchAccounts = async () => {
    try {
      const accounts = await getAllAccounts()
      setData(accounts)
    } catch (err) {
      console.error("Error fetching accounts:", err)
      toast.error("Failed to load accounts")
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const cycleRoleFilter = () => {
    setRoleFilter(prev => nextRole[prev])
  }

  const resetFilters = () => {
    setGlobalFilter("")
    setRoleFilter("all")
    localStorage.removeItem("accountsGlobalFilter")
    localStorage.removeItem("accountsRoleFilter")
  }

  const filteredData =
    roleFilter === "all"
      ? data
      : data.filter(account => account.role?.toLowerCase() === roleFilter)

  const globalFilterFn = (row, columnId, filterValue) => {
    const fields = ["account_id", "username", "role"]

    return fields.some(field => {
      const value = row.original[field]
      return String(value ?? "").toLowerCase().includes(filterValue.toLowerCase())
    })
  }

  return (
    <div className="grid grid-cols-10 grid-rows-2 gap-4 h-full">
      <div className="col-span-2 row-span-2 bg-primary-foreground p-4 rounded-lg">
        Side Panel
      </div>

      <div className="col-span-8 row-span-2 bg-primary-foreground p-4 rounded-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-2xl font-bold">Accounts</h2>
            <TableSearch
              value={globalFilter}
              onChange={setGlobalFilter}
              placeholder="Search accounts..."
            />
            <Button variant="outline" onClick={cycleRoleFilter}>
              {roleLabel[roleFilter]}
            </Button>
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="p-2"
            >
              <ListRestart className="w-4 h-4" />
            </Button>
          </div>

          <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetTrigger asChild>
              <Button className="ml-auto">Add Account</Button>
            </SheetTrigger>
            <AddAccount
              refreshAccounts={fetchAccounts}
              isSheetOpen={isAddOpen}
              onClose={() => setIsAddOpen(false)}
            />
          </Sheet>
        </div>

        <DataTable
          columns={accountsColumns(navigate)}
          data={filteredData}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          setTableRef={setTableRef}
          globalFilterFn={globalFilterFn}
        />
      </div>
    </div>
  )
}

export default Accounts
