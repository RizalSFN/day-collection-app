import prisma from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { errorResponse } from "../utils/responseHelper.js";

export const register = async (data) => {
    const existingUser = await prisma.users.findUnique({
        where: { email: data.email }
    })

    if (existingUser) return false

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.users.create({
        data: {
            name: data.name,
            username: data.username,
            email: data.email,
            password: hashedPassword
        }
    })

    return user;
}

export const login = async (email, password) => {
    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) throw errorResponse(res, "Invalid email or password")

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw errorResponse(res, "Invalid email or password")

    const token = jwt.sign(
        { id: user.id, email: user.email, password: user.password },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXP_IN || "1d" }
    )

    return { user, token }
}