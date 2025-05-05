import React, { useEffect, useState } from "react"
import { updateMemberById } from "@/lib/api/members"
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
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { validateField, validateEditMemberForm } from "@/lib/helper/validate"

const EditMember = ({ member, isSheetOpen, onClose, refreshMember }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    address: "",
    join_date: null,
    expiration_date: null,
    status_id: 1
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (member) {
      setForm({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        email: member.email || "",
        contact_number: member.contact_number || "",
        address: member.address || "",
        join_date: member.join_date ? new Date(member.join_date) : null,
        expiration_date: member.expiration_date ? new Date(member.expiration_date) : null,
        status_id: member.status_id || 1
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

    const { errors: newErrors, isValid } = validateEditMemberForm(form)
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

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    let updatedStatusId = parseInt(form.status_id)

    if (form.expiration_date) {
      const expDate = new Date(form.expiration_date)
      expDate.setHours(0, 0, 0, 0)

      if (expDate <= now) {
        updatedStatusId = 2 // Expired
      } else if (expDate > now) {
        updatedStatusId = 1 // Active
      }
    }

    const payload = {
      ...form,
      join_date: form.join_date ? format(form.join_date, "yyyy-MM-dd") : null,
      expiration_date: form.expiration_date ? format(form.expiration_date, "yyyy-MM-dd") : null,
      status_id: updatedStatusId
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
        <SheetTitle className="mb-4">Edit Member</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            <div className="p-6 pb-2 max-w-md">
              <h2 className="text-xl font-semibold">Edit Member Info</h2>
              <p className="">Only edit member info when necessary (e.g: member requests for
                              updating of old info, incorrectly saved details, mismatched dates)
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
            <div>
              <Label>First Name</Label>
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
              <Label>Last Name</Label>
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
              <Label>Email (optional)</Label>
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
              <Label>Contact Number</Label>
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
              <Label>Address</Label>
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
              <Label>Join Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.join_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.join_date
                      ? format(form.join_date, "MMMM d, yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.join_date}
                    onSelect={date => setForm(prev => ({ ...prev, join_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.expiration_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.expiration_date
                      ? format(form.expiration_date, "MMMM d, yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.expiration_date}
                    onSelect={date => setForm(prev => ({ ...prev, expiration_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.expiration_date && (
                <p className="text-red-500 text-sm mt-1">{errors.expiration_date}</p>
              )}
            </div>


            <Button type="submit" disabled={submitting} className="w-full">
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