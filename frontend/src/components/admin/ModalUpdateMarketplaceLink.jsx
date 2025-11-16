import { useForm } from "react-hook-form";
import { updateMarketplaceLink } from "../../services/marketplaceLinkService";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getMarketplacePlatform } from "../../services/marketplacePlatformService";

export default function ModalUpdateMarketplaceLink({ data, onClose, onSuccess }) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            product_id: data.product_id,
            platform_id: data.platform_id,
            url: data.url,
            is_active: data.is_active ? 1 : 0
        }
    })

    const [products, setProducts] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        Promise.all([getProducts(), getMarketplacePlatform()])
            .then(([prod, plat]) => {
                setProducts(prod);
                setPlatforms(plat);
            });
    }, []);

    const onSubmit = async (formData) => {
        try {
            await updateMarketplaceLink(data.id, formData)

            toast.success("Berhasil mengubah data marketplace link")
            onSuccess()
            onClose()
        } catch (error) {
            console.log("Gagal mengubah data marketplace link", error);
            toast.error("Gagal mengubah data marketplace link")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[450px]">
                <h2 className="text-xl font-semibold mb-4">
                    Update Marketplace Link
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label>Product ID</label>
                        <select {...register("product_id")} className="w-full border p-2 rounded">
                            {products.map((item) => (
                                <option key={item.id} value={item.id} selected={item.product_id == data.product_id ? "selected" : ""}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Platform ID</label>
                        <select {...register("platform_id")} className="w-full border p-2 rounded">
                            {platforms.map((item) => (
                                <option key={item.id} value={item.id} selected={item.platform_id == data.platform_id ? "selected" : ""}>
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
                            <option value="1" selected={data.is_active == 1 ? "selected" : ""}>Aktif</option>
                            <option value="0" selected={data.is_active == 0 ? "selected" : ""}>Nonaktif</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Batal
                        </button>

                        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}