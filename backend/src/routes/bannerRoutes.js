import express from "express";
import {
    createBanner,
    getAllBanner,
    updateBanner
} from "../controllers/bannerController.js";

const bannerRoutes = express.Router()

bannerRoutes.post("/", createBanner)
bannerRoutes.get("/", getAllBanner)
bannerRoutes.put("/:id", updateBanner)

export default bannerRoutes