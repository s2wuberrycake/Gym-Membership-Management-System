// client/auth/RequireAuth.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"          // install jwt-decode
import { AUTH_HOME_API } from "@/lib/api"

const RequireAuth = ({ children }) => {
  const [authorized, setAuthorized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      // 1) no token → login
      if (!token) {
        return navigate("/login", { replace: true })
      }

      // 2) expired token → remove & login
      try {
        const { exp } = jwtDecode(token)   // exp is in seconds
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem("token")
          return navigate("/login", { replace: true })
        }
      } catch {
        // invalid token format
        localStorage.removeItem("token")
        return navigate("/login", { replace: true })
      }

      // 3) server‐side verify
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

  // don’t render anything (or show a spinner) until we know
  if (!authorized) return null

  return children
}

export default RequireAuth
