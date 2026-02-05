import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { updateBanner } from "../../services/bannerService";

export default function ModalUpdateBanner({ data, onClose, onSuccess }) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            title: data.title,
            is_active: data.is_active ? 1 : 0
        }
    })
    const [loading, setLoading] = useState(false)

    const onSubmit = async (formData) => {
        try {
            setLoading(true)
            await updateBanner(data.id, formData)

            toast.success("Berhasil mengubah data banner")
            onSuccess()
            onClose()
        } catch (error) {
            console.log("Gagal mengubah data banner", error);
            toast.error("Gagal mengubah data banner")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-150">
                <h2 className="text-xl font-semibold mb-4">
                    Update Banner
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <label>Title</label>
                                <input
                                    {...register("title")}
                                    type="text"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label>Status</label>
                                <select {...register("is_active")}
                                    defaultValue={data.is_active} className="w-full border p-2 rounded">
                                    <option value="0">Nonaktif</option>
                                    <option value="1">Aktif</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label>Gambar</label>
                                <img
                                    src={data.image_url}
                                    className="w-20 h-20 object-cover rounded mb-2"
                                />

                                <input
                                    {...register("image_url")}
                                    type="file"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-5 gap-2">
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