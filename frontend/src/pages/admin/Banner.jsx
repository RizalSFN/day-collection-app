import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getBanner } from "../../services/bannerService";
import ModalCreateBanner from "../../components/admin/ModalCreateBanner";
import ModalUpdateBanner from "../../components/admin/ModalUpdateBanner";

export const Banner = () => {
    const [banner, setBanner] = useState([])
    const [loading, setLoading] = useState(true)
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [selectedSetting, setSelectedSetting] = useState(null)
    const [openEditModal, setOpenEditModal] = useState(false)

    const fetchData = async () => {
        try {
            const response = await getBanner()
            setBanner(response)
        } catch (error) {
            console.log("Gagal memuat data banner: ", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (data) => {
        setSelectedSetting(data)
        setOpenEditModal(true)
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Manajemen Banner
                </h2>
                <button
                    onClick={() => setOpenCreateModal(true)}
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
                                <th className="px-6 py-3">Judul</th>
                                <th className="px-6 py-3">Gambar</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banner.length > 0 ? (
                                banner.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-3">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-3 font-medium">{item.title}</td>
                                        <td className="px-6 py-3 font-medium">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="h-20 object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-3 font-medium">{item.is_active == 1 ? "aktif" : "nonaktif"}</td>
                                        <td className="px-6 py-9 flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                                            >
                                                <Pencil size={16} />
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
                                        Tidak ada data yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* modal */}
                    {openCreateModal && (
                        <ModalCreateBanner
                            isOpen={false}
                            onClose={() => setOpenCreateModal(false)}
                            onSuccess={fetchData}
                        />
                    )}

                    {openEditModal && (
                        <ModalUpdateBanner
                            data={selectedSetting}
                            onClose={() => setOpenEditModal(false)}
                            onSuccess={fetchData}
                        />
                    )}
                </div>
            )}
        </DashboardLayout>
    )
}