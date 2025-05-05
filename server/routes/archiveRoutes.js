import express from "express"
import { getCancelledMembers, restoreCancelledMember, getCancelledMemberById } from "../controllers/archiveController.js"

const router = express.Router()

router.get("/", getCancelledMembers)
router.get("/:id", getCancelledMemberById)
router.post("/restore/:id", restoreCancelledMember)

export default router
