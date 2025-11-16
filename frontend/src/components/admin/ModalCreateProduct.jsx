import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createProduct } from "../../services/productService";
import { useState } from "react";

export default function ModalCreateProduct({ onClose, onSuccess }) {
    const { register, handleSubmit } = useForm()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            await createProduct(data)
            toast.success("Berhasil menambahkan produk")
            onSuccess()
            onClose()
        } catch (error) {
            console.log("Gagal menambahkan produk", error);
            toast.error("Gagal menambahkan produk")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-[600px]">
                <h2 className="text-xl font-semibold mb-4">
                    Tambah Produk
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Grid 2 kolom */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* Kolom 1 */}
                        <div className="space-y-4">
                            <div>
                                <label className="font-medium">Nama Produk</label>
                                <input
                                    {...register("name")}
                                    type="text"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Deskripsi</label>
                                <textarea
                                    {...register("description")}
                                    className="w-full border p-2 rounded"
                                    rows={3}
                                ></textarea>
                            </div>

                            <div>
                                <label className="font-medium">Gambar Utama</label>
                                <input
                                    {...register("main_image")}
                                    type="file"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        </div>

                        {/* Kolom 2 */}
                        <div className="space-y-4">
                            <div>
                                <label className="font-medium">Slug</label>
                                <input
                                    {...register("slug")}
                                    type="text"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Harga</label>
                                <input
                                    {...register("harga")}
                                    type="number"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Status</label>
                                <select
                                    {...register("is_active")}
                                    className="w-full border p-2 rounded"
                                >
                                    <option value="">Pilih status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tombol */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
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
                                    menyimpan...
                                </>
                            ) : (
                                "Simpan"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}