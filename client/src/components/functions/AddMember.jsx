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
    contact_number: "",
    address: "",
    durationId: "",
  })

  const [durations, setDurations] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/api/members/durations")
      .then((res) => res.json())
      .then((data) => setDurations(data))
      .catch((err) => console.error("Error loading durations", err))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelect = (value) => {
    setForm({ ...form, durationId: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const selected = durations.find((d) => d.extend_date_id == form.durationId)
    const daysToAdd = selected ? selected.days : 0
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + daysToAdd)

    const payload = {
      ...form,
      expiration_date: expirationDate.toISOString().slice(0, 10),
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
          contact_number: "",
          address: "",
          durationId: "",
        })
      } else {
        toast.error("Failed to add member")
      }
    } catch (err) {
      console.error("Submit error", err)
      toast.error("Network or server error")
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
                required
              />
            </div>

            <div>
            <Label className="mb-1 font-bold">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
            <Label className="mb-1 font-bold">Contact Number</Label>
              <Input
                id="contact_number"
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                required
              />
            </div>

            <div>
            <Label className="mb-1 font-bold">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
            <Label className="font-bold">Membership Duration</Label>
            <p className="mb-1 text-sm text-muted-foreground">Select initial membership duration availed by the client</p>
              <Select value={form.durationId} onValueChange={handleSelect}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d.extend_date_id} value={String(d.extend_date_id)}>
                      {d.date_label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <Button type="submit" className="w-full">Add Member</Button>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default AddMember
