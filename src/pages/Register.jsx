import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import RegisterTablet from "../components/tablet/RegisterTablet";
import RegisterMobile from "../components/mobile/RegisterMobile";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirm_password) {
            setError("Parollar mos emas");
            return;
        }

        try {
            const res = await api.post("register/step1/", {
                first_name: formData.first_name,
                last_name: formData.last_name,
                username: formData.username,
                password: formData.password,
                confirm_password: formData.confirm_password,
            });

            // ✅ himoyalangan o‘qish
            const data = res?.data || {};
            const userId = data.user_id ?? data.id ?? data.userId;

            if (!userId) {
                // backend 201 qaytardi, lekin user_id kelmadi — loglab qo‘yamiz
                console.warn("register/step1 response:", data);
            } else {
                // string sifatida saqlash
                localStorage.setItem("user_id", String(userId));
            }

            // muvaffaqiyatda error matnini tozalab qo‘yamiz
            setError("");

            // Keyingi bosqichga o'tish
            try {
                // Senda step-2 route nomi boshqacha bo‘lsa shu yerda almashtirasan
                navigate("/2fa");
            } catch (navErr) {
                console.error("Navigate error:", navErr);
                // Navigatsiya muammosi bo‘lsa ham user_id saqlangan — matnni tushunarli qilamiz
                setError("Muvaffaqiyatli yaratildi, lekin keyingi sahifaga o'tishda xatolik yuz berdi.");
            }
        } catch (err) {
            // Backenddan kelgan xatolarni aniq ko‘rsatish
            const d = err?.response?.data || {};
            const first = Array.isArray(d.first_name) ? d.first_name[0] : null;
            const last = Array.isArray(d.last_name) ? d.last_name[0] : null;
            const uname = Array.isArray(d.username) ? d.username[0] : null;
            const pwd = Array.isArray(d.password) ? d.password[0] : null;
            const cpwd = Array.isArray(d.confirm_password) ? d.confirm_password[0] : null;
            const nonField = Array.isArray(d.non_field_errors) ? d.non_field_errors[0] : d.non_field_errors;
            const detail = typeof d.detail === "string" ? d.detail : null;

            setError(nonField || detail || first || last || uname || pwd || cpwd || "Xatolik yuz berdi");
        }
    };


    return (
        <>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen flex items-center justify-center bg-[#FFFFFF] text-black px-4">
                <div className="bg-[#F4F6FA] w-[463px] h-[705px] border border-none rounded-[31px] max-w-md p-10">
                    <h2 className="text-center text-[32px] font-bold text-black mb-8">
                        Зарегистрироваться
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Ваше имя"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] text-[16px] py-2 mb-[32px] placeholder-[#585858]"
                            required
                        />

                        <input
                            type="text"
                            name="last_name"
                            placeholder="Фамилия"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] text-[16px] py-2 mb-[32px] placeholder-[#585858]"
                            required
                        />

                        <input
                            type="text"
                            name="username"
                            placeholder="Ваше имя пользователя"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] text-[16px] py-2 mb-[32px] placeholder-[#585858]"
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] text-[16px] py-2 mb-[32px] placeholder-[#585858]"
                            required
                        />

                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Подтвердите пароль"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] text-[16px] py-2 mb-[32px] placeholder-[#585858]"
                            required
                        />

                        {/* Error */}
                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                        <div className="flex items-start gap-2 mt-4 mb-6">
                            <input type="checkbox" required className="mt-1 w-4 h-4 accent-black" />
                            <p className="text-[12px] leading-[18px]">
                                Я прочитал и принял Политику конфиденциальности и Условия*
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-[177px] h-[57px] ml-[100px] bg-[#3066BE] text-white text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] hover:bg-[#2a58a6] transition flex items-center justify-center gap-2"
                        >
                            Следующий
                            <img src="/next.png" alt="next icon" className="w-4 h-4" />
                        </button>

                        <a
                            href="/login"
                            className="text-[12px] ml-[135px] text-[#3066BE] font-[600] cursor-pointer hover:underline block mt-4"
                        >
                            Уже есть аккаунт?
                        </a>
                    </form>
                </div>
            </div>

            {/* Tablet only (md) */}
            <div className="hidden md:block lg:hidden">
                <RegisterTablet />
            </div>

            {/* Mobile (sm va past) */}
            <div className="block md:hidden">
                <RegisterMobile
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    error={error}
                />
            </div>
        </>
    );
}
