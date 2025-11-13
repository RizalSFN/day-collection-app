import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import DashboardContent from "../../components/admin/DashboardContent";
import DashboardLayout from "../../layouts/DashboardLayout";

const Dashboard = () => {
    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    )
}

export default Dashboard