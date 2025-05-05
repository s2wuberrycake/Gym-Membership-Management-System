import express from "express"
import { getCancelledMembers } from "../controllers/archiveController.js"

const router = express.Router()

router.get("/", getCancelledMembers)

export default router
