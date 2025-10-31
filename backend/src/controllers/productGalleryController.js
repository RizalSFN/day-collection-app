import * as productGalleryService from "../services/productGalleryService.js"
import { errorResponse, successResponse } from "../utils/responseHelper.js"

export const getAllProductGalleries = async (req, res) => {
    try {
        const productGallery = await productGalleryService.getAllProductGalleries()
        return successResponse(res, productGallery, "Berhasil memuat data product gallery", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data product gallery", 500)
    }
}

export const getProductGalleryById = async (req, res) => {
    try {
        const productGallery = await productGalleryService.getProductGalleryById(req.params.id)
        return successResponse(res, productGallery, "Berhasil memuat data product gallery", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data product gallery", 500)
    }
}

export const createProductGallery = async (req, res) => {
    try {
        const productGallery = await productGalleryService.createProductGallery(req.body, req.file.path)
        return successResponse(res, productGallery, "Berhasil membuat data product gallery", 201)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal membuat data product gallery", 500)
    }
}

export const updateProductGallery = async (req, res) => {
    try {
        const productGallery = await productGalleryService.updateProductGallery(req.params.id, req.body, req.file?.path)
        return successResponse(res, productGallery, "Berhasil mengubah data product gallery", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal mengubah data product gallery", 500)
    }
}

export const deleteProductGallery = async (req, res) => {
    try {
        const productGallery = await productGalleryService.deleteProductGallery(req.params.id)
        return successResponse(res, productGallery, "Berhasil menghapus data product gallery", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal menghapus data product gallery", 500)
    }
}