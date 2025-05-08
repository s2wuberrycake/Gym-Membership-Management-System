import { DateTime } from "luxon"

export function validateMemberForm(form) {
  const errors = {}
  let isValid = true

  const requiredFields = ["first_name", "last_name", "address", "contact_number", "durationId"]

  for (const field of requiredFields) {
    const error = validateField(field, form[field])
    if (error) {
      errors[field] = error
      isValid = false
    }
  }

  if (form.email && !/^[^@\s]+@[^@\s]+\.[cC][oO][mM]$/.test(form.email)) {
    errors.email = "Email must be in format name@host.com"
    isValid = false
  }

  return { errors, isValid }
}

export function validateEditMemberForm(form, originalJoinDate) {
  const errors = {}
  let isValid = true

  const requiredFields = ["first_name", "last_name", "address", "contact_number"]

  for (const field of requiredFields) {
    const error = validateField(field, form[field])
    if (error) {
      errors[field] = error
      isValid = false
    }
  }

  if (form.email && !/^[^@\s]+@[^@\s]+\.[cC][oO][mM]$/.test(form.email)) {
    errors.email = "Email must be in format name@host.com"
    isValid = false
  }

  const normalizeDate = d =>
    d ? DateTime.fromJSDate(d).setZone("Asia/Manila").startOf("day") : null

  const joinDate = normalizeDate(form.recent_join_date)
  const expDate = normalizeDate(form.expiration_date)
  const originalDate = normalizeDate(originalJoinDate)

  const validationMessages = []

  if (joinDate && expDate) {
    const diffInDays = expDate.diff(joinDate, "days").days

    if (diffInDays < 28) {
      validationMessages.push("Expiration date must be at least 28 days after join date")
      isValid = false
    }

    if (joinDate > expDate) {
      validationMessages.push("Expiration date must be after join date")
      isValid = false
    }
  }

  if (joinDate && originalDate && joinDate < originalDate) {
    validationMessages.push("Recent join date cannot be earlier than original join date")
    isValid = false
  }

  if (validationMessages.length > 0) {
    errors.expirationValidation = validationMessages.join("\n")
  }

  return { errors, isValid }
}

export function validateAccountForm(form) {
  const errors = {}
  let isValid = true

  const fieldNames = ["username", "password", "roleId"]
  for (const field of fieldNames) {
    const error = validateField(field, form[field])
    if (error) {
      errors[field] = error
      isValid = false
    }
  }

  return { errors, isValid }
}

export function validateField(name, value) {
  switch (name) {
    case "first_name":
    case "last_name":
      if (!value.trim()) return `${name === "first_name" ? "First" : "Last"} name is required`
      if (!/^[a-zA-Z\s]+$/.test(value)) return `${name === "first_name" ? "First" : "Last"} name must contain only letters and spaces`
      break

    case "email":
      if (value.trim() === "") return null
      if (!/^[^@\s]+@[^@\s]+\.[cC][oO][mM]$/.test(value)) return "Email must be in format name@host.com"
      break

    case "address":
      if (!value.trim()) return "Address is required"
      break

    case "contact_number":
      const digitsOnly = value.replace(/\D/g, "")
      if (!/^\d{11}$/.test(digitsOnly)) return "Contact number must be exactly 11 digits and can only contain numbers"
      break

    case "durationId":
      if (!value) return "Please select a membership duration"
      break

    case "username":
      if (!value.trim()) return "Username is required"
      if (value.length < 8) return "Username must be at least 8 characters"
      break

    case "password":
      if (!value.trim()) return "Password is required"
      if (value.length < 8) return "Password must be at least 8 characters"
      break

    case "roleId":
      if (!value) return "Please select a role"
      break

    default:
      return null
  }

  return null
}

export async function checkUsernameExists(username) {
  try {
    const response = await fetch(`/api/accounts/check-username?username=${encodeURIComponent(username)}`)
    const data = await response.json()
    return data.exists
  } catch (error) {
    console.error("Failed to check username:", error)
    return false
  }
}