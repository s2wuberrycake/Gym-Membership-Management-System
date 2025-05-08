import axios from "axios"
import { ACCOUNTS_API } from "."

export const getAllAccounts = async () => {
  const res = await axios.get(ACCOUNTS_API)
  return res.data
}

export const addAccount = async formData => {
  const res = await axios.post(ACCOUNTS_API, formData)
  return res.data
}

export const updateAccountById = async (id, formData) => {
  const res = await axios.put(`${ACCOUNTS_API}/${id}`, formData)
  return res.data
}

export const deleteAccount = async id => {
  const res = await axios.delete(`${ACCOUNTS_API}/${id}`)
  return res.data
}

export const checkUsernameAvailability = async username => {
  const res = await axios.get(`${ACCOUNTS_API}/check-username`, {
    params: { username }
  })
  return !res.data.exists
}

export const getRoles = async () => {
  const res = await axios.get(`${ACCOUNTS_API}/roles`)
  return res.data
}
