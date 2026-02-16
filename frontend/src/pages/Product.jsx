import { useEffect, useState } from "react";
import { Package, ChevronLeft, ChevronRight, XCircle, CheckCircle2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
// Pastikan path ke komponen Modal sudah benar
import ProductDetailModal from "../components/admin/ProductDetailModal.jsx";
import { getMarketplaceLink } from "../services/marketplaceLinkService";
import { getVariantsByProduct } from "../services/variantService.js";
import { createOrder, uploadPaymentProof } from "../services/orderService.js";
import { getAppSetting } from "../services/appSettingService.js";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // --- STATES MODAL & ORDER ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [variants, setVariants] = useState([]);
    const [newOrderId, setNewOrderId] = useState(null);
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // State Pembeli (Nama, HP, Alamat Detail)
    const [buyerData, setBuyerData] = useState({
        buyer_name: "",
        buyer_phone: "",
        buyer_address: ""
    });

    const [quantity, setQuantity] = useState(1);
    const [appSettings, setAppSettings] = useState([]);

    // --- STATES FEEDBACK (SUCCESS/ERROR) ---
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [finalOrderCode, setFinalOrderCode] = useState("");

    // 1. Load Produk & Settings saat awal
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await getMarketplaceLink();
                setProducts(response || []);
            } catch (error) {
                setErrorMessage(error.response?.data?.msg || "Gagal memuat data produk.");
                setShowError(true);
            } finally {
                setLoading(false);
            }
        };

        const fetchSettings = async () => {
            try {
                const data = await getAppSetting();
                setAppSettings(data);
            } catch (error) {
                console.error("Gagal load settings:", error);
            }
        };

        fetchSettings();
        fetchProducts();
    }, []);

    // Ambil Data Bank dari Settings
    const bankName = appSettings.find(s => s.name === "Bank")?.value || "BCA";
    const bankAccount = appSettings.find(s => s.name === "Nomor Rekening")?.value || "123 456 7890";
    const accountOwner = appSettings.find(s => s.name === "Pemilik Rekening")?.value || "ADMIN";

    // --- HANDLERS MODAL ---
    const handleOpenModal = async (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsModalOpen(true);
        setCheckoutStep(1);
        setBuyerData({ buyer_name: "", buyer_phone: "", buyer_address: "" }); // Reset form

        try {
            const data = await getVariantsByProduct(product.id);
            setVariants(data);
            if (data.length > 0) setSelectedVariant(data[0]);
            else setSelectedVariant(null);
        } catch (error) {
            console.error(error);
            setErrorMessage("Gagal memuat varian produk.");
            setShowError(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCheckoutStep(1);
        setFile(null);
        setNewOrderId(null);
    };

    // --- HANDLER CREATE ORDER (Dipanggil dari Modal) ---
    // payloadReceived adalah object lengkap yang dikirim dari Modal (sudah ada ongkir dll)
    const handleCreateOrder = async (payloadReceived) => {
        setIsProcessing(true);

        try {
            // Sesuaikan struktur payload Modal dengan struktur yang diminta Backend Anda
            // Backend butuh: product_id, buyer_name, total_amount, items[], dll.

            const finalPayload = {
                product_id: parseInt(payloadReceived.product_id),
                buyer_name: payloadReceived.customer_name,
                buyer_phone: payloadReceived.customer_phone,
                // Alamat sudah digabung di modal (Jalan + Kecamatan + Kota)
                buyer_address: payloadReceived.shipping_address,

                total_amount: payloadReceived.total_price, // Total Harga + Ongkir
                checkout_method: "BANK_TRANSFER",
                status: "WAITING_PAYMENT",

                // Array items (sesuai struktur backend orderItems)
                items: [{
                    product_id: parseInt(payloadReceived.product_id),
                    variant_id: payloadReceived.variant_id ? parseInt(payloadReceived.variant_id) : null,
                    quantity: payloadReceived.quantity,
                    // Harga satuan disimpan untuk referensi history
                    price: payloadReceived.total_price / payloadReceived.quantity // Estimasi harga per unit rata-rata (termasuk ongkir)
                }],

                // Opsional: Jika backend punya kolom khusus untuk nyatat kurir
                shipping_courier: payloadReceived.shipping_courier,
                shipping_service: payloadReceived.shipping_service,
                shipping_cost: payloadReceived.shipping_cost
            };

            const response = await createOrder(finalPayload);

            // Simpan ID Order baru untuk proses upload bukti bayar
            setNewOrderId(response.data.id);

            // Pindah ke Step 3 (Upload Bukti) di Modal
            setCheckoutStep(3);

        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.msg || "Gagal membuat pesanan.");
            setShowError(true);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- HANDLER CONFIRM PAYMENT (Upload Bukti) ---
    const handleConfirmPayment = async () => {
        if (!file) {
            setErrorMessage("Mohon pilih foto bukti transfer terlebih dahulu.");
            setShowError(true);
            return;
        }

        setIsProcessing(true);
        try {
            const response = await uploadPaymentProof(newOrderId, file);
            const orderData = response.data;

            setFinalOrderCode(orderData.order_code);
            setIsModalOpen(false); // Tutup modal checkout
            setShowSuccess(true); // Tampilkan popup sukses
        } catch (error) {
            console.error(error);
            setErrorMessage("Gagal mengunggah bukti pembayaran.");
            setShowError(true);
            setIsModalOpen(false); // Tutup modal biar user bisa baca error
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFinishSuccess = () => {
        setShowSuccess(false);
        handleCloseModal();
        // Refresh data produk jika perlu (misal stok berkurang)
        // fetchProducts(); 
    };

    // --- PAGINATION LOGIC ---
    const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const paginatedProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <MainLayout>
            <div className="min-h-screen pb-20">
                {/* Search & Header */}
                <section className="bg-white border-b border-gray-100 pt-24 pb-10 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase italic tracking-tighter">
                                <Package className="text-amber-500" size={24} /> Koleksi Produk
                            </h1>
                        </div>
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                className="w-full bg-gray-100 border-2 border-gray-200 focus:border-amber-500 focus:outline-none rounded-xl py-3 pl-4 pr-12 text-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                {loading ? (
                    <section className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 animate-fadeIn">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                            <p>Memuat data produk...</p>
                        </div>
                    </section>
                ) : (
                    <section className="max-w-7xl mx-auto px-4 py-8">
                        {paginatedProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 animate-fadeIn">
                                <div className="bg-amber-100 p-4 rounded-full mb-4 text-amber-600">
                                    <Package size={40} />
                                </div>
                                <h3 className="text-lg font-black uppercase italic tracking-tighter text-gray-800">
                                    Produk Tidak Ditemukan
                                </h3>
                                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                    Coba gunakan kata kunci pencarian lain
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {paginatedProducts.map((product) => {
                                        const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
                                        const isOutOfStock = totalStock === 0;

                                        return (
                                            <div
                                                key={product.id}
                                                onClick={() => handleOpenModal(product)}
                                                className="group bg-white rounded-4xl shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full relative"
                                            >
                                                <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter shadow-sm ${isOutOfStock ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'}`}>
                                                    {isOutOfStock ? 'Sold Out' : 'Ready Stock'}
                                                </div>

                                                <div className="aspect-square overflow-hidden bg-gray-50">
                                                    <img
                                                        src={product.main_image}
                                                        alt={product.name}
                                                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                                                    />
                                                </div>

                                                <div className="p-4 flex flex-col grow bg-white">
                                                    <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 mb-2 uppercase italic leading-tight group-hover:text-amber-600 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    <div className="mt-auto flex flex-col">
                                                        <p className="text-amber-600 font-black text-sm italic tracking-tighter">
                                                            Rp {parseInt(product.base_price).toLocaleString("id-ID")}
                                                        </p>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">
                                                            Lihat Detail & Varian
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-12 gap-4">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            className="p-2 border rounded-lg disabled:opacity-50 hover:bg-amber-500 hover:text-black transition-colors"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="text-sm font-black italic">{currentPage} / {totalPages}</span>
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            className="p-2 border rounded-lg disabled:opacity-50 hover:bg-amber-500 hover:text-black transition-colors"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                )}

                {/* --- POPUP SUCCESS --- */}
                {showSuccess && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
                        <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-green-50 to-transparent z-0"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                                    <CheckCircle2 size={40} className="text-green-600" strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">
                                    Pembayaran <span className="text-green-600">Berhasil!</span>
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
                                    Bukti transfer diterima. Pesanan Anda akan segera diproses.
                                </p>
                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 mb-8">
                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Kode Order</p>
                                    <p className="text-xl font-black text-gray-900 font-mono tracking-tighter">#{finalOrderCode}</p>
                                </div>
                                <button
                                    onClick={handleFinishSuccess}
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl"
                                >
                                    Selesai & Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- POPUP ERROR --- */}
                {showError && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
                        <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-red-50 to-transparent z-0"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
                                    <XCircle size={40} className="text-red-500" strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">
                                    Terjadi <span className="text-red-500">Kesalahan</span>
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mb-8 leading-relaxed px-4">
                                    {errorMessage}
                                </p>
                                <button
                                    onClick={() => setShowError(false)}
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all shadow-xl"
                                >
                                    Tutup & Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODAL CHECKOUT --- */}
                <ProductDetailModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                    variants={variants}
                    step={checkoutStep}
                    setStep={setCheckoutStep}
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                    buyerData={buyerData}
                    setBuyerData={setBuyerData}
                    quantity={quantity}
                    setQuantity={setQuantity}

                    // PASS HANDLER YANG BARU
                    handleCreateOrder={handleCreateOrder}
                    handleConfirmPayment={handleConfirmPayment}

                    file={file}
                    setFile={setFile}
                    isProcessing={isProcessing}
                    bankName={bankName}
                    bankAccount={bankAccount}
                    accountOwner={accountOwner}
                />
            </div>
        </MainLayout>
    );
}