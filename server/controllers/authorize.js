import { authenticateAccount, getUserById } from "../services/authorize.js"
import { generateToken } from "../utils/jwt.js"

export const loginUserController = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await authenticateAccount(username, password)

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

export const getHomeController = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id)

    if (!user) {
      const error = new Error("User not found")
      error.statusCode = 404
      throw error
    }

    res.status(200).json({ user: { id: user.account_id, username: user.username, role: req.user.role } })
  } catch (err) {
    next(err)
  }
}
