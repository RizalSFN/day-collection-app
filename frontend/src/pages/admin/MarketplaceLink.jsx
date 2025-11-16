import { useEffect, useState } from "react";
import { getOriginallyMarketplaceLink } from "../../services/marketplaceLinkService";

import ModalCreateMarketplaceLink from "../../components/admin/ModalCreateMarketplaceLink";
import ModalUpdateMarketplaceLink from "../../components/admin/ModalUpdateMarketplaceLink";
import ModalDeleteMarketplaceLink from "../../components/admin/ModalDeleteMarketplaceLink";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function MarketplaceLink() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);

    const fetchData = async () => {
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

    const onSuccess = () => {
        fetchData();
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Manajemen Marketplace Link
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
            ) : links.length === 0 ? (
                <div className="text-center text-gray-500 py-10">Tidak ada data</div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-amber-500 text-white uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Platform</th>
                                <th className="px-6 py-3">url</th>
                                <th className="px-6 py-3">status</th>
                                <th className="px-6 py-3">aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-3">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-3 font-medium">{item.products.name}</td>
                                    <td className="px-6 py-3 font-medium">{item.marketplace_platform.name}</td>
                                    <td className="px-6 py-3 font-medium">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            className="text-blue-600 underline"
                                        >
                                            {item.url}
                                        </a>
                                    </td>
                                    <td className="px-6 py-3 font-medium">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${item.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item.is_active ? "Aktif" : "Nonaktif"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedLink(item);
                                                setOpenUpdateModal(true);
                                            }}
                                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedLink(item);
                                                setOpenDeleteModal(true);
                                            }}
                                            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Modal Create */}
                    {openCreateModal && (
                        <ModalCreateMarketplaceLink
                            onClose={() => setOpenCreateModal(false)}
                            onSuccess={onSuccess}
                        />
                    )}

                    {/* Modal Update */}
                    {openUpdateModal && (
                        <ModalUpdateMarketplaceLink
                            data={selectedLink}
                            onClose={() => setOpenUpdateModal(false)}
                            onSuccess={onSuccess}
                        />
                    )}

                    {/* Modal Delete */}
                    {openDeleteModal && (
                        <ModalDeleteMarketplaceLink
                            data={selectedLink}
                            onClose={() => setOpenDeleteModal(false)}
                            onSuccess={onSuccess}
                        />
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
