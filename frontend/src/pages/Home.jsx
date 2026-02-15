import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { getProducts } from "../services/productService.js"
import { getActiveBanner } from "../services/bannerService.js";

export default function Home() {
    const [products, setProducts] = useState([])
    const [banner, setBanner] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const dataBanner = await getActiveBanner()
            setBanner(dataBanner)

            const response = await getProducts();
            setProducts(response)
        }
        fetchData()
    }, [])

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
                        <a href="/produk" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-md transition">
                            Belanja Sekarang
                        </a>
                        <a href="#koleksi" className="border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-full text-lg font-medium transition">
                            Lihat Koleksi
                        </a>
                    </div>
                </div>

                {/* Image Section */}
                <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center bg-red-500">
                    {banner ? (
                        <img
                            src={banner.image_url}
                            alt={banner.title || "Banner Utama"}
                            className="w-80 md:w-96 rounded-2xl object-cover"
                        />
                    ) : (
                        // UBAH 3: Tampilkan Skeleton Loading / Placeholder jika banner belum siap
                        <div className="w-80 md:w-96 h-64 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Memuat Banner...</span>
                        </div>
                    )}
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
                                                <a
                                                    href="/produk"
                                                    className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                                                >
                                                    <ShoppingCart size={16} /> Beli Sekarang
                                                </a>
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
        </MainLayout>
    );
}
