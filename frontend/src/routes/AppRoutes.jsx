import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Produk from "../pages/Product";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produk" element={<Produk />} />
            </Routes>
        </BrowserRouter>
    );
}
