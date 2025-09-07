// src/components/mobile/LoginMobile.jsx
import React from "react";

export default function LoginMobile({
                                        username,
                                        password,
                                        onChangeUsername,
                                        onChangePassword,
                                        onSubmit,
                                        error,
                                    }) {
    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F4F6FA] rounded-2xl p-6 shadow">

                <h1 className="text-[22px] leading-[30px] font-bold text-center mt-1 mb-6">
                    Вход в аккаунт
                </h1>

                <form className="space-y-5" onSubmit={onSubmit}>
                    {/* Username */}
                    <div className="flex justify-center">
                        <input
                            type="text"
                            placeholder="Ваше имя пользователя"
                            className="w-full max-w-[300px] bg-[#F4F6FA] placeholder-[#585858]
                         border-0 border-b border-black/90 focus:outline-none
                         focus:border-black py-2 text-[14px]"
                            value={username}
                            onChange={(e) => onChangeUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex justify-center">
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="w-full max-w-[300px] bg-[#F4F6FA] placeholder-[#585858]
                         border-0 border-b border-black/90 focus:outline-none
                         focus:border-black py-2 text-[14px]"
                            value={password}
                            onChange={(e) => onChangePassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="text-center text-red-500 text-xs">{error}</div>
                    )}

                    {/* Forgot */}
                    <div className="text-left">
                        <a
                            href="/password-reset"
                            className="text-[12px] font-semibold leading-[18px] hover:underline hover:text-[#3066BE] text-black ml-[6px]"
                        >
                            Забыли пароль?
                        </a>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center pt-1">
                        <button
                            type="submit"
                            className="w-[180px] h-[50px] bg-[#3066BE] text-white text-[15px]
                         font-semibold rounded-xl active:scale-[0.99] transition"
                        >
                            Вход в аккаунт
                        </button>
                    </div>

                    {/* Register */}
                    <div className="text-center">
                        <a
                            href="/register"
                            className="text-[12px] text-[#3066BE] hover:underline"
                        >
                            Еще нет учетной записи?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
