import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js"
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

const productRoutes = express.Router()

productRoutes.get("/", getAllProducts)
productRoutes.get("/:id", getProductById)

productRoutes.post("/", authenticate, upload.single("main_image"), createProduct)
productRoutes.put("/:id", authenticate, upload.single("main_image"), updateProduct)
productRoutes.delete("/:id", authenticate, deleteProduct)

export default productRoutes