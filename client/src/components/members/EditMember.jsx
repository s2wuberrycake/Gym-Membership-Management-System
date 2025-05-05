import React, { useEffect, useState } from "react"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateMemberById } from "@/lib/api/members"
import { validateMemberForm, validateField } from "@/lib/helper/validate"

const EditMember = ({ member, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    address: ""
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (member) {
      setForm({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        email: member.email || "",
        contact_number: member.contact_number || "",
        address: member.address || ""
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

    const { errors: newErrors, isValid } = validateMemberForm(form)
    setErrors(newErrors)
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      contact_number: true,
      address: true
    })

    if (!isValid) return

    try {
      await updateMemberById(member.member_id, form)
      toast.success("Member updated!")
      if (onUpdated) onUpdated()
      if (onClose) onClose()
    } catch (err) {
      console.error("Update error", err)
      setErrors({ submit: "Failed to update member" })
    }
  }

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Edit Member</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="mb-1 font-bold">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
              {touched.first_name && errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <Label className="mb-1 font-bold">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
              {touched.last_name && errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>

            <div>
              <Label className="mb-1 font-bold">Email (optional)</Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label className="mb-1 font-bold">Contact Number</Label>
              <Input
                id="contact_number"
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
              />
              {touched.contact_number && errors.contact_number && (
                <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
              )}
            </div>

            <div>
              <Label className="mb-1 font-bold">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
              {touched.address && errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default EditMember
