import * as marketplaceLinkService from "../services/marketplaceLinkService.js"
import { errorResponse, successResponse } from "../utils/responseHelper.js"

export const createMarketplaceLink = async (req, res) => {
    try {
        const marketplaceLink = await marketplaceLinkService.createMarketplaceLink(req.body)
        return successResponse(res, marketplaceLink, "Berhasil membuat data marketplace link", 201)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal membuat data marketplace link", 500)
    }
}

export const getAllMarketplaceLink = async (req, res) => {
    try {
        const marketplaceLink = await marketplaceLinkService.getAllMarketplaceLink()
        return successResponse(res, marketplaceLink, "Berhasil memuat data marketplace link", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data marketplace link", 500)
    }
}

export const getByIdMarketplaceLink = async (req, res) => {
    try {
        const marketplaceLink = await marketplaceLinkService.getByIdMarketplaceLink(req.params.id)
        return successResponse(res, marketplaceLink, "Berhasil memuat data marketplace link", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data marketplace link", 500)
    }
}

export const updateMarketplaceLink = async (req, res) => {
    try {
        const marketplaceLink = await marketplaceLinkService.updateMarketplaceLink(req.params.id, req.body)
        return successResponse(res, marketplaceLink, "Berhasil mengubah data marketplace link", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal mengubah data marketplace link", 500)
    }
}

export const deleteMarketplaceLink = async (req, res) => {
    try {
        const marketplaceLink = await marketplaceLinkService.deleteMarketplaceLink(req.params.id)
        return successResponse(res, marketplaceLink, "Berhasil menghapus data marketplace link", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal menghapus data marketplace link", 500)
    }
}