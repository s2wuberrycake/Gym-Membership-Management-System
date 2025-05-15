// server/routes/logs.js
import express from "express"
import { getAllUpdateLogsController } from "../controllers/logs.js"

const router = express.Router()

// GET /api/home
router.get("/", getAllUpdateLogsController)

export default router
