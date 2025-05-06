import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./routes/authorizeRoutes.js"
import membersRouter from "./routes/membersRoutes.js"
import archiveRouter from "./routes/archiveRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/api/members", membersRouter)
app.use("/api/archive", archiveRouter)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`DEBUG >> Successfully connected at PORT ${process.env.PORT}!!`)
})