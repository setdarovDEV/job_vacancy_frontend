import React from "react";
import { Link } from "react-router-dom";

export default function LoginTablet({
                                        username,
                                        password,
                                        onChangeUsername,
                                        onChangePassword,
                                        onSubmit,
                                        error,
                                        successMessage,
                                        isLoading
                                    }) {
    return (
        <div className="w-full h-screen bg-white text-black flex items-center justify-center px-4 md:px-6">
            <div className="w-full max-w-[360px] bg-[#F5F8FC] rounded-2xl px-6 py-8 shadow-md">
                <h2 className="text-center text-[20px] font-semibold mb-6">
                    Вход в аккаунт
                </h2>

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <p className="text-green-600 text-sm font-semibold text-center">
                            ✅ {successMessage}
                        </p>
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    {/* Username */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Ваше имя пользователя"
                            className="w-full border-0 border-b border-[#000000] bg-[#F4F6FA] placeholder-[#585858] text-[16px] focus:outline-none focus:border-[#3066BE] py-2 transition disabled:opacity-50"
                            value={username}
                            onChange={onChangeUsername} // ✅ Event obyektini to'g'ridan uzatamiz
                            disabled={isLoading}
                            autoComplete="username"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="w-full border-0 border-b border-black bg-[#F4F6FA] placeholder-[#585858] text-[16px] focus:outline-none focus:border-[#3066BE] py-2 transition disabled:opacity-50"
                            value={password}
                            onChange={onChangePassword} // ✅ Event obyektini to'g'ridan uzatamiz
                            disabled={isLoading}
                            autoComplete="current-password"
                            required
                        />
                        <Link
                            to="/password-reset"
                            className="text-[12px] text-black mt-1 inline-block hover:underline hover:text-[#3066BE] transition"
                        >
                            Забыли пароль?
                        </Link>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Login Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[160px] bg-[#3066BE] text-white font-semibold py-2 rounded-[13px] mt-2 hover:bg-[#2a58a6] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Вход...</span>
                                </div>
                            ) : (
                                "Вход в аккаунт"
                            )}
                        </button>
                    </div>

                    {/* Signup */}
                    <div className="text-center text-[12px] text-[#3066BE] mt-4">
                        <Link to="/register" className="hover:underline">
                            Еще нет учетной записи?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}