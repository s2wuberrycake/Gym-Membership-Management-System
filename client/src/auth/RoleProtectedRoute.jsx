import { Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const RoleProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token")

  if (!token) return <Navigate to="/login" replace />

  try {
    const decoded = jwtDecode(token)
    const userRole = decoded.role

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />
    }

    return <Outlet />
  } catch {
    return <Navigate to="/login" replace />
  }
}

export default RoleProtectedRoute