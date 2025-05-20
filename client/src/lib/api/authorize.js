import axios from "axios"
import { AUTH_API, AUTH_HOME_API } from "./index"

export const login = (credentials) =>
  axios.post(`${AUTH_API}/login`, credentials)

export const authHome = (token) =>
  axios.get(AUTH_HOME_API, {
    headers: { Authorization: `Bearer ${token}` },
  })
