import React from "react";

export default function EmailCodeVerifyTablet({
                                                  otp,
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
                                                  isValidCode,
                                              }) {
    return (
        <div className="w-full min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-[480px] bg-[#F0F3F8] rounded-[32px] px-12 py-12">
                <h1 className="text-center text-[26px] font-bold text-black mb-10">
                    Проверьте E-mail
                </h1>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-2.5 mb-7" onPaste={handlePaste}>
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                                console.log("Tablet input changed:", e.target.value, idx);
                                handleChange(e.target.value, idx);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            disabled={submitting}
                            autoComplete="off"
                            className={`w-[55px] h-[65px] border-2 rounded-[14px] text-center text-[28px] font-semibold focus:outline-none transition-all bg-white ${
                                error
                                    ? 'border-red-500'
                                    : digit
                                        ? 'border-[#3066BE]'
                                        : 'border-[#D1D5DB] focus:border-[#3066BE]'
                            } ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
                        />
                    ))}
                </div>

                {/* Timer */}
                <div className="text-center mb-7">
                    {timer > 0 ? (
                        <p className="text-[#3066BE] text-[17px] font-semibold">
                            {formatTime(timer)}
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={onResend}
                            disabled={resending}
                            className="text-[14px] text-[#3066BE] font-semibold hover:underline disabled:opacity-50 bg-transparent border-none cursor-pointer transition"
                        >
                            {resending ? "Отправка..." : "Не получили код?"}
                        </button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-center">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Success */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-center">
                        <p className="text-sm text-green-600 font-semibold">{successMessage}</p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!isValidCode || submitting}
                        className={`w-[210px] h-[54px] bg-[#3066BE] text-white text-[15px] font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2 shadow-md ${
                            !isValidCode || submitting
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-[#2856a8] active:scale-[0.98]"
                        }`}
                    >
                        {submitting ? (
                            "Проверка..."
                        ) : successMessage ? (
                            "Переход..."
                        ) : (
                            <>
                                <span>Следующий</span>
                                <svg width="17" height="17" viewBox="0 0 16 16" fill="none" className="rotate-180">
                                    <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}