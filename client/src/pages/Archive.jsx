import React, { useEffect, useState } from "react"
import DataTable from "@/components/ui/data-table"
import { archiveColumns } from "@/components/table/ArchiveColumn"
import TableSearch from "@/components/ui/table-search"
import { ListRestart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ARCHIVE_API } from "@/lib/api"
import RestoreMember from "@/components/members/RestoreMember"
import { Sheet } from "@/components/ui/sheet"

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

  const [tableRef, setTableRef] = useState(null)

  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState(null)

  useEffect(() => {
    localStorage.setItem("archiveGlobalFilter", globalFilter)
  }, [globalFilter])

  useEffect(() => {
    localStorage.setItem("archiveVisibleColumns", JSON.stringify(visibleColumns))
  }, [visibleColumns])

  const fetchCancelledMembers = () => {
    fetch(ARCHIVE_API)
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        console.error("Error fetching cancelled members:", err)
        toast.error("Failed to load cancelled members")
      })
  }

  useEffect(() => {
    fetchCancelledMembers()
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

      if (field === "cancel_date") {
        const date = value ? new Date(value) : null
        const formatted = date
          ? date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit"
            })
          : ""
        return formatted.toLowerCase().includes(filterValue.toLowerCase())
      }

      return String(value ?? "").toLowerCase().includes(filterValue.toLowerCase())
    })
  }

  const handleOpenRestore = id => {
    setSelectedMemberId(id)
    setIsRestoreOpen(true)
  }

  return (
    <div className="space-y-4 mb-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-2xl font-bold">Cancelled Members</h2>
          <TableSearch
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder="Search cancelled members..."
          />
          <Button
            variant={visibleColumns.contactNumber ? "outline" : "ghost"}
            onClick={() => toggleColumn("contactNumber")}
          >
            Contact #
          </Button>
          <Button
            variant={visibleColumns.cancelDate ? "outline" : "ghost"}
            onClick={() => toggleColumn("cancelDate")}
          >
            Cancel Date
          </Button>
          <Button variant="ghost" onClick={resetFilters} className="p-2">
            <ListRestart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <DataTable
        columns={archiveColumns(visibleColumns, {
          openRestore: handleOpenRestore
        })}
        data={data}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        setTableRef={setTableRef}
        globalFilterFn={globalFilterFn}
      />

      <Sheet open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <RestoreMember
          memberId={selectedMemberId}
          isSheetOpen={isRestoreOpen}
          onClose={() => {
            setIsRestoreOpen(false)
            setSelectedMemberId(null)
          }}
          refreshMember={fetchCancelledMembers}
        />
      </Sheet>
    </div>
  )
}
