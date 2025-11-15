import React, { useEffect, useState } from "react";
import { deleteMarketplacePlatform, getMarketplacePlatform } from "../../services/marketplacePlatformService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ModalAddMarketplacePlatform from "../../components/admin/ModalAddMarketplacePlatform";
import ModalUpdateMarketplacePLatform from "../../components/admin/ModalUpdateMarketplacePlatform";
import { toast } from "react-toastify";

const MarketplacePlatform = () => {
    const [marketplacePlatform, setMarketplacePlatform] = useState([])
    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState(null)
    const [openEditModal, setOpenEditModal] = useState(false)

    const fetchData = async () => {
        try {
            const response = await getMarketplacePlatform()
            setMarketplacePlatform(response)
        } catch (error) {
            console.log("Gagal memuat data marketplace platform: ", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (platform) => {
        setSelectedPlatform(platform)
        setOpenEditModal(true)
    }

    const handleDelete = async (id) => {
        try {
            toast(
                ({ closeToast }) => (
                    <div>
                        <p>Yakin ingin menghapus data?</p>
                        <button
                            onClick={async () => {
                                await deleteMarketplacePlatform(id);
                                toast.success("Data berhasil dihapus");
                                fetchData()
                                closeToast();
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-md"
                        >
                            Hapus
                        </button>
                    </div>
                ),
                { autoClose: false }
            );
        } catch (error) {
            console.log(error);
            toast.error("Gagal menghapus data marketplace platform")
        }
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Manajemen Produk
                </h2>
                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={18} />
                    Tambah
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
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketplacePlatform.length > 0 ? (
                                marketplacePlatform.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-3">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-3 font-medium">{item.name}</td>
                                        <td className="px-6 py-3 flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
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

                    {/* modal */}
                    <ModalAddMarketplacePlatform
                        isOpen={openModal}
                        onClose={() => setOpenModal(false)}
                        onSuccess={fetchData}
                    />

                    <ModalUpdateMarketplacePLatform
                        open={openEditModal}
                        onClose={() => setOpenEditModal(false)}
                        onSuccess={fetchData}
                        platform={selectedPlatform}
                    />
                </div>
            )}
        </DashboardLayout>
    )
}

export default MarketplacePlatform