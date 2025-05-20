import express from "express"
import {
  getAllAccountsController,
  getAccountByIdController,
  createAccountController,
  updateAccountController,
  deleteAccountController,
  checkUsernameExistsController,
  getRolesController,
  listBackupsController,
  backupDatabaseController,
  restoreDatabaseController
} from "../controllers/settings.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

const adminOnly = [
  verifyToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }
    next()
  }
]

const authorizeAccountAccess = (req, res, next) => {
  const { id: userId, role: userRole } = req.user || {}
  const targetId = Number(req.params.id)
  if (userRole === "admin" || userId === targetId) {
    return next()
  }
  return res.status(403).json({ message: "Access denied" })
}

router.get(
  "/check-username",
  checkUsernameExistsController
)

router.get(
  "/roles",
  getRolesController
)

router.get(
  "/",
  adminOnly,
  getAllAccountsController
)
router.post(
  "/",
  adminOnly,
  createAccountController
)

router.get(
  "/backups",
  adminOnly,
  listBackupsController
)
router.post(
  "/backup",
  adminOnly,
  backupDatabaseController
)
router.post(
  "/restore",
  adminOnly,
  restoreDatabaseController
)

router.get(
  "/:id",
  verifyToken,
  authorizeAccountAccess,
  getAccountByIdController
)
router.put(
  "/:id",
  verifyToken,
  authorizeAccountAccess,
  updateAccountController
)

router.delete(
  "/:id",
  adminOnly,
  deleteAccountController
)

export default router
