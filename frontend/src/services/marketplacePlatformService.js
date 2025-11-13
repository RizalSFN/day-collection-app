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