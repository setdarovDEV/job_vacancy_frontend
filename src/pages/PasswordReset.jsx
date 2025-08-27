import React, { useState } from "react";
import api from "../utils/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await api.post("/api/auth/password-reset/", { email });
            setMessage("Parolni tiklash havolasi emailingizga yuborildi.");
        } catch (err) {
            setError(err.response?.data?.detail || "Xatolik yuz berdi.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <div className="w-[463px] h-[340px] bg-[#F4F6FA] rounded-[31px] px-8 py-10 shadow">
                <h2 className="text-[28px] text-center text-[#000000] font-bold mb-6 mt-[30px]">
                    Забыли пароль?
                </h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-6">
                        <input
                            type="email"
                            placeholder="Введите ваш Email"
                            className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] placeholder-[#585858] text-[16px] focus:outline-none focus:border-[#000000] py-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {message && (
                        <div className="text-green-600 text-center text-sm">{message}</div>
                    )}
                    {error && (
                        <div className="text-red-600 text-center text-sm">{error}</div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-[169px] h-[59px] bg-[#3066BE] text-white text-[16px] font-semibold rounded-[13px] hover:bg-[#2a58a6] transition mt-[10px]"
                        >
                            Отправить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
