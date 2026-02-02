import {
    createOrderService,
    getOrderService,
    getOrderByIdService,
    updateOrderStatusService,
    uploadPaymentProofService,
    trackingOrderService
} from "../services/orderService.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";

export const createOrder = async (req, res) => {
    try {
        const order = await createOrderService(req.body)
        return successResponse(res, order, "Berhasil menambahkan order", 201)
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}

export const uploadPaymentProof = async (req, res) => {
    try {
        const result = await uploadPaymentProofService(
            req.params.id,
            req.file.path
        )
        return successResponse(res, result, "Berhasil mengupload bukti pembayaran", 200)
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}

export const getOrders = async (req, res) => {
    const data = await getOrderService()
    return successResponse(res, data, "Berhasil memuat data order", 200)
}

export const getOrderById = async (req, res) => {
    const data = await getOrderByIdService(req.params.id)
    return successResponse(res, data, `Berhasil memuat data order dengan id ${req.params.id}`, 200)
}

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body
    const data = await updateOrderStatusService(req.params.id, status)
    return successResponse(res, data, `Berhasil mengupdate status order dengan id ${req.params.id}`, 200)
}

export const handleTrackOrder = async (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ message: "Kata kunci pencarian diperlukan" });
    }

    try {
        const order = await trackingOrderService(keyword);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Pesanan tidak ditemukan. Pastikan Kode Order atau Nama benar."
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

