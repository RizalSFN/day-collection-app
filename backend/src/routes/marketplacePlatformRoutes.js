import express from "express";
import {
    createMarketplacePlatform,
    getAllMarketplacePlatform,
    getByIdMarketplacePlatform,
    updateMarketplacePlatform,
    deleteMarketplacePlatform
} from "../controllers/marketplacePlatformController.js";

const marketplacePlatformRoutes = express.Router()

marketplacePlatformRoutes.post("/", createMarketplacePlatform)
marketplacePlatformRoutes.get("/", getAllMarketplacePlatform)
marketplacePlatformRoutes.get("/:id", getByIdMarketplacePlatform)
marketplacePlatformRoutes.put("/:id", updateMarketplacePlatform)
marketplacePlatformRoutes.delete("/:id", deleteMarketplacePlatform)

export default marketplacePlatformRoutes