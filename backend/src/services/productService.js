import prisma from "../config/db.js";

export const createProduct = async (data) => {
    return await prisma.products.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            main_image: data.main_image,
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

export const updateProduct = async (id, data) => {
    return await prisma.products.update({
        where: { id: Number(id) },
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            main_image: data.main_image,
            base_price: data.base_price,
            status: data.status,
            updated_at: new Date()
        }
    })
}

export const deleteProduct = async (id) => {
    return await prisma.products.delete({ where: { id: Number(id) } })
}