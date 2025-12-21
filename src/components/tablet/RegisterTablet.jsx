import React from "react";
import { Link } from "react-router-dom";

export default function RegisterTablet({
                                           formData,
                                           onChange,
                                           onSubmit,
                                           error,
                                           fieldErrors = {},
                                           isLoading,
                                       }) {
    return (
        <div className="w-full min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
            <div className="w-full max-w-[460px] bg-white rounded-[28px] px-10 py-10 shadow-sm">
                <h1 className="text-center text-[24px] font-bold text-black mb-8">
                    Зарегистрироваться
                </h1>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* First Name */}
                    <div>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Ваше имя"
                            value={formData.first_name}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full border-0 border-b bg-white focus:outline-none py-3 text-[15px] placeholder-gray-500 transition-colors ${
                                fieldErrors.first_name ? "border-red-500" : "border-gray-300 focus:border-[#3066BE]"
                            }`}
                            required
                        />
                        {fieldErrors.first_name && (
                            <p className="text-xs text-red-500 mt-1">
                                {fieldErrors.first_name}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Фамилия"
                            value={formData.last_name}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full border-0 border-b bg-white focus:outline-none py-3 text-[15px] placeholder-gray-500 transition-colors ${
                                fieldErrors.last_name ? "border-red-500" : "border-gray-300 focus:border-[#3066BE]"
                            }`}
                            required
                        />
                        {fieldErrors.last_name && (
                            <p className="text-xs text-red-500 mt-1">
                                {fieldErrors.last_name}
                            </p>
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
                            className={`w-full border-0 border-b bg-white focus:outline-none py-3 text-[15px] placeholder-gray-500 transition-colors ${
                                fieldErrors.username ? "border-red-500" : "border-gray-300 focus:border-[#3066BE]"
                            }`}
                            required
                        />
                        {fieldErrors.username && (
                            <p className="text-xs text-red-500 mt-1">
                                {fieldErrors.username}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full border-0 border-b bg-white focus:outline-none py-3 text-[15px] placeholder-gray-500 transition-colors ${
                                fieldErrors.password ? "border-red-500" : "border-gray-300 focus:border-[#3066BE]"
                            }`}
                            required
                        />
                        {fieldErrors.password && (
                            <p className="text-xs text-red-500 mt-1">
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Подтвердите пароль"
                            value={formData.confirm_password}
                            onChange={onChange}
                            disabled={isLoading}
                            className="w-full border-0 border-b border-gray-300 bg-white focus:outline-none py-3 text-[15px] placeholder-gray-500 focus:border-[#3066BE] transition-colors"
                            required
                        />
                    </div>

                    {/* General Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Terms */}
                    <div className="flex items-start gap-3 mt-6">
                        <input
                            type="checkbox"
                            required
                            disabled={isLoading}
                            className="mt-[3px] w-[18px] h-[18px] accent-[#3066BE] cursor-pointer"
                        />
                        <p className="text-[13px] leading-tight text-gray-600">
                            Я прочитал и принял Политику конфиденциальности и Условия*
                        </p>
                    </div>

                    {/* Submit Button & Link */}
                    <div className="flex flex-col items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[200px] h-[52px] bg-[#3066BE] text-white text-[15px] font-semibold rounded-[12px] hover:bg-[#2856a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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

                        <Link to="/login" className="text-[13px] text-[#3066BE] font-semibold hover:underline">
                            Уже есть аккаунт?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}