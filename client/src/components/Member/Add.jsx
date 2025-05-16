import React, { useEffect, useState } from "react"
import { getDurations, addMember } from "@/lib/api/members"
import { validateMemberForm, validateField } from "@/lib/helper/validate"

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
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

const AddMember = ({ refreshMembers, isSheetOpen, onClose }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    address: "",
    durationId: ""
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [durations, setDurations] = useState([])
  const [submitting, setSubmitting] = useState(false)
  

  useEffect(() => {
    getDurations()
      .then(setDurations)
      .catch(err => console.error("Error loading durations", err))
  }, [])

  useEffect(() => {
    if (!isSheetOpen) {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        address: "",
        durationId: ""
      })
      setErrors({})
      setTouched({})
    }
  }, [isSheetOpen])

  const handleChange = e => {
    const { name, value } = e.target
    if (name === "contact_number" && /[^0-9]/.test(value)) return

    setForm(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSelect = value => {
    setForm(prev => ({ ...prev, durationId: value }))
    setTouched(prev => ({ ...prev, durationId: true }))

    const error = validateField("durationId", value)
    setErrors(prev => ({ ...prev, durationId: error }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const { errors: newErrors, isValid } = validateMemberForm(form)
    setErrors(newErrors)
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      contact_number: true,
      address: true,
      durationId: true
    })

    if (!isValid) return

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      contact_number: form.contact_number,
      address: form.address,
      extend_date_id: form.durationId
    }    

    try {
      setSubmitting(true)
      await addMember(payload)
      toast.success("Member added!")
      if (refreshMembers) refreshMembers()

        onClose()
      
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        address: "",
        durationId: ""
      })
      setErrors({})
      setTouched({})
    } catch (err) {
      console.error("Submit error", err)
      setErrors({ submit: "Failed to add member" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Add Member</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            <div className="p-6 pb-2 max-w-md">
              <h2 className="pb-0.5 text-xl font-bold">Add a New Member</h2>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              {["first_name", "last_name", "email", "contact_number", "address"].map(field => (
                <div key={field}>
                  <Label className="pb-0.5 capitalize">{field.replace("_", " ")}</Label>
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
                <Label className="pb-0.5">Membership Duration</Label>
                <p className="mb-2 text-sm text-muted-foreground leading-tight">
                  Select initial membership duration availed by the client
                </p>
                <Select value={form.durationId} onValueChange={handleSelect}>
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
                {touched.durationId && errors.durationId && (
                  <p className="text-red-500 text-sm mt-1">{errors.durationId}</p>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm text-center">{errors.submit}</p>
              )}

              <Button type="submit" disabled={submitting} size="sm" className="w-full">
                {submitting ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default AddMember
