import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllMembers } from "@/lib/api/members"

import { ListRestart, Contact, CalendarCheck, X } from "lucide-react"

import DataTable from "@/components/ui/data-table"
import { membersColumns } from "@/components/table/MembersColumn"
import TableSearch from "@/components/ui/table-search"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import AddMember from "@/components/Member/Add"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent
} from "@/components/ui/container"

const statusLabel = {
  all: "All Status",
  active: "Active Only",
  expired: "Expired Only"
}

const nextStatus = {
  all: "active",
  active: "expired",
  expired: "all"
}

export default function Members() {
  const navigate = useNavigate()

  const [data, setData] = useState([])
  const [tableRef, setTableRef] = useState(null)

  const [globalFilter, setGlobalFilter] = useState(() => {
    return localStorage.getItem("membersGlobalFilter") || ""
  })

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("membersVisibleColumns")
    return saved
      ? JSON.parse(saved)
      : { contactNumber: true, joinDate: true, expireDate: true }
  })

  const [statusFilter, setStatusFilter] = useState(() => {
    return localStorage.getItem("membersStatusFilter") || "all"
  })

  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("membersGlobalFilter", globalFilter)
  }, [globalFilter])

  useEffect(() => {
    localStorage.setItem("membersVisibleColumns", JSON.stringify(visibleColumns))
  }, [visibleColumns])

  useEffect(() => {
    localStorage.setItem("membersStatusFilter", statusFilter)
  }, [statusFilter])

  const fetchMembers = async () => {
    try {
      const members = await getAllMembers()
      setData(members)
    } catch (err) {
      console.error("Error fetching members:", err)
      toast.error("Failed to load members")
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const cycleStatusFilter = () => {
    setStatusFilter(prev => nextStatus[prev])
  }

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
      joinDate: true,
      expireDate: true
    })
    setStatusFilter("all")
    localStorage.removeItem("membersGlobalFilter")
    localStorage.removeItem("membersVisibleColumns")
    localStorage.removeItem("membersStatusFilter")
  }

  const filteredData =
    statusFilter === "all"
      ? data
      : data.filter(member => member.status?.toLowerCase() === statusFilter)

  const globalFilterFn = (row, columnId, filterValue) => {
    const fields = ["id", "first_name", "last_name"]
    if (visibleColumns.contactNumber) fields.push("contact_number")
    if (visibleColumns.joinDate) fields.push("recent_join_date")
    if (visibleColumns.expireDate) fields.push("expiration_date")

    return fields.some(field => {
      const value = row.original[field]
      if (field === "recent_join_date" || field === "expiration_date") {
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

  const hasActiveFilters =
    globalFilter ||
    statusFilter !== "all" ||
    Object.values(visibleColumns).some(v => !v)

  const totalCount = filteredData.length
  const shownCount = tableRef?.getRowModel().rows.length || 0

return (
  <div className="grid grid-cols-20 grid-rows-[auto_1fr] gap-4 h-full">
    <div className="col-span-20 flex justify-between items-center">
      <TableSearch
        value={globalFilter}
        onChange={setGlobalFilter}
        placeholder="Search members..."
      />
    </div>

    <Container className="col-span-20 flex flex-col gap-4 h-full">
      <ContainerHeader>
        <div className="flex items-center justify-between flex-wrap gap-4 mt-18 -mb-6">
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={cycleStatusFilter}
              className="h-8 text-sm"
            >
              {statusLabel[statusFilter]}
            </Button>

            <Button
              variant={visibleColumns.contactNumber ? "default" : "outline"}
              onClick={() => toggleColumn("contactNumber")}
              size="sm"
              className="h-8 text-sm flex items-center gap-1"
            >
              <span>Contact Number</span>
              {visibleColumns.contactNumber && <span><X className="w-3 h-3" /></span>}
            </Button>

            <Button
              variant={visibleColumns.joinDate ? "default" : "outline"}
              onClick={() => toggleColumn("joinDate")}
              size="sm"
              className="h-8 text-sm flex items-center gap-1"
            >
              <span>Join Date</span>
              {visibleColumns.joinDate && <span><X className="w-3 h-3" /></span>}
            </Button>

            <Button
              variant={visibleColumns.expireDate ? "default" : "outline"}
              onClick={() => toggleColumn("expireDate")}
              size="sm"
              className="h-8 text-sm flex items-center gap-1"
            >
              <span>Expire Date</span>
              {visibleColumns.expireDate && <span><X className="w-3 h-3" /></span>}
            </Button>

            {hasActiveFilters ? (
              <Button variant="default" size="sm" onClick={resetFilters} className="h-8 text-sm">
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
              <Button
                size="sm">Add Member</Button>
            </SheetTrigger>
            <AddMember
              refreshMembers={fetchMembers}
              isSheetOpen={isAddOpen}
              onClose={() => setIsAddOpen(false)}
            />
          </Sheet>
        </div>
      </ContainerHeader>

      <ContainerContent className="pt-2 flex-1 flex flex-col">
        <DataTable
          columns={membersColumns(navigate, visibleColumns)}
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
