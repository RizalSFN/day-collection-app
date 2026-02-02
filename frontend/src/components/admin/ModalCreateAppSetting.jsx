import React, { useState } from "react";
import { Save, Settings2, X } from "lucide-react";
import { toast } from "react-toastify";
import { createAppSetting } from "../../services/appSettingService";

const ModalCreateAppSetting = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Pastikan payload mengirim name dan value sesuai kebutuhan backend Anda
            await createAppSetting({ name, value });

            toast.success("Berhasil menambah konfigurasi baru");
            onSuccess();
            onClose();
            setName("");
            setValue("");
        } catch (error) {
            console.error("Gagal menambah data app setting", error);
            toast.error("Gagal menambah data app setting");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
        //     <div className="bg-white w-96 rounded-xl p-5 shadow-2xl relative">

        //         {/* Tombol Close */}
        //         <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
        //             <X size={22} />
        //         </button>

        //         <h2 className="text-xl font-semibold mb-4 text-amber-600">
        //             Tambah App Setting
        //         </h2>

        //         <form onSubmit={handleSubmit} className="space-y-4">
        //             <div>
        //                 <label className="block text-sm font-medium">Nama</label>
        //                 <input
        //                     type="text"
        //                     className="w-full border rounded-lg px-3 py-2 mt-1"
        //                     value={name}
        //                     onChange={(e) => setName(e.target.value)}
        //                     required
        //                 />
        //             </div>

        //             <div>
        //                 <label className="block text-sm font-medium">Value</label>
        //                 <input
        //                     type="text"
        //                     className="w-full border rounded-lg px-3 py-2 mt-1"
        //                     value={value}
        //                     onChange={(e) => setValue(e.target.value)}
        //                     required
        //                 />
        //             </div>

        //             <button
        //                 type="submit"
        //                 className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg"
        //             >
        //                 Simpan
        //             </button>
        //         </form>
        //     </div>
        // </div>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fadeIn">

                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Header Modal */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                        <Settings2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            App <span className="text-amber-500">Setting</span>
                        </h2>
                        <p className="text-gray-500 text-sm">Tambahkan konfigurasi sistem baru</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input Nama */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                            Nama Konfigurasi
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: CONTACT_PHONE"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Input Value */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                            Nilai (Value)
                        </label>
                        <textarea
                            placeholder="Masukkan nilai konfigurasi..."
                            rows="3"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                        />
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
                            className="flex-2 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {loading ? "Menyimpan..." : "Simpan Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalCreateAppSetting