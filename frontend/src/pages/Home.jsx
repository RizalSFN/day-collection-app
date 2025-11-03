import MainLayout from "../layouts/MainLayout";

export default function Home() {
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
                        <button className="border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-full text-lg font-medium transition">
                            Lihat Koleksi
                        </button>
                    </div>
                </div>

                {/* Image Section */}
                <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
                    <img
                        src="/assets/hero-fashion.png"
                        alt="Day Collection Hero"
                        className="w-80 md:w-96 rounded-2xl shadow-lg border border-amber-100"
                    />
                </div>
            </section>

            {/* Product Preview Section */}
            <section className="py-16 bg-yellow-50 rounded-3xl mt-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">Koleksi Terbaru</h2>
                    <p className="text-gray-600 mt-2">Produk pilihan dengan desain modern dan bahan berkualitas.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                    {[
                        { name: "Kemeja Linen Putih", price: "Rp249.000", img: "/assets/product1.jpg" },
                        { name: "Sweater Oversize Cream", price: "Rp199.000", img: "/assets/product2.jpg" },
                        { name: "Celana Kulot Hitam", price: "Rp179.000", img: "/assets/product3.jpg" },
                    ].map((p, i) => (
                        <div
                            key={i}
                            className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition"
                        >
                            <img src={p.img} alt={p.name} className="w-full h-64 object-cover" />
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                                <p className="text-amber-600 font-medium mt-1">{p.price}</p>
                                <button className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition">
                                    Tambah ke Keranjang
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
