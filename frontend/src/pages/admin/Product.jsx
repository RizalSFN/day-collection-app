import React, { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../../services/productService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";

const Product = () => {
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts()
                setProducts(response)
            } catch (error) {
                console.log("Gagal memuat produk: ", error);
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(products.length / itemsPerPage)

    const handleDelete = async (id) => {
        if (window.confirm("Apakah anda yakin untuk menghapus peroduk ini?")) {
            try {
                await deleteProduct(id)
                setProducts(products.filter((p) => p.id !== id))
                alert("Produk berhasil dihapus")
            } catch (error) {
                console.log(error);
                alert("Terjadi kesalahan saat menghapus produk")
            }
        }
    }

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Manajemen Produk
                </h2>
                <button
                    onClick={() => (window.location.href = "/admin/products/create")}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={18} />
                    Tambah Produk
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-10">Memuat data...</div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-amber-500 text-white uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Nama Produk</th>
                                <th className="px-6 py-3">Harga</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.length > 0 ? (
                                currentProducts.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-3">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-3 font-medium">{item.name}</td>
                                        <td className="px-6 py-3 text-amber-600 font-semibold">
                                            Rp {parseInt(item.base_price).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${item.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    (window.location.href = `/admin/products/edit/${item.id}`)
                                                }
                                                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-gray-500 py-6 italic"
                                    >
                                        Tidak ada produk yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                            ? "bg-amber-500 text-white border-amber-500"
                            : "border-gray-300 hover:bg-amber-100"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </DashboardLayout>
    )
}

export default Product