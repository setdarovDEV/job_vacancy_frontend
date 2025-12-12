import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SelectRoleTablet({
                                             onSelect,
                                             loading,
                                             selectedRole,
                                             error,
                                         }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("uid");

    return (
        <div className="w-full min-h-screen bg-white flex items-center justify-center px-4">
            <div className="flex flex-col gap-4 w-full max-w-[360px]">
                <h2 className="text-center text-[22px] font-bold text-black mb-2">
                    Выберите роль
                </h2>
                <p className="text-center text-sm text-gray-600 mb-2">
                    Выберите, как вы хотите использовать платформу
                </p>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-xs text-red-600">
                        {error}
                    </div>
                )}

                {/* Job Seeker Button */}
                <button
                    onClick={() => onSelect("JOB_SEEKER")}
                    disabled={loading}
                    className={`
                        w-[330px] h-[127px] mx-auto bg-[#F5F8FC] rounded-2xl px-4 py-6 text-center shadow 
                        transition-all
                        flex flex-col items-center justify-center
                        ${
                        loading && selectedRole === "JOB_SEEKER"
                            ? "border-2 border-[#3066BE] bg-blue-50 scale-105"
                            : loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-[#e9eff9] hover:shadow-lg hover:scale-105"
                    }
                    `}
                >
                    <div className="text-4xl mb-2">💼</div>
                    <p className="text-black text-[15px] font-semibold leading-snug">
                        Я ищу работу
                    </p>
                    <p className="text-[#3066BE] font-bold mt-1 text-[16px]">
                        Соискатель
                    </p>
                    {loading && selectedRole === "JOB_SEEKER" && (
                        <div className="mt-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3066BE] mx-auto"></div>
                        </div>
                    )}
                </button>

                {/* Employer Button */}
                <button
                    onClick={() => onSelect("EMPLOYER")}
                    disabled={loading}
                    className={`
                        w-[330px] h-[127px] mx-auto bg-[#F5F8FC] rounded-2xl px-4 py-6 text-center shadow 
                        transition-all
                        flex flex-col items-center justify-center
                        ${
                        loading && selectedRole === "EMPLOYER"
                            ? "border-2 border-[#3066BE] bg-blue-50 scale-105"
                            : loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-[#e9eff9] hover:shadow-lg hover:scale-105"
                    }
                    `}
                >
                    <div className="text-4xl mb-2">🏢</div>
                    <p className="text-black text-[15px] font-semibold leading-snug">
                        Я ищу сотрудников
                    </p>
                    <p className="text-[#3066BE] font-bold mt-1 text-[16px]">
                        Работодатель
                    </p>
                    {loading && selectedRole === "EMPLOYER" && (
                        <div className="mt-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3066BE] mx-auto"></div>
                        </div>
                    )}
                </button>

                {loading && (
                    <p className="text-center text-gray-600 text-xs mt-2 animate-pulse">
                        Сохранение...
                    </p>
                )}

                {/* Back button */}
                <div className="text-center mt-2">
                    <button
                        type="button"
                        onClick={() => navigate(userId ? `/register/step3?uid=${userId}` : "/register/step3")}
                        disabled={loading}
                        className="text-xs text-[#3066BE] font-semibold hover:underline disabled:opacity-50 bg-transparent border-none"
                    >
                        ← Назад к проверке E-mail
                    </button>
                </div>
            </div>
        </div>
    );
}