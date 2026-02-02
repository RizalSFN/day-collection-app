import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { ShoppingCart, ChevronRight, X, CreditCard, ExternalLink, ArrowLeft, Upload } from "lucide-react";
import { getProducts } from "../services/productService.js"
import { getActiveBanner } from "../services/bannerService.js";
import { getVariantsByProduct } from "../services/variantService.js";
import { createOrder, uploadPaymentProof } from "../services/orderService.js";

export default function Home() {
    const [products, setProducts] = useState([])
    const [banner, setBanner] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [step, setStep] = useState(1); // Step 1: Pilih Metode, Step 2: Form & Varian, Step 3: Upload Bukti
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getProducts();
            const dataBanner = await getActiveBanner()
            setProducts(response)
            setBanner(dataBanner)
        }
        fetchData()
    }, [])

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    const openCheckoutModal = async (product) => {
        setSelectedProduct(product);
        const dataVariants = await getVariantsByProduct(product.id);
        setVariants(dataVariants);
        setIsCheckoutModalOpen(true);
        setStep(1); // Reset ke langkah pertama
    }

    const closeCheckoutModal = () => {
        setSelectedProduct(null)
        setIsCheckoutModalOpen(false)
    }

    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="flex flex-col-reverse md:flex-row items-center justify-between py-16 md:py-24">
                {/* Text Content */}
                <div className="md:w-1/2 text-center md:text-left space-y-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                        Temukan Gaya <span className="text-amber-500">Eleganmu</span>
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto md:mx-0">
                        Koleksi terbaik dari <span className="font-semibold">Day Collection</span> untuk melengkapi
                        tampilanmu. Simpel, elegan, dan penuh gaya.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-md transition">
                            Belanja Sekarang
                        </button>
                        <a href="#koleksi" className="border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-full text-lg font-medium transition">
                            Lihat Koleksi
                        </a>
                    </div>
                </div>

                {/* Image Section */}
                <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
                    <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-80 md:w-96 rounded-2xl"
                    />
                </div>
            </section>

            {/* Product Preview Section */}
            <section id="koleksi" className="py-20 bg-[#FDFBF7] rounded-[3rem] mt-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div className="text-left">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">
                                Koleksi <span className="text-amber-500">Terbaru</span>
                            </h2>
                            <p className="text-gray-500 mt-2 font-medium">Koleksi produk terbaik untuk gaya hidup modern Anda.</p>
                        </div>
                        <a href="/produk" className="hidden md:flex items-center text-amber-600 hover:text-amber-700 font-bold uppercase text-sm tracking-widest transition group">
                            Lihat Semua <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition" />
                        </a>
                    </div>

                    {products.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-medium">Belum ada koleksi yang tersedia saat ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {products
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .slice(0, 3)
                                .map((product, i) => (
                                    <div
                                        key={i}
                                        className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
                                    >
                                        {/* Image Container */}
                                        <div className="relative overflow-hidden aspect-4/5">
                                            <img
                                                src={product.main_image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-5 left-5">
                                                <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                                                    Baru Datang
                                                </span>
                                            </div>
                                            {/* Overlay Button on Hover */}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                                >
                                                    Quick View
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-8 flex flex-col grow">
                                            <h3 className="text-xl font-black text-gray-900 uppercase italic leading-tight mb-2 group-hover:text-amber-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-2xl font-black text-amber-500 tracking-tighter italic mb-6">
                                                Rp {parseInt(product.base_price).toLocaleString("id-ID")}
                                            </p>

                                            <div className="mt-auto flex gap-3">
                                                <button
                                                    onClick={() => openCheckoutModal(product)}
                                                    className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                                                >
                                                    <ShoppingCart size={16} /> Beli Sekarang
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Mobile "See More" Button */}
                    <div className="md:hidden mt-12 flex justify-center">
                        <a href="/produk" className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">
                            Lihat Semua Koleksi
                        </a>
                    </div>
                </div>
            </section>

            {/* Modal Checkout Terpadu */}
            {isCheckoutModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={closeCheckoutModal}>
                    <div
                        className="bg-white w-full max-w-4xl rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-fadeIn max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Tombol Close */}
                        <button
                            onClick={closeCheckoutModal}
                            className="absolute top-6 right-6 z-30 p-2 bg-amber-500 text-black rounded-full hover:bg-amber-600 transition-colors shadow-lg"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>

                        {/* Sisi Kiri: Visual Produk */}
                        <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 overflow-hidden relative">
                            <img
                                src={selectedProduct.main_image}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex flex-col justify-end p-8">
                                <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Checkout Item</span>
                                <h3 className="text-white text-2xl font-black italic uppercase leading-tight">{selectedProduct.name}</h3>
                            </div>
                        </div>

                        {/* Sisi Ranan: Alur Transaksi */}
                        <div className="md:w-1/2 flex flex-col h-[60vh] md:h-auto overflow-hidden bg-white">
                            <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">

                                {/* STEP 1: PILIH METODE */}
                                {step === 1 && (
                                    <div className="animate-fadeIn">
                                        <h3 className="text-xl font-black italic uppercase mb-6 text-gray-900">Pilih <span className="text-amber-500">Metode</span></h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="w-full flex items-center justify-between p-5 border-2 border-amber-500 bg-amber-50/50 rounded-2xl group transition-all"
                                            >
                                                <div className="flex items-center gap-3 text-amber-700">
                                                    <CreditCard size={20} />
                                                    <span className="font-black uppercase text-xs tracking-widest">Transfer Bank Manual</span>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition" />
                                            </button>

                                            <div className="flex items-center py-4 opacity-20">
                                                <div className="grow border-t border-gray-900"></div>
                                                <span className="px-4 text-[9px] font-black uppercase">Atau Marketplace</span>
                                                <div className="grow border-t border-gray-900"></div>
                                            </div>

                                            {selectedProduct.marketplace_link?.map((link) => (
                                                <a
                                                    key={link.id}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-5 border-2 border-gray-100 hover:border-gray-900 rounded-2xl transition-all group"
                                                >
                                                    <span className="text-gray-900 font-black uppercase text-[10px] tracking-widest">Lanjut ke {link.marketplace_platform.name}</span>
                                                    <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-900" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: FORM DATA PENERIMA */}
                                {step === 2 && (
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        setLoading(true);
                                        const payload = {
                                            buyer_name: e.target.name.value,
                                            buyer_phone: e.target.phone.value,
                                            buyer_address: e.target.address.value,
                                            product_id: selectedProduct.id,
                                            total_amount: selectedVariant ? selectedVariant.price : selectedProduct.base_price,
                                            checkout_method: "BANK_TRANSFER",
                                            items: [{
                                                product_id: selectedProduct.id,
                                                variant_id: selectedVariant?.id,
                                                quantity: 1, // Anda bisa menambahkan state quantity jika perlu
                                                price: selectedVariant ? selectedVariant.price : selectedProduct.base_price
                                            }]
                                        };
                                        const res = await createOrder(payload);
                                        setOrderId(res.data.id);
                                        setStep(3);
                                        setLoading(false);
                                    }} className="animate-fadeIn">
                                        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase mb-6 hover:text-amber-700">
                                            <ArrowLeft size={14} /> Kembali
                                        </button>
                                        <h3 className="text-xl font-black italic uppercase mb-6">Data <span className="text-amber-500">Penerima</span></h3>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Varian Tersedia</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {variants.map((v) => (
                                                        <button
                                                            type="button"
                                                            key={v.id}
                                                            onClick={() => setSelectedVariant(v)}
                                                            className={`px-3 py-2 rounded-xl text-[10px] font-bold border-2 transition-all ${selectedVariant?.id === v.id ? 'border-amber-500 bg-amber-500 text-white shadow-md' : 'border-gray-50 text-gray-400'}`}
                                                        >
                                                            {v.color} - {v.size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <input name="name" placeholder="NAMA LENGKAP" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none transition-all" required />
                                            <input name="phone" placeholder="NOMOR WHATSAPP" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none transition-all" required />
                                            <textarea name="address" placeholder="ALAMAT LENGKAP" rows="3" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none resize-none transition-all" required />
                                        </div>

                                        <button type="submit" disabled={loading || !selectedVariant} className="w-full py-4 bg-gray-900 text-amber-500 rounded-2xl font-black uppercase text-xs tracking-widest mt-8 hover:bg-black transition-all disabled:bg-gray-200 shadow-xl">
                                            {loading ? "MEMPROSES..." : "KONFIRMASI & BAYAR"}
                                        </button>
                                    </form>
                                )}

                                {/* STEP 3: PEMBAYARAN */}
                                {step === 3 && (
                                    <div className="animate-fadeIn text-center">
                                        <h3 className="text-xl font-black italic uppercase mb-8 text-gray-900">Selesaikan <span className="text-amber-500">Pembayaran</span></h3>
                                        <div className="bg-amber-50 p-6 rounded-4xl border-2 border-amber-200 mb-6">
                                            <p className="text-2xl font-black text-gray-900 tracking-widest mb-4 italic">12345678</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase italic">A.N. DAY COLLECTION</p>
                                        </div>

                                        <div className="mb-8">
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total:</p>
                                            <p className="text-3xl font-black text-amber-600">
                                                Rp {parseInt(selectedVariant?.price || selectedProduct.base_price).toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        <div className="relative border-2 border-dashed border-amber-300 rounded-4xl p-8 bg-amber-50/30 mb-8 cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    setLoading(true);
                                                    await uploadPaymentProof(orderId, e.target.files[0]);
                                                    alert("Bukti terkirim! Pesanan sedang kami verifikasi.");
                                                    closeCheckoutModal();
                                                    setLoading(false);
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <Upload size={24} className="mx-auto text-amber-500 mb-2" />
                                            <p className="text-[9px] font-black text-amber-700 uppercase">{loading ? "MENGIRIM..." : "UPLOAD BUKTI TRANSFER"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
