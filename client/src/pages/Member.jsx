import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMemberById } from "@/lib/api/members"
import { format } from "date-fns"

import { CornerDownLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger
} from "@/components/ui/sheet"
import { toast } from "sonner"
import EditMember from "@/components/Member/Edit"
import ExtendMember from "@/components/Member/Extend"
import CancelMember from "@/components/Member/Cancel"

const Member = () => {
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

  if (loading) return <div className="p-4">Loading...</div>
  if (!member) return <div className="p-4 text-red-500">Member not found or failed to load.</div>

  const renderDate = date =>
    date ? format(new Date(date), "MMMM d, yyyy") : "N/A"

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2"
        >
          <CornerDownLeft className="w-4 h-4" />
          Return
        </Button>

        <h1 className="text-2xl font-bold mb-4">
          Viewing Member: {member.first_name} {member.last_name}
        </h1>

        <div className="space-y-2">
          <p><strong>Email:</strong> {member.email || "N/A"}</p>
          <p><strong>Phone:</strong> {member.contact_number}</p>
          <p><strong>Address:</strong> {member.address}</p>
          <p><strong>Status:</strong> {member.status}</p>
          <p><strong>Original Join Date:</strong> {renderDate(member.original_join_date)}</p>
          <p><strong>Recent Join Date:</strong> {renderDate(member.recent_join_date)}</p>
          <p><strong>Expiration Date:</strong> {renderDate(member.expiration_date)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setIsEditOpen(true)}>Edit Info</Button>
          </SheetTrigger>
          <EditMember
            member={member}
            isSheetOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            refreshMember={loadMember}
          />
        </Sheet>

        <Sheet open={isExtendOpen} onOpenChange={setIsExtendOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" onClick={() => setIsExtendOpen(true)}>
              Extend Membership
            </Button>
          </SheetTrigger>
          <ExtendMember
            memberId={member.id}
            isSheetOpen={isExtendOpen}
            onClose={() => setIsExtendOpen(false)}
            refreshMember={loadMember}
          />
        </Sheet>

        <Sheet open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <SheetTrigger asChild>
            <Button variant="destructive" onClick={() => setIsCancelOpen(true)}>
              Cancel Membership
            </Button>
          </SheetTrigger>
          <CancelMember
            member={member}
            isSheetOpen={isCancelOpen}
            onClose={() => setIsCancelOpen(false)}
            refreshMember={loadMember}
          />
        </Sheet>
      </div>
    </div>
  )
}

export default Member
