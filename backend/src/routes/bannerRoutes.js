import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
    createBanner,
    getAllBanner,
    updateBanner
} from "../controllers/bannerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const bannerRoutes = express.Router()

bannerRoutes.get("/", getAllBanner)

bannerRoutes.post("/", authenticate, upload.single("image_url"), createBanner)
bannerRoutes.put("/:id", authenticate, upload.single("image_url"), updateBanner)

export default bannerRoutes