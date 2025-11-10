import api from "./api";

export const loginService = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials)
        return response.data
    } catch (error) {
        return error.response.data.error
    }
}