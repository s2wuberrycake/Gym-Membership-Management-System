import express from "express"
import {
  getMemberGrowthController,
  getVisitRateController,
  getMemberRatioController
} from "../controllers/analytics.js"
import { downloadAnalyticsReport } from "../controllers/reports.js"

const router = express.Router()

router.get("/member-growth", getMemberGrowthController)
router.get("/analytics-report.xlsx", downloadAnalyticsReport)
router.get("/visit-rate", getVisitRateController)
router.get("/member-ratio", getMemberRatioController)

export default router
