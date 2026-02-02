import { getToken } from "../utils/storage.js";
import api from "./api.js";

export const getVariantsByProduct = async (productId) => {
    try {
        const response = await api.get(`/product-variant/product/${productId}`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal memuat varian produk: ", error);
        return [];
    }
};

export const createVariant = async (payload) => {
    try {
        const token = getToken();
        const response = await api.post("/product-variant", payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Gagal menambah varian: ", error);
        throw error;
    }
};

export const updateVariant = async (id, payload) => {
    try {
        const token = getToken();
        const response = await api.put(`/product-variant/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Gagal mengubah varian: ", error);
        throw error;
    }
};

export const deleteVariant = async (id) => {
    try {
        const token = getToken();
        await api.delete(`/product-variant/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return true;
    } catch (error) {
        console.error("Gagal menghapus varian: ", error);
        throw error;
    }
};