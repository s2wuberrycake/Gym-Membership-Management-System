export const requireRole = (allowedRoles) => (req, res, next) => {
  const { role: userRole } = req.user || {}
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "Access denied" })
  }
  next()
}
