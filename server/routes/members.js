import express from "express"
import { extractUser } from "../middleware/user.js"
import { upload } from "../middleware/upload.js"
import {
  getDurationsController,
  getAllMembersController,
  getMemberByIdController,
  createMemberController,
  updateMemberController,
  extendMembershipController,
  cancelMemberController
} from "../controllers/members.js"

const router = express.Router()

// peel off req.user from the JWT (if present)
router.use(extractUser)

// read-only endpoints
router.get("/durations", getDurationsController)
router.get("/",           getAllMembersController)
router.get("/:id",        getMemberByIdController)

// create & update with optional photo upload
router.post("/",           upload.single("photo"), createMemberController)
router.put("/:id",         upload.single("photo"), updateMemberController)

// membership extension and cancellation
router.put("/:id/extend",  extendMembershipController)
router.delete("/:id/cancel", cancelMemberController)

export default router
