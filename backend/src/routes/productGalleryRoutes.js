import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
    getAllProductGalleries,
    getProductGalleryById,
    createProductGallery,
    updateProductGallery,
    deleteProductGallery
} from "../controllers/productGalleryController.js";

const productGalleryRoutes = express.Router()

productGalleryRoutes.get("/", getAllProductGalleries)
productGalleryRoutes.get("/:id", getProductGalleryById)
productGalleryRoutes.post("/", upload.single("image"), createProductGallery)
productGalleryRoutes.put("/:id", upload.single("image"), updateProductGallery)
productGalleryRoutes.delete("/:id", updateProductGallery)

export default productGalleryRoutes