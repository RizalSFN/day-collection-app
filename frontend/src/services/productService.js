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

export const createProduct = async (payload) => {
    try {
        const formData = new FormData();
        const token = getToken()

        formData.append("name", payload.name);
        formData.append("slug", payload.slug);
        formData.append("description", payload.description);
        formData.append("base_price", payload.harga);
        formData.append("status", payload.is_active);
        formData.append("main_image", payload.main_image[0]);

        const response = await api.post("/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        });

        return response.data
    } catch (error) {
        console.error("Gagal menambah data produk: ", error);
        return []
    }
}

export const updateProduct = async (id, data) => {
    try {
        const token = getToken()
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("description", data.description);
        formData.append("base_price", data.base_price);
        formData.append("status", data.status);

        if (data.main_image && data.main_image.length > 0) {
            formData.append("main_image", data.main_image[0]);
        }

        const response = await api.put(`/products/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.error("Gagal mengubah data produk: ", error);
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