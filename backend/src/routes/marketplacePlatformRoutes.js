import express from "express";
import {
    createMarketplacePlatform,
    getAllMarketplacePlatform,
    getByIdMarketplacePlatform,
    updateMarketplacePlatform,
    deleteMarketplacePlatform
} from "../controllers/marketplacePlatformController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const marketplacePlatformRoutes = express.Router()

marketplacePlatformRoutes.get("/", getAllMarketplacePlatform)
marketplacePlatformRoutes.get("/:id", getByIdMarketplacePlatform)

marketplacePlatformRoutes.post("/", authenticate, createMarketplacePlatform)
marketplacePlatformRoutes.put("/:id", authenticate, updateMarketplacePlatform)
marketplacePlatformRoutes.delete("/:id", authenticate, deleteMarketplacePlatform)

export default marketplacePlatformRoutes