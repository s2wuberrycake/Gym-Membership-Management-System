import { DateTime } from "luxon"

const TIMEZONE = "Asia/Manila"

export const getToday = () => DateTime.now().setZone(TIMEZONE).startOf("day")
export const formatDate = dt => dt.toFormat("yyyy-MM-dd")

export { TIMEZONE }
