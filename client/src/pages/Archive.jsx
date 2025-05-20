import React, { useEffect, useState } from "react"
import { getAllCancelledMembers } from "@/lib/api/archive"

import { ListRestart, X } from "lucide-react"

import DataTable from "@/components/ui/data-table"
import TableSearch from "@/components/ui/table-search"
import { Button } from "@/components/ui/button"
import { Sheet } from "@/components/ui/sheet"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import { archiveColumns } from "@/components/table/ArchiveColumn"
import RestoreMember from "@/components/Member/Restore"

const Archive = () => {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState(
    () => localStorage.getItem("archiveGlobalFilter") || ""
  )
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("archiveVisibleColumns")
    return saved
      ? JSON.parse(saved)
      : { contactNumber: true, cancelDate: true }
  })
  const [restoreId, setRestoreId] = useState(null)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("archiveGlobalFilter", globalFilter)
  }, [globalFilter])

  useEffect(() => {
    localStorage.setItem(
      "archiveVisibleColumns",
      JSON.stringify(visibleColumns)
    )
  }, [visibleColumns])

  const fetchData = async () => {
    try {
      const cancelled = await getAllCancelledMembers()
      setData(cancelled)
    } catch (err) {
      console.error("Failed to fetch cancelled members", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleColumn = column => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  const resetFilters = () => {
    setGlobalFilter("")
    setVisibleColumns({ contactNumber: true, cancelDate: true })
    localStorage.removeItem("archiveGlobalFilter")
    localStorage.removeItem("archiveVisibleColumns")
  }

  const globalFilterFn = (row, _colId, filterValue) => {
    const lower = filterValue.toLowerCase()

    const fullName = `${row.original.first_name} ${row.original.last_name}`.toLowerCase()
    if (fullName.includes(lower)) {
     return true
    }

    const fields = ["id"]
    if (visibleColumns.contactNumber) fields.push("contact_number")
    if (visibleColumns.cancelDate)    fields.push("cancel_date")

    return fields.some(field => {
      let text = String(row.original[field] ?? "")
      if (field === "cancel_date" && text) {
        const d = new Date(text)
        text = !isNaN(d)
          ? d.toLocaleDateString("en-US", {
              year:  "numeric",
              month: "short",
              day:   "2-digit",
            })
          : ""
      }
      return text.toLowerCase().includes(lower)
    })
 }

  const hasActiveFilters =
    globalFilter || Object.values(visibleColumns).some(v => !v)

  const openRestore = memberId => {
    setRestoreId(memberId)
    setIsRestoreOpen(true)
  }

  return (
    <div className="grid grid-cols-20 gap-4 mb-4 h-full">
      <div className="col-span-20 flex flex-col gap-4 h-full">
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle className="font-bold">
              Cancelled Members
            </ContainerTitle>
            <p className="text-sm text-muted-foreground">
              View and restore cancelled members. Toggle column visibility or reset filters below.
            </p>
          </ContainerHeader>
          <Separator />
          <ContainerContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <TableSearch
                value={globalFilter}
                onChange={setGlobalFilter}
                placeholder="Search cancelled members..."
                className="h-8 w-100"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1 flex-wrap">
                <Button
                  variant={visibleColumns.contactNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleColumn("contactNumber")}
                  className="h-8 text-sm flex items-center gap-1"
                >
                  Contact Number
                  {visibleColumns.contactNumber && <X className="w-3 h-3" />}
                </Button>

                <Button
                  variant={visibleColumns.cancelDate ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleColumn("cancelDate")}
                  className="h-8 text-sm flex items-center gap-1"
                >
                  Cancel Date
                  {visibleColumns.cancelDate && <X className="w-3 h-3" />}
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
            </div>

            <DataTable
              columns={archiveColumns(visibleColumns, { openRestore })}
              data={data}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              globalFilterFn={globalFilterFn}
            />
          </ContainerContent>
        </Container>
      </div>

      <Sheet open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <RestoreMember
          memberId={restoreId}
          isSheetOpen={isRestoreOpen}
          onClose={() => setIsRestoreOpen(false)}
          refreshMember={fetchData}
        />
      </Sheet>
    </div>
  )
}

export default Archive
