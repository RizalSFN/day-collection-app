import * as appSettingService from "../services/appSettingService.js"
import { successResponse, errorResponse } from "../utils/responseHelper.js"

export const createAppSetting = async (req, res) => {
    try {
        const appSetting = await appSettingService.createAppSetting(req.body)
        return successResponse(res, appSetting, "Berhasil membuat data app setting", 201)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal membuat data app setting", 500)
    }
}

export const getAllAppSetting = async (req, res) => {
    try {
        const appSetting = await appSettingService.getAllAppSetting()
        return successResponse(res, appSetting, "Berhasil memuat data app setting", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data app setting", 500)
    }
}

export const updateAppSetting = async (req, res) => {
    try {
        const appSetting = await appSettingService.updateAppSetting(req.params.id, req.body)
        return successResponse(res, appSetting, "Berhasil mengubah data app setting", 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Gagal memuat data app setting", 500)
    }
}