import prisma from "../config/db.js";

export const createMarketplacePlatform = async (data) => {
    return await prisma.marketplace_platform.create({
        data: {
            name: data.name
        }
    })
}

export const getAllMarketplacePlatform = async () => {
    return await prisma.marketplace_platform.findMany({
        include: { marketplace_link: true },
        orderBy: { id: "asc" }
    })
}

export const getByIdMarketplacePlatform = async (id) => {
    return await prisma.marketplace_platform.findUnique({
        where: { id: Number(id) },
        include: { marketplace_link: true }
    })
}

export const updateMarketplacePlatform = async (id, data) => {
    return await prisma.marketplace_platform.update({
        where: { id: Number(id) },
        data: {
            name: data.name
        }
    })
}

export const deleteMarketplacePlatform = async (id) => {
    return await prisma.marketplace_platform.delete({
        where: { id: Number(id) }
    })
}