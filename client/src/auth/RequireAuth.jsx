import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AUTH_HOME_API } from "@/lib/api"

const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      try {
        const res = await axios.get(AUTH_HOME_API, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status !== 200) throw new Error()
      } catch {
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [navigate])

  if (loading) return null
  return children
}

export default RequireAuth