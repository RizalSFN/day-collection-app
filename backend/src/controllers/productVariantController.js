import {
    createVariantService,
    getVariantsByProductService,
    updateVariantService,
    deleteVariantService
} from "../services/productVariantService.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";

export const createVariant = async (req, res) => {
    try {
        const data = await createVariantService(req.body)
        return successResponse(res, data, "Berhasil menambahkan data varian produk", 201)
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}

export const getVariantByProduct = async (req, res) => {
    const data = await getVariantsByProductService(req.params.productId)
    return successResponse(res, data, `Berhasil memuat data varian berdasarkan produk id ${req.params.productId}`)
}

export const updateVariant = async (req, res) => {
    const data = await updateVariantService(req.params.id, req.body)
    return successResponse(res, data, "Berhasil mengupdate varian produk", 200)
}

export const deleteVariant = async (req, res) => {
    await deleteVariantService(req.params.id)
    return successResponse(res, null, "Berhasil menonaktifkan varian produk", 200)
}