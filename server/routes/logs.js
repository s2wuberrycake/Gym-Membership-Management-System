import express from "express"
import { getAllUpdateLogsController } from "../controllers/logs.js"

const router = express.Router()

router.get("/", getAllUpdateLogsController)

export default router
