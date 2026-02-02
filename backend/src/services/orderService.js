import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs"

export const createOrderService = async (payload) => {
    // 1. Generate Order Code
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedOrderCode = `INV-${date}-${randomStr}`;

    // 2. Gunakan Prisma Transaction agar Order & Update Stok berjalan beriringan
    return await prisma.$transaction(async (tx) => {

        // A. Buat Pesanan Utama & Item Detail
        const order = await tx.order.create({
            data: {
                order_code: generatedOrderCode,
                buyer_name: payload.buyer_name,
                buyer_phone: payload.buyer_phone,
                buyer_address: payload.buyer_address,
                total_amount: parseInt(payload.total_amount),
                checkout_method: payload.checkout_method,
                status: payload.status || (payload.checkout_method === "BANK_TRANSFER" ? "WAITING_PAYMENT" : "PENDING"),

                // Menghubungkan Order ke Product utama (karena relasinya wajib)
                product: {
                    connect: { id: parseInt(payload.product_id) }
                },

                items: {
                    create: payload.items.map((item) => ({
                        product_id: parseInt(item.product_id),
                        variant_id: item.variant_id ? parseInt(item.variant_id) : null,
                        quantity: parseInt(item.quantity || 1),
                        price: parseInt(item.price)
                    }))
                }
            },
            include: { items: true }
        });

        // B. Loop setiap item untuk memotong stok di product_variants
        for (const item of payload.items) {
            if (item.variant_id) {
                // Ambil data varian dulu untuk cek stok cukup atau tidak
                const variant = await tx.product_variants.findUnique({
                    where: { id: parseInt(item.variant_id) }
                });

                if (!variant || variant.stock < item.quantity) {
                    throw new Error(`Stok untuk varian ${variant?.color || ''} tidak mencukupi!`);
                }

                // Update stok (pengurangan)
                await tx.product_variants.update({
                    where: { id: parseInt(item.variant_id) },
                    data: {
                        stock: {
                            decrement: parseInt(item.quantity) // Mengurangi stok secara atomik
                        }
                    }
                });
            }
        }

        return order;
    });
};

export const uploadPaymentProofService = async (orderId, filePath) => {
    // 1. Upload ke Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "payment_proofs"
    });

    // 2. Hapus file sementara di server lokal
    fs.unlinkSync(filePath);

    // 3. Update Database menggunakan Nested Write
    return prisma.order.update({
        where: { id: Number(orderId) },
        data: {
            // PERBAIKAN: Gunakan upsert agar jika sudah ada bukti, datanya diupdate
            // Jika menggunakan create langsung, akan error "Unique constraint" saat re-upload
            payment_proof: {
                upsert: {
                    create: {
                        image_url: uploadResult.secure_url,
                    },
                    update: {
                        image_url: uploadResult.secure_url,
                        uploaded_at: new Date(), // Pastikan field ini ada di schema
                    }
                }
            },
            status: "WAITING_VERIFICATION"
        },
        include: {
            payment_proof: true // Sertakan hasil update bukti di return value
        }
    });
};

export const getOrderService = () => {
    return prisma.order.findMany({
        include: {
            items: {
                include: {
                    product: true,
                    product_variants: true
                }
            },
            payment_proof: true
        },
        orderBy: { created_at: "desc" }
    })
}

export const getOrderByIdService = (id) => {
    return prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
            items: { include: { product: true } }
        }
    })
}

export const updateOrderStatusService = (id, status) => {
    return prisma.order.update({
        where: { id: Number(id) },
        data: { status }
    })
}

export const trackingOrderService = async (keyword) => {
    const cleanKeyword = keyword.trim();

    return await prisma.order.findFirst({
        where: {
            OR: [
                {
                    order_code: {
                        equals: cleanKeyword, // Kode order harus sama persis
                    }
                },
                {
                    buyer_name: {
                        contains: cleanKeyword
                    }
                }
            ]
        },
        // Pastikan relasi ini sesuai dengan nama yang ada di schema.prisma
        include: {
            items: {
                include: {
                    product: true,
                    product_variants: true
                }
            },
            payment_proof: true
        },
        orderBy: {
            created_at: "desc" // Selalu ambil yang terbaru jika ada nama yang mirip
        }
    });
};