// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPasswordPage() {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const extractError = (err) => {
        const data = err?.response?.data;
        if (!data) return "Xatolik yuz berdi.";
        if (typeof data === "string") return data;
        if (data.detail) return String(data.detail);
        // DRF field errors
        const firstField = Object.keys(data)[0];
        if (firstField && Array.isArray(data[firstField])) {
            return data[firstField][0];
        }
        return "Xatolik yuz berdi.";
    };

    const validate = () => {
        if (!uid || !token) return "Noto‘g‘ri link.";
        if (!password) return "Yangi parolni kiriting.";
        if (password.length < 8) return "Parol kamida 8 ta belgidan iborat bo‘lishi kerak.";
        if (password !== confirm) return "Parollar mos emas.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        try {
            setLoading(true);
            // Ko‘p backendlarda shu endpoint ishlatiladi.
            // Agar sizda nom boshqacha bo‘lsa (masalan new_password), shu yerda almashtiring.
            const payload = { uid, token, password };
            const res = await api.post("/api/auth/password-reset-confirm/", payload);
            setSuccess(res?.data?.detail || "Parol muvaffaqiyatli tiklandi.");
            // 2 soniyada login sahifasiga
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
            <div className="bg-[#F4F6FA] rounded-[30px] shadow-md px-8 sm:px-10 py-10 w-full max-w-[460px]">
                <h2 className="text-[24px] font-bold text-center mb-8">Yangi parol</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Parol */}
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="Yangi parol"
                            className="w-full border-0 border-b border-[#000] bg-[#F4F6FA] text-[16px] placeholder-[#777] focus:outline-none py-2 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass((s) => !s)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-[#3066BE] px-2 py-1 border-none bg-transparent"
                            aria-label={showPass ? "Parolni berkitish" : "Parolni ko‘rsatish"}
                        >
                            {showPass ? "Berkit" : "Ko‘rsat"}
                        </button>
                    </div>

                    {/* Tasdiqlash */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Parolni tasdiqlash"
                            className="w-full border-0 border-b border-[#000] bg-[#F4F6FA] text-[16px] placeholder-[#777] focus:outline-none py-2 pr-10"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((s) => !s)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-[#3066BE] px-2 py-1 border-none bg-transparent"
                            aria-label={showConfirm ? "Parolni berkitish" : "Parolni ko‘rsatish"}
                        >
                            {showConfirm ? "Berkit" : "Ko‘rsat"}
                        </button>
                    </div>

                    {/* Xabarlar */}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-600 text-sm text-center">{success}</p>}

                    {/* Yuborish */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3066BE] text-white py-3 rounded-[12px] font-semibold hover:bg-[#2a58a6] transition disabled:opacity-60"
                    >
                        {loading ? "Saqlanmoqda..." : "Saqlash ➞"}
                    </button>

                    {/* Orqaga qaytish */}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full mt-2 bg-white text-[#3066BE] py-3 rounded-[12px] font-semibold border border-[#3066BE] hover:bg-[#EFF4FF] transition"
                    >
                        Login sahifasiga
                    </button>

                    {/* Kichik eslatma */}
                    <p className="text-xs text-[#777] text-center mt-2">
                        Parol kamida 8 belgi bo‘lsin. Harflar va raqamlarni aralashtirish tavsiya etiladi.
                    </p>
                </form>
            </div>
        </div>
    );
}
