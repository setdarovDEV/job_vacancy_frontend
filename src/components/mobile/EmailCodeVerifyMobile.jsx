import React from "react";

export default function EmailCodeVerifyMobile({
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
        <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-5 py-8">
            <div className="w-full max-w-[360px]">
                <div className="bg-[#F0F3F8] rounded-[28px] px-7 py-10">
                    <h1 className="text-center text-[22px] font-bold mb-9 text-black">
                        Проверьте E-mail
                    </h1>

                    <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                ref={(el) => (inputsRef.current[idx] = el)}
                                disabled={submitting}
                                autoComplete="off"
                                className={`w-[46px] h-[56px] border-2 rounded-[12px] text-center text-[26px] font-semibold focus:outline-none transition-all bg-white ${
                                    error
                                        ? 'border-red-500'
                                        : digit
                                            ? 'border-[#3066BE]'
                                            : 'border-[#D1D5DB] focus:border-[#3066BE]'
                                } ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
                            />
                        ))}
                    </div>

                    <div className="text-center mb-6">
                        {timer > 0 ? (
                            <p className="text-[#3066BE] text-[16px] font-semibold">
                                {formatTime(timer)}
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={onResend}
                                disabled={resending}
                                className="text-[13px] text-[#3066BE] font-semibold hover:underline disabled:opacity-50 bg-transparent border-none cursor-pointer transition"
                            >
                                {resending ? "Отправка..." : "Не получили код?"}
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-5 text-center">
                            <p className="text-xs text-red-600">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-5 text-center">
                            <p className="text-xs text-green-600 font-semibold">{successMessage}</p>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={!isValidCode || submitting}
                            className={`w-[195px] h-[52px] bg-[#3066BE] text-white text-[15px] font-semibold rounded-[13px] transition-all flex items-center justify-center gap-2 shadow-md ${
                                !isValidCode || submitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-[#2856a8] active:scale-[0.98]"
                            }`}
                        >
                            {submitting ? "Проверка..." : successMessage ? "Переход..." : (
                                <>
                                    <span>Следующий</span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
                                        <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}