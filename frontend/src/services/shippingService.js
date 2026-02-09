import api from "./api"; // Pastikan path ini benar sesuai file api.js Anda

// 1. Service Cari Lokasi (Autocomplete)
export const searchLocationApi = async (query) => {
    try {
        const response = await api.get("/shipping/search", {
            params: { query }
        });

        const rawData = response.data.data || [];

        // --- PERBAIKAN: MAPPING DATA ---
        // Kita ubah data mentah dari API menjadi format standar { id, label }
        // agar komponen LocationSearch bisa membacanya dengan benar.
        return rawData.map(item => ({
            // Ambil ID dari berbagai kemungkinan nama field
            id: item.id || item.subdistrict_id || item.city_id || item.district_id,

            // Gabungkan Label agar informatif (Kecamatan, Kota, Provinsi)
            label: item.label || `${item.subdistrict_name || item.city_name}, ${item.province_name || item.province || ''}`,

            // Simpan data asli untuk referensi jika perlu
            original: item,

            // Tipe lokasi (Kota/Kabupaten/Kecamatan)
            type: item.type || "Kecamatan"
        }));

    } catch (error) {
        console.error("Gagal mencari lokasi: ", error);
        return [];
    }
};

// 2. Service Cek Ongkir
export const checkOngkirApi = async (destinationId, weight, courier) => {
    try {
        // Validasi Pre-Flight (Cegah request jika data kosong)
        if (!destinationId) {
            console.warn("Cek Ongkir dibatalkan: ID Tujuan kosong");
            return [];
        }

        const payload = {
            destination: destinationId,
            weight: parseInt(weight),
            courier: courier
        };

        // Debugging: Lihat apa yang dikirim ke backend
        console.log("Mengirim Cek Ongkir:", payload);

        const response = await api.post("/shipping/cost", payload);

        // Ambil data costs dari hasil pertama
        const results = response.data?.data;
        if (results && Array.isArray(results) && results.length > 0) {
            return results[0].costs || [];
        }

        return [];
    } catch (error) {
        console.error("Gagal cek ongkir (API): ", error.response?.data || error.message);
        throw error;
    }
};