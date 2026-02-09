import api from "./api.js";

export const searchLocationApi = async (query) => {
    try {
        const response = await api.get("/shipping/search", {
            params: { query }
        });
        // Sesuai backend kita: return response.data.data (array lokasi)
        return response.data.data;
    } catch (error) {
        console.error("Gagal mencari lokasi: ", error);
        return [];
    }
}

export const checkOngkirApi = async (destinationId, weight, courier) => {
    try {
        const payload = {
            destination: destinationId,
            weight: parseInt(weight),
            courier: courier
        };

        const response = await api.post("/shipping/cost", payload);

        // --- PERBAIKAN DI SINI ---
        // Cek apakah data ada dan array-nya tidak kosong
        const results = response.data?.data;

        if (results && Array.isArray(results) && results.length > 0) {
            // Ambil costs dari hasil pertama (JNE/Pos/dll)
            return results[0].costs || [];
        }

        return []; // Selalu return array kosong jika data tidak ada

    } catch (error) {
        console.error("Gagal cek ongkir: ", error);
        return []; // Return array kosong saat error, JANGAN throw error agar UI tidak crash
    }
};