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
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent
} from "@/components/ui/container"

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

const Settings = () => {
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

  const hasActiveFilters =
    globalFilter || roleFilter !== "all"

  return (
    <div className="grid grid-cols-20 grid-rows-[auto_1fr] gap-4 h-full">
      <div className="col-span-20 flex justify-between items-center">
        <TableSearch
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search accounts..."
        />
      </div>

      <Container className="col-span-20 flex flex-col gap-4 h-full">
        <ContainerHeader>
          <div className="flex items-center justify-between flex-wrap gap-4 mt-18 -mb-6">
            <div className="flex items-center gap-1 flex-wrap">
              <Button
                variant={roleFilter === "all" ? "default" : "outline"}
                onClick={cycleRoleFilter}
                size="sm"
                className="h-8 text-sm"
              >
                {roleLabel[roleFilter]}
              </Button>

              {hasActiveFilters ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-sm"
                >
                  Reset Filters
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-sm"
                >
                  <ListRestart className="w-4 h-4" />
                </Button>
              )}
            </div>

            <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="h-8 text-sm">Add Account</Button>
              </SheetTrigger>
              <AddAccount
                refreshAccounts={fetchAccounts}
                isSheetOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
              />
            </Sheet>
          </div>
        </ContainerHeader>

        <ContainerContent className="pt-2 flex-1 flex flex-col">
          <DataTable
            columns={accountsColumns(navigate)}
            data={filteredData}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            setTableRef={setTableRef}
            globalFilterFn={globalFilterFn}
          />
        </ContainerContent>
      </Container>
    </div>
  )
}

export default Settings
