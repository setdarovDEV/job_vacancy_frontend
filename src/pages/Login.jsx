import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import LoginTablet from "../components/tablet/LoginTablet";
import LoginMobile from "../components/mobile/LoginMobile";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const registrationMessage = location.state?.message;
    const [successMessage, setSuccessMessage] = useState(registrationMessage || "");

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            setError("Логин и пароль обязательны");
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.post("/api/auth/login/", {
                username: trimmedUsername,
                password: trimmedPassword
            });

            const data = res.data;

            console.log("✅ Login successful:", data);

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("role", data.role || "JOB_SEEKER");
            localStorage.setItem("username", data.username || "");
            localStorage.setItem("user_id", data.user_id || "");

            api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

            if (data.role === "EMPLOYER") {
                navigate("/dashboard");
            } else if (data.role === "JOB_SEEKER") {
                navigate("/dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.error("❌ Login error:", err);
            console.error("❌ Error response:", err?.response);

            const data = err?.response?.data || {};

            let errorMsg = "";

            if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
                errorMsg = data.non_field_errors[0];
            } else if (typeof data === "string") {
                errorMsg = data;
            } else if (data.detail) {
                errorMsg = data.detail;
            } else if (data.error) {
                errorMsg = data.error;
            } else {
                errorMsg = "Неверный логин или пароль";
            }

            setError(errorMsg);

        } finally {
            setIsLoading(false);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (error) setError("");
        if (successMessage) setSuccessMessage("");
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError("");
        if (successMessage) setSuccessMessage("");
    };

    return (
        <React.Fragment>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen items-center justify-center bg-white text-black px-4">
                <div className="w-full max-w-md bg-[#F4F6FA] rounded-[31px] p-10 shadow-lg">
                    <h2 className="text-[32px] text-center text-black font-bold mb-8">
                        Вход в аккаунт
                    </h2>

                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                            <p className="text-green-600 text-sm font-semibold text-center">
                                ✅ {successMessage}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <input
                                type="text"
                                placeholder="Ваше имя пользователя"
                                value={username}
                                onChange={handleUsernameChange}
                                disabled={isLoading}
                                autoComplete="username"
                                className={`w-full border-0 border-b ${
                                    error ? 'border-red-500' : 'border-black'
                                } bg-[#F4F6FA] placeholder-gray-600 text-base py-2 focus:outline-none focus:border-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={isLoading}
                                autoComplete="current-password"
                                className={`w-full border-0 border-b ${
                                    error ? 'border-red-500' : 'border-black'
                                } bg-[#F4F6FA] placeholder-gray-600 text-base py-2 focus:outline-none focus:border-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-600 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Forgot Password Link */}
                        <div className="text-left">

                            <a href="/password-reset"
                            className="text-xs text-black font-semibold hover:text-[#3066BE] hover:underline transition"
                            >
                            Забыли пароль?
                        </a>
                </div>

                {/* Login Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-[169px] h-[59px] bg-[#3066BE] text-white text-base font-semibold rounded-[13px] hover:bg-[#2a58a6] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Вход...</span>
                            </div>
                        ) : (
                            "Вход в аккаунт"
                        )}
                    </button>
                </div>

                {/* Register Link */}
                <div className="text-center">

                    <a href="/register"
                    className="text-xs text-[#3066BE] font-medium hover:underline cursor-pointer transition"
                    >
                    Еще нет учетной записи?
                </a>
            </div>
        </form>
</div>
</div>

    {/* Tablet (md) */}
    <div className="hidden md:block lg:hidden">
        <LoginTablet
            username={username}
            password={password}
            onChangeUsername={handleUsernameChange}
            onChangePassword={handlePasswordChange}
            onSubmit={handleSubmit}
            error={error}
            successMessage={successMessage}
            isLoading={isLoading}
        />
    </div>

    {/* Mobile (sm va past) */}
    <div className="block md:hidden">
        <LoginMobile
            username={username}
            password={password}
            onChangeUsername={handleUsernameChange}
            onChangePassword={handlePasswordChange}
            onSubmit={handleSubmit}
            error={error}
            successMessage={successMessage}
            isLoading={isLoading}
        />
    </div>
</React.Fragment>
);
}