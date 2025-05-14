import React, { useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cancelMemberById } from "@/lib/api/members"
import { useNavigate } from "react-router-dom"

const CancelMember = ({ member, isSheetOpen, onClose, refreshMember }) => {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setSubmitting(true)
      const today = format(new Date(), "yyyy-MM-dd")
      await cancelMemberById(member.id, today)
      toast.success("Membership cancelled")
      onClose()
      navigate("/members")
    } catch (err) {
      console.error("Cancellation failed:", err)
      toast.error(err.message || "Failed to cancel membership")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Cancel Membership</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            <div className="p-6 pb-2 max-w-md">
              <h2 className="pb-0.5 text-xl font-bold">Cancel member?</h2>
              <p>
                Cancelling a membership will update their status to <strong>Cancelled</strong> and will promptly be
                moved to the <strong>Archive</strong> table <br /><br />NOTE: remaining membership duration will be cancelled. 
                Proceed with caution.
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="w-full"
                variant="destructive"
              >
                {submitting ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default CancelMember
