import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs"
import { errorResponse } from "../utils/responseHelper.js";

export const getAllProductGalleries = async () => {
    return await prisma.product_gallery.findMany({
        include: {
            products: {
                select: { id: true, name: true, slug: true }
            }
        }
    })
}

export const getProductGalleryById = async (id) => {
    return await prisma.product_gallery.findUnique({
        where: { id: Number(id) },
        include: {
            products: {
                select: { id: true, name: true, slug: true }
            }
        }
    })
}

export const createProductGallery = async (data, filePath) => {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "product_gallery"
    })

    fs.unlinkSync(filePath)

    return await prisma.product_gallery.create({
        data: {
            product_id: Number(data.product_id),
            image_url: uploadResult.secure_url,
            alt_text: data.alt_text,
            sort_order: Number(data.sort_order)
        }
    })
}

export const updateProductGallery = async (id, data, filePath) => {
    let updateData = {
        alt_text: data.alt_text,
        sort_order: Number(data.sort_order)
    }

    if (filePath) {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "product_gallery"
        })

        fs.unlinkSync(filePath)
        updateData.image_url = uploadResult.secure_url
    }

    return await prisma.product_gallery.update({
        where: { id: Number(id) },
        data: updateData
    })
}

export const deleteProductGallery = async (id) => {
    const productGallery = await prisma.product_gallery.findUnique({
        where: { id: Number(id) }
    })

    if (!productGallery) throw errorResponse(res, "Gallery not found", 400)

    const publicId = productGallery.image_url.split("/").slice(-2).join("/").split(".")[0]

    await cloudinary.uploader.upload(publicId)
    return await prisma.product_gallery.delete({
        where: { id: Number(id) }
    })
}