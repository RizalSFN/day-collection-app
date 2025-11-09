import React from "react";
import { Navigate } from "react-router-dom";

export const protectedRoute = ({ children }) => {
    const token = localStorage.getItem("auth_token")

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return children
}