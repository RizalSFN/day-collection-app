import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
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
productGalleryRoutes.post("/", upload.single("image"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File image is required" });
        }

        await createProductGallery(req, res);
    } catch (error) {
        next(error);
    }
})
productGalleryRoutes.put("/:id", upload.single("image"), updateProductGallery)
productGalleryRoutes.delete("/:id", deleteProductGallery)

export default productGalleryRoutes