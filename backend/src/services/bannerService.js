import cloudinary from "../config/cloudinary.js";
import prisma from "../config/db.js";
import fs, { link } from "fs"

export const createBanner = async (data, filePath) => {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "banner"
    })

    fs.unlinkSync(filePath)

    return await prisma.banner.create({
        data: {
            title: data.title,
            image_url: uploadResult.secure_url,
            is_active: data.is_active ?? true
        }
    })
}

export const getAllBanner = async () => {
    return await prisma.banner.findUnique({
        orderBy: { id: "asc" },
        where: { is_active: true }
    })
}

export const updateBanner = async (id, data, filePath) => {
    let updateData = {
        title: data.title,
        is_active: data.is_active ?? true
    }

    if (filePath) {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "banner"
        })

        fs.unlinkSync(filePath)
        updateData.image_url = uploadResult.secure_url
    }

    return await prisma.banner.update({
        where: { id: Number(id) },
        data: updateData
    })
}