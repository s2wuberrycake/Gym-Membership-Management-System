import React, { useEffect, useState } from "react"
import DataTable from "../components/ui/data-table"
import { membersColumns } from "../components/table/MembersColumn"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import AddMember from "../components/functions/AddMember"
import TableSearch from "@/components/ui/table-search"
import ColumnToggle from "@/components/ui/column-toggle"

export default function Members() {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [tableRef, setTableRef] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all") // "all" | "active" | "expired"

  const fetchMembers = () => {
    fetch("http://localhost:3000/api/members")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error fetching members:", err))
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // Cycle filter state
  const cycleStatusFilter = () => {
    setStatusFilter(prev =>
      prev === "all" ? "active" :
      prev === "active" ? "expired" :
      "all"
    )
  }

  // Filtered data based on status
  const filteredData =
    statusFilter === "all"
      ? data
      : data.filter(member => member.status?.toLowerCase() === statusFilter)

  // Label for button
  const statusLabel = {
    all: "All Status",
    active: "Active Only",
    expired: "Expired Only"
  }

  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-2xl font-bold">Members</h2>
          <TableSearch
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder="Search members..."
          />
          <ColumnToggle table={tableRef} />
          <Button variant="outline" onClick={cycleStatusFilter}>
            {statusLabel[statusFilter]}
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="ml-auto">Add Member</Button>
          </SheetTrigger>
          <AddMember refreshMembers={fetchMembers} />
        </Sheet>
      </div>

      <DataTable
        columns={membersColumns}
        data={filteredData}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        setTableRef={setTableRef}
      />
    </div>
  )
}
