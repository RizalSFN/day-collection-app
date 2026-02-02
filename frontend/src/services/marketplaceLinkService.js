import { getToken } from "../utils/storage";
import api from "./api";

export const getMarketplaceLink = async () => {
    try {
        const response = await api.get("/marketplace-link")
        const data = response.data.data

        // Kelompokkan link berdasarkan produk
        const grouped = data.reduce((acc, item) => {
            const productId = item.products.id;
            if (!acc[productId]) {
                acc[productId] = {
                    id: item.products.id,
                    name: item.products.name,
                    slug: item.products.slug,
                    description: item.products.description,
                    main_image: item.products.main_image,
                    base_price: item.products.base_price,
                    status: item.products.status,
                    variants: item.products.product_variants || [],
                    marketplace_links: []
                };
            }

            acc[productId].marketplace_links.push({
                id: item.id,
                platform_name: item.marketplace_platform.name,
                url: item.url
            });

            return acc;
        }, {})

        return Object.values(grouped);
    } catch (error) {
        console.error("Gagal memuat data banner: ", error);
        return []
    }
}

export const getOriginallyMarketplaceLink = async () => {
    try {
        const response = await api.get("/marketplace-link")
        return response.data.data
    } catch (error) {
        console.log("Gagal memuat data marketplace link", error);
        return []
    }
}

export const createMarketplaceLink = async (payload) => {
    try {
        const token = getToken()
        const response = await api.post("/marketplace-link", payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.log("Gagal menambah data marketplace link", error);
        return []
    }
}

export const updateMarketplaceLink = async (id, data) => {
    try {
        const token = getToken()
        const response = await api.put(`/marketplace-link/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.log("Gagal mengubah data marketplace link", error);
        return []
    }
}

export const deleteMarketplaceLink = async (id) => {
    try {
        const token = getToken()
        await api.delete(`/marketplace-link/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return true
    } catch (error) {
        console.log("Gagal menghapus data marketplace link", error);
        return []
    }
}