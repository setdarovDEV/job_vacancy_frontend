// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/**
 * PrivateRoute - Faqat login qilgan foydalanuvchilar kirishi mumkin
 *
 * Agar token bo'lmasa, /login ga yo'naltiradi
 */
export default function PrivateRoute({ children }) {
    const isAuth = isAuthenticated();

    if (!isAuth) {
        console.log("🔒 Not authenticated - redirecting to login");
        return <Navigate to="/login" replace />;
    }

    console.log("✅ Authenticated - rendering protected content");
    return children;
}