import React, { useState, useEffect } from "react"
import { updateAccountById, getRoles } from "@/lib/api/accounts"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { validateField, validateAccountForm } from "@/lib/helper/validate"

const EditAccount = ({
  account,
  isSheetOpen,
  onClose,
  refreshAccount
}) => {
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    roleId: ""
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch(() => toast.error("Failed to load roles"))
  }, [])

  useEffect(() => {
    if (!account) return
    setForm({
      username: account.username,
      password: "",
      repeatPassword: "",
      roleId: account.role_id?.toString() || ""
    })
    setErrors({})
    setTouched({})
  }, [account])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setTouched(t => ({ ...t, [name]: true }))
    const err = name === "repeatPassword"
      ? validateField(name, value, form.password)
      : validateField(name, value)
    setErrors(errs => ({ ...errs, [name]: err }))
  }

  const handleSelect = (value) => {
    setForm(f => ({ ...f, roleId: value }))
    setTouched(t => ({ ...t, roleId: true }))
    setErrors(errs => ({
      ...errs,
      roleId: validateField("roleId", value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let { errors: newErrors, isValid } = validateAccountForm(form)
    const rpErr = validateField("repeatPassword", form.repeatPassword, form.password)
    if (rpErr) {
      newErrors.repeatPassword = rpErr
      isValid = false
    }
    setErrors(newErrors)
    setTouched({
      username: true,
      password: true,
      repeatPassword: true,
      roleId: true
    })
    if (!isValid) return

    try {
      setSubmitting(true)
      await updateAccountById(account.account_id, {
        username: form.username,
        password: form.password,
        role_id: form.roleId
      })
      toast.success("Account updated")
      refreshAccount()
      onClose()
    } catch {
      toast.error("Update failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Edit Account</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            <div className="p-6 pb-2 max-w-md">
              <h2 className="text-xl font-bold">Update Account Details</h2>
              <p className="text-sm text-muted-foreground">
                Change username, password, or role below.
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              <div>
                <Label>Username</Label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
                {touched.username && errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
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
                  type="password"
                  name="repeatPassword"
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
                <Select value={form.roleId} onValueChange={handleSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.role_id} value={r.role_id.toString()}>
                        {r.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.roleId && errors.roleId && (
                  <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>
                )}
              </div>

              <Button
                type="submit"
                size="sm"
                className="w-full"
                disabled={submitting}
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

export default EditAccount
