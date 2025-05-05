import { MEMBERS_API, DURATIONS_API } from "."

// Api for accessing duration selection
export async function fetchDurations() {
  const res = await fetch(DURATIONS_API)
  if (!res.ok) throw new Error("Failed to fetch durations")
  return await res.json()
}

// Api for adding new member
export async function addMember(payload) {
  const res = await fetch(MEMBERS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error("Failed to add member")
  return await res.json()
}

// Api for accessing member info
export const fetchMemberById = async memberId => {
  const res = await fetch(`${MEMBERS_API}/${memberId}`)
  if (!res.ok) throw new Error("Failed to fetch member")
  return await res.json()
}

// ✅ NEW: Api for updating existing member
export const updateMemberById = async (memberId, payload) => {
  const res = await fetch(`${MEMBERS_API}/${memberId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error("Failed to update member")
  return await res.json()
}
