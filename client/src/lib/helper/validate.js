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

  const normalizeDate = d => {
    const date = new Date(d)
    date.setHours(0, 0, 0, 0)
    return date
  }

  const joinDate = form.recent_join_date ? normalizeDate(form.recent_join_date) : null
  const expDate = form.expiration_date ? normalizeDate(form.expiration_date) : null
  const originalDate = originalJoinDate ? normalizeDate(originalJoinDate) : null

  if (joinDate && expDate) {
    const diffInDays = (expDate - joinDate) / (1000 * 60 * 60 * 24)

    if (diffInDays < 28) {
      errors.expiration_date = "Expiration date must be at least 28 days after join date"
      isValid = false
    }

    if (joinDate > expDate) {
      errors.expiration_date = "Expiration date must be after join date"
      isValid = false
    }
  }

  if (joinDate && originalDate && joinDate < originalDate) {
    errors.recent_join_date = "Recent join date cannot be earlier than original join date"
    isValid = false
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

    default:
      return null
  }

  return null
}