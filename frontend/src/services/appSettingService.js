import { getToken } from "../utils/storage.js";
import api from "./api.js";

export const getAppSetting = async () => {
    try {
        const response = await api.get("/app-setting")
        return response.data.data
    } catch (error) {
        console.error("Gagal memuat data app setting: ", error);
        return []
    }
}

export const createAppSetting = async (payload) => {
    try {
        const token = getToken()
        const response = await api.post("/app-setting", payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.log("Gagal menambahkan data app setting", error);
        return []
    }
}

export const updateAppSetting = async (id, data) => {
    try {
        const token = getToken()
        const response = await api.put(`/app-setting/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.log("Gagal mengubah data app setting", error);
        return []
    }
}