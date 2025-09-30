// EmailStep.jsx — faqat handleSubmit ichini va post yo'lini to'g'irlash kifoya
import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import EmailVerifyTablet from "../components/tablet/EmailVerifyTablet";
import EmailVerifyMobile from "../components/mobile/EmailVerifyMobile";

export default function EmailStep() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const userId = localStorage.getItem("user_id");
        if (!userId) {
            setError("Foydalanuvchi aniqlanmadi");
            return;
        }

        const trimmed = email.trim();
        const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!simpleEmail.test(trimmed)) {
            setError("Email format noto'g'ri");
            return;
        }

        try {
            // ✅ E’TIBOR: baseURL allaqachon .../api/auth/ bo‘lsa, bu yerda faqat nisbiy yo‘l kerak
            await api.post(`register/step2/${userId}/`, { email: trimmed });

            // Muvoffaqiyat — keyingi bosqich (step 3: kod kiritish)
            navigate("/verify");
        } catch (err) {
            const d = err?.response?.data || {};
            const emailErr = Array.isArray(d.email) ? d.email[0] : d.email;
            const detail = typeof d.detail === "string" ? d.detail : null;
            setError(emailErr || detail || "Xatolik yuz berdi");
        }
    };

    return (
        <>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen flex items-center justify-center bg-white text-black px-4">
                <div className="bg-[#F6F8FC] p-10 rounded-[24px] shadow-md w-full max-w-md text-center">
                    <h2 className="text-[24px] font-bold text-black mb-6">Ваш E-mail</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 text-left">
                            <input
                                type="email"
                                inputMode="email"
                                placeholder="Напишите E-mail адрес"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] placeholder-[#585858] text-[16px] focus:outline-none focus:border-[#000000] py-2 mb-[23px]"
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-[177px] h-[57px] ml-[100px] hover:text-white bg-[#3066BE] border-none text-white text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] hover:bg-[#2a58a6] transition flex items-center justify-center gap-2"
                        >
                            Следующий
                            <img src="/next.png" alt="next icon" className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Tablet only (md) */}
            <div className="hidden md:block lg:hidden">
                <EmailVerifyTablet />
            </div>

            {/* Mobile (sm va past) */}
            <div className="block md:hidden">
                <EmailVerifyMobile
                    email={email}
                    onChangeEmail={setEmail}
                    onSubmit={handleSubmit}
                    error={error}
                />
            </div>
        </>
    );
}
