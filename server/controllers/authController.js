import { authenticateUser, getUserById } from "../services/authService.js"
import { generateToken } from "../utils/jwt.js"

export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await authenticateUser(username, password)

    if (!user) {
      const error = new Error("Invalid credentials")
      error.statusCode = 401
      throw error
    }

    const token = generateToken(user)
    res.status(200).json({ token })
  } catch (err) {
    next(err)
  }
}

export const getHome = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id)

    if (!user) {
      const error = new Error("User not found")
      error.statusCode = 404
      throw error
    }

    res.status(200).json({ user: req.user })
  } catch (err) {
    next(err)
  }
}