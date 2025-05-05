import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchMemberById } from "@/lib/api/members"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger
} from "@/components/ui/sheet"
import { toast } from "sonner"
import { CornerDownLeft } from "lucide-react"
import EditMember from "@/components/members/EditMember"
import ExtendMember from "@/components/members/ExtendMember"

const Member = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isExtendOpen, setIsExtendOpen] = useState(false)

  const loadMember = async () => {
    try {
      const data = await fetchMemberById(id)
      setMember(data)
    } catch (err) {
      setError("Failed to load member")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMember()
  }, [id])

  const handleEditInfo = () => {
    setIsEditOpen(true)
  }

  const handleExtendMembership = () => {
    setIsExtendOpen(true)
  }

  const handleCancelMembership = () => {
    const confirm = window.confirm("Are you sure you want to cancel this membership?")
    if (!confirm) return
    toast.success("Membership cancelled (simulate)")
    setMember(prev => ({ ...prev, status: "cancelled" }))
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!member) return <div className="p-4">No member found</div>

  return (
    <>
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
            <p>
              <strong>Join Date:</strong>{" "}
              {member.join_date ? format(new Date(member.join_date), "MMMM d, yyyy") : "N/A"}
            </p>
            <p>
              <strong>Expiration Date:</strong>{" "}
              {member.expiration_date ? format(new Date(member.expiration_date), "MMMM d, yyyy") : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
            <SheetTrigger asChild>
              <Button onClick={handleEditInfo}>Edit Info</Button>
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
              <Button variant="outline" onClick={handleExtendMembership}>
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
          
          <Button onClick={handleCancelMembership} variant="destructive">
            Cancel Membership
          </Button>
        </div>
      </div>
    </>
  )
}

export default Member