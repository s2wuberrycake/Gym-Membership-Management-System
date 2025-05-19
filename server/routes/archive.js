import express from "express"
import { extractUser } from "../middleware/user.js"
import {
  getCancelledMembersController,
  getCancelledMemberByIdController,
  restoreCancelledMemberController
} from "../controllers/archive.js"

const router = express.Router()

router.use(extractUser)

router.get(
  "/",
  getCancelledMembersController
)

router.get(
  "/:id",
  getCancelledMemberByIdController
)

router.put(
  "/:id/restore",
  restoreCancelledMemberController
)

export default router
