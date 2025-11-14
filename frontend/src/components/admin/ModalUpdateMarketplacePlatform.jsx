import React from "react";
import { useForm } from 'react-hook-form'
import { updateMarketplacePlatform } from "../../services/marketplacePlatformService"
import { toast } from "react-toastify";

const ModalUpdateMarketplacePLatform = ({ open, onClose, onSuccess, platform }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    React.useEffect(() => {
        if (platform) {
            setValue("name", platform.name)
        }
    }, [platform, setValue])

    const onSubmit = async (data) => {
        try {
            await updateMarketplacePlatform(platform.id, data)

            toast.success("Marketplace platform berhasil diperbarui")

            onSuccess()
            onClose()
        } catch (error) {
            console.log("Gagal memperbarui marketplace platform", error);
            toast.error("Gagal memperbarui marketplace platform")
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-4 text-amber-600">
                    Edit Marketplace Platform
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Nama */}
                    <div className="mb-4">
                        <label className="text-sm font-medium">Nama Marketplace</label>
                        <input
                            {...register("name", { required: "Nama wajib diisi!" })}
                            className="w-full p-2 border rounded mt-1"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Tombol */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-300 text-gray-700"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalUpdateMarketplacePLatform