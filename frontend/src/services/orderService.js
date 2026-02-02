import { getToken } from "../utils/storage.js";
import api from "./api.js";

export const getOrders = async () => {
    try {
        const token = getToken();
        const response = await api.get("/order", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error("Gagal memuat data order: ", error);
        return [];
    }
};

export const createOrder = async (payload) => {
    try {
        const response = await api.post("/order", payload);
        return response.data;
    } catch (error) {
        console.error("Gagal membuat pesanan: ", error);
        throw error;
    }
};

export const uploadPaymentProof = async (orderId, file) => {
    try {
        const formData = new FormData();
        // Pastikan key "payment_proof" sesuai dengan upload.single("payment_proof") di backend
        formData.append("payment_proof", file);

        const response = await api.post(`/order/${orderId}/payment-proof`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                // Jika backend membutuhkan token untuk upload, tambahkan Authorization di sini
            }
        });
        return response.data;
    } catch (error) {
        console.error("Gagal mengunggah bukti pembayaran: ", error);
        throw error;
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const token = getToken();
        const response = await api.put(`/order/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Gagal mengubah status order: ", error);
        throw error;
    }
};

export const trackOrderApi = async (keyword) => {
    try {
        const response = await api.get(`/order/track`, {
            params: { keyword }
        });
        return response.data; // Mengembalikan { success: true, data: { ... } }
    } catch (error) {
        // Melempar error agar bisa ditangkap oleh catch di komponen UI
        throw error.response?.data?.message || "Gagal melacak pesanan";
    }
};