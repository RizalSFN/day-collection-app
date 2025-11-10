import React from "react";

const Navbar = () => {
    return (
        <div className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center border-b border-amber-100">
            <h1 className="text-lg font-semibold text-amber-600">Dashboard</h1>
            <div className="flex items-center gap-3">
                <span className="text-gray-700">Halo, Admin</span>
                <img
                    src="https://ui-avatars.com/api/?name=Admin&background=f59e0b&color=fff"
                    alt="Admin"
                    className="w-9 h-9 rounded-full shadow-sm"
                />
            </div>
        </div>
    )
}

export default Navbar