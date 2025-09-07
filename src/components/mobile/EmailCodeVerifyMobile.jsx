// src/components/mobile/EmailCodeVerifyMobile.jsx
import React, { useEffect, useRef } from "react";

export default function EmailCodeVerifyMobile({
                                                  otp,
                                                  setOtp,
                                                  timer,
                                                  onSubmit,
                                                  onResend,
                                                  error,
                                              }) {
    const inputsRef = useRef([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (e, index) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 1);
        const next = [...otp];
        next[index] = val;
        setOtp(next);

        if (val && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const next = [...otp];
            if (next[index]) {
                next[index] = "";
                setOtp(next);
                return;
            }
            if (index > 0) {
                inputsRef.current[index - 1]?.focus();
                const n2 = [...otp];
                n2[index - 1] = "";
                setOtp(n2);
            }
        }
        if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handlePaste = (e) => {
        const text = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
        if (!text) return;
        e.preventDefault();
        const next = [...otp];
        for (let i = 0; i < 6; i++) next[i] = text[i] || "";
        setOtp(next);
        const lastFilled = Math.min(text.length, 6) - 1;
        inputsRef.current[Math.max(lastFilled, 0)]?.focus();
    };

    const code = otp.join("");
    const disabled = code.length !== 6;

    const formatTime = (sec) => {
        const m = String(Math.floor(sec / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F7F9FC] rounded-2xl p-6 shadow text-center">
                <h1 className="text-[22px] leading-[30px] font-bold mb-6">Проверьте E-mail</h1>

                {/* OTP Inputs */}
                <div
                    className="flex justify-center gap-2 mb-4"
                    onPaste={handlePaste}
                >
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            className="w-[42px] h-[50px] border border-black rounded-[6px]
                         text-center text-[22px] font-semibold focus:outline-[#3066BE]"
                        />
                    ))}
                </div>

                {/* Error */}
                {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

                {/* Timer / Resend */}
                {timer > 0 ? (
                    <p className="text-[#3066BE] text-sm font-medium mb-4">{formatTime(timer)}</p>
                ) : (
                    <button
                        type="button"
                        onClick={onResend}
                        className="text-xs text-[#3066BE] underline mb-4"
                    >
                        Не получили код? Отправить повторно
                    </button>
                )}

                {/* Next */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={disabled}
                        className={`w-[177px] h-[52px] rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 transition
              ${disabled ? "bg-[#91AFE2] text-white cursor-not-allowed" : "bg-[#3066BE] text-white active:scale-[0.99]"}`}
                    >
                        Следующий
                        <img src="/next.png" alt="next icon" className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
