import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Setup Axios Client
const rajaOngkirClient = axios.create({
    baseURL: "https://rajaongkir.komerce.id/api/v1",
    timeout: 15000
});

// Interceptor: Inject API Key & Atur Header
rajaOngkirClient.interceptors.request.use((config) => {
    config.headers.key = process.env.RAJAONGKIR_API_KEY;
    // PENTING: Kita ubah header agar server tahu ini Form Data
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    return config;
});

export const searchDestinationService = async (query) => {
    try {
        // Untuk GET request tidak perlu diubah ke form data
        const response = await rajaOngkirClient.get("/destination/domestic-destination", {
            params: { search: query, limit: 20 }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const getAllCitiesService = async () => {
    try {
        const response = await rajaOngkirClient.get("/destination/domestic-destination?limit=500&type=city");
        // Note: Endpoint ini mungkin berbeda tergantung Komerce/RajaOngkir. 
        // Jika endpoint domestic-destination search city tidak support all, gunakan endpoint native RajaOngkir:
        // const response = await rajaOngkirClient.get("/city"); // Endpoint standar RajaOngkir

        // Asumsi pakai endpoint standar RajaOngkir /city untuk list kota
        // Jika error, sesuaikan dengan endpoint Komerce yang mengembalikan list kota.
        return response.data.data || response.data.rajaongkir.results;
    } catch (error) {
        return [];
    }
};

export const findCityIdByName = async (cityName) => {
    try {
        // Karena kita tidak tahu ID kotanya, kita cari via search endpoint yang Anda punya
        // Atau ambil semua kota dan filter
        const response = await rajaOngkirClient.get("/destination/domestic-destination", {
            params: { search: cityName, limit: 10 } // Cari kota berdasarkan nama
        });

        // Filter hasil yang tipenya 'city' atau 'Kabupaten/Kota'
        // Ambil ID-nya. Bisa jadi ada banyak (Kab. Bandung, Kota Bandung), kita return array
        return response.data.data.filter(c => c.city_name.toUpperCase().includes(cityName.toUpperCase()));
    } catch (error) {
        return [];
    }
};

export const getDistrictsByCityService = async (cityId) => {
    try {
        const response = await rajaOngkirClient.get(`/destination/district/${cityId}`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal ambil kecamatan:", error.message);
        return [];
    }
};

export const calculateCostService = async (origin, destination, weight, courier) => {
    try {
        // Konversi tipe data
        const cleanOrigin = parseInt(origin);
        const cleanDest = parseInt(destination);
        const cleanWeight = parseInt(weight);

        // --- UBAH FORMAT KE URL SEARCH PARAMS (FORM DATA) ---
        // Ini kuncinya! Jangan kirim object JSON mentah.
        const params = new URLSearchParams();
        params.append("origin", cleanOrigin);
        params.append("originType", "city")
        params.append("destination", cleanDest);
        params.append("destinationType", "subdistrict")
        params.append("weight", cleanWeight);
        params.append("courier", courier.toLowerCase());

        console.log("=== DEBUG ONGKIR ===");
        console.log(`Origin: ${cleanOrigin} (Type: city)`);
        console.log(`Destination: ${cleanDest} (Type: subdistrict)`);

        console.log("=== SENDING FORM DATA ===", params.toString());

        // Axios akan otomatis mengirim ini sebagai application/x-www-form-urlencoded
        const response = await rajaOngkirClient.post("/calculate/domestic-cost", params);

        return response.data.data;

    } catch (error) {
        console.error("SERVICE ERROR:", error.response?.data || error.message);
        throw error;
    }
};