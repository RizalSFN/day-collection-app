import api from "./api"; // Pastikan path ini benar

// 1. Service Cari Lokasi (Autocomplete)
export const searchLocationApi = async (query) => {
    try {
        const response = await api.get("/shipping/search", {
            params: { query }
        });

        const rawData = response.data.data || [];

        return rawData.map(item => ({
            // --- PERBAIKAN FATAL DI SINI ---
            // Urutan Prioritas Pengambilan ID:
            // 1. subdistrict_id (Ini biasanya ID Kecamatan yang valid untuk RajaOngkir Pro/Starter)
            // 2. district_id (Nama lain dari kecamatan di beberapa response)
            // 3. city_id (Jika user memilih Kota)
            // 4. id (Fallback terakhir - biasanya ID Desa yang bikin error)

            id: item.subdistrict_id || item.district_id || item.city_id || item.id,

            // Kita simpan juga nama lengkapnya
            label: item.label || `${item.subdistrict_name || item.name}, ${item.city_name}, ${item.province_name}`,

            type: item.type || "Lokasi"
        }));

    } catch (error) {
        console.error("Gagal mencari lokasi: ", error);
        return [];
    }
};

// 2. Service Cek Ongkir
export const checkOngkirApi = async (destinationId, weight, courier, districtName, cityName) => {
    try {
        if (!destinationId) return [];

        const payload = {
            destination: destinationId,
            weight: parseInt(weight),
            courier: courier,

            // TAMBAHAN: Kirim Nama Kecamatan buat bantu backend mapping ID
            district_name: districtName,
            city_name: cityName
        };

        const response = await api.post("/shipping/cost", payload);

        // ... (sisanya sama)
        const responseData = response.data?.data;
        if (Array.isArray(responseData) && responseData.length > 0) {
            const firstItem = responseData[0];
            if (firstItem.costs) return firstItem.costs;
            if (firstItem.service || firstItem.cost) return responseData;
        }
        return [];
    } catch (error) {
        console.error("Gagal cek ongkir: ", error);
        return [];
    }
};