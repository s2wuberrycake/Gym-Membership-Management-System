import jwt from "jsonwebtoken"

export const extractUser = (req, res, next) => {
  const authHeader = req.headers.authorization || ""
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    try {
      req.user = jwt.decode(token) || {}
    } catch (error) {
      req.user = {}
    }
  } else {
    req.user = {}
  }
  next()
}
