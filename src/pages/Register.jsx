import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import RegisterTablet from "../components/tablet/RegisterTablet";


export default function RegisterForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        confirm_password: "",
        role: "JOB_SEEKER", // yoki EMPLOYER
    });


    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirm_password) {
            setError("Parollar mos emas");
            return;
        }

        try {
            const res = await api.post("api/auth/register/step1/", {
                first_name: formData.first_name,
                last_name: formData.last_name,
                username: formData.username,
                password: formData.password,
                confirm_password: formData.confirm_password,
            });

            const userId = res.data.user_id;
            localStorage.setItem("user_id", userId);

            navigate("/2fa");
        } catch (err) {
            console.log("XATO:", err.response);
            setError(err.response?.data?.detail || "Xatolik yuz berdi");
        }
    };


    const payload = {
        full_name: formData.first_name + " " + formData.last_name,
        username: formData.username,
        password: formData.password,
        role: formData.role,
    };

    return (
        <>
        <div className="hidden lg:flex min-h-screen flex items-center justify-center bg-[#FFFFFF] text-black px-4">
            <div className="bg-[#F4F6FA] w-[463px] h-[705px] border border-none rounded-[31px] max-w-md p-10">
                <h2 className="text-center text-[32px] font-bold text-black mb-8">Зарегистрироваться</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Ваше имя"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-[357px] border-0 border-b border-[#000000] bg-[#F4F6FA] text-[16px] py-2 mb-[32px] placeholder-[#585858]]"
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

                    {/* Error message */}
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

                    <a href="/login" className="text-[12px] ml-[135px] text-[#3066BE] font-[600] cursor-pointer hover:underline block mt-4">
                        Уже есть аккаунт?
                    </a>
                </form>
            </div>
        </div>

        <div className="block lg:hidden">
            <RegisterTablet />
        </div>
        </>
    );
}
