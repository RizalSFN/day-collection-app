import express from "express";
import {
    createMarketplaceLink,
    getAllMarketplaceLink,
    getByIdMarketplaceLink,
    updateMarketplaceLink,
    deleteMarketplaceLink
} from "../controllers/marketplaceLinkController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const marketplaceLinkRoutes = express.Router()

marketplaceLinkRoutes.get("/", getAllMarketplaceLink)
marketplaceLinkRoutes.get("/:id", getByIdMarketplaceLink)

marketplaceLinkRoutes.post("/", authenticate, createMarketplaceLink)
marketplaceLinkRoutes.put("/:id", authenticate, updateMarketplaceLink)
marketplaceLinkRoutes.delete("/:id", authenticate, deleteMarketplaceLink)

export default marketplaceLinkRoutes