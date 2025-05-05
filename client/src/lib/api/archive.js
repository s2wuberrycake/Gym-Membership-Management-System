import { ARCHIVE_API } from "."

// Fetch all cancelled members
export const fetchCancelledMembers = async () => {
  const res = await fetch(ARCHIVE_API)
  if (!res.ok) throw new Error("Failed to fetch cancelled members")
  return await res.json()
}

// Fetch a single cancelled member by ID
export const fetchCancelledMemberById = async (id) => {
  const res = await fetch(`${ARCHIVE_API}/${id}`)
  if (!res.ok) throw new Error("Failed to fetch cancelled member")
  return await res.json()
}

// Restore a cancelled member by ID
export const restoreMemberById = async (id, expiration_date) => {
  const res = await fetch(`${ARCHIVE_API}/restore/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ expiration_date })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to restore member")
  }

  return await res.json()
}
