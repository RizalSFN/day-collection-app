export const successResponse = (res, data, message = "Berhasil!", statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data })
}

export const errorResponse = (res, error, statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message: error.message || "Terjadi kesalahan server"
    })
}