import express from "express"
import {
  getDurations,
  getAllMembers,
  createMember,
  updateMember,
  getMemberById,
  extendMembership,
  cancelMemberById
} from "../controllers/membersController.js"


const router = express.Router()

router.get("/durations", getDurations)
router.get("/", getAllMembers)
router.post("/", createMember)
router.get("/:id", getMemberById)
router.put("/:id/extend", extendMembership)
router.put("/:id", updateMember)
router.delete("/:id/cancel", cancelMemberById)


export default router