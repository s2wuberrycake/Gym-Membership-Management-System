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

export default function EditMember({ member, isSheetOpen, onClose, refreshMember }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    address: "",
    recent_join_date: null,
    expiration_date: null
  })
  const [photoFile, setPhotoFile] = useState(null)
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
        last_name:  member.last_name  || "",
        email:      member.email      || "",
        contact_number: member.contact_number || "",
        address:    member.address    || "",
        recent_join_date: member.recent_join_date
          ? new Date(member.recent_join_date)
          : null,
        expiration_date: member.expiration_date
          ? new Date(member.expiration_date)
          : null
      })
      setPhotoFile(null)
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

  const handleFileChange = e => {
    setPhotoFile(e.target.files[0] || null)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { errors: newErrors, isValid } = validateEditMemberForm(
      form,
      member.original_join_date
    )
    setErrors(newErrors)
    setTouched({
      first_name: true,
      last_name:  true,
      email:      true,
      contact_number: true,
      address:    true
    })
    if (!isValid) return

    const fd = new FormData()
    fd.append("first_name", form.first_name)
    fd.append("last_name",  form.last_name)
    fd.append("email",      form.email)
    fd.append("contact_number", form.contact_number)
    fd.append("address",    form.address)
    if (form.recent_join_date) {
      fd.append(
        "recent_join_date",
        DateTime.fromJSDate(form.recent_join_date)
          .setZone("Asia/Manila")
          .toFormat("yyyy-MM-dd")
      )
    }
    if (form.expiration_date) {
      fd.append(
        "expiration_date",
        DateTime.fromJSDate(form.expiration_date)
          .setZone("Asia/Manila")
          .toFormat("yyyy-MM-dd")
      )
    }
    if (photoFile) {
      fd.append("photo", photoFile)
    } else if (member.profile_picture) {
      fd.append("existingPhoto", member.profile_picture)
    }

    try {
      setSubmitting(true)
      await updateMemberById(member.id, fd)
      toast.success("Member updated successfully")
      refreshMember?.()
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
                Only edit member info when necessary (e.g. corrections or date adjustments).
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              {["first_name","last_name","email","contact_number","address"].map(field => (
                <div key={field}>
                  <Label className="pb-0.5">
                    {field === "email" ? "Email (optional)"
                     : field === "contact_number" ? "Contact Number"
                     : field.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())
                    }
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

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="photo">Profile Picture</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <Label className="pb-0.5">Recent Join Date</Label>
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
                        ? DateTime.fromJSDate(form.recent_join_date).toFormat("MMMM d, yyyy")
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

              <div>
                <Label className="pb-0.5">Expiration Date</Label>
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
                        ? DateTime.fromJSDate(form.expiration_date).toFormat("MMMM d, yyyy")
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
