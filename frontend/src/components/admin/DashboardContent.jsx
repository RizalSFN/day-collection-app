import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, Image } from "lucide-react";
import { getProducts } from "../../services/productService";
import { getBanner } from "../../services/bannerService";
import { getMarketplacePlatform } from "../../services/marketplacePlatformService"

const DashboardContent = () => {
    const [dashboardStats, setDashboardStats] = useState({
        totalMarketplace: 0,
        totalProducts: 0,
        totalUsers: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    products,
                    banner,
                    marketplaces,
                ] = await Promise.all([
                    getProducts(),
                    getBanner(),
                    getMarketplacePlatform(),
                ]);

                setDashboardStats({
                    totalProducts: products.length,
                    totalBanner: banner.length,
                    totalMarketplace: marketplaces.length,
                });
            } catch (error) {
                console.error("Gagal memuat data dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        {
            title: "Marketplace Platform",
            value: dashboardStats.totalMarketplace,
            icon: <ShoppingCart />,
            color: "bg-amber-100 text-amber-700",
        },
        {
            title: "Total Produk",
            value: dashboardStats.totalProducts,
            icon: <Package />,
            color: "bg-amber-200 text-amber-800",
        },
        {
            title: "User Aktif",
            value: dashboardStats.totalBanner,
            icon: <Image />,
            color: "bg-amber-50 text-amber-700",
        },
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
                            <h3 className="text-lg font-medium">
                                {item.title}
                            </h3>

                            {loading ? (
                                <div className="h-8 w-16 bg-gray-300 animate-pulse rounded mt-2"></div>
                            ) : (
                                <p className="text-3xl font-bold mt-1">
                                    {item.value}
                                </p>
                            )}
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
                    <li>• Banner baru berhasil dipublikasikan</li>
                    <li>• Produk <b>"Sneakers Kuning"</b> berhasil ditambahkan</li>
                    <li>• Marketplace <b>"Shopee"</b> diaktifkan</li>
                </ul>
            </div>
        </div>
    )
}

export default DashboardContent