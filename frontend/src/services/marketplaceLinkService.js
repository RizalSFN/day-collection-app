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