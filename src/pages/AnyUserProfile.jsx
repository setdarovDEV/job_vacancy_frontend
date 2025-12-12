// src/pages/AnyUserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

// Import existing profile components
import ProfilePageDesktop from "./ProfilePageDesktop";
import HomeEmployer from "./HomeEmployer";

export default function AnyUserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState("");

    const currentUserId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);

                // ✅ Agar o'z profilimizga o'tsak → dashboard'ga yo'naltir
                if (userId === currentUserId) {
                    const res = await api.get("/api/auth/me/");
                    const myRole = res.data.role;

                    if (myRole === "JOB_SEEKER") {
                        navigate("/profile", { replace: true });
                    } else if (myRole === "EMPLOYER") {
                        navigate("/home-employer", { replace: true });
                    }
                    return;
                }

                // ✅ Boshqa userning profilini ko'rish
                const response = await api.get(`/api/auth/profile/${userId}/`);
                const role = response.data.role;

                if (!role) {
                    setError("User role not found");
                    return;
                }

                setUserRole(role);
            } catch (err) {
                console.error("❌ Profile fetch error:", err);
                setError(err.response?.data?.detail || "Profile topilmadi");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId, currentUserId, navigate]);

    // ===== LOADING =====
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3066BE] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    // ===== ERROR =====
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2 bg-[#3066BE] text-white rounded-lg hover:bg-[#2452a6]"
                    >
                        Orqaga qaytish
                    </button>
                </div>
            </div>
        );
    }

    // ===== RENDER BASED ON ROLE =====
    if (userRole === "JOB_SEEKER") {
        // ✅ Job Seeker profilini ko'rsatamiz (read-only mode)
        return <ProfilePageDesktop viewOnly={true} targetUserId={userId} />;
    }

    if (userRole === "EMPLOYER") {
        // ✅ Employer profilini ko'rsatamiz (read-only mode)
        return <HomeEmployer viewOnly={true} targetUserId={userId} />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600">Unknown user role</p>
        </div>
    );
}