import { MEMBERS_API, DURATIONS_API } from "."
const handleResponse = async res => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "An error occurred")
  }
  return await res.json()
}

export const getDurations = async () => {
  const res = await fetch(DURATIONS_API)
  return await handleResponse(res)
}

export const getAllMembers = async () => {
  const res = await fetch(MEMBERS_API)
  return await handleResponse(res)
}

export const addMember = async payload => {
  const res = await fetch(MEMBERS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return await handleResponse(res)
}

export const getMemberById = async memberId => {
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

export const extendMember = async (id, extend_date_id) => {
  const res = await fetch(`${MEMBERS_API}/${id}/extend`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ extend_date_id })
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

export const restoreMemberById = async (id, expiration_date) => {
  const res = await fetch(`${MEMBERS_API}/${id}/restore`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expiration_date })
  })
  return await handleResponse(res)
}
