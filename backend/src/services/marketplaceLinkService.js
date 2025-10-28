import prisma from "../config/db.js";

export const createMarketplaceLink = async (data) => {
    return await prisma.marketplace_link.create({
        data: {
            product_id: Number(data.product_id),
            platform_id: Number(data.platform_id),
            url: data.url,
            is_active: data.is_active ?? true
        },
        include: {
            products: true,
            marketplace_platform: true
        }
    })
}

export const getAllMarketplaceLink = async () => {
    return await prisma.marketplace_link.findMany({
        orderBy: { id: "asc" },
        include: {
            products: {
                select: { id: true, name: true, slug: true }
            },
            marketplace_platform: {
                select: { id: true, name: true }
            }
        }
    })
}

export const getByIdMarketplaceLink = async (id) => {
    return await prisma.marketplace_link.findUnique({
        where: { id: Number(id) },
        include: {
            products: {
                select: { id: true, name: true, slug: true }
            },
            marketplace_platform: {
                select: { id: true, name: true }
            }
        }
    })
}

export const updateMarketplaceLink = async (id, data) => {
    return await prisma.marketplace_link.update({
        where: { id: Number(id) },
        data: {
            product_id: Number(data.product_id),
            platform_id: Number(data.platform_id),
            url: data.url,
            is_active: data.is_active
        }
    })
}

export const deleteMarketplaceLink = async (id) => {
    return await prisma.marketplace_link.delete({
        where: { id: Number(id) }
    })
}