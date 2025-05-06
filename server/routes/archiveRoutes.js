import express from "express"
import {
  getCancelledMembersController,
  restoreCancelledMemberController,
  getCancelledMemberByIdController
} from "../controllers/archiveController.js"

const router = express.Router()

router.get("/", getCancelledMembersController)
router.get("/:id", getCancelledMemberByIdController)
router.post("/restore/:id", restoreCancelledMemberController)

export default router