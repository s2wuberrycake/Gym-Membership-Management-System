import { ARCHIVE_API } from "."

export const fetchCancelledMembers = async () => {
  const res = await fetch(ARCHIVE_API)
  if (!res.ok) throw new Error("Failed to fetch cancelled members")
  return await res.json()
}
