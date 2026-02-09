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
        const payload = {
            destination: destinationId,
            weight: parseInt(weight),
            courier: courier
        };

        console.log("DEBUG REQUEST:", payload); // Cek di Console Browser

        const response = await api.post("/shipping/cost", payload);

        console.log("DEBUG RESPONSE:", response.data); // Cek hasil asli dari Backend

        // Struktur RajaOngkir biasanya: response.data.data[0].costs
        // Tapi kita harus fleksibel ceknya
        const rajaOngkirData = response.data?.data;

        if (Array.isArray(rajaOngkirData) && rajaOngkirData.length > 0) {
            // Jika akun Pro (biasanya return array kurir)
            return rajaOngkirData[0].costs || [];
        } else if (rajaOngkirData?.costs) {
            // Jika struktur langsung costs
            return rajaOngkirData.costs;
        }

        return [];
    } catch (error) {
        console.error("DEBUG ERROR SERVICE:", error);
        return [];
    }
};