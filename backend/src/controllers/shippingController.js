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
        // Kita terima district_name (nama kecamatan) dari frontend
        const { destination, weight, courier, district_name } = req.body;

        if (!destination || !weight || !courier) {
            return res.status(400).json({ msg: "Data tidak lengkap" });
        }

        const originCityId = process.env.STORE_CITY_ID; // 55 (Bandung)
        let finalDestinationId = destination; // Default: Pakai ID dari frontend (5146)

        // --- LOGIKA AUTO-CORRECT ID ---
        if (district_name) {
            console.log(`Mencari ID Kecamatan untuk: ${district_name} di Kota ID: ${originCityId}`);

            // 1. Ambil semua kecamatan di Kota Bandung (55)
            const districts = await getDistrictsByCityService(originCityId);

            // 2. Cari yang namanya COCOK (Misal: "MARGAHAYU")
            const foundDistrict = districts.find(
                d => d.name.toUpperCase() === district_name.toUpperCase()
            );

            // 3. Jika ketemu, GANTI ID tujuan menjadi ID Kecamatan (474)
            if (foundDistrict) {
                console.log(`✅ MATCH FOUND! Mengganti ID ${destination} -> ${foundDistrict.id} (${foundDistrict.name})`);
                finalDestinationId = foundDistrict.id;
            } else {
                console.log("❌ Tidak ditemukan kecocokan kecamatan lokal.");
            }
        }
        // ------------------------------

        const data = await calculateCostService(originCityId, finalDestinationId, weight, courier);

        res.status(200).json({
            status: "success",
            data: data
        });

    } catch (error) {
        // ... (error handling sama)
        console.error(error);
        res.status(500).json({ msg: "Gagal cek ongkir" });
    }
};