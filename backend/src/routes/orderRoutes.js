import express from "express"
import {
    createOrder,
    getOrders,
    getOrderById,
    uploadPaymentProof,
    updateOrderStatus,
    handleTrackOrder
} from "../controllers/orderController.js"
import { upload } from "../middlewares/uploadMiddleware.js"

const orderRoutes = express.Router()

orderRoutes.post("/", createOrder)
orderRoutes.get("/", getOrders)
orderRoutes.get("/track", handleTrackOrder);
orderRoutes.get("/:id", getOrderById)
orderRoutes.put("/:id/status", updateOrderStatus)
orderRoutes.post("/:id/payment-proof", upload.single("payment_proof"), uploadPaymentProof)

export default orderRoutes