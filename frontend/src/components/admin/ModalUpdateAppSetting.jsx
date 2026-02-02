import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form'
import { toast } from "react-toastify";
import { updateAppSetting } from "../../services/appSettingService";
import { Edit3, RefreshCw, X } from "lucide-react";

const ModalUpdateAppSetting = ({ open, onClose, onSuccess, platform }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (platform) {
            setValue("name", platform.name);
            setValue("value", platform.value);
        }
    }, [platform, setValue]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await updateAppSetting(platform.id, data);
            toast.success("Konfigurasi berhasil diperbarui");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Gagal memperbarui app setting", error);
            toast.error("Gagal memperbarui konfigurasi");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        // <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        //     <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        //         <h2 className="text-lg font-semibold mb-4 text-amber-600">
        //             Edit App Setting
        //         </h2>

        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             {/* Nama */}
        //             <div className="mb-4">
        //                 <label className="text-sm font-medium">Nama</label>
        //                 <input
        //                     {...register("name", { required: "Nama wajib diisi!" })}
        //                     className="w-full p-2 border rounded mt-1"
        //                 />
        //                 {errors.name && (
        //                     <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        //                 )}
        //             </div>

        //             <div className="mb-4">
        //                 <label className="text-sm font-medium">Value</label>
        //                 <input
        //                     {...register("value", { required: "value wajib diisi!" })}
        //                     className="w-full p-2 border rounded mt-1"
        //                 />
        //                 {errors.name && (
        //                     <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        //                 )}
        //             </div>

        //             {/* Tombol */}
        //             <div className="flex justify-end gap-2 mt-6">
        //                 <button
        //                     type="button"
        //                     onClick={onClose}
        //                     className="px-4 py-2 rounded bg-gray-300 text-gray-700"
        //                 >
        //                     Batal
        //                 </button>

        //                 <button
        //                     type="submit"
        //                     className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700"
        //                 >
        //                     {loading ? (
        //                         <>
        //                             <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        //                             Memperbarui...
        //                         </>
        //                     ) : (
        //                         "Simpan perubahan"
        //                     )}
        //                 </button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fadeIn">

                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Header Modal */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                        <Edit3 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Update <span className="text-amber-500">Setting</span>
                        </h2>
                        <p className="text-gray-500 text-sm">Ubah nilai konfigurasi sistem</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Input Nama */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                            Nama Konfigurasi
                        </label>
                        <input
                            {...register("name", { required: "Nama wajib diisi!" })}
                            placeholder="Contoh: SITE_TITLE"
                            className={`w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${errors.name ? "ring-2 ring-red-400" : ""
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs ml-1 italic font-medium">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Input Value */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                            Nilai (Value)
                        </label>
                        <textarea
                            {...register("value", { required: "Value wajib diisi!" })}
                            placeholder="Masukkan nilai konfigurasi..."
                            rows="3"
                            className={`w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none font-mono text-sm ${errors.value ? "ring-2 ring-red-400" : ""
                                }`}
                        />
                        {errors.value && (
                            <p className="text-red-500 text-xs ml-1 italic font-medium">{errors.value.message}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-400 font-semibold hover:text-gray-600 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-2 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCw size={18} className="animate-spin" />
                            ) : (
                                <RefreshCw size={18} />
                            )}
                            {loading ? "Memperbarui..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalUpdateAppSetting