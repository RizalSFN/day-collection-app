import React, { useState, useEffect } from "react";
import { X, CreditCard, Landmark, Upload, ArrowLeft, ExternalLink, Truck, CheckCircle } from "lucide-react";
import LocationSearch from "../LocationSearch";
import { checkOngkirApi } from "../../services/shippingService";

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

    // --- STATE BARU ---
    const [destinationId, setDestinationId] = useState(null);
    const [fullLocationLabel, setFullLocationLabel] = useState("");
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [loadingShipping, setLoadingShipping] = useState(false);

    // Reset state saat modal ditutup/dibuka
    useEffect(() => {
        if (!isOpen) {
            setShippingOptions([]);
            setSelectedShipping(null);
            setDestinationId(null);
            setFullLocationLabel("");
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    // --- HITUNG HARGA ---
    const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
    const productPrice = parseInt(selectedVariant?.price || product.base_price);
    const subTotal = productPrice * quantity;

    // --- PERBAIKAN 1: Cara ambil harga ongkir (Langsung .cost) ---
    const shippingCost = selectedShipping ? parseInt(selectedShipping.cost) : 0;
    const grandTotal = subTotal + shippingCost;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCheckOngkir = async () => {
        if (!destinationId) return;

        setLoadingShipping(true);
        setShippingOptions([]);
        setSelectedShipping(null);

        try {
            const baseWeight = product.weight ? parseInt(product.weight) : 1000;
            const totalWeight = baseWeight * (quantity || 1);

            const costs = await checkOngkirApi(destinationId, totalWeight, "jne");

            // Debugging
            console.log("DATA ONGKIR DITERIMA MODAL:", costs);

            if (costs && costs.length > 0) {
                setShippingOptions(costs);
            } else {
                alert("Ongkir tidak ditemukan untuk lokasi ini.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat cek ongkir.");
        } finally {
            setLoadingShipping(false);
        }
    };

    const onProcessOrder = () => {
        if (!buyerData.buyer_name || !buyerData.buyer_phone || !buyerData.buyer_address) {
            alert("Mohon lengkapi Nama, WA, dan Alamat Detail.");
            return;
        }
        if (!destinationId || !selectedShipping) {
            alert("Mohon pilih Lokasi dan Layanan Pengiriman (Cek Ongkir).");
            return;
        }

        // --- PERBAIKAN 2: Cara ambil data ongkir untuk payload ---
        const orderPayload = {
            product_id: product.id,
            variant_id: selectedVariant?.id || null,
            quantity: quantity,
            total_price: grandTotal,
            customer_name: buyerData.buyer_name,
            customer_phone: buyerData.buyer_phone,
            shipping_address: `${buyerData.buyer_address}, ${fullLocationLabel}`,

            // Perhatikan ini: Langsung akses .service, .etd, dan .cost
            shipping_service: `${selectedShipping.service} (${selectedShipping.etd || '-'})`,
            shipping_courier: "JNE",
            shipping_cost: selectedShipping.cost
        };

        handleCreateOrder(orderPayload);
    };

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

                {/* Sisi Kiri: Gambar */}
                <div className="md:w-1/2 h-48 md:h-auto bg-gray-100 overflow-hidden relative">
                    <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                        <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Checkout Item</span>
                        <h3 className="text-white text-2xl font-black italic uppercase leading-tight">{product.name}</h3>
                    </div>
                </div>

                {/* Sisi Kanan: Konten */}
                <div className="md:w-1/2 flex flex-col h-[60vh] md:h-auto overflow-hidden bg-white">
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">

                        {/* STEP 1: PILIH VARIAN */}
                        {step === 1 && (
                            <div className="animate-fadeIn">
                                {/* ... Bagian Step 1 ini SAMA PERSIS dengan sebelumnya ... */}
                                <div className="mb-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${totalStock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                                        {totalStock > 0 ? `STOK TERSEDIA: ${totalStock}` : 'STOK HABIS'}
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-amber-500 mb-6 tracking-tighter italic">
                                    Rp {productPrice.toLocaleString("id-ID")}
                                </p>

                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Pilih Varian</p>
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
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Jumlah Beli</p>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl border-2 border-gray-100 flex items-center justify-center font-black hover:border-amber-500 hover:text-amber-500 transition-all">-</button>
                                        <span className="text-lg font-black italic w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                                            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black transition-all ${quantity >= (selectedVariant?.stock || 0) ? 'border-red-200 text-red-300' : 'border-gray-100 hover:border-amber-500 hover:text-amber-500'}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {product.marketplace_links?.map((link) => (
                                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest transition-transform active:scale-95 shadow-md" style={{ backgroundColor: getPlatformColor(link.platform_name) }}>
                                                <ExternalLink size={14} /> {link.platform_name}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    disabled={totalStock === 0}
                                    onClick={() => setStep(2)}
                                    className={`w-full py-4 mt-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all ${totalStock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900 hover:text-white active:scale-95'}`}
                                >
                                    <CreditCard size={18} /> Isi Data Pengiriman
                                </button>
                            </div>
                        )}

                        {/* STEP 2: DATA & ONGKIR */}
                        {step === 2 && (
                            <div className="animate-fadeIn flex flex-col h-full">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase mb-6 hover:text-amber-700 transition-colors"
                                >
                                    <ArrowLeft size={14} /> Kembali
                                </button>
                                <h3 className="text-xl font-black italic uppercase mb-6 text-gray-900">Data <span className="text-amber-500">Penerima</span></h3>

                                <div className="space-y-4 grow">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="NAMA LENGKAP"
                                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none transition-all uppercase"
                                            value={buyerData.buyer_name}
                                            onChange={(e) => setBuyerData({ ...buyerData, buyer_name: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            placeholder="NO. WHATSAPP"
                                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                                            value={buyerData.buyer_phone}
                                            onChange={(e) => setBuyerData({ ...buyerData, buyer_phone: e.target.value })}
                                        />
                                    </div>

                                    <LocationSearch
                                        onSelectLocation={(item) => {
                                            if (item) {
                                                setDestinationId(item.id);
                                                setFullLocationLabel(item.label);
                                                setShippingOptions([]);
                                                setSelectedShipping(null);
                                            } else {
                                                setDestinationId(null);
                                            }
                                        }}
                                    />

                                    <textarea
                                        placeholder="ALAMAT DETAIL (Nama Jalan, No. Rumah, RT/RW, Patokan)"
                                        rows="2"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-amber-500 focus:bg-white outline-none resize-none transition-all uppercase"
                                        value={buyerData.buyer_address}
                                        onChange={(e) => setBuyerData({ ...buyerData, buyer_address: e.target.value })}
                                    ></textarea>

                                    {/* LIST ONGKIR */}
                                    <div className={`p-4 rounded-3xl border-2 transition-all ${destinationId ? 'bg-amber-50/50 border-amber-100' : 'bg-gray-50 border-dashed border-gray-200'}`}>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Truck size={16} />
                                                <p className="text-[10px] font-black uppercase tracking-widest">Pengiriman</p>
                                            </div>
                                            {destinationId && shippingOptions.length === 0 && (
                                                <button
                                                    onClick={handleCheckOngkir}
                                                    disabled={loadingShipping}
                                                    className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-xl uppercase hover:bg-black transition-all disabled:opacity-50"
                                                >
                                                    {loadingShipping ? "Memuat..." : "Cek Ongkir"}
                                                </button>
                                            )}
                                        </div>

                                        {/* --- PERBAIKAN 3: RENDER LIST ONGKIR --- */}
                                        {shippingOptions.length > 0 ? (
                                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                                {shippingOptions.map((opt, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setSelectedShipping(opt)}
                                                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedShipping === opt ? 'border-amber-500 bg-white shadow-md' : 'border-gray-200 hover:border-amber-300 bg-white/60'}`}
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                {/* Ambil properti langsung, bukan array */}
                                                                <p className="text-xs font-black text-gray-800">{opt.service}</p>
                                                                {selectedShipping === opt && <CheckCircle size={12} className="text-amber-500" />}
                                                            </div>
                                                            {/* Render ETD langsung */}
                                                            <p className="text-[10px] text-gray-400 font-bold">Est. {opt.etd || '-'} Hari</p>
                                                        </div>
                                                        {/* Render Cost langsung */}
                                                        <p className="text-sm font-black text-amber-600">Rp {parseInt(opt.cost).toLocaleString("id-ID")}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            !loadingShipping && destinationId && (
                                                <p className="text-[10px] text-gray-400 italic text-center py-2">Klik tombol Cek Ongkir di atas.</p>
                                            )
                                        )}
                                        {!destinationId && (
                                            <p className="text-[10px] text-gray-400 italic text-center py-2">Pilih Kecamatan/Kota terlebih dahulu.</p>
                                        )}
                                    </div>
                                </div>

                                {/* RINGKASAN BIAYA */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs mb-1 text-gray-500 font-bold">
                                        <span>Harga ({quantity} Item)</span>
                                        <span>Rp {subTotal.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-3 text-gray-500 font-bold">
                                        <span>Ongkos Kirim</span>
                                        {/* Tampilkan cost langsung */}
                                        <span>{selectedShipping ? `Rp ${parseInt(selectedShipping.cost).toLocaleString("id-ID")}` : "-"}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black italic text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <span>Total Bayar</span>
                                        <span className="text-amber-600">Rp {grandTotal.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={onProcessOrder}
                                    disabled={isProcessing || !selectedShipping}
                                    className="w-full py-4 bg-gray-900 text-amber-500 rounded-2xl font-black uppercase text-xs tracking-widest mt-4 hover:bg-black transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-xl"
                                >
                                    {isProcessing ? "MEMPROSES..." : "LANJUT PEMBAYARAN"}
                                </button>
                            </div>
                        )}

                        {/* STEP 3: PEMBAYARAN */}
                        {step === 3 && (
                            <div className="animate-fadeIn flex flex-col h-full text-center">
                                <h3 className="text-xl font-black italic uppercase mb-8 text-gray-900">Selesaikan <span className="text-amber-500">Pembayaran</span></h3>

                                <div className="bg-amber-50 p-6 rounded-4xl border-2 border-amber-200 mb-6">
                                    <div className="flex items-center justify-center gap-2 text-amber-700 font-black text-[10px] mb-2 uppercase tracking-widest">
                                        <Landmark size={14} /> BANK {bankName}
                                    </div>
                                    <p className="text-2xl font-black text-gray-900 tracking-widest mb-4 italic">{bankAccount}</p>
                                    <button
                                        onClick={() => handleCopy(bankAccount)}
                                        className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${copied ? 'bg-black text-amber-500' : 'bg-amber-500 text-black hover:bg-amber-600 shadow-md'}`}
                                    >
                                        {copied ? "BERHASIL DISALIN!" : "SALIN NO. REKENING"}
                                    </button>
                                    <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase italic">A.N. {accountOwner}</p>
                                </div>

                                <div className="mb-6 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Transfer:</p>
                                    <p className="text-3xl font-black text-amber-600">
                                        Rp {grandTotal.toLocaleString("id-ID")}
                                    </p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 italic">
                                        (Sudah termasuk ongkir {selectedShipping?.service})
                                    </p>
                                </div>

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