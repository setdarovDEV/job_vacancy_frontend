import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import LoginTablet from "../components/tablet/LoginTablet";
import LoginMobile from "../components/mobile/LoginMobile";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const u = username.trim();
        const p = password;

        if (!u || !p) {
            setError("Login va parolni kiriting.");
            return;
        }

        try {
            // BASE: .../api/auth/  -> faqat nisbiy yo'l kerak
            const res = await api.post("api/auth/login/", { username: u, password: p });
            const { access, refresh } = res.data || {};

            if (!access || !refresh) {
                setError("Kutilmagan javob: tokenlar kelmadi.");
                return;
            }

            // Ikki nomda ham saqlaymiz (api interceptor ikkisini ham tekshiradi)
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            navigate("/dashboard");
        } catch (err) {
            const d = err?.response?.data || {};
            // Backend: {"non_field_errors": [...]} yoki {"detail": "..."} yoki {"__all__": "..."} bo'lishi mumkin
            const nf = Array.isArray(d.non_field_errors) ? d.non_field_errors[0] : d.non_field_errors;
            const all = Array.isArray(d.__all__) ? d.__all__[0] : d.__all__;
            const msg = nf || d.detail || all || d.error || "Login yoki parol noto‘g‘ri!";
            setError(msg);
        }
    };

    return (
        <>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen items-center justify-center bg-white text-black">
                <div className="w-[463px] h-[492px] bg-[#F4F6FA] rounded-[31px] px-8 py-10 shadow">
                    <h2 className="text-[32px] leading-[48px] text-center text-[#000000] font-bold mb-6 mt-[25px]">
                        Вход в аккаунт
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Username */}
                        <div className="flex justify-center mb-6">
                            <input
                                type="text"
                                placeholder="Ваше имя пользователя"
                                className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] placeholder-[#585858] text-[16px] focus:outline-none focus:border-[#000000] py-2"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="flex justify-center mb-4">
                            <input
                                type="password"
                                placeholder="Пароль"
                                className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] placeholder-[#585858] text-[16px] focus:outline-none focus:border-[#000000] py-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Error */}
                        {error && <div className="text-center text-red-500 text-sm">{error}</div>}

                        {/* Forgot */}
                        <div className="text-left ml-[20px]">
                            <a
                                href="/password-reset"
                                className="text-[12px] text-black font-semibold leading-[18px] hover:underline hover:text-[#3066BE]"
                            >
                                Забыли пароль?
                            </a>
                        </div>

                        {/* Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-[169px] h-[59px] bg-[#3066BE] text-white text-[16px] font-semibold rounded-[13px] hover:bg-[#2a58a6] transition"
                            >
                                Вход в аккаунт
                            </button>
                        </div>

                        {/* Register */}
                        <a
                            href="/register"
                            className="ml-[130px] text-[12px] text-[#3066BE] font-normal leading-[18px] text-center cursor-pointer hover:underline"
                        >
                            Еще нет учетной записи?
                        </a>
                    </form>
                </div>
            </div>

            {/* Tablet only (md) */}
            <div className="hidden md:block lg:hidden">
                <LoginTablet
                    username={username}
                    password={password}
                    onChangeUsername={setUsername}
                    onChangePassword={setPassword}
                    onSubmit={handleSubmit}
                    error={error}
                />
            </div>

            {/* Mobile (sm va past) */}
            <div className="block md:hidden">
                <LoginMobile
                    username={username}
                    password={password}
                    onChangeUsername={setUsername}
                    onChangePassword={setPassword}
                    onSubmit={handleSubmit}
                    error={error}
                />
            </div>
        </>
    );
}
