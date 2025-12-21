import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerifyTablet({
                                              email,
                                              onChangeEmail,
                                              onSubmit,
                                              error,
                                              isLoading,
                                              successMessage,
                                          }) {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
            <div className="w-full max-w-[460px] bg-white rounded-[28px] px-12 py-10 shadow-sm">
                <h1 className="text-center text-[24px] font-bold text-black mb-10">
                    Ваш E-mail
                </h1>

                <form onSubmit={onSubmit} className="space-y-8">
                    <div>
                        <input
                            type="email"
                            inputMode="email"
                            placeholder="Напишите E-mail адрес"
                            value={email}
                            onChange={onChangeEmail}
                            required
                            disabled={isLoading}
                            className={`w-full border-0 border-b bg-white py-3 text-[15px] focus:outline-none transition-colors placeholder-gray-500
                                ${error
                                ? "border-red-500"
                                : successMessage
                                    ? "border-green-500"
                                    : "border-gray-300 focus:border-[#3066BE]"
                            }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />

                        {error && (
                            <p className="text-sm text-red-500 mt-2">{error}</p>
                        )}

                        {successMessage && (
                            <p className="text-sm text-green-600 mt-2 font-semibold">
                                {successMessage}
                            </p>
                        )}
                    </div>

                    {isLoading && (
                        <p className="text-blue-600 text-sm text-center">
                            Отправляем код на ваш E-mail...
                        </p>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[200px] h-[52px] bg-[#3066BE] text-white text-[15px] font-semibold rounded-[12px] hover:bg-[#2856a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                        >
                            {isLoading ? (
                                "Отправка..."
                            ) : successMessage ? (
                                "Переход..."
                            ) : (
                                <>
                                    Следующий
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
                                        <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}