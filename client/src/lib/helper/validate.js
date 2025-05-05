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

export function validateEditMemberForm(form) {
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
