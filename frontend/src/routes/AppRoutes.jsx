import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Produk from "../pages/Product";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produk" element={<Produk />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
