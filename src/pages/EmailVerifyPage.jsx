import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import "./EmailVerification.css";

const EmailVerifyPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);

    const userId = searchParams.get("uid") || localStorage.getItem("user_id");

    useEffect(() => {
        if (!userId) {
            setError("Фойдаланувчи аникланмади. Қайтадан рўйхатдан ўтинг.");
            setTimeout(() => navigate("/register"), 2000);
        }
    }, [userId, navigate]);

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle OTP input change
    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (error) setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('');
        setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);

        const focusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    // Handle submit - Backend step3 ga mos
    const handleSubmit = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError("Илтимос, 6 рақамли кодни киритинг");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            console.log('🔵 Verifying code:', otpCode);
            console.log('🔵 User ID:', userId);

            // ✅ Backend endpoint: /api/auth/register/step3/<uuid:user_id>/
            const response = await api.post(`/api/auth/register/step3/${userId}/`, {
                code: otpCode
            });

            console.log('✅ Verification successful:', response.data);

            // Navigate to step 4 (role selection)
            setTimeout(() => {
                navigate(`/register/step4?uid=${userId}`);
            }, 500);

        } catch (err) {
            console.error('❌ Verification failed:', err);

            const data = err?.response?.data || {};
            let errorMsg = "Код нотўғри. Қайтадан уриниб кўринг.";

            if (data.error) {
                errorMsg = data.error;
            } else if (data.detail) {
                errorMsg = data.detail;
            } else if (data.code) {
                // Agar code field bo'yicha xato bo'lsa
                errorMsg = Array.isArray(data.code) ? data.code[0] : data.code;
            }

            setError(errorMsg);

            // Clear OTP on error
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    // Resend code - Backend resend endpoint
    const handleResend = async () => {
        if (!canResend) return;

        setIsLoading(true);
        setError("");

        try {
            console.log('📧 Resending code to user:', userId);

            // ✅ Backend endpoint: /api/auth/register/resend-code/<uuid:user_id>/
            const response = await api.post(`/api/auth/register/resend-code/${userId}/`);

            console.log('✅ Code resent:', response.data);

            setTimer(120);
            setCanResend(false);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();

            // Optional: Ko'rsatish uchun success message
            // setSuccessMessage("Код успешно отправлен повторно!");

        } catch (err) {
            console.error('❌ Resend failed:', err);

            const data = err?.response?.data || {};
            const errorMsg = data.error || data.detail || "Кодни қайта жўнатишда хатолик";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="email-verification-container">
            <div className="email-verification-card">
                <h1 className="verification-title">Проверьте E-mail</h1>

                <div className="otp-input-container">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={`otp-input ${error ? 'otp-input-error' : ''}`}
                            autoFocus={index === 0}
                            disabled={isLoading}
                        />
                    ))}
                </div>

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <div className="timer">{formatTime(timer)}</div>

                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={otp.join('').length !== 6 || isLoading}
                >
                    {isLoading ? (
                        "Текширилмоқда..."
                    ) : (
                        <>
                            Следующий
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </>
                    )}
                </button>

                <button
                    className={`resend-button ${canResend ? 'active' : ''}`}
                    onClick={handleResend}
                    disabled={!canResend || isLoading}
                >
                    Не получили код?
                </button>
            </div>
        </div>
    );
};

export default EmailVerifyPage;