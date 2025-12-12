// src/components/mobile/RegisterMobile.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterMobile({
                                           formData,
                                           onChange,
                                           onSubmit,
                                           error,
                                           fieldErrors = {},
                                           isLoading,
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
                        <div className="w-full max-w-[300px]">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Ваше имя"
                                value={formData.first_name}
                                onChange={onChange}
                                disabled={isLoading}
                                className={`w-full bg-[#F4F6FA] placeholder-[#585858]
                                    border-0 border-b focus:outline-none py-2 text-[14px]
                                    ${fieldErrors.first_name ? 'border-red-500' : 'border-black/90'}
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                required
                            />
                            {fieldErrors.first_name && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.first_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Last name */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-[300px]">
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Фамилия"
                                value={formData.last_name}
                                onChange={onChange}
                                disabled={isLoading}
                                className={`w-full bg-[#F4F6FA] placeholder-[#585858]
                                    border-0 border-b focus:outline-none py-2 text-[14px]
                                    ${fieldErrors.last_name ? 'border-red-500' : 'border-black/90'}
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                required
                            />
                            {fieldErrors.last_name && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.last_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Username */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-[300px]">
                            <input
                                type="text"
                                name="username"
                                placeholder="Ваше имя пользователя"
                                value={formData.username}
                                onChange={onChange}
                                disabled={isLoading}
                                className={`w-full bg-[#F4F6FA] placeholder-[#585858]
                                    border-0 border-b focus:outline-none py-2 text-[14px]
                                    ${fieldErrors.username ? 'border-red-500' : 'border-black/90'}
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                required
                                autoComplete="username"
                            />
                            {fieldErrors.username && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.username}</p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-[300px]">
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    placeholder="Пароль"
                                    value={formData.password}
                                    onChange={onChange}
                                    disabled={isLoading}
                                    className={`w-full bg-[#F4F6FA] placeholder-[#585858]
                                        border-0 border-b focus:outline-none py-2 text-[14px] pr-10
                                        ${fieldErrors.password ? 'border-red-500' : 'border-black/90'}
                                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((s) => !s)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-xs px-2 py-1"
                                    disabled={isLoading}
                                >
                                    {showPass ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                            )}
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
                                disabled={isLoading}
                                className={`w-full bg-[#F4F6FA] placeholder-[#585858]
                                    border-0 border-b border-black/90 focus:outline-none py-2 text-[14px] pr-10
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs px-2 py-1"
                                disabled={isLoading}
                            >
                                {showConfirm ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-xs text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Policy checkbox */}
                    <div className="flex items-start gap-2 max-w-[300px] mx-auto">
                        <input
                            type="checkbox"
                            required
                            disabled={isLoading}
                            className="mt-[3px] w-4 h-4 accent-black"
                        />
                        <p className="text-[12px] leading-[18px]">
                            Я прочитал и принял Политику конфиденциальности и Условия*
                        </p>
                    </div>

                    {/* Submit */}
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
                                "Загрузка..."
                            ) : (
                                <>
                                    Следующий
                                    <img src="/next.png" alt="next icon" className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Login link */}
                    <div className="text-center">
                        <Link to="/login" className="text-[12px] text-[#3066BE] font-semibold hover:underline">
                            Уже есть аккаунт?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}