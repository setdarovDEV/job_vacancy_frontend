// src/components/mobile/EmailCodeVerifyMobile.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function EmailCodeVerifyMobile({
                                                  otp,
                                                  setOtp,
                                                  timer,
                                                  onSubmit,
                                                  onResend,
                                                  error,
                                                  successMessage,
                                                  submitting,
                                                  resending,
                                                  formatTime,
                                                  inputsRef,
                                                  handleChange,
                                                  handleKeyDown,
                                                  handlePaste,
                                              }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("uid");

    const code = otp.join("");
    const disabled = code.length !== 6;

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F7F9FC] rounded-2xl p-6 shadow text-center">
                <h1 className="text-[22px] leading-[30px] font-bold mb-2">Проверьте E-mail</h1>
                <p className="text-xs text-gray-600 mb-6">
                    Мы отправили 6-значный код на вашу почту
                </p>

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
                            onChange={(e) => handleChange(e.target.value, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            disabled={submitting}
                            className={`w-[42px] h-[50px] border rounded-[6px]
                                text-center text-[22px] font-semibold focus:outline-none
                                ${error ? 'border-red-500' : 'border-black'}
                                ${submitting ? 'opacity-50 cursor-not-allowed' : 'focus:border-[#3066BE]'}`}
                        />
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-xs text-red-600">
                        {error}
                    </div>
                )}

                {/* Success */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3 text-xs text-green-600 font-semibold">
                        {successMessage}
                    </div>
                )}

                {/* Timer / Resend */}
                <div className="mb-4">
                    {timer > 0 ? (
                        <p className="text-[#3066BE] text-sm font-medium">
                            Код действителен: {formatTime(timer)}
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={onResend}
                            disabled={resending}
                            className="text-xs text-[#3066BE] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none"
                        >
                            {resending ? "Отправка..." : "Не получили код? Отправить повторно"}
                        </button>
                    )}
                </div>

                {/* Next */}
                <div className="flex justify-center mb-3">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={disabled || submitting}
                        className={`w-[177px] h-[52px] rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 transition
                            ${disabled || submitting
                            ? "bg-[#91AFE2] text-white cursor-not-allowed"
                            : "bg-[#3066BE] text-white active:scale-[0.99]"}`}
                    >
                        {submitting ? (
                            "Проверка..."
                        ) : successMessage ? (
                            "Переход..."
                        ) : (
                            <>
                                Следующий
                                <img src="/next.png" alt="next icon" className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>

                {/* Back button */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => navigate(userId ? `/register/step2?uid=${userId}` : "/register/step2")}
                        disabled={submitting}
                        className="text-[12px] text-[#3066BE] font-semibold hover:underline disabled:opacity-50 bg-transparent border-none"
                    >
                        ← Назад
                    </button>
                </div>
            </div>
        </div>
    );
}