import express from "express"
import {
  getAllUpdateLogsController,
  logUpdateController,
  getAllVisitLogsController,
  logVisitController
} from "../controllers/logs.js"

const router = express.Router()

router.get("/updates", getAllUpdateLogsController)
router.post("/updates", logUpdateController)

router.get("/visits", getAllVisitLogsController)
router.post("/visits", logVisitController)

export default router
