import React, { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ModalCreateProduct from "../../components/admin/ModalCreateProduct";
import ModalUpdateProduct from "../../components/admin/ModalUpdateProduct";
import ModalDeleteProduct from "../../components/admin/ModalDeleteProduct";

const Product = () => {
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [loading, setLoading] = useState(true)
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    useEffect(() => {
        fetchProducts()
    }, [])

    const onSuccess = () => {
        fetchProducts()
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(products.length / itemsPerPage)

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Manajemen Produk
                </h2>
                <button
                    onClick={() => setOpenCreateModal(true)}
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
                                <th className="px-6 py-3">Gambar</th>
                                <th className="px-6 py-3">Deskripsi</th>
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
                                        <td className="px-6 py-3 font-medium">
                                            <img
                                                src={item.main_image}
                                                alt={item.slug}
                                                className="h-20 object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-3 font-medium">{item.description}</td>
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
                                        <td className="px-6 py-9 flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(item)
                                                    setOpenUpdateModal(true)
                                                }}
                                                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(item)
                                                    setOpenDeleteModal(true)
                                                }}
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

            {/* Modal Create */}
            {openCreateModal && (
                <ModalCreateProduct
                    onClose={() => setOpenCreateModal(false)}
                    onSuccess={onSuccess}
                />
            )}

            {/* Modal Update */}
            {openUpdateModal && (
                <ModalUpdateProduct
                    data={selectedProduct}
                    onClose={() => setOpenUpdateModal(false)}
                    onSuccess={onSuccess}
                />
            )}

            {/* Modal Delete */}
            {openDeleteModal && (
                <ModalDeleteProduct
                    data={selectedProduct}
                    onClose={() => setOpenDeleteModal(false)}
                    onSuccess={onSuccess}
                />
            )}
        </DashboardLayout>
    )
}

export default Product