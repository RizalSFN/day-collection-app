import api from "./api.js";

export const searchLocationApi = async (query) => {
    try {
        const response = await api.get("/shipping/search", {
            params: { query }
        });
        // Sesuai backend kita: return response.data.data (array lokasi)
        return response.data.data;
    } catch (error) {
        console.error("Gagal mencari lokasi: ", error);
        return [];
    }
}

export const checkOngkirApi = async (destinationId, weight, courier) => {
    try {
        const payload = {
            destination: destinationId,
            weight: parseInt(weight),
            courier: courier
        };

        const response = await api.post("/shipping/cost", payload);

        // Backend mengembalikan { status: 'success', data: [...] }
        // Kita ambil data[0].costs karena RajaOngkir membungkusnya dalam array
        return response.data.data[0].costs;
    } catch (error) {
        console.error("Gagal cek ongkir: ", error);
        throw error; // Lempar error agar UI bisa menampilkan alert
    }
}