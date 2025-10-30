import prisma from "../config/db.js";

export const createBanner = async (data) => {
    return await prisma.banner.create({
        data: {
            title: data.title,
            image_url: data.image_url,
            link: data.link,
            is_active: data.is_active ?? true
        }
    })
}

export const getAllBanner = async () => {
    return await prisma.banner.findMany({
        orderBy: { id: "asc" }
    })
}

export const updateBanner = async (id, data) => {
    return await prisma.banner.update({
        where: { id: Number(id) },
        data: {
            title: data.title,
            image_url: data.image_url,
            link: data.link,
            is_active: data.is_active ?? true
        }
    })
}