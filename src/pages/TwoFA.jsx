import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmailVerifyTablet from "../components/tablet/EmailVerifyTablet";
import EmailVerifyMobile from "../components/mobile/EmailVerifyMobile";

export default function EmailStep() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const userId = searchParams.get("uid") || localStorage.getItem("user_id");

    useEffect(() => {
        if (!userId) {
            setError("Фойдаланувчи аникланмади. Қайтадан рўйхатдан ўтинг.");
            setTimeout(() => navigate("/register"), 2000);
        }
    }, [userId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const response = await api.post(`/api/auth/register/step2/${userId}/`, {
                email: email.trim()
            });

            setSuccessMessage("Код отправлен на ваш E-mail! ✅");

            setTimeout(() => {
                navigate(`/register/step3?uid=${userId}`);
            }, 2000);

        } catch (err) {
            const data = err?.response?.data || {};
            const emailError = Array.isArray(data.email) ? data.email[0] : data.email;
            const generalError = data.error || data.detail || "Хатолик юз берди";

            setError(emailError || generalError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError("");
        if (successMessage) setSuccessMessage("");
    };

    return (
        <React.Fragment>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen items-center justify-center bg-[#F8F9FB]">
                <div className="bg-white w-full max-w-[480px] rounded-[32px] px-16 py-12 shadow-sm">
                    <h1 className="text-center text-[26px] font-bold text-black mb-10">
                        Ваш E-mail
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <input
                                type="email"
                                inputMode="email"
                                placeholder="Напишите E-mail адрес"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                disabled={isLoading}
                                className={`w-full border-0 border-b ${
                                    error ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-gray-300'
                                } bg-white placeholder-gray-500 text-[15px] focus:outline-none focus:border-[#3066BE] py-3 transition-colors ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            />

                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}

                            {successMessage && (
                                <p className="text-green-600 text-sm mt-2 font-semibold">
                                    {successMessage}
                                </p>
                            )}
                        </div>

                        {isLoading && (
                            <p className="text-blue-600 text-sm text-center">
                                Отправляем код на ваш E-mail...
                            </p>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-[200px] h-[54px] bg-[#3066BE] text-white text-[15px] font-semibold rounded-[12px] hover:bg-[#2856a8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isLoading ? (
                                    <span>Отправка...</span>
                                ) : successMessage ? (
                                    <span>Переход...</span>
                                ) : (
                                    <>
                                        Следующий
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
                                            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tablet (md) */}
            <div className="hidden md:block lg:hidden">
                <EmailVerifyTablet
                    email={email}
                    onChangeEmail={handleEmailChange}
                    onSubmit={handleSubmit}
                    error={error}
                    isLoading={isLoading}
                    successMessage={successMessage}
                />
            </div>

            {/* Mobile (sm) */}
            <div className="block md:hidden">
                <EmailVerifyMobile
                    email={email}
                    onChangeEmail={handleEmailChange}
                    onSubmit={handleSubmit}
                    error={error}
                    isLoading={isLoading}
                    successMessage={successMessage}
                />
            </div>
        </React.Fragment>
    );
}