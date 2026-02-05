import { useEffect, useState } from "react";
import { getOriginallyMarketplaceLink } from "../../services/marketplaceLinkService";

import ModalCreateMarketplaceLink from "../../components/admin/ModalCreateMarketplaceLink";
import ModalUpdateMarketplaceLink from "../../components/admin/ModalUpdateMarketplaceLink";
import ModalDeleteMarketplaceLink from "../../components/admin/ModalDeleteMarketplaceLink";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ChevronLeft, ChevronRight, ExternalLink, LinkIcon, Pencil, Plus, Search, Trash2 } from "lucide-react";

export default function MarketplaceLink() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getOriginallyMarketplaceLink();
            setLinks(response);
        } catch (error) {
            console.log("Gagal memuat data marketplace link:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredLinks = links.filter((item) =>
        item.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.marketplace_platform?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logika Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLinks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);

    const onSuccess = () => {
        fetchData();
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase italic">
                            Marketplace <span className="text-amber-500">Links</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">Kelola tautan produk ke berbagai marketplace.</p>
                    </div>
                    <button
                        onClick={() => setOpenCreateModal(true)}
                        className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg"
                    >
                        <Plus size={16} /> Tambah Link
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari produk atau platform..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset ke halaman 1 saat mencari
                            }}
                        />
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        Menampilkan {currentItems.length} dari {filteredLinks.length} data
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                        <p>Memuat data...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/80 text-gray-400 uppercase text-xs tracking-widest">
                                        <tr>
                                            <th className="px-8 py-5 font-bold text-center">No</th>
                                            <th className="px-8 py-5 font-bold">Produk & Platform</th>
                                            <th className="px-8 py-5 font-bold">URL</th>
                                            <th className="px-8 py-5 font-bold text-center">Status</th>
                                            <th className="px-8 py-5 font-bold text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm">
                                        {currentItems.length > 0 ? (
                                            currentItems.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors group">
                                                    <td className="px-8 py-5 text-gray-400 text-center font-mono">
                                                        {String(indexOfFirstItem + index + 1).padStart(2, '0')}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="font-bold text-gray-800 block">{item.products?.name}</span>
                                                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block uppercase tracking-wider">
                                                            {item.marketplace_platform?.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                                            Link <ExternalLink size={12} />
                                                        </a>
                                                    </td>
                                                    <td className="px-8 py-5 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${item.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                                            {item.is_active ? "AKTIF" : "NONAKTIF"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex justify-center gap-2">
                                                            <button onClick={() => { setSelectedLink(item); setOpenUpdateModal(true); }} className="p-2.5 bg-gray-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all"><Pencil size={16} /></button>
                                                            <button onClick={() => { setSelectedLink(item); setOpenDeleteModal(true); }} className="p-2.5 bg-gray-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-10 text-center text-gray-400 italic">Data tidak ditemukan...</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-amber-500 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-11 h-11 rounded-2xl font-bold transition-all shadow-sm ${currentPage === i + 1
                                                ? "bg-amber-500 text-white shadow-amber-200"
                                                : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-amber-500 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Modal Container */}
                {openCreateModal && <ModalCreateMarketplaceLink isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} onSuccess={onSuccess} />}
                {openUpdateModal && <ModalUpdateMarketplaceLink isOpen={openUpdateModal} data={selectedLink} onClose={() => setOpenUpdateModal(false)} onSuccess={onSuccess} />}
                {openDeleteModal && <ModalDeleteMarketplaceLink isOpen={openDeleteModal} data={selectedLink} onClose={() => setOpenDeleteModal(false)} onSuccess={onSuccess} />}
            </div>
        </DashboardLayout>
    );
}
