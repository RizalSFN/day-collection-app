export const successResponse = (res, data = null, message = "Berhasil!", statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data })
}

export const errorResponse = (res, error = null, statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        error: error ? error.message || error : undefined
    })
}