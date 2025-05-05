export function calculateExpirationDate(startDate, daysToAdd) {
  if (!startDate || typeof daysToAdd !== "number") return null

  const result = new Date(startDate)
  result.setUTCDate(result.getUTCDate() + daysToAdd)

  return result.toISOString().split("T")[0]
}

export function calculateExtendedExpiration(currentExpiration, daysToAdd) {
  if (!currentExpiration || typeof daysToAdd !== "number") return null

  const today = new Date()
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))

  const currentExp = new Date(currentExpiration)
  const currentExpUTC = new Date(Date.UTC(currentExp.getUTCFullYear(), currentExp.getUTCMonth(), currentExp.getUTCDate()))

  const isExpired = currentExpUTC < todayUTC

  const baseDate = isExpired
    ? todayUTC
    : new Date(currentExpUTC.setUTCDate(currentExpUTC.getUTCDate() + 1))

  baseDate.setUTCDate(baseDate.getUTCDate() + daysToAdd)

  return baseDate.toISOString().split("T")[0]
}
