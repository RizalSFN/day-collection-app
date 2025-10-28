import * as marketplacePlatformService from "../services/marketplacePlatformService.js"
import { errorResponse, successResponse } from "../utils/responseHelper.js";

export const createMarketplacePlatform = async (req, res) => {
    try {
        const marketplacePlatform = await marketplacePlatformService.createMarketplacePlatform(req.body)
        return successResponse(res, marketplacePlatform, "Berhasil menambahkan data marketplace platform", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal menambahkan data marketplace platform", 500)
    }
}

export const getAllMarketplacePlatform = async (req, res) => {
    try {
        const marketplacePlatform = await marketplacePlatformService.getAllMarketplacePlatform()
        return successResponse(res, marketplacePlatform, "Berhasil memuat data marketplace platform", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data marketplace platform", 500)
    }
}

export const getByIdMarketplacePlatform = async (req, res) => {
    try {
        const marketplacePlatform = await marketplacePlatformService.getByIdMarketplacePlatform(req.params.id)
        return successResponse(res, marketplacePlatform, "Berhasil memuat data marketplace platform", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data marketplace platform", 500)
    }
}

export const updateMarketplacePlatform = async (req, res) => {
    try {
        const marketplacePlatform = await marketplacePlatformService.updateMarketplacePlatform(req.params.id, req.body)
        return successResponse(res, marketplacePlatform, "Berhasil mengubah data marketplace platform", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal mengubah data marketplace platform", 500)
    }
}

export const deleteMarketplacePlatform = async (req, res) => {
    try {
        const marketplacePlatform = await marketplacePlatformService.deleteMarketplacePlatform(req.params.id)
        return successResponse(res, marketplacePlatform, "Berhasil menghapus data marketplace platform", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal menghapus data marketplace platform", 500)
    }
}