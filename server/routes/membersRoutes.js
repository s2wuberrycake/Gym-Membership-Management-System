import express from "express"
import {
  getDurations,
  getAllMembers,
  createMember,
  updateMember,
  getMemberById
} from "../controllers/membersController.js"

const router = express.Router()

router.get("/durations", getDurations)
router.get("/", getAllMembers)
router.post("/", createMember)
router.put("/:id", updateMember)
router.get("/:id", getMemberById)

export default router
