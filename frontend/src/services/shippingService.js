import api from "./api"; // Pastikan path ini benar sesuai file api.js Anda

// 1. Service Cari Lokasi (Autocomplete)
export const searchLocationApi = async (query) => {
    try {
        const response = await api.get("/shipping/search", {
            params: { query }
        });

        const rawData = response.data.data || [];

        return rawData.map(item => ({
            id: item.id || item.subdistrict_id || item.city_id || item.district_id,
            label: item.label || `${item.subdistrict_name || item.city_name}, ${item.province_name || item.province || ''}`,
            type: item.type || "Lokasi"
        }));

    } catch (error) {
        console.error("Gagal mencari lokasi: ", error);
        return [];
    }
};

// 2. Service Cek Ongkir (DIPERBAIKI)
export const checkOngkirApi = async (destinationId, weight, courier) => {
    try {
        if (!destinationId) return [];

        const payload = {
            destination: destinationId,
            weight: parseInt(weight),
            courier: courier
        };

        const response = await api.post("/shipping/cost", payload);
        const responseData = response.data?.data;

        // --- LOGIKA BARU YANG LEBIH PINTAR ---
        if (Array.isArray(responseData) && responseData.length > 0) {

            // Cek Item Pertama
            const firstItem = responseData[0];

            // KASUS A: Struktur Bersarang (Standar RajaOngkir)
            // [ { code: "jne", costs: [...] } ]
            if (firstItem.costs) {
                return firstItem.costs;
            }

            // KASUS B: Struktur Rata/Flat (Kemungkinan API Anda saat ini)
            // [ { service: "REG", cost: [...] }, { service: "YES", ... } ]
            // Jika item pertama punya 'service' atau 'cost', berarti ini sudah daftarnya!
            if (firstItem.service || firstItem.cost) {
                return responseData;
            }
        }

        return [];
    } catch (error) {
        console.error("Gagal cek ongkir: ", error);
        return [];
    }
};