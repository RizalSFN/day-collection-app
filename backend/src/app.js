import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { errorHandler } from "./middlewares/errorMiddleware.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use()

app.get("/", (req, res) => {
    res.send("E-Commerce API is running...")
})

app.use(errorHandler)

export default app