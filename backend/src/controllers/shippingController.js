import { searchDestinationService, calculateCostService, findCityIdByName, getDistrictsByCityService } from "../services/rajaongkirService.js";

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

        // --- RESOLVER ID KECAMATAN GLOBAL ---
        if (city_name && district_name) {
            console.log(`🔍 Resolving ID untuk: Kec. ${district_name}, Kota/Kab ${city_name}`);

            // 1. Cari ID Kota-nya dulu (Bisa return array: Kota Bandung & Kab Bandung)
            // Kita search ke API berdasarkan nama kota
            const potentialCities = await findCityIdByName(city_name);

            let found = false;

            // 2. Loop setiap kemungkinan Kota
            for (const city of potentialCities) {
                if (found) break;

                // Ambil ID Kota (hati-hati fieldnya, sesuaikan dengan response search API Anda)
                // Dari response search Anda sebelumnya: id adalah ID Desa, tapi ada field `city_id`?
                // Jika search endpoint tidak return city_id, kita pakai endpoint khusus /city RajaOngkir.

                // Mari asumsikan search destination mengembalikan object yang ada ID-nya jika search query-nya spesifik nama kota.
                // Jika sulit, kita gunakan trik: Search "Nama Kecamatan, Nama Kota"

                // CARA ALTERNATIF YANG LEBIH PASTI:
                // Kita gunakan ID Kota dari `potentialCities`. 
                // Karena struktur response search Komerce agak unik (id = desa), 
                // kita harus mencari "parent" id.

                // Mari kita coba search district langsung di ID yang mungkin adalah ID Kota
                // Kita ambil `city_id` dari hasil search jika ada, atau `id` jika type-nya city.
                const cityIdToCheck = city.city_id || city.id;

                if (!cityIdToCheck) continue;

                // 3. Ambil daftar kecamatan di kota tersebut
                const districts = await getDistrictsByCityService(cityIdToCheck);

                // 4. Cari nama kecamatan yang cocok
                const targetDistrict = districts.find(d => d.name.toUpperCase() === district_name.toUpperCase());

                if (targetDistrict) {
                    console.log(`✅ FOUND! ID Kecamatan Asli: ${targetDistrict.id} (di Kota ID: ${cityIdToCheck})`);
                    finalDestinationId = targetDistrict.id; // KETEMU! ID 474
                    found = true;
                }
            }
        }
        // ------------------------------------

        console.log(`🚀 Cek Ongkir: Origin ${originCityId} -> Dest ${finalDestinationId}`);

        const data = await calculateCostService(originCityId, finalDestinationId, weight, courier);

        res.status(200).json({ status: "success", data: data });

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