import express from "express"
import { loginUser, getHome } from "../controllers/authorizeController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { requireRole } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.post("/login", loginUser)
router.get("/home", verifyToken, getHome)

router.get("/check-role", verifyToken, requireRole(["admin"]), (req, res) => {
  res.json({ role: req.user.role })
})
export default router
