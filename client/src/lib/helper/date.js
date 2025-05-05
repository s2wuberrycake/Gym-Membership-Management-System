export function calculateExpirationDate(startDate, daysToAdd) {
  if (!startDate || typeof daysToAdd !== "number") return null

  const result = new Date(startDate)
  result.setDate(result.getDate() + daysToAdd)
  const year = result.getFullYear()
  const month = String(result.getMonth() + 1).padStart(2, "0")
  const day = String(result.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function calculateExtendedExpiration(currentExpiration, daysToAdd) {
  if (!currentExpiration || typeof daysToAdd !== "number") return null

  const now = new Date()
  const today = new Date(now.setHours(0, 0, 0, 0))
  const currentExp = new Date(currentExpiration)
  currentExp.setHours(0, 0, 0, 0)
  const isExpired = currentExp < today
  const baseDate = isExpired ? today : new Date(currentExp)
  if (!isExpired) baseDate.setDate(baseDate.getDate() + 1)

  baseDate.setDate(baseDate.getDate() + daysToAdd)

  return baseDate.toISOString().split("T")[0]
}