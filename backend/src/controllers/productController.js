import * as productService from "../services/productService.js"
import { errorResponse, successResponse } from "../utils/responseHelper.js";

export const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body, req.file.path)
        return successResponse(res, product, "Berhasil menambahkan data product", 201)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal menambahkan data product", 500)
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts()
        return successResponse(res, products, "Berhasil memuat data product")
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data product", 500)
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id)

        if (!product) {
            return errorResponse(res, "Product tidak ditemukan", 404)
        }

        return successResponse(res, product, "Berhasil memuat data product")
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data product", 500)
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body, req.file?.path)
        return successResponse(res, product, "Berhasil mengubah data product")
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal mengubah data product", 500)
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id)
        return successResponse(res, product, "Berhasil menghapus data product")
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal menghapus data produk", 500)
    }
}