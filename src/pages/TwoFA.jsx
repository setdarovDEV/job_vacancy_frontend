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

    // ✅ URL'dan yoki localStorage'dan user_id olish
    const userId = searchParams.get("uid") || localStorage.getItem("user_id");

    console.log("📍 Step 2 - User ID:", userId);

    // Redirect if no userId
    useEffect(() => {
        if (!userId) {
            setError("Foydalanuvchi aniqlanmadi. Qaytadan ro'yxatdan o'ting.");
            setTimeout(() => navigate("/register"), 2000);
        }
    }, [userId, navigate]);

    // EmailStep.jsx

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const response = await api.post(`/api/auth/register/step2/${userId}/`, {
                email: email.trim()
            });

            console.log('✅ Response:', response.data);

            setSuccessMessage("Код отправлен на ваш E-mail! ✅");

            // ✅ 2 sekunddan keyin Step 3 ga o'tish
            setTimeout(() => {
                navigate(`/register/step3?uid=${userId}`);
            }, 2000);

        } catch (err) {
            console.error('❌ Error:', err.response?.data || err.message);

            const data = err?.response?.data || {};
            const emailError = Array.isArray(data.email) ? data.email[0] : data.email;
            const generalError = data.error || data.detail || "Xatolik yuz berdi";

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
            <div className="hidden lg:flex min-h-screen items-center justify-center bg-white text-black px-4">
                <div className="bg-[#F6F8FC] p-10 rounded-[24px] shadow-md w-full max-w-md text-center">
                    <h2 className="text-[24px] font-bold text-black mb-6">
                        Ваш E-mail
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 text-left">
                            <input
                                type="email"
                                inputMode="email"
                                placeholder="Напишите E-mail адрес"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                disabled={isLoading}
                                className={`w-full border-0 border-b ${
                                    error ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-black'
                                } bg-[#F6F8FC] placeholder-gray-600 text-base focus:outline-none focus:border-blue-600 py-2 transition-colors ${
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[177px] h-[57px] mx-auto bg-[#3066BE] text-white text-base font-semibold rounded-lg px-6 py-4 hover:bg-[#2a58a6] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span>Отправка...</span>
                            ) : successMessage ? (
                                <span>Переход...</span>
                            ) : (
                                <React.Fragment>
                                    Следующий
                                    <img src="/next.png" alt="next icon" className="w-4 h-4" />
                                </React.Fragment>
                            )}
                        </button>

                        {/* Loading message */}
                        {isLoading && (
                            <p className="text-blue-600 text-sm mt-4">
                                Отправляем код на ваш E-mail...
                            </p>
                        )}
                    </form>

                    {/* Back button */}
                    <button
                        onClick={() => navigate("/register")}
                        disabled={isLoading}
                        className="bg-[#F4F6FA] text-[#3066BE] border-0 rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#e8ecf4] transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Назад к регистрации
                    </button>
                </div>
            </div>

            {/* Tablet only (md) */}
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

            {/* Mobile (sm va past) */}
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