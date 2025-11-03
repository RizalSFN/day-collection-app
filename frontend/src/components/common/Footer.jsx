export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-10 text-center md:text-left grid md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-amber-600">DayCollection</h2>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                        Platform belanja sederhana dengan pilihan produk berkualitas dan tampilan minimalis.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-gray-800 font-semibold mb-3">Navigasi</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li><a href="/" className="hover:text-amber-600">Beranda</a></li>
                        <li><a href="/produk" className="hover:text-amber-600">Produk</a></li>
                        <li><a href="/tentang" className="hover:text-amber-600">Tentang</a></li>
                        <li><a href="/kontak" className="hover:text-amber-600">Kontak</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-gray-800 font-semibold mb-3">Hubungi Kami</h3>
                    <p className="text-gray-600 text-sm">Email: support@daycollection.com</p>
                    <p className="text-gray-600 text-sm">Telepon: +62 812 3456 7890</p>
                    <div className="flex justify-center md:justify-start gap-4 mt-4">
                        <a href="#" className="text-gray-500 hover:text-amber-600 transition">
                            <i className="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-amber-600 transition">
                            <i className="fab fa-facebook text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-amber-600 transition">
                            <i className="fab fa-twitter text-xl"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Day Collection. All rights reserved.
            </div>
        </footer>
    );
}
