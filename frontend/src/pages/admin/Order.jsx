import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import { Search, Eye, CheckCircle, XCircle, Clock, CreditCard, User, MapPin, Phone, CheckCircle2, ShoppingBag, Calendar, Truck } from "lucide-react";
import { toast } from "react-toastify";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState({ id: null, status: null });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            // Sort order terbaru di atas
            const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(sortedData);
        } catch (error) {
            console.error("Gagal memuat data pesanan:", error);
            toast.error("Gagal memuat data pesanan");
        }
        setLoading(false);
    };

    const handleInitiateStatusUpdate = (id, status) => {
        setPendingAction({ id, status });
        setIsConfirmModalOpen(true);
    };

    const handleExecuteUpdate = async () => {
        if (!pendingAction.id || !pendingAction.status) return;

        setLoading(true);
        try {
            await updateOrderStatus(pendingAction.id, pendingAction.status);
            setIsConfirmModalOpen(false);
            setIsDetailModalOpen(false);
            toast.success("Berhasil memperbarui status pesanan");
            fetchOrders();
        } catch (error) {
            console.log(error);
            toast.error("Gagal memperbarui status pesanan");
        } finally {
            setLoading(false);
            setPendingAction({ id: null, status: null });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'WAITING_VERIFICATION': return 'bg-blue-50 text-blue-600 border border-blue-200';
            case 'PAID': return 'bg-green-50 text-green-600 border border-green-200';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border border-red-200';
            case 'WAITING_PAYMENT': return 'bg-amber-50 text-amber-600 border border-amber-200';
            default: return 'bg-gray-50 text-gray-500 border border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 uppercase italic tracking-tight">Manajemen <span className="text-amber-500">Pesanan</span></h1>
                        <p className="text-gray-500 text-sm mt-1">Pantau pesanan masuk dan verifikasi pembayaran pelanggan.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl mb-6 flex items-center gap-3 border border-gray-200 shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari Order ID (misal: ORD-...) atau Nama Pelanggan..."
                        className="bg-transparent outline-none border-none w-full text-gray-700 placeholder-gray-400 text-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                        <p className="text-gray-400 text-sm animate-pulse">Sedang memuat data...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-5">Order ID & Waktu</th>
                                        <th className="px-6 py-5">Pelanggan</th>
                                        <th className="px-6 py-5">Total</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.length > 0 ? (
                                        orders
                                            .filter(o => o.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) || o.order_code.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((order) => (
                                                <tr key={order.id} className="hover:bg-amber-50/30 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <div className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded w-fit mb-1">
                                                            #{order.order_code}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                                            <Calendar size={10} /> {formatDate(order.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-gray-800">{order.buyer_name}</div>
                                                        <div className="text-xs text-gray-400">{order.buyer_phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-amber-600">
                                                        Rp {parseInt(order.total_amount).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${getStatusStyle(order.status)}`}>
                                                            {order.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 hover:border-amber-500 hover:text-amber-500 text-gray-600 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
                                                        >
                                                            <Eye size={14} /> Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-20">
                                                <div className="flex flex-col items-center opacity-40">
                                                    <ShoppingBag size={48} className="mb-2 text-gray-300" />
                                                    <p className="italic text-gray-400">Belum ada pesanan masuk.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DETAIL */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white w-full max-w-5xl rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                        {/* Kiri: Bukti Transfer */}
                        <div className="md:w-5/12 bg-gray-900 p-6 flex flex-col relative">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative z-10 flex justify-between items-center mb-6 text-white">
                                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                    <CreditCard size={16} className="text-amber-500" /> Bukti Pembayaran
                                </h3>
                            </div>
                            <div className="flex-1 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden relative group">
                                {selectedOrder.payment_proof ? (
                                    <>
                                        <img src={selectedOrder.payment_proof.image_url} alt="Bukti" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button onClick={() => window.open(selectedOrder.payment_proof.image_url, '_blank')} className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold uppercase hover:bg-amber-500 hover:text-white transition-colors">
                                                Lihat Full Size
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <Clock size={40} className="mx-auto mb-3 opacity-50" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Belum Diupload</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-800 relative z-10">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Status Pesanan</p>
                                <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase ${getStatusStyle(selectedOrder.status)}`}>
                                    {selectedOrder.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {/* Kanan: Detail Data */}
                        <div className="md:w-7/12 bg-white flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 italic uppercase">Verifikasi <span className="text-amber-500">Order</span></h2>
                                    <p className="text-xs font-mono text-gray-400 mt-1">ID: #{selectedOrder.order_code}</p>
                                </div>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                {/* Info Pengiriman */}
                                <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100">
                                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <MapPin size={12} /> Data Pengiriman
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Penerima</p>
                                            <p className="text-sm font-bold text-gray-800">{selectedOrder.buyer_name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Phone size={10} /> {selectedOrder.buyer_phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Alamat Tujuan</p>
                                            <p className="text-xs text-gray-700 leading-relaxed font-medium">{selectedOrder.buyer_address}</p>
                                        </div>
                                    </div>
                                    {/* Tampilkan Info Kurir dari Database */}
                                    {selectedOrder.shipping_courier && (
                                        <div className="mt-3 pt-3 border-t border-amber-100/50 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                                                    <Truck size={10} /> Kurir & Layanan
                                                </p>
                                                <p className="text-xs font-bold text-gray-800 uppercase">
                                                    {selectedOrder.shipping_courier} {selectedOrder.shipping_service ? `- ${selectedOrder.shipping_service}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Rincian Belanja & Ongkir */}
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <ShoppingBag size={12} /> Rincian Belanja
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                    <img src={item.product?.main_image || "https://placehold.co/100"} alt={item.product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="grow">
                                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.name}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">
                                                        {item.product_variants ? `${item.product_variants.color} - ${item.product_variants.size}` : "Default"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-gray-500">x{item.quantity}</p>
                                                    <p className="text-sm font-bold text-amber-600">Rp {item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* --- INFORMASI ONGKIR & TOTAL (LANGSUNG DARI DB) --- */}
                                    <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-100 space-y-2">
                                        {/* Subtotal Item (Hitung manual dari items karena biasanya DB cuma simpan total) */}
                                        <div className="flex justify-between text-xs font-medium text-gray-500">
                                            <span>Subtotal Produk</span>
                                            <span>
                                                Rp {selectedOrder.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        {/* Ongkos Kirim (Dari Kolom Database) */}
                                        <div className="flex justify-between text-xs font-medium text-gray-500">
                                            <span>Ongkos Kirim ({selectedOrder.shipping_courier || 'Ekspedisi'})</span>
                                            <span className="font-bold text-gray-700">
                                                Rp {parseInt(selectedOrder.shipping_cost || 0).toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        {/* Total Akhir */}
                                        <div className="flex justify-between items-end pt-2 border-t border-gray-50 mt-2">
                                            <p className="text-xs text-gray-900 font-black uppercase">Total Tagihan</p>
                                            <p className="text-2xl font-black text-amber-500 tracking-tighter">
                                                Rp {parseInt(selectedOrder.total_amount).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-3">
                                <button onClick={() => handleInitiateStatusUpdate(selectedOrder.id, 'CANCELLED')} className="flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-transparent bg-red-100 text-red-600 hover:bg-red-200 font-bold text-xs uppercase tracking-widest transition-all">
                                    <XCircle size={16} /> Tolak
                                </button>
                                <button onClick={() => handleInitiateStatusUpdate(selectedOrder.id, 'PAID')} className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-900 text-amber-500 hover:bg-black font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95">
                                    <CheckCircle size={16} /> Terima Pembayaran
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white w-full max-w-xs rounded-4xl p-6 shadow-2xl text-center transform scale-100 transition-all">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${pendingAction.status === 'CANCELLED' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                            {pendingAction.status === 'CANCELLED' ? <XCircle size={32} /> : <CheckCircle2 size={32} />}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {pendingAction.status === 'CANCELLED' ? 'Tolak Pesanan?' : 'Konfirmasi Lunas?'}
                        </h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            {pendingAction.status === 'CANCELLED' ? "Pesanan dibatalkan permanen." : "Pastikan nominal bukti transfer sesuai dengan total tagihan."}
                        </p>
                        <div className="flex flex-col gap-2">
                            <button onClick={handleExecuteUpdate} disabled={loading} className={`w-full py-3 rounded-xl font-bold text-white text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50 ${pendingAction.status === 'CANCELLED' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}>
                                {loading ? "Memproses..." : "Ya, Lanjutkan"}
                            </button>
                            <button onClick={() => setIsConfirmModalOpen(false)} className="py-3 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Order;