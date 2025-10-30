import * as bannerService from "../services/bannerService.js"
import { errorResponse, successResponse } from "../utils/responseHelper.js"

export const createBanner = async (req, res) => {
    try {
        const banner = await bannerService.createBanner(req.body)
        return successResponse(res, banner, "Berhasil membuat data banner", 201)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal membuat data banner", 500)
    }
}

export const getAllBanner = async (req, res) => {
    try {
        const banner = await bannerService.getAllBanner()
        return successResponse(res, banner, "Berhasil memuat data banner", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data banner", 500)
    }
}

export const updateBanner = async (req, res) => {
    try {
        const banner = await bannerService.updateBanner(req.params.id, req.body)
        return successResponse(res, banner, "Berhasil mengubah data banner", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal mengubah data banner", 500)
    }
}