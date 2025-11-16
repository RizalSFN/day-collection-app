import { useForm } from "react-hook-form";
import { createMarketplaceLink } from "../../services/marketplaceLinkService";
import { getProducts } from "../../services/productService";
import { getMarketplacePlatform } from "../../services/marketplacePlatformService";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function ModalCreateMarketplaceLink({ onClose, onSuccess }) {
    const { register, handleSubmit } = useForm()
    const [products, setProducts] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        Promise.all([getProducts(), getMarketplacePlatform()])
            .then(([prod, plat]) => {
                setProducts(prod);
                setPlatforms(plat);
            });
    }, []);

    const onSubmit = async (data) => {
        try {
            await createMarketplaceLink(data)
            toast.success("Berhasil menambahkan marketplace link")
            onSuccess()
            onClose()
        } catch (error) {
            console.log("Gagal menambahkan marketplace link", error);
            toast.error("Gagal menambahkan marketplace link")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[450px]">
                <h2 className="text-xl font-semibold mb-4">
                    Tambah Marketplace Link
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label>Product</label>
                        <select {...register("product_id")} className="w-full border p-2 rounded">
                            <option value="" >Pilih produk</option>
                            {products.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Marketplace Platform</label>
                        <select {...register("platform_id")} className="w-full border p-2 rounded">
                            <option value="" >Pilih platform</option>
                            {platforms.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>URL</label>
                        <input
                            {...register("url")}
                            type="text"
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Status</label>
                        <select {...register("is_active")} className="w-full border p-2 rounded">
                            <option value="" >Pilih status</option>
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Batal
                        </button>

                        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}