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
        const token = getToken(); // Pastikan ini ada

        formData.append("name", payload.name);
        formData.append("slug", payload.slug);
        formData.append("description", payload.description);
        formData.append("base_price", payload.base_price); // Pastikan backend terima 'base_price'
        formData.append("status", payload.is_active);
        formData.append("weight", payload.weight);

        // PERBAIKAN: Langsung append payload.main_image (karena sudah file object)
        if (payload.main_image) {
            formData.append("main_image", payload.main_image);
        }

        const response = await api.post("/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Gagal menambah data produk: ", error);
        throw error; // Throw error agar UI tau kalau gagal
    }
};

export const updateProduct = async (id, data) => {
    try {
        const token = getToken();
        const formData = new FormData();

        // 1. Append Data Teks (Pastikan mapping sesuai state di Component)
        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("description", data.description);

        // Perbaikan: Ambil dari 'data.harga' karena di component namanya 'harga'
        formData.append("base_price", data.base_price);

        // Perbaikan: Ambil dari 'data.is_active' karena di component namanya 'is_active'
        formData.append("status", data.is_active);
        formData.append("weight", data.weight);

        // 2. Logic Gambar (Hanya kirim jika user upload file baru)
        // Kita cek apakah tipe datanya adalah 'File'. Jika string (URL lama), jangan kirim.
        if (data.main_image instanceof File) {
            formData.append("main_image", data.main_image);
        }

        const response = await api.put(`/products/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Gagal mengubah data produk: ", error);
        throw error; // Throw error agar toast di component bisa muncul
    }
};

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