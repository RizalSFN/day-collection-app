import express from "express"
import {
    createAppSetting,
    getAllAppSetting,
    updateAppSetting
} from "../controllers/appSettingController.js"
import { authenticate } from "../middlewares/authMiddleware.js"

const appSettingRoutes = express.Router()

appSettingRoutes.get("/", getAllAppSetting)

appSettingRoutes.post("/", authenticate, createAppSetting)
appSettingRoutes.put("/:id", authenticate, updateAppSetting)

export default appSettingRoutes