import React, { useEffect, useState } from "react"
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { toast } from "sonner"
import { fetchDurations } from "@/lib/api/members"
import {
  fetchCancelledMemberById,
  restoreMemberById
} from "@/lib/api/archive"
import { validateField } from "@/lib/helper/validate"
import { calculateExtendedExpiration } from "@/lib/helper/date"

const RestoreMember = ({ memberId, isSheetOpen, onClose, refreshMember }) => {
  const [member, setMember] = useState(null)
  const [durationId, setDurationId] = useState("")
  const [touched, setTouched] = useState(false)
  const [durations, setDurations] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (memberId && isSheetOpen) {
      fetchCancelledMemberById(memberId)
        .then(setMember)
        .catch(err => console.error("Failed to load member", err))
    }
  }, [memberId, isSheetOpen])

  useEffect(() => {
    fetchDurations()
      .then(setDurations)
      .catch(err => console.error("Failed to load durations", err))
  }, [])

  useEffect(() => {
    if (!isSheetOpen) {
      setDurationId("")
      setTouched(false)
      setError("")
    }
  }, [isSheetOpen])

  const handleSelect = value => {
    setDurationId(value)
    setTouched(true)
    const err = validateField("durationId", value)
    setError(err)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!durationId) {
      setTouched(true)
      setError("Please select a duration")
      return
    }

    try {
      setSubmitting(true)

      const selected = durations.find(d => d.extend_date_id == durationId)
      const daysToAdd = selected ? selected.days : 0

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const newExpiration = calculateExtendedExpiration(today, daysToAdd)

      await restoreMemberById(memberId, newExpiration)

      toast.success("Member restored successfully")
      onClose()
      if (refreshMember) refreshMember()
    } catch (err) {
      console.error("Restore error", err)
      toast.error("Failed to restore member")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Restore Member</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            <div className="p-6 pb-2 max-w-md">
              <h2 className="pb-0.5 text-xl font-bold">Restore Cancelled Membership</h2>
              <p className="text-sm text-muted-foreground">
                Select a membership duration to restore this member. The member's status will be set back to active.
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              <div>
                <Select value={durationId} onValueChange={handleSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations
                      .filter(d => d.extend_date_id !== 1)
                      .map(d => (
                        <SelectItem
                          key={d.extend_date_id}
                          value={String(d.extend_date_id)}
                        >
                          {d.date_label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {touched && error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Restoring..." : "Restore Member"}
              </Button>
            </div>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default RestoreMember
