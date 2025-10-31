import prisma from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = async (data, file) => {
    let imageUrl = null

    if (file) {
        const uploadResult = await cloudinary.uploader.upload({
            folder: "product_main_images"
        })

        imageUrl = uploadResult.secure_url
    }

    return await prisma.products.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            main_image: imageUrl,
            base_price: data.base_price,
            status: data.status
        }
    })
}

export const getAllProducts = async () => {
    return await prisma.products.findMany({
        include: {
            product_gallery: true,
            product_variant: {
                include: {
                    product_color: true,
                    product_size: true
                }
            },
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
            product_variant: {
                include: {
                    product_color: true,
                    product_size: true
                }
            },
            marketplace_link: {
                include: { marketplace_platform: true }
            }
        }
    })
}

export const updateProduct = async (id, data, file) => {
    const product = await prisma.products.findMany({
        where: { id: Number(id) }
    })

    let imageUrl = product.main_image

    if (file) {
        if (product.main_image) {
            const urlParts = product.main_image.split("/")
            const fileNameWithExt = urlParts[urlParts.length() - 1]
            const folderName = urlParts[urlParts.length() - 2]
            const publicId = `${folderName}/${fileNameWithExt.split(".")[0]}`
            await cloudinary.uploader.destroy(publicId)
        }

        const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "product_main_images"
        })
        imageUrl = uploadResult.secure_url
    }

    return await prisma.products.update({
        where: { id: Number(id) },
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            main_image: imageUrl,
            base_price: data.base_price,
            status: data.status,
            updated_at: new Date()
        }
    })
}

export const deleteProduct = async (id) => {
    const product = await prisma.products.findUnique({
        where: { id: Number(id) }
    })

    if (product.main_image) {
        const urlParts = product.base_image.split("/");
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const folderName = urlParts[urlParts.length - 2];
        const publicId = `${folderName}/${fileNameWithExt.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
    }

    return await prisma.products.delete({ where: { id: Number(id) } })
}