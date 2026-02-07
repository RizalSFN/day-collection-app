import express from "express"
import { searchLocation, checkOngkir } from "../controllers/shippingController.js"

const shippingRoutes = express.Router()

shippingRoutes.get("/cek-server", (req, res) => {
    res.json({
        status: "Server Vercel Hidup!",
        env_check: {
            // Kita cek apakah ENV terbaca
            store_city_id: process.env.STORE_CITY_ID || "TIDAK TERBACA (UNDEFINED)",
            api_key: process.env.RAJAONGKIR_API_KEY ? "ADA (Disensor)" : "TIDAK ADA",
            base_url: process.env.RAJAONGKIR_BASE_URL || "TIDAK TERBACA"
        }
    });
});

shippingRoutes.post("/cek-body", (req, res) => {
    res.json({
        pesan: "Mengecek apakah JSON Body masuk",
        body_diterima: req.body // Ini akan menampilkan apa yang Anda kirim dari Postman
    });
});

shippingRoutes.get("/search", searchLocation)
shippingRoutes.post("/cost", checkOngkir)

export default shippingRoutes