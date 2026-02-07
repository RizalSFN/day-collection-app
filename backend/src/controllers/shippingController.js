import { searchDestinationService, calculateCostService } from "../services/rajaongkirService.js";

/**
 * CONTROLLER 1: Search Location
 * Digunakan untuk Autocomplete di Frontend
 */
export const searchLocation = async (req, res) => {
    try {
        const { query } = req.query; 

        // Validasi sederhana
        if (!query || query.length < 3) {
            return res.status(400).json({
                msg: "Ketik minimal 3 karakter untuk mencari lokasi"
            });
        }

        const data = await searchDestinationService(query);

        res.status(200).json({
            status: "success",
            data: data
        });

    } catch (error) {
        console.error("Error Search Location:", error.response?.data || error.message);
        res.status(500).json({
            msg: "Gagal mencari lokasi",
            error: error.response?.data?.message || error.message
        });
    }
};

/**
 * CONTROLLER 2: Check Ongkir
 * Digunakan saat tombol 'Cek Ongkir' ditekan
 */
export const checkOngkir = async (req, res) => {
    try {
        const { destination, weight, courier } = req.body;

        // Validasi Input Frontend
        if (!destination || !weight || !courier) {
            return res.status(400).json({
                msg: "Data tujuan, berat, dan kurir wajib diisi"
            });
        }

        // Ambil ID Toko dari .env
        const origin = process.env.STORE_CITY_ID;

        if (!origin) {
            return res.status(500).json({ msg: "Konfigurasi toko (Origin) belum diset di server" });
        }

        const data = await calculateCostService(origin, destination, weight, courier);

        res.status(200).json({
            status: "success",
            data: data
        });

    } catch (error) {
        console.error("Error Check Ongkir:", error.response?.data || error.message);

        // Menangkap pesan error spesifik dari Komerce jika ada
        const errorMsg = error.response?.data?.message || "Gagal menghitung ongkir";

        res.status(500).json({
            msg: errorMsg,
            detail: error.response?.data
        });
    }
};