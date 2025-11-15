import React, { useState } from "react";
import { X } from "lucide-react";
import { createMarketplacePlatform } from "../../services/marketplacePlatformService";
import { toast } from "react-toastify";

const ModalAddMarketplacePlatform = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState("")

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await createMarketplacePlatform({ name })

            toast.success("Berhasil menambah data marketplace platform")

            onSuccess()
            onClose()
            setName("")
        } catch (error) {
            console.log("Gagal menambah data marketplace platform", error);
            toast.error("Gagal menambah data marketplace platform")
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white w-96 rounded-xl p-5 shadow-2xl relative">

                {/* Tombol Close */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <X size={22} />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-amber-600">
                    Tambah Marketplace Platform
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nama Platform</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            placeholder="Contoh: Shopee"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg"
                    >
                        Simpan
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ModalAddMarketplacePlatform