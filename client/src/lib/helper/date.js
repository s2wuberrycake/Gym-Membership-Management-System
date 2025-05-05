export function calculateExpirationDate(startDate, daysToAdd) {
  if (!startDate || typeof daysToAdd !== "number") return null

  const result = new Date(startDate)
  result.setDate(result.getDate() + daysToAdd + 1) // +1 to include start day
  const year = result.getFullYear()
  const month = String(result.getMonth() + 1).padStart(2, "0")
  const day = String(result.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}
