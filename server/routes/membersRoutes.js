import express from "express"
import {
  getDurations,
  getAllMembers,
  createMember,
  updateMember
} from "../controllers/membersController.js"

const router = express.Router()

router.get("/durations", getDurations)
router.get("/", getAllMembers)
router.post("/", createMember)
router.put("/:id", updateMember)

export default router