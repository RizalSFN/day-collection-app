import * as authService from "../services/authService.js"
import { errorResponse, successResponse } from "../utils/responseHelper.js"

export const register = async (req, res) => {
    try {
        const user = await authService.register(req.body)
        if (!user) return errorResponse(res, "Email already exist", 400)
        return successResponse(res, user, "Berhasil registrasi user", 201)
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const { user, token } = await authService.login(email, password)

        return successResponse(res, { user, token }, "Login berhasil", 200)
    } catch (error) {
        return errorResponse(res, "Invalid email or password", 500)
    }
}