import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateProduct } from "../../services/productService";
import { useState } from "react";

export default function ModalUpdateProduct({ data, onClose, onSuccess }) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            base_price: data.base_price,
            status: data.status
        }
    })
    const [loading, setLoading] = useState(false)

    const onSubmit = async (formData) => {
        try {
            setLoading(true)
            await updateProduct(data.id, formData)

            toast.success("Berhasil mengubah data produk")
            onSuccess()
            onClose()
        } catch (error) {
            console.log("Gagal mengubah data produk", error);
            toast.error("Gagal mengubah data produk")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[600px]">
                <h2 className="text-xl font-semibold mb-4">
                    Update Produk
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <label>Nama</label>
                                <input
                                    {...register("name")}
                                    type="text"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label>Slug</label>
                                <input
                                    {...register("slug")}
                                    type="text"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label>Gambar Utama</label>
                                <img
                                    src={data.main_image}
                                    className="w-20 h-20 object-cover rounded mb-2 border"
                                />

                                <input
                                    {...register("main_image")}
                                    type="file"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label>Deskripsi</label>
                                <input
                                    {...register("description")}
                                    type="text"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label>Harga</label>
                                <input
                                    {...register("base_price")}
                                    type="number"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label>Status</label>
                                <select {...register("status")} defaultValue={data.status} className="w-full border p-2 rounded">
                                    <option value="inactive">Nonaktif</option>
                                    <option value="active">Aktif</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-amber-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Memperbarui...
                                </>
                            ) : (
                                "Update"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}