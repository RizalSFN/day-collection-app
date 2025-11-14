import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    FileBarChart,
    ChevronDown,
    ChevronRight,
    LogOut,
    X,
} from "lucide-react";
import { removeToken } from "../../utils/storage";

const Sidebar = ({ isOpen, closeSidebar }) => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard", status: isActive("/admin/dashboard") },
        { name: "Produk", icon: <Package size={20} />, path: "/admin/products", status: isActive("/admin/products") },
    ];

    const marketplaceSubMenu = [
        { name: "Marketplace Link", path: "/admin/marketplace-link", status: isActive("/admin/marketplace-link") },
        { name: "Marketplace Platform", path: "/admin/marketplace-platform", status: isActive("/admin/marketplace-platform") },
    ];

    const isSubMenuActive = marketplaceSubMenu.some(sub => isActive(sub.path));

    useEffect(() => {
        if (isSubMenuActive) {
            setOpenDropdown(true)
        }
    }, [location.pathname, isSubMenuActive])

    const handleLogout = () => {
        removeToken();
        window.location.href = "/login";
    };

    return (
        <>
            {/* Overlay untuk mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 sm:opacity-10 z-40 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-amber-500 text-white shadow-xl flex flex-col transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        w-3/4 sm:w-64 lg:translate-x-0`}
            >
                {/* Tombol close (mobile only) */}
                <button
                    onClick={closeSidebar}
                    className="absolute top-4 right-4 lg:hidden text-white hover:text-amber-200"
                >
                    <X size={22} />
                </button>

                {/* Header */}
                <div className="px-6 py-4 text-xl font-bold border-b border-amber-400">
                    Admin Panel
                </div>

                {/* Menu utama */}
                <nav className="flex-1 mt-4 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-3 rounded-r-full transition-all duration-200 ${isActive
                                    ? "bg-white text-amber-600 font-semibold"
                                    : "hover:bg-amber-400"
                                }`
                            }
                            onClick={closeSidebar}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}

                    {/* Dropdown menu */}
                    <div>
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className={`w-full flex items-center justify-between px-6 py-3 rounded-r-full transition-all duration-200 focus:outline-none ${isActive("/admin/marketplace-link") || isActive("/admin/marketplace-platform")
                                ? "bg-white text-amber-600 font-semibold"
                                : "hover:bg-amber-400"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <FileBarChart size={20} />
                                <span>Laporan</span>
                            </div>
                            {openDropdown ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>

                        {(openDropdown || isSubMenuActive) && (
                            <div className="flex flex-col ml-10 mt-1 border-l border-amber-300">
                                {marketplaceSubMenu.map((sub) => (
                                    <NavLink
                                        key={sub.name}
                                        to={sub.path}
                                        className={`pl-4 py-2 text-sm rounded transition-all duration-200 ${sub.status
                                            ? "text-white font-medium"
                                            : "text-amber-100 hover:text-white hover:font-medium"
                                            }`
                                        }
                                        onClick={closeSidebar}
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
        </>
    );
};

export default Sidebar;
