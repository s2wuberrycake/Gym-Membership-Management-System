import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) return res.status(403).json({ message: "No token provided" })

    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = decoded
    next()
  } catch (err) {
    console.error("Token verification failed:", err)
    res.status(401).json({ message: "Unauthorized: Invalid token" })
  }
}
