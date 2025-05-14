import React, { useEffect, useState } from "react"
import { getAllCancelledMembers } from "@/lib/api/archive"

import { ListRestart, CalendarX, CalendarCheck, X } from "lucide-react"

import DataTable from "@/components/ui/data-table"
import { archiveColumns } from "@/components/table/ArchiveColumn"
import TableSearch from "@/components/ui/table-search"
import { Button } from "@/components/ui/button"
import { Sheet } from "@/components/ui/sheet"
import RestoreMember from "@/components/Member/Restore"
import {
  Container,
  ContainerHeader,
  ContainerContent
} from "@/components/ui/container"

export default function Archive() {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState(() => {
    return localStorage.getItem("archiveGlobalFilter") || ""
  })

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("archiveVisibleColumns")
    return saved
      ? JSON.parse(saved)
      : { contactNumber: true, cancelDate: true }
  })

  const [isRestoreOpen, setIsRestoreOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("archiveGlobalFilter", globalFilter)
  }, [globalFilter])

  useEffect(() => {
    localStorage.setItem("archiveVisibleColumns", JSON.stringify(visibleColumns))
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
    setVisibleColumns({
      contactNumber: true,
      cancelDate: true
    })
    localStorage.removeItem("archiveGlobalFilter")
    localStorage.removeItem("archiveVisibleColumns")
  }

  const globalFilterFn = (row, columnId, filterValue) => {
    const fields = ["id", "first_name", "last_name"]
    if (visibleColumns.contactNumber) fields.push("contact_number")
    if (visibleColumns.cancelDate) fields.push("cancel_date")

    return fields.some(field => {
      const value = row.original[field]
      const date = field === "cancel_date" ? new Date(value) : null
      const formatted = date
        ? date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit"
          })
        : ""

      return (
        (formatted || String(value ?? "")).toLowerCase().includes(filterValue.toLowerCase())
      )
    })
  }

  const hasActiveFilters =
    globalFilter || Object.values(visibleColumns).some(v => !v)

  return (
    <div className="grid grid-cols-20 grid-rows-[auto_1fr] gap-4 h-full">
      <div className="col-span-20 flex justify-between items-center">
        <TableSearch
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search cancelled members..."
        />
      </div>

      <Container className="col-span-20 flex flex-col gap-4 h-full">
        <ContainerHeader>
          <div className="flex items-center justify-between flex-wrap gap-4 mt-18 -mb-6">
            <div className="flex items-center gap-1 flex-wrap">
              <Button
                variant={visibleColumns.contactNumber ? "default" : "outline"}
                onClick={() => toggleColumn("contactNumber")}
                size="sm"
                className="h-8 text-sm flex items-center gap-1"
              >
                <span>Contact Number</span>
                {visibleColumns.contactNumber && <X className="w-3 h-3" />}
              </Button>

              <Button
                variant={visibleColumns.cancelDate ? "default" : "outline"}
                onClick={() => toggleColumn("cancelDate")}
                size="sm"
                className="h-8 text-sm flex items-center gap-1"
              >
                <span>Cancel Date</span>
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
        </ContainerHeader>

        <ContainerContent className="pt-2 flex-1 flex flex-col">
          <DataTable
            columns={archiveColumns(fetchData)}
            data={data}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            globalFilterFn={globalFilterFn}
          />
        </ContainerContent>
      </Container>

      <Sheet open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <RestoreMember
          refreshMembers={fetchData}
          isSheetOpen={isRestoreOpen}
          onClose={() => setIsRestoreOpen(false)}
        />
      </Sheet>
    </div>
  )
}
