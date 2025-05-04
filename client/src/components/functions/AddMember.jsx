import React, { useEffect, useState } from "react"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const AddMember = ({ refreshMembers }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",               // ✅ Add this
    contact_number: "",
    address: "",
    durationId: ""
  })

  const [errors, setErrors] = useState({})
  const [durations, setDurations] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/api/members/durations")
      .then((res) => res.json())
      .then((data) => setDurations(data))
      .catch((err) => console.error("Error loading durations", err))
  }, [])

  const validateField = (name, value) => {
    let error = ""
  
    if (name === "first_name") {
      if (!value.trim()) {
        error = "First name is required"
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = "First name must contain only letters and spaces"
      }
    } else if (name === "last_name") {
      if (!value.trim()) {
        error = "Last name is required"
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = "Last name must contain only letters and spaces"
      }
    } else if (name === "email") {
      if (value.trim() !== "") {
        const emailRegex = /^[^@\s]+@[^@\s]+\.[cC][oO][mM]$/
        if (!emailRegex.test(value)) {
          error = "Email must be in format name@host.com"
        }
      }
    } else if (name === "address" && !value.trim()) {
      error = "Address is required"
    } else if (name === "contact_number") {
      const digitsOnly = value.replace(/\D/g, "")
      if (!/^\d{11}$/.test(digitsOnly)) {
        error = "Contact number must be exactly 11 digits and can only contain numbers"
      }
    } else if (name === "durationId" && !value) {
      error = "Please select a membership duration"
    }
  
    setErrors((prev) => ({ ...prev, [name]: error }))
  }
  

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "contact_number" && /[^0-9]/.test(value)) return

    setForm({ ...form, [name]: value })
    validateField(name, value)
  }

  const handleSelect = (value) => {
    setForm({ ...form, durationId: value })
    validateField("durationId", value)
  }

  const validateForm = () => {
    const fields = ["first_name", "last_name", "address", "contact_number", "durationId", "email"]
    fields.forEach((field) => validateField(field, form[field]))
  
    const isValid = fields.every((field) => {
      const value = form[field]
      if (field === "contact_number") return /^\d{11}$/.test(value)
      if (field === "durationId") return value !== ""
      if (field === "first_name" || field === "last_name")
        return /^[a-zA-Z\s]+$/.test(value.trim())
      if (field === "email") {
        if (!value) return true
        return /^[^@\s]+@[^@\s]+\.[cC][oO][mM]$/.test(value)
      }
      return value.trim() !== ""
    })
  
    return isValid
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const selected = durations.find((d) => d.extend_date_id == form.durationId)
    const daysToAdd = selected ? selected.days : 0
    const today = new Date()
    const expirationDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)

    const year = expirationDate.getFullYear()
    const month = String(expirationDate.getMonth() + 1).padStart(2, "0")
    const day = String(expirationDate.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`

    const payload = {
      ...form,
      expiration_date: formattedDate,
    }

    try {
      const res = await fetch("http://localhost:3000/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
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
      } else {
        setErrors({ submit: "Failed to add member" })
      }
    } catch (err) {
      console.error("Submit error", err)
      setErrors({ submit: "Network or server error" })
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
                placeholder="example@email.com"
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
