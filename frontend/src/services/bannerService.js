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

export const getActiveBanner = async () => {
    try {
        const response = await api.get("/banner/active")
        console.log(response);

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
        const formData = new FormData()

        formData.append("title", data.title)
        formData.append("is_active", data.is_active)

        if (data.image_url && data.image_url.length > 0) {
            formData.append("image_url", data.image_url[0])
        }

        const response = await api.put(`/banner/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.error("Gagal mengupdate data banner: ", error);
        return []
    }
}