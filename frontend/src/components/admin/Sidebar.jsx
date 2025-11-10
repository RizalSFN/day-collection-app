import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { removeToken } from "../../utils/storage";

const Sidebar = () => {
    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
        { name: "Produk", icon: <Package size={20} />, path: "/admin/products" },
        { name: "Pesanan", icon: <ShoppingCart size={20} />, path: "/admin/orders" }
    ]

    const handleLogout = () => {
        removeToken()
        window.location.href = "/login"
    }

    return (
        <div className="w-64 h-screen bg-amber-500 text-white flex flex-col shadow-lg">
            <div className="px-6 py-4 text-xl font-bold border-b border-amber-400">
                Admin Panel
            </div>

            <nav className="flex-1 mt-4">
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
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-6 py-3 mt-auto border-t border-amber-400 hover:bg-amber-400 transition-all"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    )
}

export default Sidebar