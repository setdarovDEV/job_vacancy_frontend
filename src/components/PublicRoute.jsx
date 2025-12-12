// src/components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

/**
 * PublicRoute - Faqat login qilmagan foydalanuvchilar kirishi mumkin
 *
 * Agar token bo'lsa, role'ga qarab dashboard'ga yo'naltiradi
 */
export default function PublicRoute({ children }) {
    const isAuth = isAuthenticated();

    if (isAuth) {
        const role = getUserRole();
        console.log("✅ Already authenticated - redirecting to dashboard");

        // Role'ga qarab yo'naltirish
        if (role === "EMPLOYER") {
            return <Navigate to="/home" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    console.log("🔓 Not authenticated - rendering public content");
    return children;
}