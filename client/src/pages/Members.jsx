import React, { useEffect, useState } from "react"
import DataTable from "../components/ui/data-table"
import { membersColumns } from "../components/table/MembersColumn"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet"
import AddMember from "../components/functions/AddMember"

// ...

export default function Members() {
  const [data, setData] = useState([])

  const fetchMembers = () => {
    fetch("http://localhost:3000/api/members")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error fetching members:", err))
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Members</h2>
          <Input type="text" placeholder="Search members..." className="w-[200px]" />
        </div>
        <Sheet>
          <SheetTrigger asChild>        
            <Button className="ml-auto">Add Member</Button>
          </SheetTrigger>
          {/* ✅ Pass fetchMembers as a prop */}
          <AddMember refreshMembers={fetchMembers} />
        </Sheet>
      </div>

      <ToggleGroup type="multiple" className="flex gap-2">
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
        <ToggleGroupItem value="expired">Expired</ToggleGroupItem>
      </ToggleGroup>

      <DataTable columns={membersColumns} data={data} />
    </div>
  )
}