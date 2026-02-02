import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalUpdateMarketplacePLatform from "../../components/admin/ModalUpdateMarketplacePlatform";
import { Pencil, Plus, Search, SettingsIcon, Trash2 } from "lucide-react";
import { getAppSetting } from "../../services/appSettingService";
import ModalCreateAppSetting from "../../components/admin/ModalCreateAppSetting";
import ModalUpdateAppSetting from "../../components/admin/ModalUpdateAppSetting";

export const Setting = () => {
    const [setting, setSetting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        try {
            const response = await getAppSetting();
            setSetting(response);
        } catch (error) {
            console.log("Gagal memuat data setting: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (data) => {
        setSelectedSetting(data);
        setOpenEditModal(true);
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase italic">App <span className="text-amber-500">Settings</span></h1>
                        <p className="text-gray-500 text-sm font-medium">Konfigurasi variabel global aplikasi Day Collection.</p>
                    </div>
                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg"
                    >
                        <Plus size={16} /> Tambah Setting
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                        <p className="uppercase text-[10px] font-black tracking-widest">Memuat konfigurasi...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 text-gray-400 uppercase text-xs tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5 font-bold">No</th>
                                        <th className="px-8 py-5 font-bold">Nama Konfigurasi</th>
                                        <th className="px-8 py-5 font-bold">Nilai (Value)</th>
                                        <th className="px-8 py-5 font-bold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {setting.length > 0 ? (
                                        setting
                                            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((item, index) => (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-amber-50/30 transition-colors group"
                                                >
                                                    <td className="px-8 py-5 text-gray-400 font-medium">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="font-bold text-gray-800 block">{item.name}</span>
                                                        <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">System Key</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <code className="text-sm bg-gray-50 px-3 py-1.5 rounded-lg text-gray-600 border border-gray-100">
                                                            {item.value}
                                                        </code>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 rounded-xl transition-all duration-300 shadow-sm"
                                                            >
                                                                <Pencil size={14} />
                                                                <span className="text-xs font-bold">Edit</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-20">
                                                <div className="flex flex-col items-center opacity-30">
                                                    <SettingsIcon size={48} className="mb-2" />
                                                    <p className="italic">Belum ada pengaturan aplikasi.</p>
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
                <ModalCreateAppSetting
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onSuccess={fetchData}
                />

                <ModalUpdateAppSetting
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    onSuccess={fetchData}
                    platform={selectedSetting}
                />
            </div>
        </DashboardLayout>
    )
}