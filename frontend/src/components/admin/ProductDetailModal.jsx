import React, { useState } from "react";
import { X, CreditCard, Landmark, Copy, Upload, ArrowLeft, ExternalLink } from "lucide-react";

const ProductDetailModal = ({
    isOpen,
    onClose,
    product,
    variants,
    step,
    setStep,
    selectedVariant,
    setSelectedVariant,
    buyerData,
    setBuyerData,
    quantity,
    setQuantity,
    handleCreateOrder,
    handleConfirmPayment,
    file,
    setFile,
    isProcessing,
    bankName,
    bankAccount,
    accountOwner
}) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !product) return null;

    // Menghitung total stok dari semua varian produk
    const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper warna platform marketplace
    const getPlatformColor = (name) => {
        const n = name.toLowerCase();
        if (n.includes("shopee")) return "#EE4D2D";
        if (n.includes("tokopedia")) return "#00AA5B";
        if (n.includes("lazada")) return "#000083";
        if (n.includes("tiktok")) return "#000000";
        return "#F59E0B";
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-fadeIn max-h-[90vh]">

                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-30 p-2 bg-amber-500 text-black rounded-full hover:bg-amber-600 transition-colors shadow-lg"
                >
                    <X size={20} strokeWidth={3} />
                </button>

                {/* Sisi Kiri: Gambar Produk */}
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 overflow-hidden relative">
                    <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex flex-col justify-end p-8">
                        <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Checkout Item</span>
                        <h3 className="text-white text-2xl font-black italic uppercase leading-tight">{product.name}</h3>
                    </div>
                </div>

                {/* Sisi Kanan: Konten Modal */}
                <div className="md:w-1/2 flex flex-col h-[50vh] md:h-auto overflow-hidden bg-white">
                    <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
                        {/* STEP 1: DETAIL & PILIH VARIAN */}
                        {step === 1 && (
                            <div className="animate-fadeIn">
                                <div className="mb-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${totalStock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                                        {totalStock > 0 ? `STOK TERSEDIA: ${totalStock}` : 'STOK HABIS'}
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-amber-500 mb-6 tracking-tighter italic">
                                    Rp {parseInt(selectedVariant?.price || product.base_price).toLocaleString("id-ID")}
                                </p>

                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Pilih Varian & Ukuran</p>
                                    <div className="flex flex-wrap gap-2">
                                        {variants.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariant(v)}
                                                disabled={v.stock === 0}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${v.stock === 0 ? 'opacity-30 cursor-not-allowed' : ''} ${selectedVariant?.id === v.id ? 'border-amber-500 bg-amber-500 text-black shadow-md' : 'border-gray-100 text-gray-400 hover:border-amber-200'}`}
                                            >
                                                {v.color} - {v.size}
                                                <span className="text-[9px] block opacity-70">Stok: {v.stock}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center md:text-left">
                                        Jumlah Beli
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-xl border-2 border-gray-100 flex items-center justify-center font-black hover:border-amber-500 hover:text-amber-500 transition-all"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-black italic w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                                            // Tombol plus berubah warna/opacity jika sudah mencapai batas stok
                                            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black transition-all 
                                        ${quantity >= (selectedVariant?.stock || 0)
                                                    ? 'border-red-200 text-red-300 cursor-not-allowed'
                                                    : 'border-gray-100 hover:border-amber-500 hover:text-amber-500'}`}
                                        >
                                            +
                                        </button>
                                        <p className="text-[10px] font-bold text-gray-400 italic ml-2">
                                            Max: {selectedVariant?.stock || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4 italic">Beli Sekarang Melalui:</p>

                                    {/* Tombol Marketplace */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {product.marketplace_links?.map((link) => (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest transition-transform active:scale-95 shadow-md"
                                                style={{ backgroundColor: getPlatformColor(link.platform_name) }}
                                            >
                                                <ExternalLink size={14} /> {link.platform_name}
                                            </a>
                                        ))}
                                    </div>

                                    <div className="flex items-center py-2 opacity-30">
                                        <div className="grow border-t border-gray-400"></div>
                                        <span className="px-4 text-[9px] font-black text-gray-500 uppercase">Atau</span>
                                        <div className="grow border-t border-gray-400"></div>
                                    </div>

                                    {/* Tombol Step 2 */}
                                    <button
                                        disabled={totalStock === 0}
                                        onClick={() => setStep(2)}
                                        className={`w-full py-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all ${totalStock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900 hover:text-white active:scale-95'}`}
                                    >
                                        <CreditCard size={18} /> Transfer Bank Manual
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: FORM DATA PENERIMA */}
                        {step === 2 && (
                            <div className="animate-fadeIn flex flex-col h-full">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase mb-8 hover:text-amber-700 transition-colors"
                                >
                                    <ArrowLeft size={14} /> Kembali ke detail
                                </button>
                                <h3 className="text-xl font-black italic uppercase mb-8 text-gray-900">Data <span className="text-amber-500">Penerima</span></h3>

                                <div className="space-y-4 grow">
                                    <input
                                        type="text"
                                        placeholder="NAMA LENGKAP"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                                        value={buyerData.buyer_name}
                                        onChange={(e) => setBuyerData({ ...buyerData, buyer_name: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="NOMOR WHATSAPP (CONTOH: 0812...)"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                                        value={buyerData.buyer_phone}
                                        onChange={(e) => setBuyerData({ ...buyerData, buyer_phone: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="ALAMAT PENGIRIMAN LENGKAP"
                                        rows="4"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none resize-none transition-all"
                                        value={buyerData.buyer_address}
                                        onChange={(e) => setBuyerData({ ...buyerData, buyer_address: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleCreateOrder}
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-gray-900 text-amber-500 rounded-2xl font-black uppercase text-xs tracking-widest mt-8 hover:bg-black transition-all disabled:bg-gray-200 shadow-xl"
                                >
                                    {isProcessing ? "MEMPROSES DATA..." : "KONFIRMASI DATA & BAYAR"}
                                </button>
                            </div>
                        )}

                        {/* STEP 3: INSTRUKSI PEMBAYARAN */}
                        {step === 3 && (
                            <div className="animate-fadeIn flex flex-col h-full text-center">
                                <h3 className="text-xl font-black italic uppercase mb-8 text-gray-900">Selesaikan <span className="text-amber-500">Pembayaran</span></h3>

                                <div className="bg-amber-50 p-6 rounded-4xl border-2 border-amber-200 mb-6">
                                    <div className="flex items-center justify-center gap-2 text-amber-700 font-black text-[10px] mb-2 uppercase tracking-widest">
                                        <Landmark size={14} /> BANK {bankName}
                                    </div>
                                    <p className="text-2xl font-black text-gray-900 tracking-widest mb-4 italic">{bankAccount}</p>
                                    <button
                                        onClick={() => handleCopy("1234567890")}
                                        className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${copied ? 'bg-black text-amber-500' : 'bg-amber-500 text-black hover:bg-amber-600 shadow-md'}`}
                                    >
                                        {copied ? "BERHASIL DISALIN!" : "SALIN NO. REKENING"}
                                    </button>
                                    <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase italic">A.N. {accountOwner}</p>
                                </div>

                                <div className="mb-6 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nominal Transfer:</p>
                                    <p className="text-3xl font-black text-amber-600">
                                        Rp {(parseInt(selectedVariant?.price || product.base_price) * quantity).toLocaleString("id-ID")}
                                    </p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 italic">
                                        ({quantity} Item x Rp {parseInt(selectedVariant?.price || product.base_price).toLocaleString("id-ID")})
                                    </p>
                                </div>

                                {/* Upload Bukti */}
                                <div className="relative border-2 border-dashed border-amber-300 rounded-4xl p-8 bg-amber-50/30 mb-8 hover:bg-amber-50 transition-all cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <Upload size={24} className="mx-auto text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                                    <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest truncate px-4">
                                        {file ? file.name : "UPLOAD FOTO BUKTI TRANSFER"}
                                    </p>
                                </div>

                                <button
                                    onClick={handleConfirmPayment}
                                    disabled={isProcessing || !file}
                                    className="w-full py-4 my-2 bg-gray-900 text-amber-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all disabled:bg-gray-200 shadow-2xl"
                                >
                                    {isProcessing ? "MENGIRIM BUKTI..." : "KONFIRMASI PEMBAYARAN SELESAI"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;