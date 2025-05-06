import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllMembers } from "@/lib/api/members"

import { ListRestart } from "lucide-react"

import DataTable from "@/components/ui/data-table"
import { membersColumns } from "@/components/table/MembersColumn"
import TableSearch from "@/components/ui/table-search"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import AddMember from "@/components/Member/Add"

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

  return (
    <div className="space-y-4 mb-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-2xl font-bold">Members</h2>
          <TableSearch
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder="Search members..."
          />
          <Button variant="outline" onClick={cycleStatusFilter}>
            {statusLabel[statusFilter]}
          </Button>
          <Button
            variant={visibleColumns.contactNumber ? "outline" : "ghost"}
            onClick={() => toggleColumn("contactNumber")}
          >
            Contact #
          </Button>
          <Button
            variant={visibleColumns.joinDate ? "outline" : "ghost"}
            onClick={() => toggleColumn("joinDate")}
          >
            Join Date
          </Button>
          <Button
            variant={visibleColumns.expireDate ? "outline" : "ghost"}
            onClick={() => toggleColumn("expireDate")}
          >
            Expire Date
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
            <Button className="ml-auto">Add Member</Button>
          </SheetTrigger>
          <AddMember refreshMembers={fetchMembers} isSheetOpen={isAddOpen} />
        </Sheet>
      </div>

      <DataTable
        columns={membersColumns(navigate, visibleColumns)}
        data={filteredData}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        setTableRef={setTableRef}
        globalFilterFn={globalFilterFn}
      />
    </div>
  )
}