import { getToken } from "../utils/storage";
import api from "./api";

export const getMarketplacePlatform = async () => {
    try {
        const response = await api.get("/marketplace-platform")
        return response.data.data
    } catch (error) {
        console.log("Gagal memuat data marketplace platform: ", error);
        return []
    }
}

export const createMarketplacePlatform = async (payload) => {
    try {
        const token = getToken()
        console.log(token);
        const response = await api.post("/marketplace-platform", payload, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data
    } catch (error) {
        console.log("Gagal membuat data marketplace platform: ", error);
        return []
    }
}