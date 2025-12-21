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
        <div className="min-h-screen bg-white flex items-center justify-center px-5 py-8">
            <div className="w-full max-w-[340px]">
                <div className="bg-[#F8F9FB] rounded-[24px] px-8 py-10">
                    <h1 className="text-center text-[22px] font-bold mb-8 text-black">
                        Ваш E-mail
                    </h1>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                inputMode="email"
                                placeholder="Напишите E-mail адрес"
                                value={email}
                                onChange={onChangeEmail}
                                disabled={isLoading}
                                required
                                className={`w-full bg-[#F8F9FB] placeholder-gray-500
                                    border-0 border-b focus:outline-none py-3 text-[15px] transition-colors
                                    ${error ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-gray-300 focus:border-black'}
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />

                            {error && (
                                <p className="text-xs text-red-500 mt-2">{error}</p>
                            )}

                            {successMessage && (
                                <p className="text-xs text-green-600 mt-2 font-semibold">
                                    {successMessage}
                                </p>
                            )}
                        </div>

                        {isLoading && (
                            <p className="text-blue-600 text-xs text-center">
                                Отправляем код на ваш E-mail...
                            </p>
                        )}

                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-[190px] h-[52px] bg-[#3066BE] text-white text-[15px]
                                    font-semibold rounded-[12px] active:scale-[0.98] transition-all
                                    flex items-center justify-center gap-2 shadow-sm
                                    disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2856a8]"
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
        </div>
    );
}