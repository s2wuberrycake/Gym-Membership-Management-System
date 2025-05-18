import express from "express"
import { getMemberGrowthController } from "../controllers/analytics.js"

const router = express.Router()

router.get("/member-growth", getMemberGrowthController)

export default router
