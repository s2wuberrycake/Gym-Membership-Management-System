import jwt from "jsonwebtoken"

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  )
}
