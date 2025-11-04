import api from "./api.js";

export const getProducts = async () => {
    try {
        const response = await api.get("/products")
        return response.data.data
    } catch (error) {
        console.error("Gagal memuat data produk: ", error);
        return []
    }
}