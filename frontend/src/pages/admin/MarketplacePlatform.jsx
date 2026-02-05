import React, { useEffect, useState } from "react";
import { getMarketplacePlatform } from "../../services/marketplacePlatformService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Plus, Pencil, Trash2, Globe, Search, ChevronLeft, ChevronRight } from "lucide-react";
import ModalAddMarketplacePlatform from "../../components/admin/ModalAddMarketplacePlatform";
import ModalUpdateMarketplacePlatform from "../../components/admin/ModalUpdateMarketplacePlatform";
import ModalDeleteMarketplacePlatform from "../../components/admin/ModalDeleteMarketplacePlatform"; // Import modal delete
import { toast } from "react-toastify";

const MarketplacePlatform = () => {
    const [marketplacePlatform, setMarketplacePlatform] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // State Modal Delete
    const [selectedPlatform, setSelectedPlatform] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getMarketplacePlatform();
            setMarketplacePlatform(response);
        } catch (error) {
            console.log(error);
            toast.error("Gagal memuat data platform");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter & Pagination Logic
    const filteredData = marketplacePlatform.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase italic">
                            Marketplace <span className="text-amber-500">Platforms</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">Kelola daftar platform marketplace yang tersedia.</p>
                    </div>
                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg"
                    >
                        <Plus size={16} /> Tambah Platform
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama platform..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                        <p>Memuat data platform...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/80 text-gray-400 uppercase text-xs tracking-widest">
                                        <tr>
                                            <th className="px-8 py-5 font-bold text-center w-20">No</th>
                                            <th className="px-8 py-5 font-bold">Nama Platform</th>
                                            <th className="px-8 py-5 font-bold text-center w-40">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {marketplacePlatform.length > 0 ? (
                                            currentItems.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors group">
                                                    <td className="px-8 py-5 text-gray-400 font-medium text-center">
                                                        {String(indexOfFirstItem + index + 1).padStart(2, '0')}
                                                    </td>
                                                    <td className="px-8 py-5 font-bold text-gray-800 tracking-wide uppercase italic">
                                                        {item.name}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => { setSelectedPlatform(item); setOpenEditModal(true); }}
                                                                className="p-3 bg-gray-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-2xl transition-all"
                                                            >
                                                                <Pencil size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedPlatform(item); setOpenDeleteModal(true); }}
                                                                className="p-3 bg-gray-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-20">
                                                    <div className="flex flex-col items-center opacity-60">
                                                        <p className="italic">Belum ada data platform.</p>
                                                    </div>
                                                </td>
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
                                    className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 disabled:opacity-20"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                {/* ... map totalPages seperti sebelumnya ... */}
                            </div>
                        )}
                    </>
                )}

                {/* Modals */}
                <ModalAddMarketplacePlatform
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onSuccess={fetchData}
                />

                {selectedPlatform && (
                    <>
                        <ModalUpdateMarketplacePlatform
                            isOpen={openEditModal}
                            onClose={() => setOpenEditModal(false)}
                            onSuccess={fetchData}
                            platform={selectedPlatform}
                        />
                        <ModalDeleteMarketplacePlatform
                            isOpen={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onSuccess={fetchData}
                            data={selectedPlatform}
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MarketplacePlatform;