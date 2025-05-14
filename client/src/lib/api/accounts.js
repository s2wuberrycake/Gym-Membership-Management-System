import axios from "axios"
import { SETTINGS_API } from "."

export const getAllAccounts = async () => {
  const res = await axios.get(SETTINGS_API)
  return res.data
}

export const addAccount = async formData => {
  const res = await axios.post(SETTINGS_API, formData)
  return res.data
}

export const updateAccountById = async (id, formData) => {
  const res = await axios.put(`${SETTINGS_API}/${id}`, formData)
  return res.data
}

export const deleteAccount = async id => {
  const res = await axios.delete(`${SETTINGS_API}/${id}`)
  return res.data
}

export const checkUsernameAvailability = async username => {
  const res = await axios.get(`${SETTINGS_API}/check-username`, {
    params: { username }
  })
  return !res.data.exists
}

export const getRoles = async () => {
  const res = await axios.get(`${SETTINGS_API}/roles`)
  return res.data
}
