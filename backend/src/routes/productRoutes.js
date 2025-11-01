import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

const productRoutes = express.Router()

productRoutes.post("/", upload.single("main_image"), createProduct)
productRoutes.get("/", getAllProducts)
productRoutes.get("/:id", getProductById)
productRoutes.put("/:id", upload.single("main_image"), updateProduct)
productRoutes.delete("/:id", deleteProduct)

export default productRoutes