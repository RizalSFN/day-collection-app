import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, Image as ImageIcon, LayoutDashboard, ArrowRight, NotebookText } from "lucide-react";
import { getProducts } from "../../services/productService";
import { getOrders } from "../../services/orderService";
import { getMarketplacePlatform } from "../../services/marketplacePlatformService";
import { Link } from "react-router-dom";

const DashboardContent = () => {
    const [dashboardStats, setDashboardStats] = useState({
        totalMarketplace: 0,
        totalProducts: 0,
        totalOrders: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [products, orders, marketplaces] = await Promise.all([
                    getProducts(),
                    getOrders(),
                    getMarketplacePlatform(),
                ]);

                setDashboardStats({
                    totalProducts: products.length,
                    totalOrders: orders.length,
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
            title: "Marketplace",
            label: "Platform Aktif",
            value: dashboardStats.totalMarketplace,
            icon: <ShoppingCart size={28} />,
            color: "text-amber-500",
            bg: "bg-amber-50",
            link: "/admin/marketplace-platform"
        },
        {
            title: "Produk",
            label: "Item Terdaftar",
            value: dashboardStats.totalProducts,
            icon: <Package size={28} />,
            color: "text-blue-500",
            bg: "bg-blue-50",
            link: "/admin/products"
        },
        {
            title: "Pesanan",
            label: "Pesanan Produk",
            value: dashboardStats.totalOrders,
            icon: <NotebookText size={28} />,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            link: "/admin/orders"
        },
    ];

    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            {/* Header Dashboard */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <LayoutDashboard className="text-amber-500" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Ringkasan <span className="text-amber-500">Statistik</span>
                    </h2>
                </div>
                <p className="text-gray-500 ml-12">Pantau performa konten katalog Anda hari ini.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Decorative Circle */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${item.bg} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>

                        <div className="relative z-10">
                            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>

                            <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">
                                {item.label}
                            </h3>

                            <div className="flex items-end justify-between">
                                {loading ? (
                                    <div className="h-10 w-20 bg-gray-100 animate-pulse rounded-xl"></div>
                                ) : (
                                    <p className="text-4xl font-black text-gray-900 leading-none">
                                        {item.value}
                                    </p>
                                )}
                                <span className="text-gray-900 font-bold text-lg">{item.title}</span>
                            </div>

                            <Link to={item.link} className="mt-6 pt-6 border-t border-gray-50 flex items-center text-xs font-bold text-amber-600 cursor-pointer group/link">
                                LIHAT DETAIL
                                <ArrowRight size={14} className="ml-2 group-hover/link:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Welcome Banner / Info Additional */}
            <div className="mt-10 bg-amber-500 rounded-[3rem] p-10 relative overflow-hidden shadow-lg shadow-amber-200">
                <div className="relative z-10 max-w-lg text-white">
                    <h3 className="text-2xl font-bold mb-2">Selamat Datang di Panel Admin</h3>
                    <p className="opacity-90 leading-relaxed">
                        Kelola tautan produk, platform marketplace, dan visual banner Anda dengan mudah dalam satu tempat yang terorganisir.
                    </p>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-20"></div>
                <div className="absolute bottom-0 right-10 opacity-20 transform translate-y-1/4">
                    <LayoutDashboard size={200} />
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;