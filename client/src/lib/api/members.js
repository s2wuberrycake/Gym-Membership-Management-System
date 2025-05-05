import { MEMBERS_API, DURATIONS_API } from "."

// Helper to handle API response with error message fallback
const handleResponse = async res => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "An error occurred")
  }
  return await res.json()
}

export async function fetchDurations() {
  const res = await fetch(DURATIONS_API)
  return await handleResponse(res)
}

export async function fetchMembers() {
  const res = await fetch(MEMBERS_API)
  return await handleResponse(res)
}

export async function addMember(payload) {
  const res = await fetch(MEMBERS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return await handleResponse(res)
}

export const fetchMemberById = async memberId => {
  const res = await fetch(`${MEMBERS_API}/${memberId}`)
  return await handleResponse(res)
}

export const updateMemberById = async (memberId, payload) => {
  const res = await fetch(`${MEMBERS_API}/${memberId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return await handleResponse(res)
}

export const extendMember = async (id, expiration_date, status) => {
  const res = await fetch(`${MEMBERS_API}/${id}/extend`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expiration_date, status })
  })
  return await handleResponse(res)
}

export const cancelMemberById = async (id, cancel_date) => {
  const res = await fetch(`${MEMBERS_API}/${id}/cancel`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cancel_date })
  })
  return await handleResponse(res)
}

export const restoreMember = async (id, expiration_date) => {
  const res = await fetch(`${MEMBERS_API}/${id}/restore`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expiration_date })
  })
  return await handleResponse(res)
}