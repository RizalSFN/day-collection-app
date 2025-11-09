import React, { useState } from "react";
import { loginService } from "../../services/authService";
import { setToken } from "../../utils/storage";

const login = () => {
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true)

        try {
            const response = await loginService()
            if (response.success) {
                setToken(response.data.token)
                alert("login berhasil")
                window.location.href = "/admin/dashboard"
            }
        } catch (error) {
            setErrorMessage(error.message || "Login gagal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center from-amber-100 to-yellow-50">
            <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Admin Login
                </h2>
                <p className="text-gray-500 text-center mb-8">
                    Masuk untuk mengelola konten website Anda
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="Masukkan email admin"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="Masukkan password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                Memproses...
                            </>
                        ) : (
                            "Login Sekarang"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default login