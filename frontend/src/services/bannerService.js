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