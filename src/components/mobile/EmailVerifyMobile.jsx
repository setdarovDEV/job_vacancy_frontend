// src/components/mobile/EmailVerifyMobile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerifyMobile({
                                              email,
                                              onChangeEmail,
                                              onSubmit,
                                              error,
                                              isLoading,
                                              successMessage
                                          }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F6F8FC] rounded-2xl p-6 shadow text-center">
                <h1 className="text-[22px] leading-[30px] font-bold mb-6">Ваш E-mail</h1>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="text-left flex justify-center">
                        <div className="w-full max-w-[300px]">
                            <input
                                type="email"
                                inputMode="email"
                                placeholder="Напишите E-mail адрес"
                                value={email}
                                onChange={onChangeEmail}
                                disabled={isLoading}
                                required
                                className={`w-full bg-[#F6F8FC] placeholder-[#585858]
                                    border-0 border-b focus:outline-none py-2 text-[14px]
                                    ${error ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-black/90'}
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center text-xs text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center text-xs text-green-600 font-semibold">
                            {successMessage}
                        </div>
                    )}

                    {/* Loading message */}
                    {isLoading && (
                        <p className="text-blue-600 text-xs text-center">
                            Отправляем код на ваш E-mail...
                        </p>
                    )}

                    <div className="flex justify-center pt-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[177px] h-[52px] bg-[#3066BE] text-white text-[15px]
                                font-semibold rounded-xl active:scale-[0.99] transition
                                flex items-center justify-center gap-2
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                "Отправка..."
                            ) : successMessage ? (
                                "Переход..."
                            ) : (
                                <>
                                    Следующий
                                    <img src="/next.png" alt="next icon" className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Back button */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            disabled={isLoading}
                            className="text-[12px] text-[#3066BE] font-semibold hover:underline disabled:opacity-50"
                        >
                            ← Назад к регистрации
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}