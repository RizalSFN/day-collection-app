import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
    createBanner,
    getAllBanner,
    updateBanner
} from "../controllers/bannerController.js";

const bannerRoutes = express.Router()

bannerRoutes.post("/", upload.single("image_url"), createBanner)
bannerRoutes.get("/", getAllBanner)
bannerRoutes.put("/:id", upload.single("image_url"), updateBanner)

export default bannerRoutes