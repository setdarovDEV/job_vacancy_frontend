import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import RegisterTablet from "../components/tablet/RegisterTablet";
import RegisterMobile from "../components/mobile/RegisterMobile";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
        if (fieldErrors[e.target.name]) {
            setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setIsLoading(true);

        if (formData.password !== formData.confirm_password) {
            setError("Паролинг мос эмас");
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.post("/api/auth/register/step1/", {
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                username: formData.username.trim(),
                password: formData.password,
                confirm_password: formData.confirm_password,
            });

            const userId = res.data.user_id;

            if (userId) {
                localStorage.setItem("user_id", String(userId));
                navigate(`/register/step2?uid=${userId}`);
            } else {
                setError("Фойдаланувчи ID топилмади");
            }
        } catch (err) {
            const data = err?.response?.data || {};

            const errors = {};
            if (data.first_name) errors.first_name = Array.isArray(data.first_name) ? data.first_name[0] : data.first_name;
            if (data.last_name) errors.last_name = Array.isArray(data.last_name) ? data.last_name[0] : data.last_name;
            if (data.username) errors.username = Array.isArray(data.username) ? data.username[0] : data.username;
            if (data.password) errors.password = Array.isArray(data.password) ? data.password[0] : data.password;

            setFieldErrors(errors);

            const generalError = data.non_field_errors
                ? (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors)
                : data.detail || "Хатолик юз берди";

            setError(generalError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <React.Fragment>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen items-center justify-center bg-[#F8F9FB]">
                <div className="bg-white w-full max-w-[440px] rounded-[32px] px-12 py-10 shadow-sm">
                    <h1 className="text-center text-[28px] font-bold text-black mb-8 tracking-tight">
                        Зарегистрироваться
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* First Name */}
                        <div>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Ваше имя"
                                value={formData.first_name}
                                onChange={handleChange}
                                className={`w-full border-0 border-b ${
                                    fieldErrors.first_name ? 'border-red-500' : 'border-gray-300'
                                } bg-white text-[15px] py-3 placeholder-gray-500 focus:outline-none focus:border-[#3066BE] transition-colors`}
                                required
                                disabled={isLoading}
                            />
                            {fieldErrors.first_name && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.first_name}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Фамилия"
                                value={formData.last_name}
                                onChange={handleChange}
                                className={`w-full border-0 border-b ${
                                    fieldErrors.last_name ? 'border-red-500' : 'border-gray-300'
                                } bg-white text-[15px] py-3 placeholder-gray-500 focus:outline-none focus:border-[#3066BE] transition-colors`}
                                required
                                disabled={isLoading}
                            />
                            {fieldErrors.last_name && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.last_name}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Ваше имя пользователя"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full border-0 border-b ${
                                    fieldErrors.username ? 'border-red-500' : 'border-gray-300'
                                } bg-white text-[15px] py-3 placeholder-gray-500 focus:outline-none focus:border-[#3066BE] transition-colors`}
                                required
                                disabled={isLoading}
                            />
                            {fieldErrors.username && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full border-0 border-b ${
                                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                                } bg-white text-[15px] py-3 placeholder-gray-500 focus:outline-none focus:border-[#3066BE] transition-colors`}
                                required
                                disabled={isLoading}
                            />
                            {fieldErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <input
                                type="password"
                                name="confirm_password"
                                placeholder="Подтвердите пароль"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                className="w-full border-0 border-b border-gray-300 bg-white text-[15px] py-3 placeholder-gray-500 focus:outline-none focus:border-[#3066BE] transition-colors"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* General Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Checkbox */}
                        <div className="flex items-start gap-3 mt-6">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-[18px] h-[18px] accent-[#3066BE] cursor-pointer"
                                disabled={isLoading}
                            />
                            <p className="text-[13px] leading-tight text-gray-600">
                                Я прочитал и принял Политику конфиденциальности и Условия*
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-[200px] h-[54px] bg-[#3066BE] text-white text-[15px] font-semibold rounded-[12px] hover:bg-[#2856a8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isLoading ? (
                                    <span>Загрузка...</span>
                                ) : (
                                    <>
                                        Следующий
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
                                            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </>
                                )}
                            </button>

                            <a
                                href="/login"
                                className="text-[13px] text-[#3066BE] font-semibold cursor-pointer hover:underline"
                            >
                                Уже есть аккаунт?
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tablet (md) */}
            <div className="hidden md:block lg:hidden">
                <RegisterTablet
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    error={error}
                    fieldErrors={fieldErrors}
                    isLoading={isLoading}
                />
            </div>

            {/* Mobile (sm) */}
            <div className="block md:hidden">
                <RegisterMobile
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    error={error}
                    fieldErrors={fieldErrors}
                    isLoading={isLoading}
                />
            </div>
        </React.Fragment>
    );
}