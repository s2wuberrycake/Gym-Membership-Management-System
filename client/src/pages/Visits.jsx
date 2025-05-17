// src/pages/Visits.jsx
import React, { useEffect, useState } from "react"
import { getAllVisitLogs } from "@/lib/api/log"
import { getMemberById } from "@/lib/api/members"
import { format } from "date-fns"

import DataTable from "@/components/ui/data-table"
import TableSearch from "@/components/ui/table-search"
import { visitLogColumns } from "@/components/table/VisitLogColumn"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Visits = () => {
  const [visits, setVisits] = useState([])
  const [filter, setFilter] = useState(
    () => localStorage.getItem("visitGlobalFilter") || ""
  )
  const [uuid, setUuid] = useState("")
  const [member, setMember] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    localStorage.setItem("visitGlobalFilter", filter)
  }, [filter])

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

  const lookupMember = async () => {
    if (!uuid) return
    setError("")
    try {
      const m = await getMemberById(uuid)
      setMember(m)
    } catch (e) {
      console.error(e)
      setMember(null)
      setError("Member not found or expired")
    }
    setUuid("")
  }

  const isExpired = member && new Date(member.expiration_date) < new Date()
  const initials = member
    ? `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`.toUpperCase()
    : ""

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
      {/* Visit UI container (40%) */}
      <div className="col-span-8 flex flex-col gap-4">
        <Container>
          <ContainerHeader>
            <ContainerTitle className="font-bold">Visiting Member Info</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Scan the card via a scanner, or manually input the RFID tag (UUID) in the input field
            </p>
          </ContainerHeader>
          <Separator />
          <ContainerContent className="flex flex-col items-center gap-4 p-4">
            <Avatar className="w-70 h-70 rounded-full overflow-hidden">
              <AvatarImage
                className="w-full h-full object-cover object-center"
                src={
                  member?.profile_picture
                    ? `/uploads/profiles/${member.profile_picture}`
                    : undefined
                }
                alt={member ? `${member.first_name} ${member.last_name}` : ""}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {member ? (
              <>
                <p className="text-lg font-semibold">
                  {member.first_name} {member.last_name}
                </p>
                <p className={`text-sm ${isExpired ? "text-red-500" : "text-green-600"}`}>
                  {isExpired ? "Expired" : "Active"}
                </p>
                <p className="text-sm">
                  Expires:{" "}
                  {member.expiration_date
                    ? format(new Date(member.expiration_date), "MMMM d, yyyy")
                    : "N/A"}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter UUID below to load member
              </p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Input
              value={uuid}
              onChange={e => setUuid(e.target.value)}
              placeholder="Member UUID"
              onKeyDown={e => e.key === "Enter" && lookupMember()}
              autoFocus
            />
            <Button onClick={lookupMember} size="sm" className="h-8 text-sm w-full">
              Lookup
            </Button>
          </ContainerContent>
        </Container>
      </div>
      
      {/* Table container (60%) */}
      <div className="col-span-12 flex flex-col gap-4">
        <Container className="flex-1 flex flex-col">
          <ContainerHeader>
            <ContainerTitle className="font-bold">Visit Log</ContainerTitle>
            <p className="text-sm text-muted-foreground">
              Record of member visits. Scanned expired or cancelled memberships will not be recorded and be
              required to renew their memberships before being allowed entry
            </p>
          </ContainerHeader>
          <Separator />
          <ContainerContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <TableSearch
                value={filter}
                onChange={setFilter}
                placeholder="Search visits..."
                className="h-8 w-[35%]"
              />
            </div>

            <DataTable
              columns={visitLogColumns()}
              data={visits}
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

export default Visits
