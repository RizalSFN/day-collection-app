import prisma from "../config/db.js";

export const createVariantService = async (data) => {
    return prisma.product_variants.create({
        data: {
            product_id: data.product_id,
            color: data.color,
            size: data.size,
            stock: data.stock,
            price: data.price,
            is_active: true
        }
    })
}

export const getVariantsByProductService = async (productId) => {
    return prisma.product_variants.findMany({
        where: {
            product_id: Number(productId),
            is_active: true
        }
    })
}

export const updateVariantService = async (id, data) => {
    return prisma.product_variants.update({
        where: { id: Number(id) },
        data
    })
}

export const deleteVariantService = async (id) => {
    return prisma.product_variants.update({
        where: { id: Number(id) },
        data: { is_active: false }
    })
}