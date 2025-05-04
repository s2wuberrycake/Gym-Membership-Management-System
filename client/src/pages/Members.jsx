import React, { useEffect, useState } from "react"
import DataTable from "@/components/ui/data-table"
import { membersColumns } from "@/components/table/MembersColumn"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import AddMember from "@/components/members/AddMember"
import TableSearch from "@/components/ui/table-search"
import ColumnToggle from "@/components/ui/column-toggle"
import { toast } from "sonner"
import { MEMBERS_API } from "@/lib/api"

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
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [tableRef, setTableRef] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const fetchMembers = () => {
    fetch(MEMBERS_API)
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        console.error("Error fetching members:", err)
        toast.error("Failed to load members")
      })
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const cycleStatusFilter = () => {
    setStatusFilter(prev => nextStatus[prev])
  }

  const filteredData =
    statusFilter === "all"
      ? data
      : data.filter(member => member.status?.toLowerCase() === statusFilter)

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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="ml-auto">Add Member</Button>
          </SheetTrigger>
          <AddMember
            refreshMembers={fetchMembers}
            isSheetOpen={isSheetOpen}
          />
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