import { useEffect, useState } from "react";
import { getAppSetting } from "../../services/appSettingService";
import { Mail, Phone, MapPinned } from "lucide-react"

export default function Footer() {
    const [description, setDescription] = useState("")
    const [settings, setSettings] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataAppSetting = await getAppSetting()

                if (Array.isArray(dataAppSetting)) {
                    setSettings(dataAppSetting)

                    const appDesc = dataAppSetting.find(
                        (item) => item.name.toLowerCase().includes("deskripsi")
                    )

                    if (appDesc) {
                        setDescription(appDesc.value)
                    }
                } else {
                    console.warn("Response tidak valid:", dataAppSetting)
                }
            } catch (error) {
                console.error("Gagal memuat data app setting:", error)
            }
        }
        fetchData()
    }, [])

    const infoList = settings.filter((item) => {
        const lower = item.name.toLowerCase()
        return (
            lower.includes("email") ||
            lower.includes("telepon") ||
            lower.includes("alamat")
        )
    })

    const getIcon = (name) => {
        const lower = name.toLowerCase()
        if (lower.includes("email")) return <Mail className="w-5 h-5 text-yellow-800" />
        if (lower.includes("telepon")) return <Phone className="w-5 h-5 text-yellow-800" />;
        if (lower.includes("alamat")) return <MapPinned className="w-5 h-5 text-yellow-800" />;
        return null
    }

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-10 text-center md:text-left grid md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-amber-600">Day<span className="text-gray-900">Collection</span></h2>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                        {description || ""}
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-gray-800 font-semibold mb-3">Navigasi</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li><a href="/" className="hover:text-amber-600">Beranda</a></li>
                        <li><a href="/produk" className="hover:text-amber-600">Produk</a></li>
                        <li><a href="/tracking-order" className="hover:text-amber-600">Lacak Pesanan</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-gray-800 font-semibold mb-3">Hubungi Kami</h3>
                    {infoList.length > 0 ? (
                        <div className="space-y-2 text-gray-600">
                            {infoList.map((info, i) => (
                                <p key={i} className="flex space-x-2">
                                    {getIcon(info.name)}
                                    <span>{info.value}</span>
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="flex space-x-2 text-gray-600">
                            Data belum tersedia
                        </p>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Day Collection. All rights reserved. - VirioTech
            </div>
        </footer>
    );
}
