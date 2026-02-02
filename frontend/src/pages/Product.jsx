import { useEffect, useState } from "react";
import { Search, Package, ChevronLeft, ChevronRight } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProductDetailModal from "../components/admin/ProductDetailModal.jsx"; // Pastikan path benar
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

    // States khusus Modal & Order
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [variants, setVariants] = useState([]);
    const [newOrderId, setNewOrderId] = useState(null); // Penting untuk Step 3
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [buyerData, setBuyerData] = useState({
        buyer_name: "",
        buyer_phone: "",
        buyer_address: ""
    });
    const [paymentCredentials, setPaymentCredentials] = useState({
        bank_name: "",
        bank_number: ""
    })
    const [quantity, setQuantity] = useState(1);
    const [appSettings, setAppSettings] = useState([]);

    // Load Produk
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await getMarketplaceLink();
                setProducts(response || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSettings = async () => {
            const data = await getAppSetting();
            setAppSettings(data);
        };

        fetchSettings();
        fetchProducts();
    }, []);

    // Cari data spesifik dari array settings
    const bankName = appSettings.find(s => s.name === "Bank")?.value || "BCA";
    const bankAccount = appSettings.find(s => s.name === "Nomor Rekening")?.value || "123 456 7890";
    const accountOwner = appSettings.find(s => s.name === "Pemilik Rekening")?.value || "ADMIN";

    // Handlers Modal
    const handleOpenModal = async (product) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset ke 1
        setIsModalOpen(true);
        setCheckoutStep(1);
        try {
            const data = await getVariantsByProduct(product.id);
            setVariants(data);
            if (data.length > 0) setSelectedVariant(data[0]);
        } catch (error) {
            console.error("Gagal load varian:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCheckoutStep(1);
        setFile(null);
        setNewOrderId(null);
        setBuyerData({ buyer_name: "", buyer_phone: "", buyer_address: "" });
    };

    // Handler Create Order (Step 2)
    const handleCreateOrder = async () => {
        if (!buyerData.buyer_name || !buyerData.buyer_phone || !buyerData.buyer_address) {
            return alert("Mohon lengkapi data diri Anda");
        }

        setIsProcessing(true);

        // Hitung total harga berdasarkan varian * quantity
        const unitPrice = parseInt(selectedVariant?.price || selectedProduct.base_price);
        const totalPrice = unitPrice * quantity;

        const payload = {
            product_id: parseInt(selectedProduct.id),
            buyer_name: buyerData.buyer_name,
            buyer_phone: buyerData.buyer_phone,
            buyer_address: buyerData.buyer_address,
            total_amount: totalPrice, // Total yang sudah dikali quantity
            checkout_method: "BANK_TRANSFER",
            status: "WAITING_PAYMENT",
            items: [{
                product_id: parseInt(selectedProduct.id),
                variant_id: selectedVariant ? parseInt(selectedVariant.id) : null,
                quantity: quantity, // Gunakan state quantity di sini
                price: unitPrice
            }]
        };

        try {
            const response = await createOrder(payload);
            setNewOrderId(response.data.id);
            setCheckoutStep(3);
        } catch (error) {
            console.error(error);
            alert("Gagal membuat pesanan. Periksa console backend.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Handler Confirm Payment (Step 3)
    const handleConfirmPayment = async () => {
        if (!file) return alert("Pilih foto bukti transfer");

        setIsProcessing(true);
        try {
            // Menggunakan newOrderId yang didapat dari handleCreateOrder
            await uploadPaymentProof(newOrderId, file);
            alert("Bukti terkirim! Pesanan Anda akan diverifikasi.");
            handleCloseModal();
        } catch (error) {
            console.log(error);
            alert("Gagal mengunggah bukti.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Pagination Logic
    const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const paginatedProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
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

                {/* MODAL KOMPONEN */}
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