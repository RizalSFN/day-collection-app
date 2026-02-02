import fs from "fs";
import prisma from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = async (data, filePath) => {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "product_main_image"
    })

    fs.unlinkSync(filePath)

    return await prisma.products.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            main_image: uploadResult.secure_url,
            base_price: data.base_price,
            status: data.status
        }
    })
}

export const getAllProducts = async () => {
    return await prisma.products.findMany({
        include: {
            product_gallery: true,
            product_variants: true,
            marketplace_link: {
                include: { marketplace_platform: true }
            }
        },
        orderBy: { created_at: "desc" }
    })
}

export const getProductById = async (id) => {
    return await prisma.products.findUnique({
        where: { id: Number(id) },
        include: {
            product_gallery: true,
            product_variants: true,
            marketplace_link: {
                include: { marketplace_platform: true }
            }
        }
    })
}

export const updateProduct = async (id, data, filePath) => {
    let updateData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        base_price: data.base_price,
        status: data.status
    }

    if (filePath) {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "product_main_image"
        })

        fs.unlinkSync(filePath)
        updateData.main_image = uploadResult.secure_url
    }

    updateData.updated_at = new Date()

    return await prisma.products.update({
        where: { id: Number(id) },
        data: updateData
    })
}

export const deleteProduct = async (id) => {
    const product = await prisma.products.findUnique({
        where: { id: Number(id) }
    })

    if (product.main_image) {
        const urlParts = product.main_image.split("/");
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const folderName = urlParts[urlParts.length - 2];
        const publicId = `${folderName}/${fileNameWithExt.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
    }

    return await prisma.products.delete({ where: { id: Number(id) } })
}