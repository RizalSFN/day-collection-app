import React, { useState } from "react";
import { useForm } from 'react-hook-form'
import { updateMarketplacePlatform } from "../../services/marketplacePlatformService"
import { toast } from "react-toastify";
import { Edit3, Loader2, Save, X } from "lucide-react";

const ModalUpdateMarketplacePlatform = ({ isOpen, onClose, onSuccess, platform }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    React.useEffect(() => {
        if (platform) {
            setValue("name", platform.name);
        }
    }, [platform, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await updateMarketplacePlatform(platform.id, data);
            toast.success("Nama platform berhasil diperbarui");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Gagal memperbarui platform", error);
            toast.error("Gagal memperbarui platform");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fadeIn">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                        <Edit3 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Edit <span className="text-blue-500">Platform</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">Perbarui nama identitas platform</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Nama Marketplace
                        </label>
                        <input
                            {...register("name", { required: "Nama platform tidak boleh kosong!" })}
                            type="text"
                            className={`w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition-all ${errors.name ? "ring-2 ring-red-400" : ""}`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 ml-1 font-medium italic">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
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
                            className="flex-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? "Menyimpan..." : "Update Platform"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalUpdateMarketplacePlatform