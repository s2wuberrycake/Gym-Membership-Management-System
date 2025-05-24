import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMemberById } from "@/lib/api/members"
import { format } from "date-fns"
import { API_BASE } from "@/lib/api/index.js"

import { CornerDownLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent,
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import EditMember from "@/components/Member/Edit"
import ExtendMember from "@/components/Member/Extend"
import CancelMember from "@/components/Member/Cancel"

export default function Member() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isExtendOpen, setIsExtendOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  const loadMember = async () => {
    setLoading(true)
    try {
      const data = await getMemberById(id)
      setMember(data)
    } catch (err) {
      toast.error(err.message || "Failed to load member")
      setMember(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMember()
  }, [id])

  const renderDate = date => (date ? format(new Date(date), "MMMM d, yyyy") : "N/A")
  const initials = `${member?.first_name?.[0] || ""}${member?.last_name?.[0] || ""}`.toUpperCase()

  if (loading) {
    return <div className="p-6">Loading member…</div>
  }
  if (!member) {
    return <div className="p-6 text-red-500">Member not found.</div>
  }

  const statusColor = member.status?.toLowerCase() === "cancelled"
    ? "text-red-500"
    : new Date(member.expiration_date) < new Date()
      ? "text-orange-500"
      : "text-green-500"

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-2"
      >
        <CornerDownLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="grid grid-cols-20 gap-4 mb-4 h-full">
        <div className="col-span-6 flex flex-col">
          <Container>
            <ContainerHeader>
              <ContainerTitle className="font-bold">Member Info</ContainerTitle>
              <p className="text-sm text-muted-foreground"><br></br></p>
            </ContainerHeader>
            <Separator />

            <ContainerContent className="grid grid-cols-20 gap-4">
              <div className="col-span-20 flex flex-col h-full items-center">
                <Avatar className="h-70 w-70 overflow-hidden rounded-full">
                  <AvatarImage
                    src={member && member.profile_picture
                      ? `${API_BASE}/uploads/profiles/${member.profile_picture}`
                      : undefined}
                    alt={`${member.first_name} ${member.last_name}`}
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback className="h-70 w-70 overflow-hidden rounded-full">{initials}</AvatarFallback>
                </Avatar>
              </div>

            <div className="col-span-20 flex flex-col p-2">
              <div className="flex justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <span className="text-5xl font-bold break-words">
                    {member.first_name} {member.last_name}
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-between mb-1">
                <span className="text-lg font-medium"><strong>Status</strong></span>
                <span className={`text-lg font-medium ${statusColor}`}>
                  {member.status}
                </span>
              </div>

              <div className="w-full flex justify-between">
                <span className="text-lg font-medium"><strong>Expiration Date</strong></span>
                <span className="text-lg font-medium">{renderDate(member.expiration_date)}</span>
              </div>
            </div>
            </ContainerContent>
          </Container>
        </div>

        <div className="col-span-14 flex flex-col gap-4">
          <Container className="flex-1 flex flex-col">
            <ContainerHeader>
              <ContainerTitle className="font-bold">Member Details</ContainerTitle>
              <p className="text-sm text-muted-foreground">
                View and manage this member’s full information.
              </p>
            </ContainerHeader>
            <Separator />

            <ContainerContent className="flex-1 flex flex-col">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <SheetTrigger asChild>
                      <Button size="sm">Edit Info</Button>
                    </SheetTrigger>
                    <EditMember
                      member={member}
                      isSheetOpen={isEditOpen}
                      onClose={() => { setIsEditOpen(false); loadMember() }}
                      refreshMember={loadMember}
                    />
                  </Sheet>

                  <Sheet open={isExtendOpen} onOpenChange={setIsExtendOpen}>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="default">
                        Extend Membership
                      </Button>
                    </SheetTrigger>
                    <ExtendMember
                      memberId={member.id}
                      isSheetOpen={isExtendOpen}
                      onClose={() => { setIsExtendOpen(false); loadMember() }}
                      refreshMember={loadMember}
                    />
                  </Sheet>

                  <Sheet open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Cancel Membership
                      </Button>
                    </SheetTrigger>
                    <CancelMember
                      member={member}
                      isSheetOpen={isCancelOpen}
                      onClose={() => { setIsCancelOpen(false); loadMember() }}
                      refreshMember={loadMember}
                    />
                  </Sheet>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-md font-medium">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <span className="mr-12">{member.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Phone:</span>
                  <span>{member.contact_number}</span>
                </div>
                <div className="flex justify-between sm:col-span-2 items-start min-w-0">
                  <span className="font-medium text-muted-foreground">Address:</span>
                  <span className="ml-2 flex-1 min-w-0 break-words -mr-1 text-right">
                    {member.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Joined:</span>
                  <span className="mr-12">{renderDate(member.original_join_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Recent Join:</span>
                  <span>{renderDate(member.recent_join_date)}</span>
                </div>
              </div>

            </ContainerContent>
          </Container>
        </div>
      </div>
    </div>
  )
}
