// src/pages/EmailVerifyPage.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmailCodeVerifyTablet from "../components/tablet/EmailCodeVerifyTablet";
import EmailCodeVerifyMobile from "../components/mobile/EmailCodeVerifyMobile";

export default function EmailVerifyPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timer, setTimer] = useState(1800); // 30 minut = 1800 sekund
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const inputsRef = useRef([]);

    // ✅ URL'dan yoki localStorage'dan user_id olish
    const userId = searchParams.get("uid") || localStorage.getItem("user_id");

    console.log("📍 Step 3 - User ID:", userId);

    // Redirect if no userId
    useEffect(() => {
        if (!userId) {
            setError("Foydalanuvchi aniqlanmadi. Qaytadan ro'yxatdan o'ting.");
            setTimeout(() => navigate("/register"), 2000);
        }
    }, [userId, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const t = setInterval(() => setTimer((p) => Math.max(0, p - 1)), 1000);
        return () => clearInterval(t);
    }, [timer]);

    // Autofocus first input
    useEffect(() => {
        inputsRef.current?.[0]?.focus?.();
    }, []);

    const code = otp.join("").trim();
    const isValidCode = /^\d{6}$/.test(code);

    const handleChange = (val, idx) => {
        setError("");
        setSuccessMessage("");
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
        const next = Array(6).fill("");
        for (let i = 0; i < Math.min(text.length, 6); i++) {
            next[i] = text[i];
        }
        setOtp(next);
        inputsRef.current[Math.min(text.length, 5)]?.focus();
    };

    const handleSubmit = async () => {
        setError("");
        setSuccessMessage("");

        if (!userId) {
            setError("Foydalanuvchi aniqlanmadi");
            return;
        }

        if (!isValidCode) {
            setError("Пожалуйста, введите все 6 цифр.");
            return;
        }

        try {
            setSubmitting(true);
            await api.post(`/api/auth/register/step3/${userId}/`, { code });

            setSuccessMessage("Email подтвержден! ✅");

            console.log("✅ Step 3 - Success, navigating to Step 4 with uid:", userId);

            // ✅ 1.5 sekunddan keyin Step 4 ga o'tish (URL bilan)
            setTimeout(() => {
                navigate(`/register/step4?uid=${userId}`);
            }, 1500);
        } catch (err) {
            const data = err?.response?.data || {};
            const errorMsg = data.error || data.detail || data.non_field_errors;

            if (typeof errorMsg === "string") {
                setError(errorMsg);
            } else if (Array.isArray(errorMsg)) {
                setError(errorMsg[0]);
            } else {
                setError("Неверный или истёкший код.");
            }

            // Agar expired bo'lsa, resend taklif qilish
            if (errorMsg && errorMsg.includes("истёк")) {
                setTimer(0);
            }
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
            setResending(true);
            setError("");
            await api.post(`/api/auth/register/resend-code/${userId}/`);

            setTimer(1800); // Reset to 30 minutes
            setOtp(Array(6).fill(""));
            setSuccessMessage("Новый код отправлен на ваш E-mail! ✅");
            inputsRef.current?.[0]?.focus?.();

            // Success message'ni 3 sekunddan keyin o'chirish
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            const data = err?.response?.data || {};
            setError(data.error || data.detail || "Не удалось отправить код");
        } finally {
            setResending(false);
        }
    };

    // Format timer (MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <React.Fragment>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex items-center justify-center min-h-screen bg-white text-black">
                <div className="bg-[#F7F9FC] p-10 rounded-2xl shadow-md w-[450px] text-center">
                    <h2 className="text-[32px] text-black font-bold mb-2">
                        Проверьте E-mail
                    </h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Мы отправили 6-значный код на вашу почту
                    </p>

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
                                disabled={submitting}
                                className={`w-[50px] h-[60px] border-2 ${
                                    error ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg text-center text-2xl font-semibold focus:outline-none focus:border-[#3066BE] transition ${
                                    submitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <p className="text-green-600 text-sm font-semibold">{successMessage}</p>
                        </div>
                    )}

                    {/* Timer / Resend */}
                    <div className="mb-6">
                        {timer > 0 ? (
                            <p className="text-[#3066BE] text-base font-medium">
                                Код действителен: {formatTime(timer)}
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className="text-sm text-[#3066BE] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer"
                            >
                                {resending ? "Отправка..." : "Не получили код? Отправить повторно"}
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={!isValidCode || submitting}
                        className={`w-full max-w-[200px] mx-auto h-[57px] bg-[#3066BE] text-white text-base font-semibold rounded-lg px-6 py-4 transition flex items-center justify-center gap-2 ${
                            !isValidCode || submitting
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-[#2a58a6] active:scale-95"
                        }`}
                    >
                        {submitting ? (
                            <span>Проверка...</span>
                        ) : successMessage ? (
                            <span>Переход...</span>
                        ) : (
                            <React.Fragment>
                                Следующий
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </React.Fragment>
                        )}
                    </button>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(`/register/step2?uid=${userId}`)}
                        disabled={submitting}
                        className="bg-[#F4F6FA] text-[#3066BE] border-none rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[#e8ecf4] active:scale-95 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Назад
                    </button>
                </div>
            </div>

            {/* Tablet only (md) */}
            <div className="hidden md:block lg:hidden">
                <EmailCodeVerifyTablet
                    otp={otp}
                    setOtp={setOtp}
                    timer={timer}
                    onSubmit={handleSubmit}
                    onResend={handleResend}
                    error={error}
                    successMessage={successMessage}
                    submitting={submitting}
                    resending={resending}
                    formatTime={formatTime}
                    inputsRef={inputsRef}
                    handleChange={handleChange}
                    handleKeyDown={handleKeyDown}
                    handlePaste={handlePaste}
                />
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
                    successMessage={successMessage}
                    submitting={submitting}
                    resending={resending}
                    formatTime={formatTime}
                    inputsRef={inputsRef}
                    handleChange={handleChange}
                    handleKeyDown={handleKeyDown}
                    handlePaste={handlePaste}
                />
            </div>
        </React.Fragment>
    );
}