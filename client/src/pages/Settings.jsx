import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getAllAccounts,
  backupDatabase,
  listBackups,
  restoreDatabase
} from "@/lib/api/settings"

import { ListRestart } from "lucide-react"

import DataTable from "@/components/ui/data-table"
import { accountsColumns } from "@/components/table/AccountsColumn"
import TableSearch from "@/components/ui/table-search"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
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

const decodeJwt = token => {
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

const Settings = () => {
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

  const token = localStorage.getItem("token") || ""
  const { role: userRole } = decodeJwt(token)
  const isAdmin = userRole === "admin"

  const [backups, setBackups] = useState([])
  const [selectedBackup, setSelectedBackup] = useState("")

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

  const fetchBackups = async () => {
    try {
      const files = await listBackups()
      setBackups(files)
      if (files.length) setSelectedBackup(files[0])
    } catch (err) {
      console.error("Error fetching backups:", err)
      toast.error("Failed to load backups")
    }
  }

  useEffect(() => {
    fetchAccounts()
    fetchBackups()
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

  const displayedData = isAdmin ? filteredData : []

  const globalFilterFn = (row, columnId, filterValue) => {
    const fields = ["account_id", "username", "role"]
    return fields.some(field => {
      const value = row.original[field]
      return String(value ?? "")
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    })
  }

  const hasActiveFilters = globalFilter || roleFilter !== "all"

  const handleBackup = async () => {
    try {
      const { blob, filename } = await backupDatabase()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success("Backup created! ✨")
      await fetchBackups()
    } catch (err) {
      console.error("Backup error", err)
      toast.error("Backup failed")
    }
  }

  const handleRestore = async () => {
    if (!selectedBackup) return
    try {
      await restoreDatabase(selectedBackup)
      toast.success("Database restored successfully! ✨")
    } catch (err) {
      console.error("Restore error", err)
      toast.error("Restore failed")
    }
  }

  return (
    <div className="grid grid-cols-20 gap-4 mb-4 h-full">
      <div className={`col-span-20 flex flex-col gap-4 h-full ${
        !isAdmin ? "pointer-events-none opacity-50" : ""
      }`}> 
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle>Accounts</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Requires "Admin" role to access. Create, delete, and update accounts
              for your staff.
            </p>
          </ContainerHeader>
          <Separator />
          <ContainerContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <TableSearch
                value={globalFilter}
                onChange={setGlobalFilter}
                placeholder="Search accounts..."
                className="h-8 w-100"
              />
            </div>

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

      <div className="col-span-20 flex flex-col gap-4 h-full">
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle>Backup and Restore</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Generate and restore backups.
            </p>
          </ContainerHeader>
          <Separator />
          <ContainerContent className="flex-1 flex flex-col items-start justify-center gap-4">
            <Button onClick={handleBackup} disabled={!isAdmin} className="h-10">
              Backup Database
            </Button>
            <div className="flex items-center gap-2">
              <Select
                value={selectedBackup}
                onValueChange={setSelectedBackup}
                disabled={!isAdmin}
              >
                <SelectTrigger className="w-60 h-10">
                  <SelectValue placeholder="Select backup to restore" />
                </SelectTrigger>
                <SelectContent>
                  {backups.map(fn => (
                    <SelectItem key={fn} value={fn}>
                      {fn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                onClick={handleRestore}
                disabled={!isAdmin || !selectedBackup}
                className="h-10"
              >
                Restore
              </Button>
            </div>
          </ContainerContent>
        </Container>
      </div>
    </div>
  )
}

export default Settings
