import React, { useEffect, useState } from "react"
import { getAllUpdateLogs } from "@/lib/api/log"

import DataTable from "@/components/ui/data-table"
import TableSearch from "@/components/ui/table-search"
import { updateLogColumns } from "@/components/table/UpdateLogColumn"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"

const Home = () => {
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

  const globalFilterFn = (row, columnId, filterValue) => {
    const fields = [
      "update_id",
      "member_id",
      "action_label",
      "account_username",
      "log_date",
      "logged_expiration_date"
    ]
    const lower = filterValue.toLowerCase()
    return fields.some(field => {
      const value = row.original[field]
      return String(value ?? "").toLowerCase().includes(lower)
    })
  }

  return (
    <div className="grid grid-cols-20 grid-rows-[auto_1fr] gap-4 h-full">
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

export default Home
