import { getToken } from "../utils/storage.js";
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

export const deleteProduct = async (id) => {
    try {
        const token = getToken()
        await api.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return true
    } catch (error) {
        console.log("Gagal menghapus produk: ", error);
        throw error
    }
}