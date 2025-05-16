import React, { useEffect, useState } from "react"
import { updateMemberById } from "@/lib/api/members"
import { jwtDecode } from "jwt-decode"
import { cn } from "@/lib/utils"
import { validateField, validateEditMemberForm } from "@/lib/helper/validate"
import { DateTime } from "luxon"

import { CalendarIcon } from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

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
    setForm(f => ({ ...f, [name]: value }))
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(err => ({ ...err, [name]: validateField(name, value) }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const { errors: newErrors, isValid } =
      validateEditMemberForm(form, member.original_join_date)
    setErrors(newErrors)
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      contact_number: true,
      address: true
    })
    if (!isValid) return

    const payload = {
      ...form,
      recent_join_date: form.recent_join_date
        ? DateTime.fromJSDate(form.recent_join_date)
            .setZone("Asia/Manila")
            .toFormat("yyyy-MM-dd")
        : null,
      expiration_date: form.expiration_date
        ? DateTime.fromJSDate(form.expiration_date)
            .setZone("Asia/Manila")
            .toFormat("yyyy-MM-dd")
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
                Only edit member info when necessary (e.g. member requests for
                updating of old info, incorrectly saved details, mismatched dates).
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              {["first_name","last_name","email","contact_number","address"].map(field => (
                <div key={field}>
                  <Label className="pb-0.5">
                    {field === "email" ? "Email (optional)" :
                     field === "contact_number" ? "Contact Number" :
                     field.split("_").map(w=>w[0].toUpperCase()+w.slice(1)).join(" ")}
                  </Label>
                  <Input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                  />
                  {touched[field] && errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              <div>
                <Label className="pb-0.5">Recent Join Date</Label>
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full text-left font-normal",
                          !form.recent_join_date && "text-muted-foreground"
                        )}
                        disabled={!isAdmin}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.recent_join_date
                          ? DateTime.fromJSDate(form.recent_join_date).toFormat(
                              "MMMM d, yyyy"
                            )
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.recent_join_date}
                        onSelect={date =>
                          isAdmin && setForm(f => ({ ...f, recent_join_date: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label className="pb-0.5">Expiration Date</Label>
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full text-left font-normal",
                          !form.expiration_date && "text-muted-foreground"
                        )}
                        disabled={!isAdmin}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.expiration_date
                          ? DateTime.fromJSDate(form.expiration_date).toFormat(
                              "MMMM d, yyyy"
                            )
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.expiration_date}
                        onSelect={date =>
                          isAdmin && setForm(f => ({ ...f, expiration_date: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {errors.expirationValidation && (
                  <p className="text-red-500 text-sm mt-1 whitespace-pre-line">
                    {errors.expirationValidation}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="w-full"
              >
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
