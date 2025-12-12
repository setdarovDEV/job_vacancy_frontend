import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthGateway() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("role");

        // ✅ Agar foydalanuvchi login bo‘lgan bo‘lsa
        if (token) {
            if (role === "EMPLOYER") navigate("/dashboard", { replace: true });
            else navigate("/dashboard", { replace: true });
        } else {
            // 🚪 Agar login bo‘lmagan bo‘lsa — LandingPage’ga
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    // Optional: loading animatsiya (redirect davomida)
    return (
        <div className="flex items-center justify-center h-screen bg-white text-gray-600">
            <p className="text-lg">Yuklanmoqda...</p>
        </div>
    );
}
