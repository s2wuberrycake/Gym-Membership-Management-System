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
import { Separator } from "@/components/ui/separator"

// Helper to decode the payload of a JWT
const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1]
    return JSON.parse(atob(payload))
  } catch {
    return {}
  }
}

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

export default function Settings() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [tableRef, setTableRef] = useState(null)

  const [globalFilter, setGlobalFilter] = useState(
    () => localStorage.getItem("accountsGlobalFilter") || ""
  )
  const [roleFilter, setRoleFilter] = useState(
    () => localStorage.getItem("accountsRoleFilter") || "all"
  )
  const [isAddOpen, setIsAddOpen] = useState(false)

  // decode once
  const { role: userRole } = decodeJwt(localStorage.getItem("token") || "")
  const isAdmin = userRole === "admin"

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
    setRoleFilter((prev) => nextRole[prev])
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
      : data.filter(
          (account) => account.role?.toLowerCase() === roleFilter
        )

  // only show rows to admins
  const displayedData = isAdmin ? filteredData : []

  const globalFilterFn = (row, columnId, filterValue) => {
    const fields = ["account_id", "username", "role"]
    return fields.some((field) => {
      const value = row.original[field]
      return String(value ?? "")
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    })
  }

  const hasActiveFilters = globalFilter || roleFilter !== "all"

  return (
    // If not admin, grey out and disable all interaction
    <div
      className={`grid grid-cols-20 grid-rows-[auto_1fr] gap-4 h-full ${
        !isAdmin ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <div className="col-span-20 flex justify-between items-center">
        <TableSearch
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search accounts..."
        />
      </div>

      <Container className="col-span-20 flex flex-col gap-4 h-full">
        <ContainerHeader>
          <ContainerTitle>Accounts</ContainerTitle>
          <p className="text-sm text-muted-foreground">
            Requires "Admin" role to access. Create, delete, and update accounts
            for your staff.
          </p>
        </ContainerHeader>

        <Separator />

        <ContainerContent className="flex-1 flex flex-col">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={roleFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={cycleRoleFilter}
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
                <Button size="sm" className="h-8 text-sm">
                  Add Account
                </Button>
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
            data={displayedData}
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
