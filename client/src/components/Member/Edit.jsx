import React, { useEffect, useState } from "react"
import { updateMemberById } from "@/lib/api/members"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { validateField, validateEditMemberForm } from "@/lib/helper/validate"
import { DateTime } from "luxon"

const EditMember = ({ member, isSheetOpen, onClose, refreshMember }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    address: "",
    recent_join_date: null,
    expiration_date: null
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const token = localStorage.getItem("token")
  const role = token ? jwtDecode(token)?.role : null
  const isAdmin = role === "admin"

  useEffect(() => {
    if (member) {
      setForm({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        email: member.email || "",
        contact_number: member.contact_number || "",
        address: member.address || "",
        recent_join_date: member.recent_join_date
          ? new Date(member.recent_join_date)
          : null,
        expiration_date: member.expiration_date
          ? new Date(member.expiration_date)
          : null
      })
      setErrors({})
      setTouched({})
    }
  }, [member])

  const handleChange = e => {
    const { name, value } = e.target
    if (name === "contact_number" && /[^0-9]/.test(value)) return

    setForm(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const { errors: newErrors, isValid } = validateEditMemberForm(form, member.original_join_date)
    setErrors(newErrors)
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      contact_number: true,
      address: true
    })

    if (!isValid) {
      console.log("Form is not valid", newErrors)
      return
    }

    const payload = {
      ...form,
      recent_join_date: form.recent_join_date
        ? DateTime.fromJSDate(form.recent_join_date).setZone("Asia/Manila").toFormat("yyyy-MM-dd")
        : null,
      expiration_date: form.expiration_date
        ? DateTime.fromJSDate(form.expiration_date).setZone("Asia/Manila").toFormat("yyyy-MM-dd")
        : null
    }

    try {
      setSubmitting(true)
      await updateMemberById(member.id, payload)
      toast.success("Member updated successfully")
      refreshMember()
      onClose()
    } catch (err) {
      console.error("Update failed:", err)
      toast.error("Failed to update member")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Edit Info</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            <div className="p-6 pb-2 max-w-md">
              <h2 className="pb-0.5 text-xl font-bold">Edit Member Info</h2>
              <p>
                Only edit member info when necessary (e.g: member requests for
                updating of old info, incorrectly saved details, mismatched dates).
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              <div>
                <Label className="pb-0.5">First Name</Label>
                <Input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                />
                {touched.first_name && errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <Label className="pb-0.5">Last Name</Label>
                <Input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                />
                {touched.last_name && errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>

              <div>
                <Label className="pb-0.5">Email (optional)</Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label className="pb-0.5">Contact Number</Label>
                <Input
                  name="contact_number"
                  value={form.contact_number}
                  onChange={handleChange}
                />
                {touched.contact_number && errors.contact_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
                )}
              </div>

              <div>
                <Label className="pb-0.5">Address</Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
                {touched.address && errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <Label className="pb-0.5">Recent Join Date</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !form.recent_join_date && "text-muted-foreground"
                              )}
                              disabled={!isAdmin}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {form.recent_join_date
                                ? DateTime.fromJSDate(form.recent_join_date).toFormat("MMMM d, yyyy")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={form.recent_join_date}
                              onSelect={date =>
                                isAdmin && setForm(prev => ({ ...prev, recent_join_date: date }))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TooltipTrigger>
                    {!isAdmin && <TooltipContent side="left" sideOffset={-10}
                    className="h-9 flex items-center text-sm">Admin only</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div>
                <Label className="pb-0.5">Expiration Date</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !form.expiration_date && "text-muted-foreground"
                              )}
                              disabled={!isAdmin}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {form.expiration_date
                                ? DateTime.fromJSDate(form.expiration_date).toFormat("MMMM d, yyyy")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={form.expiration_date}
                              onSelect={date =>
                                isAdmin && setForm(prev => ({ ...prev, expiration_date: date }))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TooltipTrigger>
                    {!isAdmin && <TooltipContent side="left" sideOffset={-10}
                    className="h-9 flex items-center text-sm">Admin only</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>

                {errors.expirationValidation && (
                  <p className="text-red-500 text-sm mt-1 whitespace-pre-line">
                    {errors.expirationValidation}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={submitting} size="sm" className="w-full">
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default EditMember