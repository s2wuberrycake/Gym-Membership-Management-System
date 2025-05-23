import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import cron from "node-cron"

import authRouter from "./routes/authorize.js"
import membersRouter from "./routes/members.js"
import archiveRouter from "./routes/archive.js"
import settingsRouter from "./routes/settings.js"
import analyticsRouter from "./routes/analytics.js"
import logsRouter from "./routes/logs.js"
import { errorHandler } from "./middleware/error.js"
import { expireMembers } from "./services/members.js"
import { backupDatabase } from "./services/backup.js"

dotenv.config()
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Uploads & backups
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"))
)
app.use(
  "/backups",
  express.static(path.resolve(process.cwd(), "server/backups"))
)

// Routes
app.use("/auth", authRouter)
app.use("/api/members", membersRouter)
app.use("/api/archive", archiveRouter)
app.use("/api/settings", settingsRouter)
app.use("/api/analytics", analyticsRouter)
app.use("/api/logs", logsRouter)

// Expiration checks
const SYSTEM_ACCOUNT_ID = Number(process.env.SYSTEM_ACCOUNT_ID ?? 0)

expireMembers(SYSTEM_ACCOUNT_ID)
  .then(() => console.log("DEBUG >> Initial expiration check complete"))
  .catch(console.error)

cron.schedule(
  "1 0 * * *",
  () => expireMembers(SYSTEM_ACCOUNT_ID)
    .then(() => console.log("DEBUG >> Daily expiration check complete"))
    .catch(console.error),
  { timezone: "Asia/Manila" }
).start()

// Weekly backup
cron.schedule(
  "0 15 * * 0",
  async () => {
    try {
      const { filename } = await backupDatabase({ prefix: "automatic-backup" })
      console.log(`DEBUG >> Automatic backup created: ${filename}`)
    } catch (err) {
      console.error("ERROR >> Automatic backup failed", err)
    }
  },
  { timezone: "Asia/Manila" }
).start()

// Global error handling
app.use(errorHandler)

// Start server
const PORT = Number(process.env.PORT ?? 3000)
app.listen(PORT, () => {
  console.log(`DEBUG >> Server listening on port ${PORT}`)
})
