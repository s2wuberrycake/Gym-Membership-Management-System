import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { AUTH_HOME_API } from "@/lib/api"

const RequireAuth = ({ children }) => {
  const [authorized, setAuthorized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        return navigate("/login", { replace: true })
      }

      try {
        const { exp } = jwtDecode(token)
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem("token")
          return navigate("/login", { replace: true })
        }
      } catch {
        localStorage.removeItem("token")
        return navigate("/login", { replace: true })
      }

      try {
        await axios.get(AUTH_HOME_API, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAuthorized(true)
      } catch {
        localStorage.removeItem("token")
        navigate("/login", { replace: true })
      }
    }

    checkAuth()
  }, [navigate])

  if (!authorized) return null

  return children
}

export default RequireAuth
