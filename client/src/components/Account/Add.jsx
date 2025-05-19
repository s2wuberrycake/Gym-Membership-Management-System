import React, { useEffect, useState, useRef } from "react"
import { addAccount, getRoles, checkUsernameAvailability } from "@/lib/api/settings"
import { validateField } from "@/lib/helper/validate"

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
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

const AddAccount = ({ refreshAccounts, isSheetOpen, onClose }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    roleId: ""
  })
  const [roles, setRoles] = useState([])
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch(() => console.error("Error loading roles"))
  }, [])

  useEffect(() => {
    if (!isSheetOpen) {
      setForm({ username: "", password: "", repeatPassword: "", roleId: "" })
      setErrors({})
      setTouched({})
    }
  }, [isSheetOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(errs => ({ ...errs, [name]: validateField(name, value) }))

    if (name === "username") {
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        if (!value || validateField(name, value)) return
        setCheckingUsername(true)
        try {
          const ok = await checkUsernameAvailability(value)
          setErrors(errs => ({
            ...errs,
            username: ok ? "" : "Username already taken"
          }))
        } catch {
          setErrors(errs => ({
            ...errs,
            username: "Failed to check username"
          }))
        } finally {
          setCheckingUsername(false)
        }
      }, 500)
    }
  }

  const handleSelect = (value) => {
    setForm(f => ({ ...f, roleId: value }))
    setTouched(t => ({ ...t, roleId: true }))
    setErrors(errs => ({ ...errs, roleId: validateField("roleId", value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      username: validateField("username", form.username),
      password: validateField("password", form.password),
      repeatPassword: validateField("repeatPassword", form.repeatPassword, form.password),
      roleId: validateField("roleId", form.roleId)
    }
    const hasErrors = Object.values(newErrors).some(Boolean)
    setErrors(newErrors)
    setTouched({
      username: true,
      password: true,
      repeatPassword: true,
      roleId: true
    })
    if (hasErrors) return

    try {
      setSubmitting(true)
      await addAccount({
        username: form.username,
        password: form.password,
        role_id: form.roleId
      })
      toast.success("Account created!")
      refreshAccounts?.()
      onClose()
    } catch {
      setErrors({ submit: "Failed to create account" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Add Account</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            {/* Header block */}
            <div className="p-6 pb-2 max-w-md">
              <h2 className="text-xl font-bold">Create a New Account</h2>
              <p className="text-sm text-muted-foreground">
                Fill in credentials and assign a role.
              </p>
            </div>

            {/* Form fields */}
            <div className="p-6 pt-2 space-y-4 max-w-md">
              <div>
                <Label>Username</Label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
                {checkingUsername && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Checking availability...
                  </p>
                )}
                {touched.username && errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label>Repeat Password</Label>
                <Input
                  name="repeatPassword"
                  type="password"
                  value={form.repeatPassword}
                  onChange={handleChange}
                />
                {touched.repeatPassword && errors.repeatPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.repeatPassword}
                  </p>
                )}
              </div>

              <div>
                <Label>Role</Label>
                <Select
                  value={form.roleId}
                  onValueChange={handleSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem
                        key={r.role_id}
                        value={r.role_id.toString()}
                      >
                        {r.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.roleId && errors.roleId && (
                  <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm text-center">
                  {errors.submit}
                </p>
              )}

              <Button
                type="submit"
                size="sm"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default AddAccount
