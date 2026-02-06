import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import { Search, Eye, CheckCircle, XCircle, Clock, CreditCard, User, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [pendingAction, setPendingAction] = useState({ id: null, status: null })

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Gagal memuat data pesanan:", error);
            toast.error("Gagal memuat data pesanan")
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

            // Tutup semua modal terkait
            setIsConfirmModalOpen(false);
            setIsDetailModalOpen(false);

            toast.success("Berhasil memperbarui status pesanan");
            fetchOrders();
        } catch (error) {
            console.log(error);
            toast.error("Gagal memperbarui status pesanan");
        } finally {
            setLoading(false);
            // Reset pending action (opsional, tapi good practice)
            setPendingAction({ id: null, status: null });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'WAITING_VERIFICATION': return 'bg-blue-100 text-blue-600';
            case 'PAID': return 'bg-green-100 text-green-600';
            case 'CANCELLED': return 'bg-red-100 text-red-600';
            case 'WAITING_PAYMENT': return 'bg-amber-100 text-amber-600';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-10 bg-white min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 uppercase italic">Manajemen <span className="text-amber-500">Pesanan</span></h1>
                        <p className="text-gray-500 text-sm">Pantau pesanan masuk dan verifikasi pembayaran pelanggan.</p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="bg-amber-50/50 p-4 rounded-3xl mb-6 flex items-center gap-3 border border-amber-100">
                    <Search className="text-amber-500" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama pelanggan atau kode order..."
                        className="bg-transparent outline-0 border-none focus:ring-0 w-full text-gray-700"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Order Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                        <p>Memuat data pesanan...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 uppercase text-xs tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Order Code</th>
                                    <th className="px-6 py-4">Pelanggan</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.length > 0 ? (
                                    orders
                                        .filter(o => o.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) || o.order_code.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((order) => (
                                            <tr key={order.id} className="hover:bg-amber-50/20 transition">
                                                <td className="px-6 py-4 font-mono text-sm font-bold text-gray-600">
                                                    #{order.order_code}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-800">{order.buyer_name}</div>
                                                    <div className="text-xs text-gray-400">{order.buyer_phone}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-700">
                                                    Rp {parseInt(order.total_amount).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                                                        {order.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                                                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-amber-100"
                                                        >
                                                            <Eye size={14} /> Detail & Verifikasi
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20">
                                            <div className="flex flex-col items-center opacity-60">
                                                <p className="italic">Belum ada data pesanan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Detail & Verifikasi Pembayaran */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 italic uppercase">Detail <span className="text-amber-500">Pesanan</span></h2>
                                <p className="text-gray-400 font-mono text-sm">#{selectedOrder.order_code}</p>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Kiri: Bukti Pembayaran */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <CreditCard size={14} className="text-amber-500" /> Bukti Transfer
                                </h4>
                                <div className="aspect-3/4 bg-gray-50 rounded-3xl border-4 border-gray-100 overflow-hidden relative group">
                                    {selectedOrder.payment_proof ? (
                                        <img
                                            src={selectedOrder.payment_proof.image_url}
                                            alt="Bukti Transfer"
                                            className="w-full h-full object-contain cursor-zoom-in"
                                            onClick={() => window.open(selectedOrder.payment_proof.image_url, '_blank')}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                            <Clock size={48} className="mb-2" />
                                            <p className="text-xs font-bold uppercase">Belum ada bukti</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Kanan: Info Pelanggan & Produk */}
                            <div className="space-y-6">
                                <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                                    <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4">Informasi Pengiriman</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 text-sm text-gray-700">
                                            <User size={16} className="text-amber-500 shrink-0" />
                                            <span className="font-bold">{selectedOrder.buyer_name}</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-sm text-gray-700">
                                            <Phone size={16} className="text-amber-500 shrink-0" />
                                            <span>{selectedOrder.buyer_phone}</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-sm text-gray-700">
                                            <MapPin size={16} className="text-amber-500 shrink-0" />
                                            <span className="text-xs leading-relaxed">{selectedOrder.buyer_address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Item Pesanan</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{item.product.name}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">{item.product_variants?.color} - {item.product_variants?.size}</p>
                                                </div>
                                                <div className="text-right text-sm">
                                                    <p className="font-bold text-amber-600">x{item.quantity}</p>
                                                    <p className="text-[10px] text-gray-400">Rp {item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-dashed flex justify-between items-center">
                                        <span className="font-bold text-gray-900 uppercase italic">Total Pembayaran</span>
                                        <span className="text-xl font-black text-amber-500 tracking-tighter">Rp {selectedOrder.total_amount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3 pt-6">
                                    <button
                                        onClick={() => handleInitiateStatusUpdate(selectedOrder.id, 'CANCELLED')}
                                        className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-all"
                                    >
                                        <XCircle size={18} /> Batalkan
                                    </button>
                                    <button
                                        onClick={() => handleInitiateStatusUpdate(selectedOrder.id, 'PAID')}
                                        className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-200 transition-all active:scale-95"
                                    >
                                        <CheckCircle size={18} /> Verifikasi Lunas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Update Status */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-fadeIn text-center">

                        {/* Ikon & Warna Dinamis berdasarkan Status */}
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 
                ${pendingAction.status === 'CANCELLED' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>

                            {pendingAction.status === 'CANCELLED' ? (
                                <XCircle size={40} />
                            ) : (
                                <CheckCircle2 size={40} />
                            )}
                        </div>

                        {/* Judul & Deskripsi Dinamis */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {pendingAction.status === 'CANCELLED' ? 'Batalkan Pesanan?' : 'Verifikasi Pembayaran?'}
                        </h3>

                        <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed">
                            {pendingAction.status === 'CANCELLED'
                                ? "Tindakan ini akan membatalkan pesanan secara permanen dan stok akan dikembalikan."
                                : "Pastikan bukti pembayaran valid. Status pesanan akan diubah menjadi Lunas/Dikemas."}
                        </p>

                        {/* Tombol Aksi */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleExecuteUpdate}
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50
                        ${pendingAction.status === 'CANCELLED'
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-100'
                                        : 'bg-green-500 hover:bg-green-600 shadow-green-100'}`}
                            >
                                {loading ? "Memproses..." : "Ya, Lanjutkan"}
                            </button>

                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="w-full py-4 text-gray-400 font-semibold hover:text-gray-600 transition-colors"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Order;