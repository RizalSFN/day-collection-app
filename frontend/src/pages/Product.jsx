import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { ShoppingCart, Search } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function Produk() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response)
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedProduct(null)
        setIsModalOpen(false)
    }

    return (
        <MainLayout>
            <section className="max-w-7xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-800">Koleksi Produk Kami</h1>
                    <p className="text-gray-500 mt-2">
                        Temukan produk pilihan dengan kualitas terbaik untuk kebutuhan Anda.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-10 relative">
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-500">Produk tidak ditemukan.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
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
                                        Rp {parseInt(product.base_price).toLocaleString("id-ID")}
                                    </p>

                                    <div className="mt-4 flex space-x-3">
                                        <button className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white justify-center items-center rounded-lg transition">
                                            <ShoppingCart className="w-5 h-5" />
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
                        className="bg-white w-[90%] max-w-5xl rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row animate-fadeIn"
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
                                    Rp {parseInt(selectedProduct.base_price).toLocaleString("id-ID")}
                                </p>
                                <p className="text-gray-600 mt-4 leading-relaxed text-sm">
                                    {selectedProduct.description || "Tidak ada deskripsi produk."}
                                </p>
                            </div>

                            <div className="mt-6 space-y-3">
                                {selectedProduct.link_shopee && (
                                    <a
                                        href={selectedProduct.link_shopee}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-center font-medium transition"
                                    >
                                        Beli di Shopee
                                    </a>
                                )}

                                {selectedProduct.link_tokopedia && (
                                    <a
                                        href={selectedProduct.link_tokopedia}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-center font-medium transition"
                                    >
                                        Beli di Tokopedia
                                    </a>
                                )}

                                {!selectedProduct.link_shopee && !selectedProduct.link_tokopedia && (
                                    <p className="text-gray-400 text-center text-sm">
                                        Link pembelian belum tersedia.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tombol Tutup */}
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 text-gray-700 hover:text-gray-800 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
