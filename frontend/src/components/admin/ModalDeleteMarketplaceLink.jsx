import { toast } from "react-toastify"
import { deleteMarketplaceLink } from "../../services/marketplaceLinkService"
import { useState } from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

export default function ModalDeleteMarketplaceLink({ data, onClose, onSuccess, isOpen }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteMarketplaceLink(data.id);
            toast.success("Tautan berhasil dihapus");
            onSuccess();
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Gagal menghapus data");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center animate-fadeIn">

                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <AlertCircle size={40} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hapus Link?</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Apakah Anda yakin ingin menghapus link marketplace untuk produk <br />
                    <span className="font-bold text-gray-800 break-all">"{data?.products?.name || data?.url}"</span>?
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        {loading ? "Menghapus..." : "Ya, Hapus Sekarang"}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-3 text-gray-400 font-semibold hover:text-gray-600 transition-colors"
                    >
                        Batalkan
                    </button>
                </div>
            </div>
        </div>
    );
}