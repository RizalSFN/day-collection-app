import api from "./api";

export const login = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials)
        return response.data
    } catch (error) {
        console.log("Login gagal", error);
        return []
    }
}