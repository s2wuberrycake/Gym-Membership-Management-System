import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AUTH_HOME_API } from "@/lib/api"

const RequireRole = ({ allowedRoles, children }) => {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login", { replace: true })
        return
      }

      try {
        const res = await axios.get(AUTH_HOME_API, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const userRole = res.data.user?.role
        if (allowedRoles.includes(userRole)) {
          setAuthorized(true)
        } else {
          navigate("/", { replace: true })
        }
      } catch (err) {
        navigate("/login", { replace: true })
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndRole()
  }, [navigate, allowedRoles])

  if (loading) return null
  return authorized ? children : null
}

export default RequireRole
