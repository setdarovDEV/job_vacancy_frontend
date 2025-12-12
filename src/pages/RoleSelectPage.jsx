// src/pages/RoleSelectPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import SelectRoleTablet from "../components/tablet/SelectRoleTablet";
import SelectRoleMobile from "../components/mobile/SelectRoleMobile";

export default function RoleSelectPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [error, setError] = useState("");

    // ✅ URL va localStorage'dan user_id olish
    const uidFromUrl = searchParams.get("uid");
    const storedUid = localStorage.getItem("user_id");
    const userId = uidFromUrl || storedUid;

    console.log("📍 Step 4 - URL uid:", uidFromUrl);
    console.log("📍 Step 4 - Stored uid:", storedUid);
    console.log("📍 Step 4 - Final userId:", userId);

    // ✅ URL'dagi uid'ni localStorage'ga saqlash
    useEffect(() => {
        if (uidFromUrl && !storedUid) {
            console.log("✅ Saving uid to localStorage:", uidFromUrl);
            localStorage.setItem("user_id", uidFromUrl);
        }

        if (!userId) {
            setError("Foydalanuvchi aniqlanmadi. Qaytadan ro'yxatdan o'ting.");
            const timer = setTimeout(() => navigate("/register"), 2000);
            return () => clearTimeout(timer);
        }
    }, [uidFromUrl, storedUid, userId, navigate]);

    const handleSelect = async (role) => {
        if (!userId) {
            setError("Foydalanuvchi aniqlanmadi. Qaytadan ro'yxatdan o'ting.");
            setTimeout(() => navigate("/register"), 2000);
            return;
        }

        try {
            setLoading(true);
            setSelectedRole(role);
            setError("");

            console.log("📤 Sending role to backend:", role, "for user:", userId);

            // Backend'ga role yuborish
            const response = await api.post(`/api/auth/register/step4/${userId}/`, { role });

            console.log("✅ Backend response:", response.data);

            // ✅ Muvaffaqiyatli - user_id'ni o'chirish
            localStorage.removeItem("user_id");

            // ✅ Login sahifasiga o'tish
            setTimeout(() => {
                navigate("/login", {
                    state: {
                        message: "Регистрация успешно завершена! 🎉 Пожалуйста, войдите в систему.",
                        registered: true
                    }
                });
            }, 1000);

        } catch (err) {
            console.error("❌ Error:", err);
            console.error("❌ Error response:", err?.response);

            const data = err?.response?.data || {};
            const errorMsg =
                (Array.isArray(data.role) ? data.role[0] : data.role) ||
                data.detail ||
                data.error ||
                "Не удалось сохранить роль";

            setError(errorMsg);
            setSelectedRole(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen items-center justify-center bg-white px-4">
                <div className="max-w-4xl w-full">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-black mb-4">
                            Выберите роль
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Выберите, как вы хотите использовать платформу
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
                            <p className="text-red-600 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Role Cards */}
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
                        {/* Job Seeker Card */}
                        <button
                            onClick={() => handleSelect("JOB_SEEKER")}
                            disabled={loading}
                            className={`
                                bg-[#F4F6FA] border-2 rounded-2xl p-8 w-full md:w-[320px] 
                                text-center shadow-lg transition-all duration-300 
                                flex flex-col items-center justify-center min-h-[200px]
                                ${loading && selectedRole === "JOB_SEEKER"
                                ? "border-[#3066BE] bg-blue-50 scale-105"
                                : loading
                                    ? "opacity-50 cursor-not-allowed border-gray-300"
                                    : "border-transparent hover:border-[#3066BE] hover:shadow-xl hover:scale-105 active:scale-100"
                            }
                            `}
                        >
                            <div className="mb-4 text-5xl">💼</div>
                            <div className="text-gray-800">
                                <p className="text-lg font-medium mb-2">
                                    Я ищу работу
                                </p>
                                <p className="text-2xl font-bold text-[#3066BE]">
                                    Соискатель
                                </p>
                            </div>
                            {loading && selectedRole === "JOB_SEEKER" && (
                                <div className="mt-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3066BE] mx-auto"></div>
                                </div>
                            )}
                        </button>

                        {/* Employer Card */}
                        <button
                            onClick={() => handleSelect("EMPLOYER")}
                            disabled={loading}
                            className={`
                                bg-[#F4F6FA] border-2 rounded-2xl p-8 w-full md:w-[320px] 
                                text-center shadow-lg transition-all duration-300 
                                flex flex-col items-center justify-center min-h-[200px]
                                ${loading && selectedRole === "EMPLOYER"
                                ? "border-[#3066BE] bg-blue-50 scale-105"
                                : loading
                                    ? "opacity-50 cursor-not-allowed border-gray-300"
                                    : "border-transparent hover:border-[#3066BE] hover:shadow-xl hover:scale-105 active:scale-100"
                            }
                            `}
                        >
                            <div className="mb-4 text-5xl">🏢</div>
                            <div className="text-gray-800">
                                <p className="text-lg font-medium mb-2">
                                    Я ищу сотрудников
                                </p>
                                <p className="text-2xl font-bold text-[#3066BE]">
                                    Работодатель
                                </p>
                            </div>
                            {loading && selectedRole === "EMPLOYER" && (
                                <div className="mt-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3066BE] mx-auto"></div>
                                </div>
                            )}
                        </button>
                    </div>

                    {loading && (
                        <p className="text-center text-gray-600 mt-6 animate-pulse">
                            Сохранение...
                        </p>
                    )}

                    {/* Back Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={() => navigate(userId ? `/register/step3?uid=${userId}` : "/register/step3")}
                            disabled={loading}
                            className="bg-[#F4F6FA] text-[#3066BE] border-none rounded-lg px-6 py-3 text-sm font-semibold hover:bg-[#e8ecf4] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Назад к проверке E-mail
                        </button>
                    </div>
                </div>
            </div>

            {/* Tablet */}
            <div className="hidden md:block lg:hidden">
                <SelectRoleTablet
                    onSelect={handleSelect}
                    loading={loading}
                    selectedRole={selectedRole}
                    error={error}
                />
            </div>

            {/* Mobile */}
            <div className="block md:hidden">
                <SelectRoleMobile
                    onSelect={handleSelect}
                    loading={loading}
                    selectedRole={selectedRole}
                    error={error}
                />
            </div>
        </React.Fragment>
    );
}