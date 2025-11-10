import React from "react";
import { Package, ShoppingCart, Users } from "lucide-react";

const DashboardContent = () => {
    const stats = [
        { title: "Total Produk", value: 128, icon: <Package />, color: "bg-amber-100 text-amber-700" },
        { title: "Pesanan Baru", value: 32, icon: <ShoppingCart />, color: "bg-amber-200 text-amber-800" },
        { title: "User Aktif", value: 54, icon: <Users />, color: "bg-amber-50 text-amber-700" },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Ringkasan Data
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-6 rounded-xl shadow-md ${item.color}`}
                    >
                        <div>
                            <h3 className="text-lg font-medium">{item.title}</h3>
                            <p className="text-3xl font-bold mt-1">{item.value}</p>
                        </div>
                        <div className="opacity-70">{item.icon}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10 bg-white shadow-md rounded-xl p-6 border border-amber-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Aktivitas Terbaru
                </h3>
                <ul className="text-gray-600 space-y-2">
                    <li>• Produk <b>"Sneakers Kuning"</b> berhasil ditambahkan</li>
                    <li>• Pesanan baru dari pengguna <b>"Rizal Sofiana"</b></li>
                    <li>• Stok produk <b>"Sepatu Lari Amber"</b> diperbarui</li>
                </ul>
            </div>
        </div>
    )
}

export default DashboardContent