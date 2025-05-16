import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import cron from "node-cron"

import authRouter from "./routes/authorize.js"
import membersRouter from "./routes/members.js"
import archiveRouter from "./routes/archive.js"
import settingsRouter from "./routes/settings.js"
import logsRouter from "./routes/logs.js"
import { errorHandler } from "./middleware/error.js"
import { expireMembers } from "./services/members.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

// expose ./uploads/* at /uploads/*
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")))

app.use("/auth",         authRouter)
app.use("/api/members",  membersRouter)
app.use("/api/archive",  archiveRouter)
app.use("/api/settings", settingsRouter)
app.use("/api/home",     logsRouter)

const SYSTEM_ACCOUNT_ID = Number(process.env.SYSTEM_ACCOUNT_ID ?? 0)

// run one expiration check on startup
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
  console.log(`DEBUG >> Server listening on port ${process.env.PORT}`)
})
