import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { errorHandler } from "./middlewares/errorMiddleware.js"
import productRoutes from "./routes/productRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { authenticate } from "./middlewares/authMiddleware.js"
import marketplacePlatformRoutes from "./routes/marketplacePlatformRoutes.js"
import marketplaceLinkRoutes from "./routes/marketplaceLinkRoutes.js"
import appSettingRoutes from "./routes/appSettingRoutes.js"
import bannerRoutes from "./routes/bannerRoutes.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/products", authenticate, productRoutes)
app.use("/api/marketplace-platform", authenticate, marketplacePlatformRoutes)
app.use("/api/marketplace-link", authenticate, marketplaceLinkRoutes)
app.use("/api/app-setting", authenticate, appSettingRoutes)
app.use("/api/banner", authenticate, bannerRoutes)

app.get("/", (req, res) => {
    res.send("E-Commerce API is running...")
})

app.use(errorHandler)

export default app