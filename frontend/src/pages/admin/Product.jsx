import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Plus, Pencil, Trash2, Search, Edit } from "lucide-react";
import ModalCreateProduct from "../../components/admin/ModalCreateProduct";
import ModalUpdateProduct from "../../components/admin/ModalUpdateProduct";
import ModalDeleteProduct from "../../components/admin/ModalDeleteProduct";
import { toast } from "react-toastify";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // State untuk Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        harga: "", // Sesuai parameter payload Anda
        is_active: "active",
        main_image: null
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            // Jika input file, ambil file pertamanya saja.
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingProduct !== null) {
                await updateProduct(editingProduct.id, formData);
                toast.success("Berhasil memeperbarui data produk")
            } else {
                await createProduct(formData);
                toast.success("Berhasil menambah data produk")
            }
            setIsModalOpen(false);
            fetchProducts();
            resetForm();
        } catch (error) {
            console.log(error);
            toast.error("Terjadi kesalahan saat menyimpan produk")
        }
        setLoading(false);
        setEditingProduct(null)
    };

    const confirmDelete = (id) => {
        setProductIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleExecuteDelete = async () => {
        setLoading(true);
        try {
            await deleteProduct(productIdToDelete);
            setIsDeleteModalOpen(false);
            setProductIdToDelete(null);
            toast.success("Berhasil menghapus data produk")
            fetchProducts(); // Refresh data
        } catch (error) {
            console.log(error);
            toast.error("Gagal menghapus data produk")
        }
        setLoading(false);
    };

    const resetForm = () => {
        setFormData({ name: "", slug: "", description: "", harga: "", is_active: "active", main_image: null });
        setEditingProduct(null);
    }

    return (
        <DashboardLayout>
            <div className="p-6 md:p-10 bg-white min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase italic">
                            Manajemen <span className="text-amber-500">Produk</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">Kelola katalog produk Day Collection Anda di sini.</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg"
                    >
                        <Plus size={16} /> Tambah Produk
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="bg-amber-50/50 p-4 rounded-3xl mb-6 flex items-center gap-3 border border-amber-100">
                    <Search className="text-amber-500" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama produk..."
                        className="bg-transparent outline-0 border-none focus:ring-0 w-full text-gray-700"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Product Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                        <p>Memuat data produk...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 uppercase text-xs tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Produk</th>
                                    <th className="px-6 py-4">Harga</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.length > 0 ? (
                                    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                                        <tr key={product.id} className="hover:bg-amber-50/20 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={product.main_image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                                                    <div>
                                                        <div className="font-bold text-gray-800">{product.name}</div>
                                                        <div className="text-xs text-gray-400">{product.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">
                                                Rp {parseInt(product.base_price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => { setEditingProduct(product); setFormData({ ...product, harga: product.base_price }); setIsModalOpen(true); }}
                                                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(product.id)} // Panggil modal konfirmasi
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-20">
                                            <div className="flex flex-col items-center opacity-60">
                                                <p className="italic">Belum ada data produk.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Form Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Nama Produk</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Slug</label>
                                <input name="slug" value={formData.slug} onChange={handleInputChange} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Harga (Base Price)</label>
                                <input name="harga" type="number" value={formData.harga} onChange={handleInputChange} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Deskripsi</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-amber-500" required></textarea>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Status</label>
                                <select name="is_active" value={formData.is_active} onChange={handleInputChange} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-amber-500">
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Foto Produk Utama</label>
                                <input type="file" name="main_image" onChange={handleInputChange} className="text-xs file:bg-amber-50 file:text-amber-700 file:border-none file:rounded-lg file:px-4 file:py-2" />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-400 font-medium">Batal</button>
                                <button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-2xl font-bold transition">
                                    {loading ? 'Menyimpan...' : 'Simpan Produk'}
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

                        <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Produk?</h3>
                        <p className="text-gray-500 text-sm mb-8">
                            Tindakan ini tidak dapat dibatalkan. Produk akan dihapus permanen dari katalog.
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
    )
}

export default Product