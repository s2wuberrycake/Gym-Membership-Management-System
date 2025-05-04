import React, { useEffect, useState } from "react"
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
import { fetchDurations, addMember } from "@/lib/api/members"
import { validateMemberForm } from "@/lib/utils/validate"

const AddMember = ({ refreshMembers, isSheetOpen }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    address: "",
    durationId: ""
  })

  const [errors, setErrors] = useState({})
  const [durations, setDurations] = useState([])

  useEffect(() => {
    fetchDurations()
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
  }
}, [isSheetOpen])


  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "contact_number" && /[^0-9]/.test(value)) return

    const updatedForm = { ...form, [name]: value }
    setForm(updatedForm)

    const { errors: newErrors } = validateMemberForm(updatedForm)
    setErrors(newErrors)
  }


  const handleSelect = (value) => {
    const updatedForm = { ...form, durationId: value }
    setForm(updatedForm)
  
    const { errors: newErrors } = validateMemberForm(updatedForm)
    setErrors(newErrors)
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { errors: newErrors, isValid } = validateMemberForm(form)
    setErrors(newErrors)
    if (!isValid) return

    const selected = durations.find(d => d.extend_date_id == form.durationId)
    const daysToAdd = selected ? selected.days : 0
    const today = new Date()
    const expirationDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)

    const year = expirationDate.getFullYear()
    const month = String(expirationDate.getMonth() + 1).padStart(2, "0")
    const day = String(expirationDate.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`

    const payload = {
      ...form,
      expiration_date: formattedDate
    }

    try {
      await addMember(payload)
      toast.success("Member added!")
      if (refreshMembers) refreshMembers()
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        address: "",
        durationId: ""
      })
      setErrors({})
    } catch (err) {
      console.error("Submit error", err)
      setErrors({ submit: "Failed to add member" })
    }
  }

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Add Member</SheetTitle>
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
              {errors.first_name && (
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
              {errors.last_name && (
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
                placeholder="member@gmail.com"
              />
              {errors.email && (
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
              {errors.contact_number && (
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
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <Label className="font-bold">Membership Duration</Label>
              <p className="mb-1 text-sm text-muted-foreground">
                Select initial membership duration availed by the client
              </p>
              <Select value={form.durationId} onValueChange={handleSelect}>
                <SelectTrigger id="duration">
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
              {errors.durationId && (
                <p className="text-red-500 text-sm mt-1">{errors.durationId}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            <Button type="submit" className="w-full">
              Add Member
            </Button>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default AddMember