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
        const response = await api.post("/marketplace-platform", payload, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data
    } catch (error) {
        console.log("Gagal membuat data marketplace platform: ", error);
        return []
    }
}

export const updateMarketplacePlatform = async (id, data) => {
    try {
        const token = getToken()
        const response = await api.put(`/marketplace-platform/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.log("Gagal mengubah data marketplace platform", error);
        return []
    }
}

export const deleteMarketplacePlatform = async (id) => {
    try {
        const token = getToken()
        await api.delete(`/marketplace-platform/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return true
    } catch (error) {
        console.log("Gagal menghapus data marketplace platform", error);
        return []
    }
}