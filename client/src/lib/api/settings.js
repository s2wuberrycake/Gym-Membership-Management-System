import axios from "axios"
import {
  SETTINGS_API,
  BACKUPS_API,
  BACKUP_API,
  RESTORE_API
} from "."

export const getAllAccounts = async () => {
  const token = localStorage.getItem("token")
  const res = await axios.get(SETTINGS_API, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export const getAccountById = async (id) => {
  const token = localStorage.getItem("token")
  const res = await axios.get(`${SETTINGS_API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export const addAccount = async formData => {
  const token = localStorage.getItem("token")
  const res = await axios.post(SETTINGS_API, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export const updateAccountById = async (id, formData) => {
  const token = localStorage.getItem("token")
  const res = await axios.put(`${SETTINGS_API}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export const deleteAccount = async id => {
  const token = localStorage.getItem("token")
  const res = await axios.delete(`${SETTINGS_API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}

export const checkUsernameAvailability = async username => {
  const res = await axios.get(`${SETTINGS_API}/check-username`, {
    params: { username }
  })
  return !res.data.exists
}

export const getRoles = async () => {
  const res = await axios.get(`${SETTINGS_API}/roles`, {
  })
  return res.data
}

export const listBackups = async () => {
  const token = localStorage.getItem("token")
  const res = await axios.get(BACKUPS_API, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export const backupDatabase = async () => {
  const token = localStorage.getItem("token")
  const res = await axios.post(
    BACKUP_API,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob"
    }
  )
  const dispo = res.headers["content-disposition"] || ""
  const match = dispo.match(/filename="?(.+)"?/)
  const filename = match?.[1] || `backup-${Date.now()}.sql.gz`
  return { blob: res.data, filename }
}

export const restoreDatabase = async (filename) => {
  const token = localStorage.getItem("token")
  const res = await axios.post(
    RESTORE_API,
    { filename },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return res.data
}
