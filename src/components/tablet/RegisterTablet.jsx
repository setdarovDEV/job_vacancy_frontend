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
        <div className="w-full min-h-screen bg-white text-black flex items-center justify-center px-4 md:px-6">
            <div className="w-[330px] max-w-[360px] bg-[#F5F8FC] rounded-2xl px-6 py-8 shadow-md">
                <h2 className="text-center text-[20px] font-semibold mb-6">
                    Зарегистрироваться
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* First Name */}
                    <div>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Ваше имя"
                            value={formData.first_name}
                            onChange={onChange}
                            disabled={isLoading}
                            className={`w-full border-0 border-b bg-transparent focus:outline-none py-2 text-sm ${
                                fieldErrors.first_name ? "border-red-500" : "border-black"
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
                            className={`w-full border-0 border-b bg-transparent focus:outline-none py-2 text-sm ${
                                fieldErrors.last_name ? "border-red-500" : "border-black"
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
                            className={`w-full border-0 border-b bg-transparent focus:outline-none py-2 text-sm ${
                                fieldErrors.username ? "border-red-500" : "border-black"
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
                            className={`w-full border-0 border-b bg-transparent focus:outline-none py-2 text-sm ${
                                fieldErrors.password ? "border-red-500" : "border-black"
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
                            className="w-full border-0 border-b border-black bg-transparent focus:outline-none py-2 text-sm"
                            required
                        />
                    </div>

                    {/* General Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-xs text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Terms */}
                    <div className="flex items-start gap-2 text-xs mt-2">
                        <input
                            type="checkbox"
                            required
                            disabled={isLoading}
                            className="mt-[3px]"
                        />
                        <p className="leading-tight text-gray-700">
                            Я прочитал и принял Политику конфиденциальности и Условия*
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-[160px] ml-[57px] mt-4 bg-[#3066BE] text-white font-semibold py-2 rounded-[13px] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Загрузка..." : "Следующий \u2192"}
                    </button>

                    {/* Already have account */}
                    <div className="text-center text-[12px] text-[#3066BE] mt-4">
                        <Link to="/login" className="hover:underline">
                            Уже есть аккаунт?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
