import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = "Asia/Manila"

export function calculateExpirationDate(startDate, daysToAdd) {
  if (!startDate || typeof daysToAdd !== "number") return null

  const expiration = dayjs(startDate)
    .tz(TIMEZONE)
    .add(daysToAdd, "day")
    .format("YYYY-MM-DD")

  return expiration
}

export function calculateExtendedExpiration(currentExpiration, daysToAdd) {
  if (!currentExpiration || typeof daysToAdd !== "number") return null

  const today = dayjs().tz(TIMEZONE).startOf("day")
  const currentExp = dayjs(currentExpiration).tz(TIMEZONE).startOf("day")

  const isExpired = currentExp.isBefore(today, "day")

  const baseDate = isExpired ? today : currentExp.add(1, "day")

  const newExpiration = baseDate.add(daysToAdd, "day").format("YYYY-MM-DD")

  return newExpiration
}
