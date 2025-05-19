import express from "express"
import {
  loginUserController,
  getHomeController
} from "../controllers/authorize.js"
import { verifyToken } from "../middleware/auth.js"
import { requireRole } from "../middleware/role.js"

const router = express.Router()

router.post(
  "/login",
  loginUserController
)

router.get(
  "/home",
  verifyToken,
  getHomeController
)

router.get(
  "/check-role",
  verifyToken,
  requireRole(["admin"]),
  (req, res) => {
    res.json({ role: req.user.role })
  }
)

export default router
