import { toast } from "react-toastify"
import { deleteMarketplaceLink } from "../../services/marketplaceLinkService"

export default function ModalDeleteMarketplaceLink({ data, onClose, onSuccess }) {
    const handleDelete = async () => {
        try {
            await deleteMarketplaceLink(data.id)

            toast.success("Berhasil menghapus data marketplace link")
            onSuccess()
            onClose()
        } catch (error) {
            console.log("Gagal menghapus data marketplace link", error);
            toast.error("Gagal menghapus data marketplace link")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[400px]">
                <h2 className="text-xl font-semibold mb-3 text-red-600">Hapus Data</h2>

                <p className="mb-4">
                    Apakah anda yakin ingin menghapus marketplace link:
                    <br />
                    <span className="font-bold">{data.url}</span> ?
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