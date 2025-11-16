import { toast } from "react-toastify"
import { deleteProduct } from "../../services/productService"

export default function ModalDeleteProduct({ data, onClose, onSuccess }) {
    const handleDelete = async () => {
        try {
            await deleteProduct(data.id)

            toast.success("Berhasil menghapus data produk")
            onSuccess()
            onClose()
        } catch (error) {
            console.log("Gagal menghapus data produk", error);
            toast.error("Gagal menghapus data produk")
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[400px]">
                <h2 className="text-xl font-semibold mb-3 text-red-600">Hapus Data</h2>

                <p className="mb-4">
                    Apakah anda yakin ingin menghapus produk:
                    <br />
                    <span className="font-bold">{data.name}</span> ?
                </p>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Batal
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    )
}