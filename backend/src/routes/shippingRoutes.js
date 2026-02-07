import express from "express"
import { searchLocation, checkOngkir } from "../controllers/shippingController.js"

const shippingRoutes = express.Router()

shippingRoutes.get("/search", searchLocation)
shippingRoutes.post("/cost", checkOngkir)

export default shippingRoutes