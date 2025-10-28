import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { errorHandler } from "./middlewares/errorMiddleware.js"
import productRoutes from "./routes/productRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { authenticate } from "./middlewares/authMiddleware.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", productRoutes)
app.use("/api/auth", authenticate, authRoutes)

app.get("/", (req, res) => {
    res.send("E-Commerce API is running...")
})

app.use(errorHandler)

export default app