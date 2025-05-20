import React, { useEffect, useState, useRef } from "react"
import { getAllVisitLogs, logVisit } from "@/lib/api/log"
import { getMemberById } from "@/lib/api/members"
import { format } from "date-fns"
import { ListRestart } from "lucide-react"

import DataTable from "@/components/ui/data-table"
import TableSearch from "@/components/ui/table-search"
import { visitLogColumns } from "@/components/table/VisitLogColumn"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent,
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const dateLabel = {
  all:     "All Dates",
  today:   "Today",
  "7days": "Past 7 days",
  month:   "Past Month",
}

const nextDate = {
  all:     "today",
  today:   "7days",
  "7days": "month",
  month:   "all",
}

export default function Visits() {
  const [visits, setVisits]         = useState([])
  const [filter, setFilter]         = useState(
    () => localStorage.getItem("visitGlobalFilter") || ""
  )
  const [dateFilter, setDateFilter] = useState(
    () => localStorage.getItem("visitsDateFilter") || "today"
  )
  const [uuid, setUuid]             = useState("")
  const [member, setMember]         = useState(null)

  const clearTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem("visitGlobalFilter", filter)
  }, [filter])

  useEffect(() => {
    localStorage.setItem("visitsDateFilter", dateFilter)
  }, [dateFilter])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getAllVisitLogs()
        setVisits(data)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const cycleDateFilter = () => {
    setDateFilter(prev => nextDate[prev])
  }

  const resetFilters = () => {
    setFilter("")
    setDateFilter("today")
    localStorage.removeItem("visitGlobalFilter")
    localStorage.removeItem("visitsDateFilter")
  }

  const handleLogVisit = async () => {
    const memberId = uuid.trim()
    if (!memberId) return

    if (clearTimer.current) {
      clearTimeout(clearTimer.current)
    }

    let m
    try {
      m = await getMemberById(memberId)
      setMember(m)
    } catch {
      toast.error("Member not found")
      setMember(null)
      setUuid("")
      return
    }

    const expired   = new Date(m.expiration_date) < new Date()
    const cancelled = m.status?.toLowerCase() === "cancelled"

    if (expired || cancelled) {
      toast.error(cancelled ? "Membership cancelled" : "Membership expired")
    } else {
      try {
        const resp = await logVisit(memberId)
        if (resp.message) {
          toast.error(resp.message)
        } else {
          setVisits(v => [resp, ...v])
          toast.success("Visit logged successfully!")
        }
      } catch (err) {
        console.error(err)
        toast.error(err.message)
      }
    }

    setUuid("")

    clearTimer.current = window.setTimeout(() => {
      setMember(null)
      clearTimer.current = null
    }, 10000)
  }

  const filteredVisits = visits.filter(v => {
    const d   = new Date(v.visit_date)
    const now = new Date()

    if (dateFilter === "today") {
      return d.toDateString() === now.toDateString()
    }
    if (dateFilter === "7days") {
      const ago = new Date(); ago.setDate(now.getDate() - 7)
      return d >= ago
    }
    if (dateFilter === "month") {
      const ago = new Date(); ago.setMonth(now.getMonth() - 1)
      return d >= ago
    }
    return true
  })

  const globalFilterFn = (row, _colId, value) => {
    const lower = value.toLowerCase()
    const { visit_id, member_id, first_name, last_name, visit_date } = row.original
    return (
      String(visit_id).includes(lower) ||
      member_id.toLowerCase().includes(lower) ||
      (`${first_name} ${last_name}`.toLowerCase().includes(lower)) ||
      String(visit_date).toLowerCase().includes(lower)
    )
  }

  return (
    <div className="grid grid-cols-20 gap-4 mb-4 h-full">
      <div className="col-span-6 flex flex-col sticky top-0 self-start">
        <Container>
          <ContainerHeader>
            <ContainerTitle className="font-bold">
              Visiting Member Info
            </ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Scan the card or manually input the RFID tag (UUID)
            </p>
          </ContainerHeader>
          <Separator />

          <div className="flex gap-1 mb-4">
            <Input
              value={uuid}
              onChange={e => setUuid(e.target.value)}
              placeholder="Member UUID"
              onKeyDown={e => e.key === "Enter" && handleLogVisit()}
              autoFocus
              className="flex-[3] h-8"
            />
            <Button
              size="sm"
              variant="main"
              onClick={handleLogVisit}
              className="flex-1 h-8 text-sm"
            >
              Log Visit
            </Button>
          </div>

          <ContainerContent className="grid grid-cols-20 gap-4">
            <div className="col-span-20 flex flex-col h-100 items-center">
              <Avatar className="h-100 w-100 overflow-hidden rounded-full">
                <AvatarImage
                  className="w-full h-full object-cover object-center rounded-[1rem]"
                  src={
                    member?.profile_picture &&
                    `/uploads/profiles/${member.profile_picture}`
                  }
                  alt={member ? `${member.first_name} ${member.last_name}` : ""}
                />
                <AvatarFallback className="flex items-center justify-center rounded-[1rem]">
                  {member
                    ? `${member.first_name[0] || ""}${member.last_name[0] || ""}`
                    : ""}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="col-span-20 flex flex-col p-2">
              <div className="flex justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <span className="text-5xl font-bold truncate block">
                    {member
                      ? `${member.first_name} ${member.last_name}`
                      : "Name"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-1">
                <span className="text-lg font-medium"><strong>Status</strong></span>
                <span
                  className={`text-lg font-medium ${
                    member
                      ? member.status?.toLowerCase() === "cancelled"
                        ? "text-red-500"
                        : new Date(member.expiration_date) < new Date()
                        ? "text-orange-500"
                        : "text-green-600"
                      : ""
                  }`}>
                  {member
                    ? member.status?.toLowerCase() === "cancelled"
                      ? "cancelled"
                      : new Date(member.expiration_date) < new Date()
                      ? "expired"
                      : "active"
                    : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-medium"><strong>Expiration Date</strong></span>
                <span className="text-lg font-medium">
                  {member?.expiration_date
                    ? format(
                        new Date(member.expiration_date),
                        "MMMM d, yyyy"
                      )
                    : ""}
                </span>
              </div>
            </div>
          </ContainerContent>
        </Container>
      </div>

      <div className="col-span-14 flex flex-col gap-4">
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle className="font-bold">Visit Log</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Filter by date range, search, or scroll through the logs below.
            </p>
          </ContainerHeader>
          <Separator />

          <ContainerContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <TableSearch
                value={filter}
                onChange={setFilter}
                placeholder="Search visits..."
                className="h-8 w-100"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1 flex-wrap">
                <Button
                  variant={dateFilter === "all" ? "outline" : "default"}
                  size="sm"
                  onClick={cycleDateFilter}
                  className="h-8 text-sm"
                >
                  {dateLabel[dateFilter]}
                </Button>
                {(filter || dateFilter !== "today") ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 text-sm"
                  >
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
            </div>

            <DataTable
              columns={visitLogColumns()}
              data={filteredVisits}
              globalFilter={filter}
              onGlobalFilterChange={setFilter}
              globalFilterFn={globalFilterFn}
            />
          </ContainerContent>
        </Container>
      </div>
    </div>
  )
}
