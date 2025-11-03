import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-500">Day Collection</h1>
          <div className="space-x-6">
            <a href="/" className="text-slate-700 hover:text-yellow-500">Home</a>
            <a href="/about" className="text-slate-700 hover:text-yellow-500">About</a>
            <a href="/contact" className="text-slate-700 hover:text-yellow-500">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-16 text-center bg-yellow-100">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Koleksi Terbaru untuk Kamu</h2>
        <p className="text-slate-600">Temukan gaya terbaikmu dengan produk pilihan dari Day Collection</p>
      </header>

      {/* Grid Produk */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
            <img src={`https://res.cloudinary.com/dgvakrkiz/image/upload/v1762063661/product_main_image/liyvisrrjuo2stnvf46b.jpg`} alt="product" className="rounded-lg mb-3" />
            <h3 className="text-lg font-semibold text-slate-800">Produk {i}</h3>
            <p className="text-yellow-500 font-bold">Rp {(100000 * i).toLocaleString()}</p>
            <button className="mt-3 bg-yellow-400 text-slate-800 px-4 py-2 rounded-lg hover:bg-yellow-500 transition">
              Lihat Detail
            </button>
          </div>
        ))}
      </section>
    </div>

  )
}

export default App
