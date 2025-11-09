import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation()

    const isActive = (path) => location.pathname == path

    return (
        <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-amber-600">
                    Day<span className="text-gray-900">Collection</span>
                </Link>

                {/* Menu for Desktop */}
                <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
                    <Link
                        to="/"
                        className={`${isActive("/") ? "text-amber-600 font-semibold" : "text-gray-600 hover:text-amber-600"
                            } transition`}
                    >
                        Beranda
                    </Link>

                    <Link
                        to="/produk"
                        className={`${isActive("/produk")
                            ? "text-amber-600 font-semibold"
                            : "text-gray-600 hover:text-amber-600"
                            } transition`}
                    >
                        Produk
                    </Link>

                    <Link
                        to="/tentang"
                        className={`${isActive("/tentang")
                            ? "text-amber-600 font-semibold"
                            : "text-gray-600 hover:text-amber-600"
                            } transition`}
                    >
                        Tentang
                    </Link>

                    <Link
                        to="/admin/login"
                        className="ml-4 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full transition"
                    >
                        Admin Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-800 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md flex flex-col items-center py-4 gap-4 text-gray-700 font-medium">
                    <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-amber-600">Beranda</Link>
                    <Link to="/produk" onClick={() => setIsOpen(false)} className="hover:text-amber-600">Produk</Link>
                    <Link to="/tentang" onClick={() => setIsOpen(false)} className="hover:text-amber-600">Tentang</Link>
                    <Link to="/kontak" onClick={() => setIsOpen(false)} className="hover:text-amber-600">Kontak</Link>
                    <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full transition"
                    >
                        Admin Login
                    </Link>
                </div>
            )}
        </nav>
    );
}
