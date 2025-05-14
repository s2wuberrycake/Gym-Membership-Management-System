import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./routes/authorize.js"
import membersRouter from "./routes/members.js"
import archiveRouter from "./routes/archive.js"
import settingsRouter from "./routes/settings.js"
import { errorHandler } from "./middleware/error.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/api/members", membersRouter)
app.use("/api/archive", archiveRouter)
app.use("/api/settings", settingsRouter)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`DEBUG >> Successfully connected at PORT ${process.env.PORT}!!`)
})