import express from "express"
import {
  getDurations,
  getAllMembers,
  createMember,
  updateMember,
  getMemberById,
  extendMembership
} from "../controllers/membersController.js"

const router = express.Router()

router.get("/durations", getDurations)
router.get("/", getAllMembers)
router.post("/", createMember)
router.put("/:id", updateMember)
router.put("/:id/extend", extendMembership)
router.get("/:id", getMemberById)

export default router