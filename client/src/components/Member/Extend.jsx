import React, { useEffect, useState } from "react"
import {
  getDurations,
  extendMember,
  getMemberById
} from "@/lib/api/members"
import { validateField } from "@/lib/helper/validate"

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
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const ExtendMember = ({
  memberId,
  isSheetOpen,
  onClose,
  refreshMember
}) => {
  const [member, setMember] = useState(null)
  const [durationId, setDurationId] = useState("")
  const [touched, setTouched] = useState(false)
  const [durations, setDurations] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (memberId && isSheetOpen) {
      getMemberById(memberId)
        .then(setMember)
        .catch((err) => console.error("Failed to load member", err))
    }
  }, [memberId, isSheetOpen])

  useEffect(() => {
    getDurations()
      .then(setDurations)
      .catch((err) => console.error("Failed to load durations", err))
  }, [])

  useEffect(() => {
    if (!isSheetOpen) {
      setDurationId("")
      setTouched(false)
      setError("")
    }
  }, [isSheetOpen])

  const handleSelect = (value) => {
    setDurationId(value)
    setTouched(true)
    setError(validateField("durationId", value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!durationId) {
      setTouched(true)
      setError("Please select a duration")
      return
    }
    try {
      setSubmitting(true)
      await extendMember(memberId, durationId)
      toast.success("Membership extended")
      onClose()
      refreshMember?.()
    } catch (err) {
      console.error("Extend error", err)
      toast.error("Failed to extend membership")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Extend Membership</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            <div className="p-6 pb-2 max-w-md">
              <h2 className="text-xl font-bold">
                Extend a Membership Validity
              </h2>
              <p className="text-sm text-muted-foreground leading-tight">
                Select the duration to extend this member's membership validity.
                Extending an expired membership will reactivate the member.
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              <div>
                <Label>Duration</Label>
                <Select
                  value={durationId}
                  onValueChange={handleSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations
                      .filter((d) => d.extend_date_id !== 1)
                      .map((d) => (
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

              <Button
                type="submit"
                size="sm"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Extending..." : "Extend Membership"}
              </Button>
            </div>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default ExtendMember
