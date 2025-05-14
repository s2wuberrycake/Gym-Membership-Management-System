import express from "express"
import {
  getDurationsController,
  getAllMembersController,
  createMemberController,
  updateMemberController,
  getMemberByIdController,
  extendMembershipController,
  cancelMemberController
} from "../controllers/members.js"

const router = express.Router()

router.get("/durations", getDurationsController)
router.get("/", getAllMembersController)
router.post("/", createMemberController)
router.get("/:id", getMemberByIdController)
router.put("/:id/extend", extendMembershipController)
router.put("/:id", updateMemberController)
router.delete("/:id/cancel", cancelMemberController)

export default router