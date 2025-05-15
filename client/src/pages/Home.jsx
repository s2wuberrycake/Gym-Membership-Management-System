// src/pages/Home.jsx
import React, { useEffect, useState } from "react"
import { getAllUpdateLogs } from "@/lib/api/log"
import DataTable from "@/components/ui/data-table"
import { updateLogColumns } from "@/components/table/UpdateLogColumn"
import TableSearch from "@/components/ui/table-search"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState(
    () => localStorage.getItem("updateLogGlobalFilter") || ""
  )

  useEffect(() => {
    localStorage.setItem("updateLogGlobalFilter", globalFilter)
  }, [globalFilter])

  const fetchLog = async () => {
    try {
      const logs = await getAllUpdateLogs()
      setData(logs)
    } catch (err) {
      console.error("Failed to fetch update log", err)
    }
  }

  useEffect(() => {
    fetchLog()
  }, [])

  // Search across all fields in the update-log row
  const globalFilterFn = (row, columnId, filterValue) => {
    const fields = [
      "update_id",
      "member_id",
      "action_label",
      "account_username",
      "log_date",
      "logged_expiration_date"
    ]
    return fields.some((field) => {
      const v = row.original[field]
      const txt = v != null ? String(v).toLowerCase() : ""
      return txt.includes(filterValue.toLowerCase())
    })
  }

  return (
    <div className="grid grid-cols-20 grid-rows-[auto_1fr] gap-4 h-full">
      {/* top search bar */}
      <div className="col-span-20 flex justify-between items-center">
        <TableSearch
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search update log..."
        />
      </div>

      <Container className="col-span-20 flex flex-col gap-4 h-full">
        <ContainerHeader>
          <ContainerTitle className="font-bold">Update Log</ContainerTitle>
          <p className="text-sm text-muted-foreground">
            A chronological record of all member-related actions in the system.
          </p>
        </ContainerHeader>

        <Separator />

        <ContainerContent className="flex-1 flex flex-col">
          <DataTable
            columns={updateLogColumns()}
            data={data}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            globalFilterFn={globalFilterFn}
          />
        </ContainerContent>
      </Container>
    </div>
  )
}
