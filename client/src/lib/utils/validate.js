export function validateMemberForm(form) {
  const errors = {}

  if (!form.first_name.trim()) {
    errors.first_name = "First name is required"
  } else if (!/^[a-zA-Z\s]+$/.test(form.first_name)) {
    errors.first_name = "First name must contain only letters and spaces"
  }

  if (!form.last_name.trim()) {
    errors.last_name = "Last name is required"
  } else if (!/^[a-zA-Z\s]+$/.test(form.last_name)) {
    errors.last_name = "Last name must contain only letters and spaces"
  }

  if (form.email.trim() !== "") {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[cC][oO][mM]$/
    if (!emailRegex.test(form.email)) {
      errors.email = "Email must be in format name@host.com"
    }
  }

  if (!form.address.trim()) {
    errors.address = "Address is required"
  }

  const digitsOnly = form.contact_number.replace(/\D/g, "")
  if (!/^\d{11}$/.test(digitsOnly)) {
    errors.contact_number = "Contact number must be exactly 11 digits and can only contain numbers"
  }

  if (!form.durationId) {
    errors.durationId = "Please select a membership duration"
  }

  const isValid = Object.keys(errors).length === 0
  return { errors, isValid }
}
