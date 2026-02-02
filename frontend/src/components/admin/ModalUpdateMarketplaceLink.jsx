import { useForm } from "react-hook-form";
import { updateMarketplaceLink } from "../../services/marketplaceLinkService";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getMarketplacePlatform } from "../../services/marketplacePlatformService";
import { Edit3, Loader2, Save, X } from "lucide-react";

export default function ModalUpdateMarketplaceLink({ data, onClose, onSuccess, isOpen }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            product_id: data?.product_id,
            platform_id: data?.platform_id,
            url: data?.url,
            is_active: data?.is_active ? "1" : "0"
        }
    });

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

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            const payload = { ...formData, is_active: formData.is_active === "1" };
            await updateMarketplaceLink(data.id, payload);
            toast.success("Perubahan tautan berhasil disimpan");
            onSuccess();
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Gagal memperbarui tautan");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto scrollbar-hide">

                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                        <Edit3 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Edit <span className="text-blue-500">Tautan</span></h2>
                        <p className="text-gray-500 text-sm font-medium">Perbarui informasi marketplace link</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Produk</label>
                        <select {...register("product_id")} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none appearance-none transition-all">
                            {products.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Platform</label>
                        <select {...register("platform_id")} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none appearance-none transition-all">
                            {platforms.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">URL Tautan</label>
                        <input
                            {...register("url", { required: "URL tidak boleh kosong" })}
                            type="text"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                        <select {...register("is_active")} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none appearance-none transition-all">
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-gray-400 font-semibold">Batal</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? "Menyimpan..." : "Update Link"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}