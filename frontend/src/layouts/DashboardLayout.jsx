import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex bg-[#f8f8f8] min-h-screen">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

            {/* Konten utama */}
            <div
                className={`
          flex-1 flex flex-col transition-all duration-300
          ${isSidebarOpen ? "blur-sm lg:blur-0" : ""}
          lg:ml-64
        `}
            >
                {/* Header / Navbar */}
                <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-md hover:bg-amber-100"
                        >
                            <Menu size={22} className="text-amber-600" />
                        </button>
                        <h1 className="text-xl font-semibold text-amber-700">Dashboard Admin</h1>
                    </div>
                </header>

                {/* Konten halaman */}
                <main className="p-6 flex-1">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
