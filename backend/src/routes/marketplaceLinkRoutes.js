import express from "express";
import {
    createMarketplaceLink,
    getAllMarketplaceLink,
    getByIdMarketplaceLink,
    updateMarketplaceLink,
    deleteMarketplaceLink
} from "../controllers/marketplaceLinkController.js";

const marketplaceLinkRoutes = express.Router()

marketplaceLinkRoutes.post("/", createMarketplaceLink)
marketplaceLinkRoutes.get("/", getAllMarketplaceLink)
marketplaceLinkRoutes.get("/:id", getByIdMarketplaceLink)
marketplaceLinkRoutes.put("/:id", updateMarketplaceLink)
marketplaceLinkRoutes.delete("/:id", deleteMarketplaceLink)

export default marketplaceLinkRoutes