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
        <div className="min-h-screen bg-white flex items-center justify-center px-5 py-8">
            <div className="w-full max-w-[340px]">
                <h1 className="text-center text-[24px] font-bold mb-10 text-black">
                    Зарегистрироваться
                </h1>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* First name */}
                    <div>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Ваше имя"
                            value={formData.first_name}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full bg-white placeholder-gray-500
                                border-0 border-b focus:outline-none py-3 text-[15px] transition-colors
                                ${fieldErrors.first_name ? 'border-red-500' : 'border-gray-300 focus:border-black'}
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                        />
                        {fieldErrors.first_name && (
                            <p className="text-xs text-red-500 mt-1">{fieldErrors.first_name}</p>
                        )}
                    </div>

                    {/* Last name */}
                    <div>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Фамилия"
                            value={formData.last_name}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full bg-white placeholder-gray-500
                                border-0 border-b focus:outline-none py-3 text-[15px] transition-colors
                                ${fieldErrors.last_name ? 'border-red-500' : 'border-gray-300 focus:border-black'}
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                        />
                        {fieldErrors.last_name && (
                            <p className="text-xs text-red-500 mt-1">{fieldErrors.last_name}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Ваше имя пользователя"
                            value={formData.username}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full bg-white placeholder-gray-500
                                border-0 border-b focus:outline-none py-3 text-[15px] transition-colors
                                ${fieldErrors.username ? 'border-red-500' : 'border-gray-300 focus:border-black'}
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                            autoComplete="username"
                        />
                        {fieldErrors.username && (
                            <p className="text-xs text-red-500 mt-1">{fieldErrors.username}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full bg-white placeholder-gray-500
                                border-0 border-b focus:outline-none py-3 text-[15px] pr-10 transition-colors
                                ${fieldErrors.password ? 'border-red-500' : 'border-gray-300 focus:border-black'}
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass((s) => !s)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 px-2"
                            disabled={isLoading}
                        >
                            {showPass ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                    <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="10" cy="10" r="3" strokeWidth="1.5"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                    <path d="M14.12 14.12A9 9 0 015.88 5.88M1 10s3-6 9-6a9.1 9.1 0 013.77.77M19 10s-1.5 3-4.39 4.6M10 13a3 3 0 01-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="1" y1="1" x2="19" y2="19" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            )}
                        </button>
                        {fieldErrors.password && (
                            <p className="text-xs text-red-500 mt-1 absolute">{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirm_password"
                            placeholder="Подтвердите пароль"
                            value={formData.confirm_password}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full bg-white placeholder-gray-500
                                border-0 border-b border-gray-300 focus:outline-none py-3 text-[15px] pr-10 focus:border-black transition-colors
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            required
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((s) => !s)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 px-2"
                            disabled={isLoading}
                        >
                            {showConfirm ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                    <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="10" cy="10" r="3" strokeWidth="1.5"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                    <path d="M14.12 14.12A9 9 0 015.88 5.88M1 10s3-6 9-6a9.1 9.1 0 013.77.77M19 10s-1.5 3-4.39 4.6M10 13a3 3 0 01-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="1" y1="1" x2="19" y2="19" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Policy checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                        <input
                            type="checkbox"
                            required
                            disabled={isLoading}
                            className="mt-[3px] w-[18px] h-[18px] accent-[#3066BE] cursor-pointer"
                        />
                        <p className="text-[13px] leading-[18px] text-gray-600">
                            Я прочитал и принял Политику конфиденциальности и Условия*
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col items-center gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[190px] h-[52px] bg-[#3066BE] text-white text-[15px]
                                font-semibold rounded-[12px] active:scale-[0.98] transition-all
                                flex items-center justify-center gap-2 shadow-sm
                                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2856a8]"
                        >
                            {isLoading ? (
                                "Загрузка..."
                            ) : (
                                <>
                                    Следующий
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
                                        <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Login link */}
                        <Link to="/login" className="text-[13px] text-[#3066BE] font-semibold hover:underline">
                            Уже есть аккаунт?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}