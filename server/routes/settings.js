// server/routes/settings.js
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

// Public account routes
router.get("/", getAllAccountsController)
router.get("/check-username", checkUsernameExistsController)
router.get("/roles", getRolesController)
router.post("/", createAccountController)
router.put("/:id", updateAccountController)
router.delete("/:id", deleteAccountController)

// Admin-only backup/restore routes (must come before :id)
const adminOnly = [
  verifyToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }
    next()
  }
]

// List available backups
router.get("/backups", adminOnly, listBackupsController)
// Download a fresh backup
router.post("/backup", adminOnly, backupDatabaseController)
// Restore from a chosen backup
router.post("/restore", adminOnly, restoreDatabaseController)

// Parameterized account route (should come after specific routes)
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

export default router
