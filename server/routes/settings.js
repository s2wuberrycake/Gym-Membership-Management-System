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

const router = express.Router()

router.get("/", getAllAccountsController)
router.get("/check-username", checkUsernameExistsController)
router.get("/roles", getRolesController)
router.get("/:id", getAccountByIdController)
router.post("/", createAccountController)
router.put("/:id", updateAccountController)
router.delete("/:id", deleteAccountController)

export default router