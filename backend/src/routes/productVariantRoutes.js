import express from "express";
import {
    createVariant,
    getVariantByProduct,
    updateVariant,
    deleteVariant
} from "../controllers/productVariantController.js";

const productVariantRoutes = express.Router()

productVariantRoutes.post("/", createVariant)
productVariantRoutes.get("/product/:productId", getVariantByProduct)
productVariantRoutes.put("/:id", updateVariant)
productVariantRoutes.delete("/:id", deleteVariant)

export default productVariantRoutes