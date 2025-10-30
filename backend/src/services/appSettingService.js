import prisma from "../config/db.js"

export const createAppSetting = async (data) => {
    return await prisma.settings.create({
        data: {
            name: data.name,
            value: data.value
        }
    })
}

export const getAppSetting = async () => {
    return await prisma.settings.findMany({
        orderBy: { id: "asc" }
    })
}

export const updateAppSetting = async (id, data) => {
    return await prisma.settings.update({
        where: { id: Number(id) },
        data: {
            name: data.name,
            value: data.value
        }
    })
}