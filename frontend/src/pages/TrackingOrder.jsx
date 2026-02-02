import React, { useState } from "react";
import { Search, Package, Clock, CheckCircle2, XCircle, Truck, MapPin, CreditCard } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { trackOrderApi } from "../services/orderService"; // Gunakan service yang kita buat

const TrackingOrder = () => {
    const [keyword, setKeyword] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Di TrackingOrder.jsx
    const handleSearch = async (e) => {
        e.preventDefault();
        const cleanKeyword = keyword.trim(); // Bersihkan spasi di frontend
        if (!cleanKeyword) return;

        setLoading(true);
        try {
            const response = await trackOrderApi(cleanKeyword);
            setOrder(response.data);
        } catch (error) {
            console.log(error);
            setError("Pesanan tidak ditemukan...");
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "WAITING_PAYMENT":
                return { label: "Menunggu Pembayaran", icon: <CreditCard size={20} />, color: "text-amber-500", bg: "bg-amber-50" };
            case "WAITING_VERIFICATION":
                return { label: "Menunggu Verifikasi Admin", icon: <Clock size={20} />, color: "text-blue-500", bg: "bg-blue-50" };
            case "PAID":
                return { label: "Pembayaran Lunas", icon: <CheckCircle2 size={20} />, color: "text-green-500", bg: "bg-green-50" };
            case "SHIPPED":
                return { label: "Dalam Pengiriman", icon: <Truck size={20} />, color: "text-purple-500", bg: "bg-purple-50" };
            case "CANCELLED":
                return { label: "Pesanan Dibatalkan", icon: <XCircle size={20} />, color: "text-red-500", bg: "bg-red-50" };
            default:
                return { label: "Pesanan Diproses", icon: <Package size={20} />, color: "text-gray-500", bg: "bg-gray-50" };
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">
                            Lacak <span className="text-amber-500">Pesanan</span>
                        </h1>
                        <p className="text-[10px] text-gray-400 mt-2 uppercase font-black tracking-[0.3em]">
                            Input kode order atau nama penerima
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative mb-12 group">
                        <input
                            type="text"
                            placeholder="Temukan pesananmu..."
                            className="w-full bg-white border-2 border-transparent rounded-4xl py-5 pl-8 pr-20 shadow-xl shadow-gray-200 focus:border-amber-500 focus:ring-0 font-bold text-gray-700 outline-none transition-all"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-gray-900 text-amber-500 px-8 rounded-3xl font-black uppercase text-xs hover:bg-amber-500 hover:text-black transition-all active:scale-95 disabled:bg-gray-200"
                        >
                            {loading ? "..." : <Search size={20} />}
                        </button>
                    </form>

                    {/* Result Area */}
                    {error && (
                        <div className="text-center p-8 bg-white rounded-[2.5rem] border-2 border-dashed border-red-100 animate-fadeIn">
                            <p className="text-red-500 font-black text-[10px] uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    {order && (
                        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-slideUp">
                            {/* Status Header */}
                            <div className={`p-8 flex items-center justify-between ${getStatusInfo(order.status).bg}`}>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Pesanan</p>
                                    <h2 className={`text-xl font-black uppercase italic ${getStatusInfo(order.status).color}`}>
                                        {getStatusInfo(order.status).label}
                                    </h2>
                                </div>
                                <div className={`${getStatusInfo(order.status).color}`}>
                                    {getStatusInfo(order.status).icon}
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ID Transaksi</p>
                                        <p className="font-mono font-bold text-gray-800 tracking-tighter">#{order.order_code}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                                        <p className="font-black text-amber-600 italic text-lg">Rp {parseInt(order.total_amount).toLocaleString()}</p>
                                    </div>
                                </div>

                                <hr className="border-gray-50" />

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Informasi Penerima</p>
                                            <p className="text-sm font-bold text-gray-700">{order.buyer_name} ({order.buyer_phone})</p>
                                            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed uppercase">{order.buyer_address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Rincian Item</p>
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                            <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-gray-100">
                                                <img
                                                    src={item.product.main_image}
                                                    className="w-full h-full object-cover"
                                                    alt={item.product.name}
                                                />
                                            </div>
                                            <div className="grow">
                                                <p className="text-[11px] font-black uppercase italic text-gray-800">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    {item.product_variants?.color} / {item.product_variants?.size}
                                                </p>
                                                {/* Menampilkan harga per unit agar informasi lebih lengkap */}
                                                <p className="text-[9px] font-black text-amber-500 mt-1">
                                                    Rp {parseInt(item.price).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                            {/* Perbaikan nama field dari item.quality menjadi item.quantity */}
                                            <div className="text-right">
                                                <p className="text-sm font-black text-amber-600">x{item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-900 text-white p-6 rounded-4xl flex items-center gap-4 shadow-xl shadow-gray-200">
                                    <div className="p-3 bg-amber-500 rounded-2xl text-black">
                                        <Clock size={20} strokeWidth={3} />
                                    </div>
                                    <p className="text-[9px] font-bold leading-relaxed italic text-gray-300 uppercase tracking-tight">
                                        Status pesanan diperbarui oleh Admin. Silakan hubungi CS via WhatsApp jika status tidak berubah dalam 1x24 jam.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default TrackingOrder;