import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cron from "node-cron"

import authRouter from "./routes/authorize.js"
import membersRouter from "./routes/members.js"
import archiveRouter from "./routes/archive.js"
import settingsRouter from "./routes/settings.js"
import { errorHandler } from "./middleware/error.js"
import { expireMembers } from "./services/members.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/api/members", membersRouter)
app.use("/api/archive", archiveRouter)
app.use("/api/settings", settingsRouter)

app.use(errorHandler)

expireMembers()
  .then(() => console.log("DEBUG >> Initial expiration check complete"))
  .catch(console.error)

cron.schedule(
  "1 0 * * *",
  () => {
    console.log("DEBUG >> Running daily expiration check")
    expireMembers().catch(console.error)
  },
  { timezone: "Asia/Manila" }
)

app.listen(process.env.PORT, () => {
  console.log(`DEBUG >> Server listening on port ${process.env.PORT}`)
})
