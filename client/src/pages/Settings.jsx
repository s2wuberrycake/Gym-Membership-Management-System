import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getAllAccounts,
  backupDatabase,
  listBackups,
  restoreDatabase,
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
  SelectItem,
} from "@/components/ui/select"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/context/ThemeProvider"
import { toast } from "sonner"
import AddAccount from "@/components/Account/Add"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent,
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"

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
  staff: "Staff Only",
}

const nextRole = {
  all: "admin",
  admin: "staff",
  staff: "all",
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
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)

  const token = localStorage.getItem("token") || ""
  const { role: userRole } = decodeJwt(token)
  const isAdmin = userRole === "admin"

  const [backups, setBackups] = useState([])
  const [selectedBackup, setSelectedBackup] = useState("")

  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

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
      if (err.response?.status === 403) return
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
      if (err.response?.status === 403) return
      console.error("Error fetching backups:", err)
      toast.error("Failed to load backups")
    }
  }

  useEffect(() => {
    fetchAccounts()
    fetchBackups()
  }, [])

  const cycleRoleFilter = () => setRoleFilter((prev) => nextRole[prev])
  const resetFilters = () => {
    setGlobalFilter("")
    setRoleFilter("all")
    localStorage.removeItem("accountsGlobalFilter")
    localStorage.removeItem("accountsRoleFilter")
  }

  const filteredData =
    roleFilter === "all"
      ? data
      : data.filter((a) => a.role?.toLowerCase() === roleFilter)
  const displayedData = isAdmin ? filteredData : []

  const globalFilterFn = (row, _, filterValue) =>
    ["account_id", "username", "role"].some((field) =>
      String(row.original[field] ?? "")
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    )

  const hasActiveFilters = globalFilter || roleFilter !== "all"

  const handleBackup = async () => {
    try {
      const { blob, filename } = await backupDatabase()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success("Backup created! ✨")
      await fetchBackups()
    } catch (err) {
      console.error("Backup error", err)
      toast.error("Backup failed")
    }
  }

  const handleRestore = async () => {
    try {
      await restoreDatabase(selectedBackup)
      toast.success("Database restored successfully! ✨")
      fetchAccounts()
      setIsRestoreOpen(false)
    } catch (err) {
      console.error("Restore error", err)
      toast.error("Restore failed")
    }
  }

  return (
    <div className="grid grid-cols-20 gap-4 mb-4 h-full">
      {/* Accounts pane */}
      <div
        className={`col-span-20 flex flex-col gap-4 h-full ${
          !isAdmin ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle>Accounts</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Requires "Admin" role to access. Create, delete, and update
              accounts for your staff.
            </p>
          </ContainerHeader>
          <Separator />
          <ContainerContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-2">
              <TableSearch
                value={globalFilter}
                disabled={!isAdmin}
                onChange={setGlobalFilter}
                placeholder="Search accounts..."
                className="h-8 w-full max-w-sm"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={roleFilter === "all" ? "default" : "outline"}
                  size="sm"
                  disabled={!isAdmin}
                  className="h-8 text-sm"
                  onClick={cycleRoleFilter}
                >
                  {roleLabel[roleFilter]}
                </Button>

                <Button
                  variant={hasActiveFilters ? "default" : "outline"}
                  size="sm"
                  disabled={!isAdmin}
                  className="h-8 text-sm"
                  onClick={resetFilters}
                >
                  {hasActiveFilters ? "Reset Filters" : <ListRestart className="w-4 h-4" />}
                </Button>
              </div>

              <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="main" disabled={!isAdmin} className="h-8 text-sm">
                    Add Account
                  </Button>
                </SheetTrigger>
                <AddAccount
                  isSheetOpen={isAddOpen}
                  onClose={() => setIsAddOpen(false)}
                  refreshAccounts={fetchAccounts}
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

      {/* Backup & Restore pane */}
      <div
        className={`col-span-20 flex flex-col gap-4 h-full ${
          !isAdmin ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle>Backup and Restore</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Generate and restore backups. Generated backups will save the state of the whole database. A maximum of 8
              backups can be stored. Older backups will be overwritten first if the amount of saved backups exceeded. A
              backup will be automatically generated every week
            </p>
          </ContainerHeader>
          <Separator />
          <ContainerContent className="flex-1 flex flex-col items-start justify-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={!isAdmin}
                className="h-8 text-sm"
                onClick={handleBackup}
              >
                Generate a Backup
              </Button>

              <Select
                value={selectedBackup}
                disabled={!isAdmin}
                onValueChange={setSelectedBackup}
              >
                <SelectTrigger className="w-full max-w-xs h-8">
                  <SelectValue placeholder="Select backup to restore" />
                </SelectTrigger>
                <SelectContent>
                  {backups.map((fn) => (
                    <SelectItem key={fn} value={fn}>
                      {fn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Sheet open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!isAdmin || !selectedBackup}
                    className="h-8 text-sm"
                  >
                    Restore a Backup
                  </Button>
                </SheetTrigger>

                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="mb-4">Confirm Restore</SheetTitle>
                    <SheetDescription asChild>
                      <div>
                        <div className="p-6 pb-2 max-w-md">
                          <h2 className="text-xl font-bold">
                            Restore a Backup File
                          </h2>
                          <p className="text-sm text-muted-foreground leading-tight">
                            This will overwrite your entire database with{" "}
                            <strong>{selectedBackup}</strong>. This cannot be undone.
                          </p>
                        </div>

                        <div className="flex flex-auto justify-between p-6 pt-2 space-y-4 max-w-md">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-sm"
                            onClick={() => setIsRestoreOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-sm"
                            onClick={handleRestore}
                          >
                            Yes, Restore
                          </Button>
                        </div>
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

            </div>
          </ContainerContent>
        </Container>
      </div>

      {/* Dark Mode pane */}
      <div className="col-span-20 flex flex-col gap-4 h-full">
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle>Appearance</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Toggle between light or dark mode based on your preference.
            </p>
          </ContainerHeader>
          <Separator />
          <ContainerContent className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <p> Dark Mode</p>
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
              aria-label="Toggle dark mode"
            />
          </ContainerContent>
        </Container>
      </div>
    </div>
  )
}
