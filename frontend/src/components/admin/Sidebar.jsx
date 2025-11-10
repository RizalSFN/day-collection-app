import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, FileBarChart, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { removeToken } from "../../utils/storage";

const Sidebar = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const location = useLocation()
    const isActive = (path) => location.pathname == path

    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard", status: isActive("/admin/dashboard") },
        { name: "Produk", icon: <Package size={20} />, path: "/admin/products", status: isActive("/admin/products") },
        { name: "Pesanan", icon: <ShoppingCart size={20} />, path: "/admin/orders", status: isActive("/admin/orders") },
    ];

    const laporanSubmenu = [
        { name: "Laporan Penjualan", path: "/admin/laporan/penjualan" },
        { name: "Laporan Stok", path: "/admin/laporan/stok" },
    ];

    const handleLogout = () => {
        removeToken()
        window.location.href = "/login"
    }

    return (
        <div className="w-64 h-screen bg-amber-500 text-white flex flex-col shadow-lg">
            {/* Header */}
            <div className="px-6 py-4 text-xl font-bold border-b border-amber-400">
                Admin Panel
            </div>

            {/* Menu Utama */}
            <nav className="flex-1 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-6 py-3 rounded-r-full transition-all duration-200 ${item.status
                            ? "bg-white text-amber-600 font-semibold"
                            : "hover:bg-amber-400"
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}

                {/* Dropdown Menu */}
                <div>
                    <button
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className="w-full flex items-center justify-between px-6 py-3 hover:bg-amber-400 rounded-r-full transition-all duration-200 focus:outline-none"
                    >
                        <div className="flex items-center gap-3">
                            <FileBarChart size={20} />
                            <span>Laporan</span>
                        </div>
                        {openDropdown ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    {/* Submenu */}
                    {openDropdown && (
                        <div className="flex flex-col ml-10 mt-1 border-l border-amber-300">
                            {laporanSubmenu.map((sub) => (
                                <NavLink
                                    key={sub.name}
                                    to={sub.path}
                                    className={({ isActive }) =>
                                        `pl-4 py-2 text-sm rounded transition-all duration-200 ${isActive
                                            ? "text-amber-800 bg-white font-medium"
                                            : "text-amber-100 hover:text-white hover:translate-x-1"
                                        }`
                                    }
                                >
                                    • {sub.name}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-6 py-3 mt-auto border-t border-amber-400 hover:bg-red-500 transition-all"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    )
}

export default Sidebar