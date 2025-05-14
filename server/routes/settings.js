// server/routes/settings.js
import express from "express"
import {
  getAllAccountsController,
  getAccountByIdController,
  createAccountController,
  updateAccountController,
  deleteAccountController,
  checkUsernameExistsController,
  getRolesController
} from "../controllers/settings.js"

import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// public
router.get("/", getAllAccountsController)
router.get("/check-username", checkUsernameExistsController)
router.get("/roles", getRolesController)

// protected: admin or self-only
router.get(
  "/:id",
  verifyToken,
  (req, res, next) => {
    const userId = req.user?.id            // from your JWT payload
    const userRole = req.user?.role        // from your JWT payload
    const targetId = Number(req.params.id) // the :id in the URL

    // admins can see any
    if (userRole === "admin") return next()

    // non-admins can only see their own
    if (userId === targetId) return next()

    return res.status(403).json({ message: "Access denied" })
  },
  getAccountByIdController
)

// the rest of your CRUD endpoints
router.post("/", createAccountController)
router.put("/:id", updateAccountController)
router.delete("/:id", deleteAccountController)

export default router
