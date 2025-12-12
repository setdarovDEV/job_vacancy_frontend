import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // sizning api.js faylingiz
// import axios from "axios"; // api.js ishlatgani ma'qul

import ProfilePage from "./ProfilePage";
import HomeEmployer from "./HomeEmployer";

export default function RoleBasedPage() {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                setLoading(true);
                setError(null);

                // Token tekshirish
                const token = localStorage.getItem("access_token");
                console.log("🔑 Token:", token ? "Mavjud" : "Yo'q");

                if (!token) {
                    console.warn("⚠️ Token yo'q, login sahifasiga yo'naltirish...");
                    navigate("/login");
                    return;
                }

                // User ma'lumotini olish
                console.log("📡 User ma'lumotini yuklamoqda...");
                const response = await api.get("/api/auth/me/");

                console.log("✅ Backend javobi:", response.data);
                console.log("👤 User role:", response.data.role);

                const userRole = response.data.role;

                // Role tekshirish
                if (!userRole) {
                    console.error("❌ Role mavjud emas!");
                    setError("Role aniqlanmadi");
                    return;
                }

                // Role set qilish
                setRole(userRole);
                console.log("🎯 Role o'rnatildi:", userRole);

            } catch (err) {
                console.error("❌ Xatolik:", err);
                console.error("Response:", err.response?.data);

                setError(err.response?.data?.detail || "Ma'lumot yuklanmadi");

                // 401 - Unauthorized
                if (err.response?.status === 401) {
                    console.warn("🔒 Token yaroqsiz, logout...");
                    localStorage.clear();
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [navigate]);

    // Loading holati
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 text-lg">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    // Error holati
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Xatolik</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Qayta urinish
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="ml-3 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Login sahifasiga
                    </button>
                </div>
            </div>
        );
    }

    // Role bo'yicha sahifa
    if (role === "JOB_SEEKER") {
        console.log("🎨 Job Seeker sahifasini ko'rsatish");
        return <ProfilePage />;
    }

    if (role === "EMPLOYER") {
        console.log("🏢 Employer sahifasini ko'rsatish");
        return <HomeEmployer />;
    }

    // Noma'lum role
    console.error("❓ Noma'lum role:", role);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="text-yellow-500 text-5xl mb-4">❓</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Noma'lum rol</h2>
                <p className="text-gray-600 mb-4">
                    Sizning role: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{role}</span>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    Role "JOB_SEEKER" yoki "EMPLOYER" bo'lishi kerak.
                </p>
                <button
                    onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Qayta login qilish
                </button>
            </div>
        </div>
    );
}