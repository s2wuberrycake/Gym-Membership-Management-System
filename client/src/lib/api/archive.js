import axios from "axios"
import { ARCHIVE_API } from "."

export const getAllCancelledMembers = async () => {
  const { data } = await axios.get(ARCHIVE_API)
  return data
}

export const getCancelledMemberById = async id => {
  const { data } = await axios.get(`${ARCHIVE_API}/${id}`)
  return data
}

export const restoreCancelledMemberById = async (id, extend_date_id) => {
  const { data } = await axios.post(`${ARCHIVE_API}/restore/${id}`, {
    extend_date_id
  })
  return data
}