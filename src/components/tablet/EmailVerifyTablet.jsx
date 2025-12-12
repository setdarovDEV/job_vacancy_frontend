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
        <div className="w-full min-h-screen bg-white flex items-center justify-center px-4 text-black">
            <div className="w-full max-w-[360px] bg-[#F5F8FC] rounded-2xl px-6 py-8 shadow-md">
                <h2 className="text-center text-[20px] font-semibold mb-6">
                    Ваш E-mail
                </h2>

                <form onSubmit={onSubmit}>
                    {/* Email input */}
                    <div className="mb-4">
                        <input
                            type="email"
                            inputMode="email"
                            placeholder="Напишите E-mail адрес"
                            value={email}
                            onChange={onChangeEmail}
                            required
                            disabled={isLoading}
                            className={`w-full border-0 border-b bg-transparent py-2 text-sm focus:outline-none transition-colors
                                ${error
                                ? "border-red-500"
                                : successMessage
                                    ? "border-green-500"
                                    : "border-black"
                            }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2 text-xs text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2 text-xs text-green-600 text-center font-semibold">
                            {successMessage}
                        </div>
                    )}

                    {/* Loading message */}
                    {isLoading && (
                        <p className="text-blue-600 text-xs text-center mb-2">
                            Отправляем код на ваш E-mail...
                        </p>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#3066BE] w-[158px] ml-[74px] text-white font-semibold py-2 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading
                            ? "Отправка..."
                            : successMessage
                                ? "Переход..."
                                : "Следующий →"}
                    </button>

                    {/* Back button */}
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            disabled={isLoading}
                            className="text-xs text-[#3066BE] font-semibold hover:underline disabled:opacity-50 bg-transparent border-none"
                        >
                            ← Назад к регистрации
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}