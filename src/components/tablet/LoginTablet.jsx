import React from "react";
import { Link } from "react-router-dom";

export default function LoginTablet({
                                        username,
                                        password,
                                        onChangeUsername,
                                        onChangePassword,
                                        onSubmit,
                                        error,
                                    }) {
    return (
        <div className="w-full h-screen bg-white text-black flex items-center justify-center px-4 md:px-6">
            <div className="w-full max-w-[360px] bg-[#F5F8FC] rounded-2xl px-6 py-8 shadow-md">
                <h2 className="text-center text-[20px] font-semibold mb-6">
                    Вход в аккаунт
                </h2>
                <form onSubmit={onSubmit}>
                    {/* Username */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Ваше имя пользователя"
                            className="w-full border-0 border-b border-[#000000] bg-[#F4F6FA] placeholder-[#585858] text-[16px] focus:outline-none focus:border-[#000000] py-2"
                            value={username}
                            onChange={(e) => onChangeUsername(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="w-full border-0 border-b border-black bg-transparent focus:outline-none focus:ring-0 focus:border-black"
                            value={password}
                            onChange={(e) => onChangePassword(e.target.value)}
                        />
                        <Link
                            to="/forgot"
                            className="text-[12px] text-black mt-1 inline-block hover:underline"
                        >
                            Забыли пароль?
                        </Link>
                    </div>

                    {/* Error */}
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-[160px] ml-[75px] bg-[#3066BE] text-white font-semibold py-2 rounded-[13px] mt-2 hover:opacity-90 transition"
                    >
                        Вход в аккаунт
                    </button>

                    {/* Signup */}
                    <div className="text-center text-[12px] text-[#3066BE] mt-4">
                        <Link to="/signup" className="hover:underline">
                            Еще нет учетной записи?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
