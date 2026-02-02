import { useForm } from "react-hook-form";
import { createMarketplaceLink } from "../../services/marketplaceLinkService";
import { getProducts } from "../../services/productService";
import { getMarketplacePlatform } from "../../services/marketplacePlatformService";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link2, Loader2, Save, X } from "lucide-react";

export default function ModalCreateMarketplaceLink({ onClose, onSuccess, isOpen }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [products, setProducts] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setFetching(true);
        Promise.all([getProducts(), getMarketplacePlatform()])
            .then(([prod, plat]) => {
                setProducts(prod);
                setPlatforms(plat);
            })
            .finally(() => setFetching(false));
    }, []);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            // Konversi is_active ke boolean/number sesuai kebutuhan API Anda
            const payload = { ...data, is_active: data.is_active === "1" };
            await createMarketplaceLink(payload);
            toast.success("Tautan marketplace berhasil ditambahkan");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Gagal menambahkan link", error);
            toast.error("Gagal menambahkan link");
        } finally {
            setLoading(false);
        }

        if (!isOpen) return null;
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto scrollbar-hide">

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
                        <Link2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Tambah <span className="text-amber-500">Link</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">Hubungkan produk ke toko online</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Select Product */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Pilih Produk</label>
                        <select
                            {...register("product_id", { required: "Produk wajib dipilih" })}
                            className={`w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all appearance-none ${errors.product_id ? "ring-2 ring-red-400" : ""}`}
                        >
                            <option value="">{fetching ? "Memuat produk..." : "— Pilih Produk —"}</option>
                            {products.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                        {errors.product_id && <p className="text-red-500 text-xs ml-1 italic font-medium">{errors.product_id.message}</p>}
                    </div>

                    {/* Select Platform */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Platform Marketplace</label>
                        <select
                            {...register("platform_id", { required: "Platform wajib dipilih" })}
                            className={`w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all appearance-none ${errors.platform_id ? "ring-2 ring-red-400" : ""}`}
                        >
                            <option value="">{fetching ? "Memuat platform..." : "— Pilih Platform —"}</option>
                            {platforms.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                        {errors.platform_id && <p className="text-red-500 text-xs ml-1 italic font-medium">{errors.platform_id.message}</p>}
                    </div>

                    {/* Input URL */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL Tautan</label>
                        <input
                            {...register("url", {
                                required: "URL wajib diisi",
                                pattern: { value: /^https?:\/\/.+/, message: "URL harus diawali http:// atau https://" }
                            })}
                            type="text"
                            placeholder="https://shopee.co.id/nama-produk"
                            className={`w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${errors.url ? "ring-2 ring-red-400" : ""}`}
                        />
                        {errors.url && <p className="text-red-500 text-xs ml-1 italic font-medium">{errors.url.message}</p>}
                    </div>

                    {/* Select Status */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Status Aktivasi</label>
                        <select
                            {...register("is_active", { required: "Status wajib dipilih" })}
                            className={`w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all appearance-none ${errors.is_active ? "ring-2 ring-red-400" : ""}`}
                        >
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-400 font-semibold hover:text-gray-600 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || fetching}
                            className="flex-2 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? "Menyimpan..." : "Simpan Tautan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}