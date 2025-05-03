import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./routes/authRoutes.js"
import membersRouter from "./routes/membersRoutes.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/api/members", membersRouter)

app.listen(process.env.PORT, () => {
  console.log(`やったー!! サーバーはポート ${process.env.PORT} に正常に接続しました`)
})
