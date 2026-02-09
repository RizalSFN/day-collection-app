import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2, AlertCircle } from "lucide-react";
import { searchLocationApi } from "../services/shippingService";

const LocationSearch = ({ onSelectLocation }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);

    // Ref untuk mendeteksi klik di luar komponen (agar dropdown tertutup)
    const wrapperRef = useRef(null);

    // Effect: Debounce Search (Tunggu user berhenti ngetik 500ms)
    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            // Hanya cari jika query lebih dari 2 karakter
            if (query.length >= 3) {
                setLoading(true);
                setError(null);
                try {
                    const data = await searchLocationApi(query);
                    setResults(data || []);
                    setIsOpen(true);
                } catch (err) {
                    console.error(err);
                    setError("Gagal memuat lokasi.");
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500); // Delay 500ms

        return () => clearTimeout(delaySearch);
    }, [query]);

    // Effect: Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Saat user memilih salah satu lokasi
    const handleSelect = (item) => {
        setQuery(item.label); // Tampilkan nama lengkap di input
        setIsOpen(false); // Tutup dropdown
        onSelectLocation(item); // Kirim data ke Parent (Modal)
    };

    // Saat tombol X diklik
    const handleClear = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        onSelectLocation(null); // Reset di Parent
    };

    return (
        <div ref={wrapperRef} className="relative w-full z-20">
            {/* Input Field */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        // Jika user mengetik ulang, reset pilihan di parent
                        if (e.target.value.length < query.length) {
                            onSelectLocation(null);
                        }
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    placeholder="KETIK KECAMATAN / KOTA (MIN. 3 HURUF)"
                    className={`w-full bg-gray-50 border-2 rounded-2xl p-4 pl-12 pr-10 text-xs font-bold outline-none transition-all uppercase 
                        ${isOpen ? 'border-amber-500 bg-white' : 'border-transparent focus:border-amber-500 focus:bg-white'}`}
                />

                {/* Icon Search (Kiri) */}
                <Search className="absolute left-4 top-4 text-gray-400" size={18} />

                {/* Loading Indicator (Kanan) */}
                {loading && (
                    <div className="absolute right-4 top-4">
                        <Loader2 className="animate-spin text-amber-500" size={18} />
                    </div>
                )}

                {/* Tombol Clear / X (Kanan - Jika tidak loading & ada teks) */}
                {!loading && query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Dropdown Hasil Pencarian */}
            {isOpen && (
                <div className="absolute w-full bg-white mt-2 rounded-2xl shadow-xl border-2 border-gray-100 max-h-60 overflow-y-auto custom-scrollbar animate-fadeIn overflow-hidden">

                    {/* State: Error */}
                    {error && (
                        <div className="p-4 text-center text-red-500 text-xs font-bold flex flex-col items-center gap-2">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    {/* State: Tidak Ditemukan */}
                    {!loading && !error && results.length === 0 && query.length >= 3 && (
                        <div className="p-6 text-center text-gray-400">
                            <p className="text-[10px] font-bold uppercase italic">Lokasi tidak ditemukan.</p>
                            <p className="text-[9px]">Coba ketik nama kecamatan lain.</p>
                        </div>
                    )}

                    {/* State: List Hasil */}
                    <ul>
                        {results.map((item, idx) => (
                            <li
                                key={idx} // API RajaOngkir kadang id-nya unik per database, idx aman untuk key list
                                onClick={() => handleSelect(item)}
                                className="px-5 py-3 hover:bg-amber-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-start gap-3 transition-colors group"
                            >
                                <MapPin size={16} className="text-gray-300 group-hover:text-amber-500 mt-0.5 shrink-0 transition-colors" />
                                <div className="text-left">
                                    <p className="text-xs font-bold text-gray-700 uppercase group-hover:text-black">
                                        {item.label}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md uppercase">
                                            {item.type}
                                        </span>
                                        {item.zip_code && (
                                            <span className="text-[9px] text-gray-400 py-0.5">
                                                {item.zip_code}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Helper Text di bawah input */}
            <div className="mt-2 flex justify-between px-2">
                <p className="text-[9px] text-gray-400 italic font-bold">
                    *Pilih lokasi dari daftar yang muncul
                </p>
                {query.length > 0 && query.length < 3 && (
                    <p className="text-[9px] text-amber-500 italic font-bold">
                        Ketik {3 - query.length} huruf lagi...
                    </p>
                )}
            </div>
        </div>
    );
};

export default LocationSearch;