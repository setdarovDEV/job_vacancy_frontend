// src/components/mobile/SelectRoleMobile.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SelectRoleMobile({
                                             onSelect,
                                             loading,
                                             selectedRole,
                                             error
                                         }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("uid");

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px]">
                <h1 className="text-center text-[24px] font-bold mb-2">Выберите роль</h1>
                <p className="text-center text-sm text-gray-600 mb-6">
                    Выберите, как вы хотите использовать платформу
                </p>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-center text-xs text-red-600">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* JOB SEEKER */}
                    <button
                        onClick={() => onSelect("JOB_SEEKER")}
                        disabled={loading}
                        className={`w-full bg-[#F4F6FA] rounded-2xl p-6 shadow transition-all
                            flex flex-col items-center justify-center text-center min-h-[120px]
                            ${loading && selectedRole === "JOB_SEEKER"
                            ? "border-2 border-[#3066BE] bg-blue-50 scale-105"
                            : loading
                                ? "opacity-50 cursor-not-allowed"
                                : "active:scale-95 hover:bg-[#e9eff9]"}`}
                    >
                        <div className="text-4xl mb-2">💼</div>
                        <p className="text-[15px] leading-[22px] font-semibold text-black">
                            Я ищу работу
                        </p>
                        <p className="text-[#3066BE] font-bold text-[16px] mt-1">
                            Соискатель
                        </p>
                        {loading && selectedRole === "JOB_SEEKER" && (
                            <div className="mt-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3066BE] mx-auto"></div>
                            </div>
                        )}
                    </button>

                    {/* EMPLOYER */}
                    <button
                        onClick={() => onSelect("EMPLOYER")}
                        disabled={loading}
                        className={`w-full bg-[#F4F6FA] rounded-2xl p-6 shadow transition-all
                            flex flex-col items-center justify-center text-center min-h-[120px]
                            ${loading && selectedRole === "EMPLOYER"
                            ? "border-2 border-[#3066BE] bg-blue-50 scale-105"
                            : loading
                                ? "opacity-50 cursor-not-allowed"
                                : "active:scale-95 hover:bg-[#e9eff9]"}`}
                    >
                        <div className="text-4xl mb-2">🏢</div>
                        <p className="text-[15px] leading-[22px] font-semibold text-black">
                            Я ищу сотрудников
                        </p>
                        <p className="text-[#3066BE] font-bold text-[16px] mt-1">
                            Работодатель
                        </p>
                        {loading && selectedRole === "EMPLOYER" && (
                            <div className="mt-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3066BE] mx-auto"></div>
                            </div>
                        )}
                    </button>
                </div>

                {loading && (
                    <p className="text-center text-gray-600 text-xs mt-4 animate-pulse">
                        Сохранение...
                    </p>
                )}

                {/* Back button */}
                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => navigate(userId ? `/register/step3?uid=${userId}` : "/register/step3")}
                        disabled={loading}
                        className="text-[12px] text-[#3066BE] font-semibold hover:underline disabled:opacity-50 bg-transparent border-none"
                    >
                        ← Назад к проверке E-mail
                    </button>
                </div>
            </div>
        </div>
    );
}