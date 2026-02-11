import React, { useEffect, useState } from "react";
import { loginService } from "../../services/authService";
import { setToken } from "../../utils/storage";
import { getActiveBanner } from "../../services/bannerService";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [banner, setBanner] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const dataBanner = await getActiveBanner()
            setBanner(dataBanner)
        }
        fetchData()
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true)

        try {
            const response = await loginService(form)
            if (response.success) {
                setToken(response.data.token)
                window.location.href = "/admin/dashboard"
            }
            setErrorMessage(response)
        } catch (error) {
            setErrorMessage(error.message || "Login gagal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="mx-auto h-40 w-auto"
                />
                <h1 className="font-bold text-2xl text-center my-5 tracking-wider">Day Collection</h1>


                {errorMessage && (
                    <div className="mb-4 p-3 font-semibold tracking-wide bg-red-200 text-red-600 rounded">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                placeholder="Masukkan email"
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                placeholder="Masukkan password"
                                onChange={handleChange}
                                required
                                autoComplete="password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full bg-amber-500 hover:bg-amber-600 justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Copyright@DayCollection
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        2026 -
                    </a>
                    VirioTech
                </p>
            </div>
        </div>
    )
}

export default Login