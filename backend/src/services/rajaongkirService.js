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
        params.append("destination", cleanDest);
        params.append("weight", cleanWeight);
        params.append("courier", courier.toLowerCase());

        console.log("=== SENDING FORM DATA ===", params.toString());

        // Axios akan otomatis mengirim ini sebagai application/x-www-form-urlencoded
        const response = await rajaOngkirClient.post("/calculate/domestic-cost", params);

        return response.data.data;

    } catch (error) {
        console.error("SERVICE ERROR:", error.response?.data || error.message);
        throw error;
    }
};