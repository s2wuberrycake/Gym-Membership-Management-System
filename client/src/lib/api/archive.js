import axios from "axios"
import { ARCHIVE_API } from "."

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getAllCancelledMembers = async () => {
  const { data } = await axios.get(ARCHIVE_API)
  return data
}

export const getCancelledMemberById = async id => {
  const { data } = await axios.get(`${ARCHIVE_API}/${id}`)
  return data
}

export const restoreCancelledMemberById = async (id, extend_date_id) => {
  const { data } = await axios.put(
    `${ARCHIVE_API}/${id}/restore`,
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
