import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Produk from "../pages/Product";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login";
import Product from "../pages/admin/Product";
import MarketplacePlatform from "../pages/admin/MarketplacePlatform";
import MarketplaceLink from "../pages/admin/MarketplaceLink";
import { Setting } from "../pages/admin/Setting";
import { Banner } from "../pages/admin/Banner";
import VariantProduct from "../pages/admin/VariantProduct";
import Order from "../pages/admin/Order";
import TrackingOrder from "../pages/TrackingOrder";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produk" element={<Produk />} />
                <Route path="/tracking-order" element={<TrackingOrder />} />
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
                    path="/admin/product-variants"
                    element={
                        <ProtectedRoute>
                            <VariantProduct />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute>
                            <Order />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/banner"
                    element={
                        <ProtectedRoute>
                            <Banner />
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
                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute>
                            <Setting />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
