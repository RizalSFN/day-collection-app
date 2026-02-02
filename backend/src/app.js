import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { errorHandler } from "./middlewares/errorMiddleware.js"
import productRoutes from "./routes/productRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import marketplacePlatformRoutes from "./routes/marketplacePlatformRoutes.js"
import marketplaceLinkRoutes from "./routes/marketplaceLinkRoutes.js"
import appSettingRoutes from "./routes/appSettingRoutes.js"
import bannerRoutes from "./routes/bannerRoutes.js"
import productGalleryRoutes from "./routes/productGalleryRoutes.js"
import rateLimit from "express-rate-limit"
import orderRoutes from "./routes/orderRoutes.js"
import productVariantRoutes from "./routes/productVariantRoutes.js"

dotenv.config()
const app = express()

app.use(cors())

app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use("/api", seedRoutes);

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/marketplace-platform", marketplacePlatformRoutes)
app.use("/api/marketplace-link", marketplaceLinkRoutes)
app.use("/api/app-setting", appSettingRoutes)
app.use("/api/banner", bannerRoutes)
app.use("/api/product-gallery", productGalleryRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/product-variant", productVariantRoutes)

app.get("/health", (req, res) => {
    res.json({ status: "OK", time: new Date() });
});

app.get("/", (req, res) => res.send("Express on Vercel"));

app.use(errorHandler)

export default app