import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import EmailCodeVerifyTablet from "../components/tablet/EmailCodeVerifyTablet";
import EmailCodeVerifyMobile from "../components/mobile/EmailCodeVerifyMobile"; // <— YANGI

export default function EmailVerifyPage() {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timer, setTimer] = useState(120); // 2 minut
    const [error, setError] = useState("");
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (timer <= 0) return;
        const t = setInterval(() => setTimer((p) => p - 1), 1000);
        return () => clearInterval(t);
    }, [timer]);

    const handleSubmit = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            setError("To‘liq 6 ta raqam kiriting.");
            return;
        }
        try {
            await api.post(`/api/auth/register/step3/${userId}/`, { code });
            navigate("/role");
        } catch (err) {
            const d = err?.response?.data || {};
            setError(d.detail || d.error || "Noto‘g‘ri yoki eskirgan kod.");
        }
    };

    const handleResend = async () => {
        try {
            await api.post(`/api/auth/register/resend-code/${userId}/`);
            setTimer(120);
            setError("");
            // ixtiyoriy: toast qo‘llayotgan bo‘lsangiz shuni ishlating
            // toast.success("Kod qayta yuborildi");
            alert("Kod qayta yuborildi!");
            setOtp(Array(6).fill(""));
            inputsRef.current?.[0]?.focus?.();
        } catch (err) {
            const d = err?.response?.data || {};
            alert("Kod yuborilmadi: " + (d.error || "Xatolik"));
        }
    };

    return (
        <>
            {/* Desktop (lg+) — sizdagi mavjud UI saqladik */}
            <div className="hidden lg:flex flex items-center justify-center min-h-screen bg-white text-black">
                <div className="bg-[#F7F9FC] p-10 rounded-2xl shadow-md w-[400px] text-center">
                    <h2 className="text-[32px] font-[400] leading-[150%] text-black font-bold mb-6 font-gilroy">
                        Проверьте E-mail
                    </h2>

                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-2 mb-4">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                                    const next = [...otp];
                                    next[idx] = val;
                                    setOtp(next);
                                    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
                                }}
                                onKeyDown={(e) => {
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
                                }}
                                onPaste={(e) => {
                                    const text = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
                                    if (!text) return;
                                    e.preventDefault();
                                    const next = [...otp];
                                    for (let i = 0; i < 6; i++) next[i] = text[i] || "";
                                    setOtp(next);
                                    inputsRef.current[Math.min(text.length - 1, 5)]?.focus();
                                }}
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
                        <p
                            className="text-xs text-[#3066BE] mt-3 cursor-pointer hover:underline mb-2"
                            onClick={handleResend}
                        >
                            Не получили код? Отправить повторно
                        </p>
                    )}

                    {/* Next */}
                    <button
                        onClick={handleSubmit}
                        className="w-[177px] h-[57px] ml-[70px] hover:text-white bg-[#3066BE] border-none text-white text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] hover:bg-[#2a58a6] transition flex items-center justify-center gap-2"
                    >
                        Следующий
                        <img src="/next.png" alt="next icon" className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tablet only (md) */}
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
