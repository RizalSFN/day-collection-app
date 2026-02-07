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
        const payload = {
            origin: parseInt(origin),        // Pastikan Integer
            destination: parseInt(destination), // Pastikan Integer
            weight: parseInt(weight),        // Pastikan Integer (Gram)
            courier: courier.toLowerCase()   // jne, pos, tiki, sicepat
        };

        const response = await rajaOngkirClient.post("/calculate/domestic-cost", payload);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};