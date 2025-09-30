// RoleSelectPage.jsx — faqat handleSelect ni yangilash kifoya
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import SelectRoleTablet from "../components/tablet/SelectRoleTablet";
import SelectRoleMobile from "../components/mobile/SelectRoleMobile";

export default function RoleSelectPage() {
    const navigate = useNavigate();

    const handleSelect = async (role) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            alert("Foydalanuvchi aniqlanmadi.");
            return;
        }

        try {
            // ✅ baseURL: .../api/auth/  -> faqat nisbiy yo‘l ishlatamiz
            await api.post(`register/step4/${userId}/`, { role });

            // ixtiyoriy: user_id ni tozalash (ro'yxat tugadi)
            localStorage.removeItem("user_id");

            // Ikki rol ham hozircha login ga
            navigate("/login");
        } catch (err) {
            const d = err?.response?.data || {};
            const msg =
                (Array.isArray(d.role) ? d.role[0] : d.role) ||
                d.detail ||
                d.error ||
                "Xatolik yuz berdi";
            alert("Xatolik: " + msg);
            console.error("Role select error:", err?.response || err);
        }
    };

    return (
        <>
            {/* Desktop (lg+) */}
            <div className="hidden lg:flex min-h-screen flex items-center justify-center bg-white px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    <button
                        onClick={() => handleSelect("JOB_SEEKER")}
                        className="bg-[#F4F6FA] border-none rounded-[31px] px-10 py-6 w-[300px] text-center shadow-sm transition text-black font-semibold text-[16px] leading-[24px]"
                    >
                        <p>Я работаю,</p>
                        <p className="font-bold">хочу найти работу</p>
                    </button>

                    <button
                        onClick={() => handleSelect("EMPLOYER")}
                        className="bg-[#F4F6FA] border-none rounded-[31px] px-10 py-6 w-[300px] text-center shadow-sm transition text-black font-semibold text-[16px] leading-[24px]"
                    >
                        <p>Я клиент, которому</p>
                        <p className="font-bold">нужно найти профессионалов.</p>
                    </button>
                </div>
            </div>

            {/* Tablet */}
            <div className="hidden md:block lg:hidden">
                <SelectRoleTablet onSelect={handleSelect} />
            </div>

            {/* Mobile */}
            <div className="block md:hidden">
                <SelectRoleMobile onSelect={handleSelect} />
            </div>
        </>
    );
}
