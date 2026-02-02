import React, { useState } from "react";
import { Globe, Loader2, Save, X } from "lucide-react";
import { createMarketplacePlatform } from "../../services/marketplacePlatformService";
import { toast } from "react-toastify";

const ModalAddMarketplacePlatform = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createMarketplacePlatform({ name });
            toast.success("Platform baru berhasil ditambahkan");
            onSuccess();
            onClose();
            setName("");
        } catch (error) {
            console.error("Gagal menambah platform", error);
            toast.error("Gagal menambah platform");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fadeIn">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Tambah <span className="text-amber-500">Platform</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">Tambah jalur marketplace baru</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Nama Platform
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-gray-300"
                            placeholder="Misal: Shopee, Tokopedia, TikTok Shop"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
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
                            className="flex-2 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? "Menyimpan..." : "Simpan Platform"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAddMarketplacePlatform