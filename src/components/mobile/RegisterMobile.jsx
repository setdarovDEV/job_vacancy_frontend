// src/components/mobile/RegisterMobile.jsx
import React, { useState } from "react";

export default function RegisterMobile({
                                           formData,
                                           onChange,
                                           onSubmit,
                                           error,
                                       }) {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F4F6FA] rounded-2xl p-6 shadow">
                <h1 className="text-center text-[22px] leading-[30px] font-bold mb-6">
                    Зарегистрироваться
                </h1>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* First name */}
                    <div className="flex justify-center">
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Ваше имя"
                            value={formData.first_name}
                            onChange={onChange}
                            className="w-full max-w-[300px] bg-[#F4F6FA] placeholder-[#585858]
                         border-0 border-b border-black/90 focus:outline-none
                         focus:border-black py-2 text-[14px]"
                            required
                        />
                    </div>

                    {/* Last name */}
                    <div className="flex justify-center">
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Фамилия"
                            value={formData.last_name}
                            onChange={onChange}
                            className="w-full max-w-[300px] bg-[#F4F6FA] placeholder-[#585858]
                         border-0 border-b border-black/90 focus:outline-none
                         focus:border-black py-2 text-[14px]"
                            required
                        />
                    </div>

                    {/* Username */}
                    <div className="flex justify-center">
                        <input
                            type="text"
                            name="username"
                            placeholder="Ваше имя пользователя"
                            value={formData.username}
                            onChange={onChange}
                            className="w-full max-w-[300px] bg-[#F4F6FA] placeholder-[#585858]
                         border-0 border-b border-black/90 focus:outline-none
                         focus:border-black py-2 text-[14px]"
                            required
                            autoComplete="username"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-[300px] relative">
                            <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={onChange}
                                className="w-full bg-[#F4F6FA] placeholder-[#585858]
                           border-0 border-b border-black/90 focus:outline-none
                           focus:border-black py-2 text-[14px] pr-10"
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                aria-label={showPass ? "Hide password" : "Show password"}
                                onClick={() => setShowPass((s) => !s)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs px-2 py-1"
                            >
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-[300px] relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirm_password"
                                placeholder="Подтвердите пароль"
                                value={formData.confirm_password}
                                onChange={onChange}
                                className="w-full bg-[#F4F6FA] placeholder-[#585858]
                           border-0 border-b border-black/90 focus:outline-none
                           focus:border-black py-2 text-[14px] pr-10"
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                                onClick={() => setShowConfirm((s) => !s)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs px-2 py-1"
                            >
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && <div className="text-center text-red-500 text-xs">{error}</div>}

                    {/* Policy checkbox */}
                    <div className="flex items-start gap-2 max-w-[300px] mx-auto">
                        <input type="checkbox" required className="mt-[3px] w-4 h-4 accent-black" />
                        <p className="text-[12px] leading-[18px]">
                            Я прочитал и принял{" "}
                            <a href="/privacy" className="underline">Политику конфиденциальности</a>{" "}
                            и <a href="/terms" className="underline">Условия</a>*
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center pt-1">
                        <button
                            type="submit"
                            className="w-[177px] h-[52px] bg-[#3066BE] text-white text-[15px]
                         font-semibold rounded-xl active:scale-[0.99] transition
                         flex items-center justify-center gap-2"
                        >
                            Следующий
                            <img src="/next.png" alt="next icon" className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Login link */}
                    <div className="text-center">
                        <a href="/login" className="text-[12px] text-[#3066BE] font-semibold hover:underline">
                            Уже есть аккаунт?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
