import { ARCHIVE_API } from "."

const handleResponse = async res => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "An error occurred")
  }
  return await res.json()
}

// Get all cancelled members
export const getAllCancelledMembers = async () => {
  const res = await fetch(ARCHIVE_API)
  return await handleResponse(res)
}

// Get single cancelled member by ID
export const getCancelledMemberById = async id => {
  const res = await fetch(`${ARCHIVE_API}/${id}`)
  return await handleResponse(res)
}

// Restore a cancelled member by ID
export const restoreCancelledMemberById = async (id, extend_date_id) => {
  const res = await fetch(`${ARCHIVE_API}/restore/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ extend_date_id }) // <-- Fix is here
  })
  return await handleResponse(res)
}

