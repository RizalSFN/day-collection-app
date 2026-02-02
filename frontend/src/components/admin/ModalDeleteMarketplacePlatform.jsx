import React, { useState } from "react";
import { toast } from "react-toastify";
import { deleteMarketplacePlatform } from "../../services/marketplacePlatformService";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";

export default function ModalDeleteMarketplacePlatform({ isOpen, onClose, onSuccess, data }) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteMarketplacePlatform(data.id);
            toast.success(`Platform ${data.name} berhasil dihapus`);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus platform");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center animate-fadeIn">

                {/* Warning Icon */}
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce-short">
                    <AlertCircle size={40} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hapus Platform?</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Menghapus platform <span className="font-bold text-gray-800">"{data?.name}"</span> juga mungkin akan mempengaruhi link marketplace yang terhubung.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        {loading ? "Menghapus..." : "Ya, Hapus Platform"}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full py-3 text-gray-400 font-semibold hover:text-gray-600 transition-colors disabled:opacity-0"
                    >
                        Batalkan
                    </button>
                </div>
            </div>
        </div>
    );
}