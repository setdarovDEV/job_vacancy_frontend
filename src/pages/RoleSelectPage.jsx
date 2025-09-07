import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import SelectRoleTablet from "../components/tablet/SelectRoleTablet";
import SelectRoleMobile from "../components/mobile/SelectRoleMobile"; // <— YANGI

export default function RoleSelectPage() {
    const navigate = useNavigate();

    const handleSelect = async (role) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            alert("Foydalanuvchi aniqlanmadi.");
            return;
        }

        try {
            await api.post(`api/auth/register/step4/${userId}/`, { role });

            // Har bir rol uchun navigate (hozircha ikkalasi ham login-ga)
            if (role === "JOB_SEEKER" || role === "EMPLOYER") {
                navigate("/login");
            }
        } catch (err) {
            console.error("Xatolik:", err?.response);
            alert("Xatolik yuz berdi: " + (err?.response?.data?.detail || "Nomaʼlum xato"));
        }
    };

    return (
        <>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen flex items-center justify-center bg-white px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Job Seeker */}
                    <button
                        onClick={() => handleSelect("JOB_SEEKER")}
                        className="bg-[#F4F6FA] border-none rounded-[31px] px-10 py-6 w-[300px] text-center shadow-sm transition text-black font-semibold text-[16px] leading-[24px]"
                    >
                        <p>Я работаю,</p>
                        <p className="font-bold">хочу найти работу</p>
                    </button>

                    {/* Employer */}
                    <button
                        onClick={() => handleSelect("EMPLOYER")}
                        className="bg-[#F4F6FA] border-none rounded-[31px] px-10 py-6 w-[300px] text-center shadow-sm transition text-black font-semibold text-[16px] leading-[24px]"
                    >
                        <p>Я клиент, которому</p>
                        <p className="font-bold">нужно найти профессионалов.</p>
                    </button>
                </div>
            </div>

            {/* Tablet only (md) */}
            <div className="hidden md:block lg:hidden">
                <SelectRoleTablet onSelect={handleSelect} />
            </div>

            {/* Mobile (sm va past) */}
            <div className="block md:hidden">
                <SelectRoleMobile onSelect={handleSelect} />
            </div>
        </>
    );
}
