import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ImageIcon, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { getBanner } from "../../services/bannerService";
import ModalCreateBanner from "../../components/admin/ModalCreateBanner";
import ModalUpdateBanner from "../../components/admin/ModalUpdateBanner";

export const Banner = () => {
    const [banner, setBanner] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getBanner();
            setBanner(response);
        } catch (error) {
            console.log("Gagal memuat data banner: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (data) => {
        setSelectedBanner(data);
        setOpenEditModal(true);
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase italic">
                            Manajemen <span className="text-amber-500">Banner</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">Kelola banner promosi untuk halaman utama toko Anda.</p>
                    </div>
                    <button
                        onClick={() => setOpenCreateModal(true)}
                        className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg"
                    >
                        <Plus size={16} /> Tambah Banner
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-amber-50/50 p-4 rounded-3xl mb-8 flex items-center gap-3 border border-amber-100 max-w-md">
                    <Search className="text-amber-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari judul banner..."
                        className="bg-transparent border-none focus:ring-0 w-full text-gray-700 placeholder:text-gray-400"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                        <p>Memuat data banner...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 text-gray-400 uppercase text-xs tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5 font-bold text-center">No</th>
                                        <th className="px-8 py-5 font-bold">Visual Banner</th>
                                        <th className="px-8 py-5 font-bold text-center">Status</th>
                                        <th className="px-8 py-5 font-bold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {banner && banner.length > 0 ? (
                                        banner
                                            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((item, i) => (
                                                <tr key={i} className="hover:bg-amber-50/30 transition-colors group">
                                                    <td className="px-8 py-5 text-gray-400 font-medium text-center">
                                                        {String(i + 1).padStart(2, '0')}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-5">
                                                            <div className="relative group/img h-24 w-44 overflow-hidden rounded-2xl bg-gray-100 border border-gray-100">
                                                                <img
                                                                    src={item.image_url}
                                                                    alt={item.title}
                                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                                                />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-gray-800 text-lg block">{item.title}</span>
                                                                <span className="text-xs text-gray-400 font-mono tracking-tighter">ID: {item.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-center">
                                                        <span
                                                            className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block ${item.is_active === 1 || item.is_active === true
                                                                ? "bg-green-100 text-green-600 border border-green-200"
                                                                : "bg-red-100 text-red-600 border border-red-200"
                                                                }`}
                                                        >
                                                            {item.is_active == 1 ? "Aktif" : "Nonaktif"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-200 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 rounded-xl transition-all duration-300 shadow-sm font-bold text-xs"
                                                            >
                                                                <Pencil size={14} />
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-20 text-gray-400 italic">
                                                <div className="flex flex-col items-center opacity-60">
                                                    <ImageIcon size={48} className="mb-2" />
                                                    <p>Belum ada banner yang ditambahkan.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal Components */}
                {openCreateModal && (
                    <ModalCreateBanner
                        isOpen={openCreateModal}
                        onClose={() => setOpenCreateModal(false)}
                        onSuccess={fetchData}
                    />
                )}

                {openEditModal && (
                    <ModalUpdateBanner
                        data={selectedBanner}
                        onClose={() => setOpenEditModal(false)}
                        onSuccess={fetchData}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}