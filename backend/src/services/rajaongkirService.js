import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const API_KEY = process.env.RAJAONGKIR_API_KEY
const BASE_URL = process.env.RAJAONGKIR_BASE_URL

const rajaOngkirClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 15000 // Timeout 15 detik (jaga-jaga server sana lambat)
});

rajaOngkirClient.interceptors.request.use((config) => {
    config.headers.key = process.env.RAJAONGKIR_API_KEY;
    return config;
});

export const searchDestinationService = async (query) => {
    try {
        const response = await rajaOngkirClient.get("/destination/domestic-destination", {
            params: {
                search: query,
                limit: 20 // Batasi hasil pencarian biar tidak terlalu banyak
            }
        });

        // Struktur return Komerce biasanya ada di response.data.data
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const calculateCostService = async (origin, destination, weight, courier) => {
    try {
        // --- LOGGING DATA YANG DITERIMA DARI CONTROLLER ---
        console.log("=== DEBUG SERVICE INPUT ===");
        console.log("Origin:", origin, typeof origin);
        console.log("Dest:", destination, typeof destination);
        console.log("Weight:", weight, typeof weight);
        console.log("Courier:", courier);

        // --- PERBAIKAN: HANDLING DATA ---
        // Kita paksa konversi ke Integer dan pastikan tidak NaN
        const cleanOrigin = parseInt(origin);
        const cleanDest = parseInt(destination);
        const cleanWeight = parseInt(weight);

        // Validasi Terakhir sebelum kirim
        if (isNaN(cleanOrigin) || isNaN(cleanDest) || isNaN(cleanWeight)) {
            throw new Error(`Data Invalid: Origin=${cleanOrigin}, Dest=${cleanDest}, Weight=${cleanWeight}`);
        }

        const payload = {
            origin: cleanOrigin,
            destination: cleanDest,
            weight: cleanWeight,
            courier: courier.toLowerCase()
        };

        console.log("=== PAYLOAD FINAL KE KOMERCE ===", JSON.stringify(payload));

        const response = await rajaOngkirClient.post("/calculate/domestic-cost", payload);
        return response.data.data;

    } catch (error) {
        // Biar errornya kelihatan jelas di log Vercel
        console.error("SERVICE ERROR:", error.response?.data || error.message);
        throw error;
    }
};