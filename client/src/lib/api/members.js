// src/lib/api/members.js
import { MEMBERS_API, DURATIONS_API } from "../api"

export async function fetchDurations() {
  const res = await fetch(DURATIONS_API)
  if (!res.ok) throw new Error("Failed to fetch durations")
  return await res.json()
}

export async function addMember(payload) {
  const res = await fetch(MEMBERS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error("Failed to add member")
  return await res.json()
}