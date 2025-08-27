import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // sening axios instance

export default function ResumeButton() {
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const res = await api.get("/api/resumes/my/");
            if (res.status === 204 || !res.data?.id) {
                // Resume topilmadi → yaratish sahifasi
                navigate("/resumes/create");
            } else {
                // Resume bor → tahrirlash sahifasi
                navigate(`/resumes/${res.data.id}/edit`);
            }
        } catch (error) {
            console.error("Xatolik:", error);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="bg-[#3066BE] text-white text-[16px] font-medium rounded-[10px] px-[25px] py-[15px]"
        >
            Заполнить резюме
        </button>
    );
}
