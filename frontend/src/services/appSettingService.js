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