import React, { useEffect, useState } from "react";
import { getMarketplacePlatform } from "../../services/marketplacePlatformService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";

const MarketplacePlatform = () => {
    const [marketplacePlatform, setMarketplacePlatform] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        fetchData()
    }, [])

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Manajemen Produk
                </h2>
                <button
                    onClick={() => (window.location.href = "/admin/marketplace-platform/create")}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={18} />
                    Tambah Marketplace Platform
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
                                                onClick={() =>
                                                    (window.location.href = `/admin/marketplace-platform/edit/${item.id}`)
                                                }
                                                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
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
        </DashboardLayout>
    )
}

export default MarketplacePlatform