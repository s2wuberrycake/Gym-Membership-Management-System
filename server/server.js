// server.js
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import cron from "node-cron"

import authRouter from "./routes/authorize.js"
import membersRouter from "./routes/members.js"
import archiveRouter from "./routes/archive.js"
import settingsRouter from "./routes/settings.js"
import {
  getAllUpdateLogsController,
  logUpdateController,
  getAllVisitLogsController,
  logVisitController
} from "./controllers/logs.js"
import { errorHandler } from "./middleware/error.js"
import { expireMembers } from "./services/members.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

// expose ./uploads/* at /uploads/*
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"))
)

app.use("/auth", authRouter)
app.use("/api/members", membersRouter)
app.use("/api/archive", archiveRouter)
app.use("/api/settings", settingsRouter)

// ── Update‐log endpoints ────────────────────────────────────────────────────
// GET  /api/home       → all update logs
// POST /api/home       → record an update log
app.get("/api/home", getAllUpdateLogsController)
app.post("/api/home", logUpdateController)

// ── Visit‐log endpoints ─────────────────────────────────────────────────────
// GET  /api/visits     → all visit logs (only one per member/day)
// POST /api/visits     → record a visit (if active and not already logged today)
app.get("/api/visits", getAllVisitLogsController)
app.post("/api/visits", logVisitController)

const SYSTEM_ACCOUNT_ID = Number(process.env.SYSTEM_ACCOUNT_ID ?? 0)

// initial expiration check
expireMembers(SYSTEM_ACCOUNT_ID)
  .then(() => console.log("DEBUG >> Initial expiration check complete"))
  .catch(console.error)

// schedule daily expiration check at 00:01 Manila time
cron.schedule(
  "1 0 * * *",
  () => {
    console.log("DEBUG >> Running daily expiration check")
    expireMembers(SYSTEM_ACCOUNT_ID).catch(console.error)
  },
  { timezone: "Asia/Manila" }
)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(
    `DEBUG >> Server listening on port ${process.env.PORT}`
  )
})
