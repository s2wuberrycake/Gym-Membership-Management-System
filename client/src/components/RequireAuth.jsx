import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

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
        const response = await axios.get("http://localhost:3000/auth/home", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.status !== 200) {
          navigate("/login")
        }
      } catch (err) {
        console.error("Token validation failed:", err)
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [navigate])
  return children
}

export default RequireAuth
