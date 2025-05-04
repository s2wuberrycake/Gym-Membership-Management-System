import { createContext, useContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    username: null,
    role: null,
    token: null
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setAuth({
          token,
          username: decoded.username || decoded.name || "user",
          role: decoded.role || "staff"
        })
      } catch (err) {
        console.error("Invalid token:", err)
        setAuth({ token: null, username: null, role: null })
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
