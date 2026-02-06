import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Plus, Pencil, Trash2, Save, X, Layers, AlertCircle } from "lucide-react";
import { getProducts } from "../../services/productService";
import {
    getVariantsByProduct,
    createVariant,
    updateVariant,
    deleteVariant
} from "../../services/variantService";
import { toast } from "react-toastify";

const VariantProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);

    // State untuk Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    const [formData, setFormData] = useState({
        color: "",
        size: "",
        stock: "",
        price: "",
    });
    const [variantIdToDelete, setVariantIdToDelete] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            const productData = await getProducts();
            setProducts(productData);
            if (productData.length > 0) {
                setSelectedProduct(productData[0]);
                loadVariants(productData[0].id);
            }
        };
        fetchInitialData()
    }, [])


    const loadVariants = async (productId) => {
        setLoading(true);
        try {
            const data = await getVariantsByProduct(productId);
            setVariants(data);
        } catch (error) {
            console.error("Gagal memuat data varian", error);
            toast.error("Gagal memuat data varian")
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openModal = (variant = null) => {
        if (variant) {
            setEditingVariant(variant);
            setFormData({
                color: variant.color,
                size: variant.size,
                stock: variant.stock,
                price: variant.price
            });
        } else {
            setEditingVariant(null);
            setFormData({ color: "", size: "", stock: "", price: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                product_id: selectedProduct.id,
                stock: parseInt(formData.stock),
                price: parseFloat(formData.price)
            };

            if (editingVariant) {
                await updateVariant(editingVariant.id, payload);
                toast.success("Berhasil memperbarui data varian")
            } else {
                await createVariant(payload);
                toast.success("Berhasil menambah data varian")
            }

            setIsModalOpen(false);
            loadVariants(selectedProduct.id);
        } catch (error) {
            console.log(error);
            alert("Terjadi kesalahan saat menyimpan data varian");
            toast.error("Terjadi kesalahan saat menyimpan data varian")
        }
    };

    const confirmDelete = (id) => {
        setVariantIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleExecuteDelete = async () => {
        setLoading(true);
        try {
            await deleteVariant(variantIdToDelete);
            setIsDeleteModalOpen(false);
            setVariantIdToDelete(null);
            toast.success("Berhasil menghapus data varian")
            loadVariants(selectedProduct.id)
        } catch (error) {
            console.log(error);
            toast.error("Gagal menghapus data varian")
        }
        setLoading(false);
    };

    return (
        <DashboardLayout>
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase italic">Master <span className="text-amber-500">Variants</span></h1>
                        <p className="text-gray-500 text-sm font-medium">Kelola SKU produk berdasarkan ukuran dan warna.</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-500 transition-all shadow-lg"
                    >
                        <Plus size={16} /> ADD NEW VARIANT
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* List Produk (Kiri) */}
                    <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">Select Product</h3>
                        {products.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => { setSelectedProduct(p); loadVariants(p.id); }}
                                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedProduct?.id === p.id ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-transparent bg-white hover:bg-gray-100'}`}
                            >
                                <p className="font-bold text-gray-800 text-sm truncate uppercase italic">{p.name}</p>
                                <p className="text-[10px] text-gray-400">Rp {parseInt(p.base_price).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabel Varian (Kanan) */}
                    <div className="lg:col-span-3 bg-white rounded-4xl shadow-sm border border-gray-100 flex flex-col h-125">

                        {/* 2. Wrapper khusus untuk scroll area */}
                        <div className="overflow-y-auto flex-1 w-full rounded-4xl scrollbar-hide">
                            <table className="w-full text-left">

                                {/* 3. Jadikan Header Sticky (Menempel di atas) */}
                                <thead className="bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-5">Color</th>
                                        <th className="px-6 py-5">Size</th>
                                        <th className="px-6 py-5">Stock</th>
                                        <th className="px-6 py-5">Price</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold animate-pulse">MEMUAT VARIAN...</td></tr>
                                    ) : variants.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-20 text-center">
                                                {/* Pastikan import Layers sudah ada */}
                                                <Layers className="mx-auto text-gray-200 mb-2" size={48} />
                                                <p className="text-gray-400 italic">Belum ada varian untuk produk ini.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        variants.map((v) => (
                                            <tr key={v.id} className="hover:bg-amber-50/10 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-700">{v.color}</td>
                                                <td className="px-6 py-4"><span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono">{v.size}</span></td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-bold ${v.stock < 5 ? 'text-red-500' : 'text-gray-600'}`}>
                                                        {v.stock} <span className="text-[9px] uppercase tracking-tighter">pcs</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-amber-600 font-black italic">Rp {v.price.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => openModal(v)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"><Pencil size={16} /></button>
                                                        <button onClick={() => confirmDelete(v.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form (Tambah/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={24} /></button>

                        <h2 className="text-xl font-black italic uppercase text-gray-900 mb-6">
                            {editingVariant ? 'Edit' : 'Add'} <span className="text-amber-500">Variant</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Color / Variant Name</label>
                                <input name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. Jet Black" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 mt-1" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Size</label>
                                    <input name="size" value={formData.size} onChange={handleInputChange} placeholder="L, XL, or All Size" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 mt-1" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                                    <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="0" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 mt-1" required />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price (IDR)</label>
                                <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="165000" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 mt-1" required />
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full py-4 bg-gray-900 hover:bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                    {/* <Save size={18} /> {editingVariant ? 'Update Variant' : 'Create Variant'} */}
                                    <Save size={18} /> {editingVariant ? loading ? 'Update Variant' : 'Memproses...' : 'Create Variant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-fadeIn text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={40} />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Varian?</h3>
                        <p className="text-gray-500 text-sm mb-8">
                            Tindakan ini tidak dapat dibatalkan. Varian akan dihapus permanen.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleExecuteDelete}
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "Menghapus..." : "Ya, Hapus Sekarang"}
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-full py-4 text-gray-400 font-semibold hover:text-gray-600 transition-colors"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default VariantProduct;