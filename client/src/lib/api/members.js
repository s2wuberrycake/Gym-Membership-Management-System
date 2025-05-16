import axios from "axios"
import { MEMBERS_API, DURATIONS_API } from "."

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getDurations = async () => {
  const { data } = await axios.get(DURATIONS_API)
  return data
}

export const getAllMembers = async () => {
  const { data } = await axios.get(MEMBERS_API)
  return data
}

export const getMemberById = async memberId => {
  const { data } = await axios.get(`${MEMBERS_API}/${memberId}`)
  return data
}

export const addMember = async payload => {
  const { data } = await axios.post(
    MEMBERS_API,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    }
  )
  return data
}

export const updateMemberById = async (memberId, payload) => {
  const { data } = await axios.put(
    `${MEMBERS_API}/${memberId}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    }
  )
  return data
}

export const extendMember = async (id, extend_date_id) => {
  const { data } = await axios.put(
    `${MEMBERS_API}/${id}/extend`,
    { extend_date_id },
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    }
  )
  return data
}

export const cancelMemberById = async (id) => {
  const { data } = await axios.delete(
    `${MEMBERS_API}/${id}/cancel`,
    {
      headers: getAuthHeaders(),
      data: {}
    }
  )
  return data
}

export const restoreMemberById = async (id) => {
  const { data } = await axios.put(
    `${MEMBERS_API}/${id}/restore`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    }
  )
  return data
}
