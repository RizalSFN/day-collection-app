import { getToken } from "../utils/storage.js";
import api from "./api.js";

export const getBanner = async () => {
    try {
        const response = await api.get("/banner")
        return response.data.data
    } catch (error) {
        console.error("Gagal memuat data banner: ", error);
        return []
    }
}

export const createBanner = async (payload) => {
    try {
        const token = getToken()
        const response = await api.post("/banner", payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.error("Gagal menambah data banner: ", error);
        return []
    }
}

export const updateBanner = async (id, data) => {
    try {
        const token = getToken()
        const response = await api.put(`/banner/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.error("Gagal mengupdate data banner: ", error);
        return []
    }
}