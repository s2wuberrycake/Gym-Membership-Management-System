import React, { useEffect, useState } from "react"
import { format } from "date-fns"

import { getAllUpdateLogs } from "@/lib/api/log"
import { getDashboardStats, getMostRecentVisit } from "@/lib/api/analytics"
import { ANALYTICS_API, API_BASE } from "@/lib/api"

import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import TableSearch from "@/components/ui/table-search"
import { updateLogColumns } from "@/components/table/UpdateLogColumn"
import { Container, ContainerHeader, ContainerTitle, ContainerContent } from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import MemberGrowthChart from "@/components/Chart/Wrapper/MemberGrowth"
import VisitRateChart from "@/components/Chart/Wrapper/VisitRate"
import MemberRatioChart from "@/components/Chart/Wrapper/MemberRatio"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const periods = [
  { label: "Today", value: "default" },
  { label: "Last 7 Days", value: "week" },
  { label: "Last 12 Months", value: "year" }
]

export default function Home() {
  const [logs, setLogs] = useState([])
  const [globalFilter, setGlobalFilter] = useState(
    () => localStorage.getItem("updateLogGlobalFilter") || ""
  )

  const [period, setPeriod] = useState("default")
  const [stats, setStats] = useState(null)
  const [recentVisit, setRecent] = useState(null)

  useEffect(() => {
    localStorage.setItem("updateLogGlobalFilter", globalFilter)
  }, [globalFilter])

  useEffect(() => {
    getAllUpdateLogs().then(setLogs).catch(console.error)
  }, [])

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error)
    getMostRecentVisit().then(setRecent).catch(console.error)
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
    return fields.some((f) =>
      String(row.original[f] ?? "").toLowerCase().includes(lower)
    )
  }

  const getInitials = (first, last) =>
    `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase()

  return (
    <div className="grid grid-cols-1 md:grid-cols-20 gap-4 mb-4 h-full">
      <div className="col-span-20 flex flex-col">
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle className="font-bold">Analytics</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Statistical data for business and market analysis. Generate and import reports below.
            </p>
          </ContainerHeader>
          <Separator />

          <ContainerContent className="grid grid-cols-1 md:grid-cols-20 gap-4">
            <div className="col-span-20 flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {periods.map((p) => (
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

            {/* Charts */}
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

            {/* Stats */}
            <div className="col-span-7">
              <Container className="h-full flex flex-col">
                <ContainerContent className="space-y-2">
                  {stats ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-4xl font-extrabold">Total Members</span>
                        <span className="text-4xl font-extrabold">{stats.totalMembers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Active Members</span>
                        <span className="font-medium">{stats.activeMembers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Expired Members</span>
                        <span className="font-medium">{stats.expiredMembers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Cancelled Members</span>
                        <span className="font-medium">{stats.cancelledMembers}</span>
                      </div>
                    </>
                  ) : (
                    <Skeleton className="h-6 w-full" />
                  )}
                </ContainerContent>
              </Container>
            </div>

            {/* Visits */}
            <div className="col-span-7">
              <Container className="h-full flex flex-col">
                <ContainerContent className="space-y-2">
                  {stats ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-4xl font-extrabold">Visits Today</span>
                        <span className="text-4xl font-extrabold">{stats.visits.today}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Last 7 Days</span>
                        <span className="font-medium">{stats.visits.week}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Last 30 Days</span>
                        <span className="font-medium">{stats.visits.last30}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Last 12 Months</span>
                        <span className="font-medium">{stats.visits.year}</span>
                      </div>
                    </>
                  ) : (
                    <Skeleton className="h-6 w-full" />
                  )}
                </ContainerContent>
              </Container>
            </div>

            {/* Most Recent Visit */}
            <div className="col-span-6">
              <Container className="h-full flex flex-col">
                <ContainerHeader>
                  <ContainerTitle>Most Recent Visit</ContainerTitle>
                </ContainerHeader>
                <ContainerContent className="flex items-center space-x-4">
                  {recentVisit ? (
                    <>
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          className="w-full h-full object-cover object-center rounded-[0_1rem_0_1rem]"
                          src={`${API_BASE}/uploads/profiles/${recentVisit.profile_picture}`}
                          alt={`${recentVisit.first_name} ${recentVisit.last_name}`}
                        />
                        <AvatarFallback>
                          {getInitials(
                            recentVisit.first_name,
                            recentVisit.last_name
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold">
                          {recentVisit.first_name} {recentVisit.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(recentVisit.visit_date), "hh:mm a")}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Skeleton className="h-12 w-full" />
                  )}
                </ContainerContent>
              </Container>
            </div>
          </ContainerContent>
        </Container>
      </div>

      {/* Update Log Section */}
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
              data={logs}
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
