import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import DashboardContent from "../../components/admin/DashboardContent";

const Dashboard = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <DashboardContent />
                </main>
            </div>
        </div>
    )
}

export default Dashboard