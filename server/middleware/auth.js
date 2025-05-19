import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || ""
  const token      = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null

  if (!token) {
    return res.status(403).json({ message: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = decoded
    next()
  } catch (err) {
    console.error("Token verification failed:", err)
    res.status(401).json({ message: "Unauthorized: Invalid token" })
  }
}
