// src/pages/EmailVerifyPage.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import EmailCodeVerifyTablet from "../components/tablet/EmailCodeVerifyTablet";
import EmailCodeVerifyMobile from "../components/mobile/EmailCodeVerifyMobile";

export default function EmailVerifyPage() {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timer, setTimer] = useState(120); // 2 minut
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const userId = localStorage.getItem("user_id");

    // Start countdown
    useEffect(() => {
        if (timer <= 0) return;
        const t = setInterval(() => setTimer((p) => p - 1), 1000);
        return () => clearInterval(t);
    }, [timer]);

    // Autofocus first cell once mounted
    useEffect(() => {
        inputsRef.current?.[0]?.focus?.();
    }, []);

    const code = otp.join("").trim();
    const isValidCode = /^\d{6}$/.test(code);

    const handleChange = (val, idx) => {
        const v = String(val || "").replace(/\D/g, "").slice(0, 1);
        const next = [...otp];
        next[idx] = v;
        setOtp(next);
        if (v && idx < 5) inputsRef.current[idx + 1]?.focus();
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const next = [...otp];
            if (next[idx]) {
                next[idx] = "";
                setOtp(next);
                return;
            }
            if (idx > 0) {
                inputsRef.current[idx - 1]?.focus();
                const n2 = [...otp];
                n2[idx - 1] = "";
                setOtp(n2);
            }
        }
        if (e.key === "ArrowLeft" && idx > 0) {
            e.preventDefault();
            inputsRef.current[idx - 1]?.focus();
        }
        if (e.key === "ArrowRight" && idx < 5) {
            e.preventDefault();
            inputsRef.current[idx + 1]?.focus();
        }
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handlePaste = (e) => {
        const text = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
        if (!text) return;
        e.preventDefault();
        const next = [...otp];
        for (let i = 0; i < 6; i++) next[i] = text[i] || "";
        setOtp(next);
        inputsRef.current[Math.min(text.length - 1, 5)]?.focus();
    };

    const handleSubmit = async () => {
        setError("");
        if (!userId) {
            setError("Foydalanuvchi aniqlanmadi");
            return;
        }
        if (!isValidCode) {
            setError("To‘liq 6 ta raqam kiriting.");
            return;
        }

        try {
            setSubmitting(true);
            // NOTE: api baseURL ehtimol .../api/auth/ -> shu bois nisbiy endpoint
            await api.post(`register/step3/${userId}/`, { code });
            navigate("/role");
        } catch (err) {
            const d = err?.response?.data || {};
            const nonField = Array.isArray(d.non_field_errors) ? d.non_field_errors[0] : d.non_field_errors;
            const detail = typeof d.detail === "string" ? d.detail : null;
            const msg = typeof d.error === "string" ? d.error : null; // {"error":"User not found"}
            setError(nonField || detail || msg || "Noto‘g‘ri yoki eskirgan kod.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!userId) {
            setError("Foydalanuvchi aniqlanmadi");
            return;
        }
        try {
            // NOTE: api baseURL ehtimol .../api/auth/ -> shu bois nisbiy endpoint
            await api.post(`register/resend-code/${userId}/`);
            setTimer(120);
            setError("");
            setOtp(Array(6).fill(""));
            inputsRef.current?.[0]?.focus?.();
            alert("Kod qayta yuborildi!");
        } catch (err) {
            const d = err?.response?.data || {};
            alert("Kod yuborilmadi: " + (d.error || d.detail || "Xatolik"));
        }
    };

    return (
        <>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex items-center justify-center min-h-screen bg-white text-black">
                <div className="bg-[#F7F9FC] p-10 rounded-2xl shadow-md w-[400px] text-center">
                    <h2 className="text-[32px] leading-[150%] text-black font-bold mb-6 font-gilroy">
                        Проверьте E-mail
                    </h2>

                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                aria-label={`Digit ${idx + 1}`}
                                onChange={(e) => handleChange(e.target.value, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                ref={(el) => (inputsRef.current[idx] = el)}
                                className="w-[40px] h-[50px] border border-black rounded-[4px] text-center text-[24px] font-semibold focus:outline-[#3066BE]"
                            />
                        ))}
                    </div>

                    {/* Error */}
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    {/* Timer / Resend */}
                    {timer > 0 ? (
                        <p className="text-[#3066BE] text-sm font-medium mb-4">
                            {String(Math.floor(timer / 60)).padStart(2, "0")}:
                            {String(timer % 60).padStart(2, "0")}
                        </p>
                    ) : (
                        <button
                            type="button"
                            className="text-xs text-[#3066BE] mt-3 cursor-pointer hover:underline mb-2 bg-transparent border-none"
                            onClick={handleResend}
                        >
                            Не получили код? Отправить повторно
                        </button>
                    )}

                    {/* Next */}
                    <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={!isValidCode || submitting}
                        className={`w-[177px] h-[57px] ml-[70px] bg-[#3066BE] text-white text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] transition flex items-center justify-center gap-2
            ${!isValidCode || submitting ? "opacity-60 cursor-not-allowed" : "hover:bg-[#2a58a6]"}`}
                        title={!isValidCode ? "Avval 6 xonali kodni kiriting" : "Keyingi bosqich"}
                    >
                        {submitting ? "Yuborilmoqda..." : "Следующий"}
                        <img src="/next.png" alt="next icon" className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tablet only (md ≤ w < lg) */}
            <div className="hidden md:block lg:hidden">
                <EmailCodeVerifyTablet />
            </div>

            {/* Mobile (sm va past) */}
            <div className="block md:hidden">
                <EmailCodeVerifyMobile
                    otp={otp}
                    setOtp={setOtp}
                    timer={timer}
                    onSubmit={handleSubmit}
                    onResend={handleResend}
                    error={error}
                />
            </div>
        </>
    );
}
