import api from "./api";

export const loginService = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials)
        console.log(credentials);
        console.log(response.data);

        return response.data
    } catch (error) {
        console.log("Login gagal", error);
        return []
    }
}