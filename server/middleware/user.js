import jwt from "jsonwebtoken"

export function extractUser(req, res, next) {
  const auth = req.headers.authorization
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7)
    try {
      req.user = jwt.decode(token) || {}
    } catch {
      req.user = {}
    }
  } else {
    req.user = {}
  }
  next()
}
