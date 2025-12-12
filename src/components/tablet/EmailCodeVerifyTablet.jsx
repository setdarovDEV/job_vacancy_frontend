import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
                                              }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("uid");

    const code = otp.join("").trim();
    const isValidCode = /^\d{6}$/.test(code);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!submitting) {
            onSubmit();
        }
    };

    return (
        <div className="w-full min-h-screen bg-white flex text-black items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F5F8FC] rounded-2xl px-6 py-8 shadow-md">
                <h2 className="text-center text-[20px] font-semibold mb-2">
                    Проверьте E-mail
                </h2>
                <p className="text-center text-xs text-gray-600 mb-4">
                    Мы отправили 6-значный код на вашу почту
                </p>

                <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col items-center gap-3"
                >
                    {/* Code input (6ta) */}
                    <div
                        className="flex gap-2 justify-center"
                        onPaste={handlePaste}
                    >
                        {otp.map((val, i) => (
                            <input
                                key={i}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={val}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                ref={(el) => (inputsRef.current[i] = el)}
                                disabled={submitting}
                                className={`w-10 h-12 text-center text-[20px] border rounded-md focus:outline-none transition
                                    ${error ? "border-red-500" : "border-black"}
                                    ${submitting ? "opacity-50 cursor-not-allowed" : "focus:border-[#3066BE]"}`}
                            />
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600 text-center w-full mt-1">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-600 text-center w-full mt-1 font-semibold">
                            {successMessage}
                        </div>
                    )}

                    {/* Timer / Resend */}
                    <div className="text-xs text-gray-600 mt-1">
                        {timer > 0 ? (
                            <span>Код действителен: {formatTime(timer)}</span>
                        ) : (
                            <button
                                type="button"
                                onClick={onResend}
                                disabled={resending}
                                className="text-[#2F61C9] hover:underline disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer"
                            >
                                {resending
                                    ? "Отправка..."
                                    : "Не получили код? Отправить повторно"}
                            </button>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isValidCode || submitting}
                        className={`w-[160px] bg-[#2F61C9] text-white font-semibold py-2 rounded-xl hover:opacity-90 transition mt-2
                            ${!isValidCode || submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {submitting
                            ? "Проверка..."
                            : successMessage
                                ? "Переход..."
                                : "Следующий →"}
                    </button>

                    {/* Back button */}
                    <div className="text-center mt-2">
                        <button
                            type="button"
                            onClick={() => navigate(userId ? `/register/step2?uid=${userId}` : "/register/step2")}
                            disabled={submitting}
                            className="text-xs text-[#3066BE] font-semibold hover:underline disabled:opacity-50 bg-transparent border-none"
                        >
                            ← Назад
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}