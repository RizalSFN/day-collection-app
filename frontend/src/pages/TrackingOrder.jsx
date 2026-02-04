import React, { useState } from "react";
import { Search, Package, Clock, CheckCircle2, XCircle, Truck, MapPin, CreditCard, ChevronRight, ArrowLeft } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { trackOrderApi } from "../services/orderService";

const TrackingOrder = () => {
    const [keyword, setKeyword] = useState("");

    // State untuk menyimpan HASIL PENCARIAN (Array)
    const [orderList, setOrderList] = useState([]);

    // State untuk menyimpan ORDER YANG DIPILIH untuk dilihat detailnya
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        const cleanKeyword = keyword.trim();
        if (!cleanKeyword) return;

        setLoading(true);
        setError("");
        setOrderList([]);
        setSelectedOrder(null);

        try {
            const response = await trackOrderApi(cleanKeyword);
            const data = response.data; // Asumsi backend return array di dalam data

            if (!data || data.length === 0) {
                setError("Pesanan tidak ditemukan. Periksa kembali kode order atau nama Anda.");
            } else if (data.length === 1) {
                // Jika cuma 1, langsung tampilkan detail
                setSelectedOrder(data[0]);
            } else {
                // Jika banyak, simpan di list untuk dipilih user
                setOrderList(data);
            }
        } catch (error) {
            setError("Terjadi kesalahan saat mencari pesanan.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "WAITING_PAYMENT":
                return { label: "Menunggu Pembayaran", icon: <CreditCard size={20} />, color: "text-amber-500", bg: "bg-amber-50" };
            case "WAITING_VERIFICATION":
                return { label: "Menunggu Verifikasi", icon: <Clock size={20} />, color: "text-blue-500", bg: "bg-blue-50" };
            case "PAID":
                return { label: "Lunas", icon: <CheckCircle2 size={20} />, color: "text-green-500", bg: "bg-green-50" };
            case "SHIPPED":
                return { label: "Dikirim", icon: <Truck size={20} />, color: "text-purple-500", bg: "bg-purple-50" };
            case "CANCELLED":
                return { label: "Dibatalkan", icon: <XCircle size={20} />, color: "text-red-500", bg: "bg-red-50" };
            default:
                return { label: "Diproses", icon: <Package size={20} />, color: "text-gray-500", bg: "bg-gray-50" };
        }
    };

    // --- KOMPONEN KECIL: LIST ITEM ---
    const OrderListItem = ({ order }) => (
        <div
            onClick={() => setSelectedOrder(order)}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer flex justify-between items-center group"
        >
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusInfo(order.status).bg} ${getStatusInfo(order.status).color}`}>
                        {getStatusInfo(order.status).label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                        {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </span>
                </div>
                <p className="font-mono font-bold text-gray-800 text-sm">#{order.order_code}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {order.items?.map(i => i.product.name).join(", ")}
                </p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-amber-500 transition-colors" />
        </div>
    );

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">

                    {/* Header: Sembunyikan jika sedang melihat detail agar bersih */}
                    {!selectedOrder && (
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">
                                Lacak <span className="text-amber-500">Pesanan</span>
                            </h1>
                            <p className="text-[10px] text-gray-400 mt-2 uppercase font-black tracking-[0.3em]">
                                Input nomor telepon atau nama penerima
                            </p>
                        </div>
                    )}

                    {/* Search Bar: Sembunyikan jika sedang melihat detail */}
                    {!selectedOrder && (
                        <form onSubmit={handleSearch} className="relative mb-12 group">
                            <input
                                type="text"
                                placeholder="Temukan Pesananmu..."
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
                    )}

                    {/* Result Area */}
                    {error && (
                        <div className="text-center p-8 bg-white rounded-[2.5rem] border-2 border-dashed border-red-100 animate-fadeIn">
                            <p className="text-red-500 font-black text-[10px] uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    {/* KONDISI 1: Menampilkan List jika hasil > 1 dan belum ada yang dipilih */}
                    {!selectedOrder && orderList.length > 0 && (
                        <div className="space-y-4 animate-slideUp">
                            <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                Ditemukan {orderList.length} Pesanan atas nama "{keyword}"
                            </p>
                            {orderList.map((order) => (
                                <OrderListItem key={order.id} order={order} />
                            ))}
                        </div>
                    )}

                    {/* KONDISI 2: Menampilkan Detail Pesanan */}
                    {selectedOrder && (
                        <div className="animate-slideUp">
                            {/* Tombol Back */}
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase mb-6 hover:text-amber-500 transition-colors"
                            >
                                <ArrowLeft size={16} /> Kembali ke pencarian
                            </button>

                            {/* ... Bagian Detail Order sama persis seperti kode Anda sebelumnya ... */}
                            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                                <div className={`p-8 flex items-center justify-between ${getStatusInfo(selectedOrder.status).bg}`}>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Pesanan</p>
                                        <h2 className={`text-xl font-black uppercase italic ${getStatusInfo(selectedOrder.status).color}`}>
                                            {getStatusInfo(selectedOrder.status).label}
                                        </h2>
                                    </div>
                                    <div className={`${getStatusInfo(selectedOrder.status).color}`}>
                                        {getStatusInfo(selectedOrder.status).icon}
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kode Order</p>
                                            <p className="font-mono font-bold text-gray-800">#{selectedOrder.order_code}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bayar</p>
                                            <p className="font-black text-amber-600 italic text-lg">Rp {parseInt(selectedOrder.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* ... Lanjutkan sisa detail order (alamat, items, dll) ... */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Item Pesanan</p>
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <img src={item.product.main_image} className="w-12 h-12 rounded-lg object-cover" alt="item" />
                                                <div className="grow">
                                                    <p className="text-[11px] font-black uppercase italic text-gray-800">{item.product.name}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                                                        {item.product_variants?.color || '-'} / {item.product_variants?.size || '-'}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-black text-amber-600">x{item.quantity || item.quality}</p>
                                            </div>
                                        ))}
                                    </div>

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