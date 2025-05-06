import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AUTH_HOME_API } from "@/lib/api"

const RequireAuth = ({ children }) => {
  const [authorized, setAuthorized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) return navigate("/login")

      try {
        await axios.get(AUTH_HOME_API, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAuthorized(true)
      } catch {
        navigate("/login")
      }
    }

    checkAuth()
  }, [navigate])

  if (!authorized) return null
  return children
}

export default RequireAuth