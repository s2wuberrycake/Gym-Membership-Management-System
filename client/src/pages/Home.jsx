import React, { useEffect, useState } from "react"
import { getAllUpdateLogs }   from "@/lib/api/log"
import { getMemberGrowth }    from "@/lib/api/analytics"
import { ANALYTICS_API } from "@/lib/api"

import { Button }             from "@/components/ui/button"
import DataTable   from "@/components/ui/data-table"
import TableSearch from "@/components/ui/table-search"
import { updateLogColumns } from "@/components/table/UpdateLogColumn"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import MemberGrowthChart from "@/components/Chart/Wrapper/MemberGrowth"
import VisitRateChart    from "@/components/Chart/Wrapper/VisitRate"
import MemberRatioChart  from "@/components/Chart/Wrapper/MemberRatio"



const periods = [
  { label: "Today",       value: "default" },
  { label: "Last 7 Days", value: "week"    },
  { label: "Last 12 Months",   value: "year"    }
]

const Home = () => {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState(
    () => localStorage.getItem("updateLogGlobalFilter") || ""
  )

  const [period, setPeriod] = useState("default")

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
    <div className="grid grid-cols-20 gap-4 mb-4 h-full">
      <div className="col-span-20 flex flex-col">
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle className="font-bold">Analytics</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Statistical data for business and market analysis. Generate and import reports below.
            </p>
          </ContainerHeader>
          <Separator />

          <ContainerContent className="grid grid-cols-20 gap-4">
            <div className="col-span-20 flex items-center justify-between">
              <div className="flex space-x-2">
                {periods.map(p => (
                  <Button
                    key={p.value}
                    variant={period === p.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPeriod(p.value)}
                    className="h-8 text-sm"
                  >
                    {p.label}
                  </Button>
                ))}
              </div>

              <Button variant="default" size="sm" asChild>
                <a
                  href={`${ANALYTICS_API}/analytics-report.xlsx?period=${period}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Analytics Report
                </a>
              </Button>
            </div>

            <div className="col-span-4">
              <Container className="h-full flex flex-col">
                <ContainerHeader>
                  <ContainerTitle>Members</ContainerTitle>
                </ContainerHeader>
                <ContainerContent className="flex-1">
                  <MemberRatioChart />
                </ContainerContent>
              </Container>
            </div>

            <div className="col-span-8">
              <Container className="h-full flex flex-col">
                <ContainerHeader>
                  <ContainerTitle>Membership Growth</ContainerTitle>
                </ContainerHeader>
                <ContainerContent className="flex-1">
                  <MemberGrowthChart period={period} />
                </ContainerContent>
              </Container>
            </div>

            <div className="col-span-8">
              <Container className="h-full flex flex-col">
                <ContainerHeader>
                  <ContainerTitle>Visit Rate</ContainerTitle>
                </ContainerHeader>
                <ContainerContent className="flex-1">
                  <VisitRateChart period={period} />
                </ContainerContent>
              </Container>
            </div>

          </ContainerContent>
        </Container>
      </div>

      <div className="col-span-20 flex flex-col">
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle className="font-bold">Update Log</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              A chronological record of all member-related actions in the system.
            </p>
          </ContainerHeader>
          <Separator />

          <ContainerContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <TableSearch
                value={globalFilter}
                onChange={setGlobalFilter}
                placeholder="Search update log..."
                className="h-8 w-100"
              />
            </div>

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
    </div>
  )
}

export default Home
