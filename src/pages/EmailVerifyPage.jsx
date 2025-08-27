import React, { useState, useRef, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import EmailCodeVerifyTablet from "../components/tablet/EmailCodeVerifyTablet";

export default function EmailVerifyPage() {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timer, setTimer] = useState(120); // 2 minut
    const [error, setError] = useState("");
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const userId = localStorage.getItem("user_id");

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (sec) => {
        const min = String(Math.floor(sec / 60)).padStart(2, "0");
        const seconds = String(sec % 60).padStart(2, "0");
        return `${min}:${seconds}`;
    };

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            if (!otp[index] && index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
            newOtp[index] = "";
            setOtp(newOtp);
        }
    };

    const handleSubmit = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            setError("To‘liq 6 ta raqam kiriting.");
            return;
        }

        try {
            await api.post(`/api/auth/register/step3/${userId}/`, {
                code,
            });
            navigate("/role");
        } catch (err) {
            console.error(err.response);
            setError("Noto‘g‘ri yoki eskirgan kod.");
        }
    };

    const handleResend = async () => {
        try {
            await api.post(`/api/auth/register/resend-code/${userId}/`);
            setTimer(120); // reset timer
            setError("");
            alert("Kod qayta yuborildi!");
        } catch (err) {
            alert("Kod yuborilmadi: " + (err.response?.data?.error || "Xatolik"));
        }
    };


    return (
        <>
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
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            className="w-[40px] h-[50px] border border-black rounded-[4px] text-center text-[24px] font-semibold focus:outline-[#3066BE]"
                        />
                    ))}
                </div>

                {/* Error */}
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                {/* Timer */}
                {timer > 0 ? (
                    <p className="text-[#3066BE] text-sm font-medium mb-4">{formatTime(timer)}</p>
                ) : (
                    <p
                        className="text-xs text-[#3066BE] mt-3 cursor-pointer hover:underline mb-2"
                        onClick={handleResend}
                    >
                        Не получили код? Отправить повторно
                    </p>
                )}

                {/* Button */}
                <button
                    onClick={handleSubmit}
                    className="w-[177px] h-[57px] ml-[70px] hover:text-white bg-[#3066BE] border-none text-white text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] hover:bg-[#2a58a6] transition flex items-center justify-center gap-2"
                >
                    Следующий
                    <img src="/next.png" alt="next icon" className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Tablet */}
        <div className="block lg:hidden">
            <EmailCodeVerifyTablet />
        </div>
        </>
    );
}
