import express from "express"
import {
    createAppSetting,
    getAllAppSetting,
    updateAppSetting
} from "../controllers/appSettingController.js"

const appSettingRoutes = express.Router()

appSettingRoutes.post("/", createAppSetting)
appSettingRoutes.get("/", getAllAppSetting)
appSettingRoutes.put("/:id", updateAppSetting)

export default appSettingRoutes