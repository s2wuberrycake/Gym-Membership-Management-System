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

// Public
router.get("/",                getAllAccountsController)
router.get("/check-username",  checkUsernameExistsController)
router.get("/roles",           getRolesController)

// Protected
router.get(
  "/:id",
  verifyToken,
  (req, res, next) => {
    const { id: userId, role: userRole } = req.user || {}
    const targetId = Number(req.params.id)
    if (userRole === "admin" || userId === targetId) {
      return next()
    }
    return res.status(403).json({ message: "Access denied" })
  },
  getAccountByIdController
)

router.post("/",       createAccountController)
router.put("/:id",     updateAccountController)
router.delete("/:id",  deleteAccountController)

export default router
