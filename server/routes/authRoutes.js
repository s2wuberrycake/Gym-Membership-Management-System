import express from "express"
import { loginUser, getHome } from "../controllers/authController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/login", loginUser)
router.get("/home", verifyToken, getHome)

export default router