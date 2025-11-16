import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Produk from "../pages/Product";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login";
import Product from "../pages/admin/Product";
import MarketplacePlatform from "../pages/admin/MarketplacePlatform";
import MarketplaceLink from "../pages/admin/MarketplaceLink";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produk" element={<Produk />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute>
                            <Product />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/marketplace-platform"
                    element={
                        <ProtectedRoute>
                            <MarketplacePlatform />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/marketplace-link"
                    element={
                        <ProtectedRoute>
                            <MarketplaceLink />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
