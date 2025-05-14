import React, { useEffect, useState, useRef } from "react"
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
import { addAccount, getRoles, checkUsernameAvailability } from "@/lib/api/accounts"
import { validateField } from "@/lib/helper/validate"

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
      .catch(err => console.error("Error loading roles", err))
  }, [])

  useEffect(() => {
    if (!isSheetOpen) {
      setForm({ username: "", password: "", repeatPassword: "", roleId: "" })
      setErrors({})
      setTouched({})
    }
  }, [isSheetOpen])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))

    if (name === "username") {
      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(async () => {
        if (!value || error) return
        setCheckingUsername(true)
        try {
          const isAvailable = await checkUsernameAvailability(value)
          if (!isAvailable) {
            setErrors(prev => ({ ...prev, username: "Username already taken" }))
          } else {
            setErrors(prev => ({ ...prev, username: "" }))
          }
        } catch (err) {
          console.error("Username check error", err)
          setErrors(prev => ({ ...prev, username: "Failed to check username" }))
        } finally {
          setCheckingUsername(false)
        }
      }, 500)
    }
  }

  const handleSelect = value => {
    setForm(prev => ({ ...prev, roleId: value }))
    setTouched(prev => ({ ...prev, roleId: true }))

    const error = validateField("roleId", value)
    setErrors(prev => ({ ...prev, roleId: error }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const { username, password, roleId } = form
    const newErrors = {
      username: validateField("username", username),
      password: validateField("password", password),
      repeatPassword: validateField("repeatPassword", form.repeatPassword, password),
      roleId: validateField("roleId", roleId)
    }    

    const hasErrors = Object.values(newErrors).some(error => !!error)
    setErrors(newErrors)
    setTouched({ username: true, password: true, repeatPassword: true, roleId: true })

    if (hasErrors) return

    const payload = {
      username,
      password,
      role_id: roleId
    }

    try {
      setSubmitting(true)
      await addAccount(payload)
      toast.success("Account created!")
      if (refreshAccounts) refreshAccounts()
      onClose()
      setForm({ username: "", password: "", repeatPassword: "", roleId: "" })
      setErrors({})
      setTouched({})
    } catch (err) {
      console.error("Submit error", err)
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
            <div className="p-6 pb-2 max-w-md">
              <h2 className="pb-0.5 text-xl font-bold">Create a New Account</h2>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              <div>
                <Label className="pb-0.5">Username</Label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
                {checkingUsername && (
                  <p className="text-sm text-muted-foreground mt-1">Checking availability...</p>
                )}
                {touched.username && errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <Label className="pb-0.5">Password</Label>
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
                <Label className="pb-0.5">Repeat Password</Label>
                <Input
                  name="repeatPassword"
                  type="password"
                  value={form.repeatPassword}
                  onChange={handleChange}
                />
                {touched.repeatPassword && errors.repeatPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>
                )}
              </div>

              <div>
                <Label className="pb-0.5">Role</Label>
                <p className="mb-2 text-sm text-muted-foreground leading-tight">
                  Select account permission level
                </p>
                <Select value={form.roleId} onValueChange={handleSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.role_id} value={String(role.role_id)}>
                      {role.role}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
                {touched.roleId && errors.roleId && (
                  <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm text-center">{errors.submit}</p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
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