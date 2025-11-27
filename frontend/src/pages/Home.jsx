import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { getProducts } from "../services/productService.js"
import { getBanner } from "../services/bannerService.js";

export default function Home() {
    const [products, setProducts] = useState([])
    const [banner, setBanner] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getProducts();
            const dataBanner = await getBanner()
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
                    {banner.map((item, i) => (
                        <img
                            key={i}
                            src={item.image_url}
                            alt={item.title}
                            className="w-80 md:w-96 rounded-2xl"
                        />
                    ))
                    }
                </div>
            </section>

            {/* Product Preview Section */}
            <section id="koleksi" className="py-16 bg-yellow-50 rounded-3xl mt-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">Koleksi Terbaru</h2>
                    <p className="text-gray-600 mt-2">Produk pilihan dengan desain modern dan bahan berkualitas.</p>
                </div>

                {products.length === 0 ? (
                    <center><p className="text-gray-500">Tidak ada koleksi produk tersedia.</p></center>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {products
                            // Urutkan berdasarkan waktu produk dibuat (bukan marketplace link)
                            .sort(
                                (a, b) =>
                                    new Date(b.created_at) - new Date(a.created_at)
                            )
                            // Ambil hanya 3 produk terbaru
                            .slice(0, 3)
                            // Render card produk
                            .map((product, i) => (
                                <div
                                    key={i}
                                    className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition"
                                >
                                    <img
                                        src={product.main_image}
                                        alt={product.slug}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {product.name}
                                        </h3>
                                        <p className="text-amber-600 font-medium mt-1">
                                            Rp{" "}
                                            {parseInt(product.base_price).toLocaleString(
                                                "id-ID"
                                            )}
                                        </p>
                                        <div className="mt-4 flex space-x-3">
                                            <button className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white justify-center products-center rounded-lg transition">
                                                <ShoppingCart />
                                            </button>
                                            <button
                                                onClick={() => openModal(product)}
                                                className="flex-1 text-center border border-amber-500 text-amber-600 hover:bg-amber-50 py-2 rounded-lg transition"
                                            >
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </section>

            {/* ===== MODAL DETAIL PRODUK ===== */}
            {isModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white w-[90%] max-w-5xl rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row animate-fadeIn relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Gambar Produk (Kiri) */}
                        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                            <img
                                src={selectedProduct.main_image}
                                alt={selectedProduct.name}
                                className="w-full h-96 rounded-lg object-cover"
                            />
                        </div>

                        {/* Detail Produk (Kanan) */}
                        <div className="md:w-1/2 p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    {selectedProduct.name}
                                </h3>
                                <p className="text-amber-600 font-medium text-lg mt-2">
                                    Rp{" "}
                                    {parseInt(selectedProduct.base_price).toLocaleString("id-ID")}
                                </p>
                                <p className="text-gray-600 mt-4 leading-relaxed text-sm">
                                    {selectedProduct.description ||
                                        "Belum ada deskripsi untuk produk ini."}
                                </p>
                            </div>

                            {/* Tombol Marketplace */}
                            <div className="mt-6 space-y-3">
                                <p className="text-gray-600 mt-4 leading-relaxed text-lg">
                                    Checkout by
                                </p>
                                <div className="flex flex-row flex-wrap gap-3">
                                    {/* {console.log(selectedProduct)} */}
                                    {selectedProduct.marketplace_link?.length > 0 ? (
                                        selectedProduct.marketplace_link.map((link) => {
                                            // Tentukan warna tombol berdasarkan nama platform
                                            const platformName = link.marketplace_platform.name.toLowerCase();
                                            let buttonColor = "";

                                            if (platformName.includes("shopee")) {
                                                buttonColor = "bg-orange-500 hover:bg-orange-600";
                                            } else if (platformName.includes("tokopedia")) {
                                                buttonColor = "bg-green-500 hover:bg-green-600";
                                            } else if (platformName.includes("lazada")) {
                                                buttonColor = "bg-blue-500 hover:bg-blue-600";
                                            } else {
                                                buttonColor = "bg-gray-500 hover:bg-gray-600"; // default
                                            }

                                            return (
                                                <a
                                                    key={link.id}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`${buttonColor} text-white px-4 py-2 rounded-lg text-center font-medium transition`}
                                                >
                                                    {link.marketplace_platform.name}
                                                </a>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-400 text-center text-sm">
                                            Link pembelian belum tersedia.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tombol Tutup */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-5 text-gray-700 hover:text-gray-900 text-3xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-5">
                <a
                    href="/produk"
                    className="flex items-center text-amber-600 hover:text-amber-700 font-medium transition"
                >
                    <span>Lihat produk lainnya</span>
                    <ChevronRight className="w-5 h-5 ml-2 hover:text-amber-700" />
                </a>
            </div>
        </MainLayout>
    );
}
