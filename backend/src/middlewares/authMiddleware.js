import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHelper.js";

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return errorResponse(res, "Unauthorized: No token provided", 401)
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return errorResponse(res, "Unauthorized: Invalid token", 401)
    }
}