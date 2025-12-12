import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import axios from "axios";

export default function VacancyModal({ onClose, vacancy }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    // ✅ Vakansiya ma’lumotini olish
    useEffect(() => {
        const fetchVacancyDetail = async () => {
            if (!vacancy?.id) return;
            try {
                setLoading(true);
                const res = await api.get(`/api/vacancies/jobposts/${vacancy.id}/`);
                setData(res.data);
                setIsSaved(res.data.is_saved); // 🔹 Saqlangan holatni o‘rnatamiz
                setIsApplied(res.data.is_applied); // 🔹 Apply holatni ham o‘rnatamiz
            } catch (err) {
                console.error("Vakansiya detailni olishda xatolik:", err);
                toast.error("Vakansiyani yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        fetchVacancyDetail();
    }, [vacancy?.id]);

    // ✅ Apply funksiyasi
    const handleApply = async () => {
        if (isApplied) return; // oldin bosilgan bo‘lsa qaytadi
        try {
            await api.post("/api/applications/apply/", {
                job_post: data.id,
                cover_letter: "",
            });
            toast.success("Arizangiz yuborildi ✅");
            setIsApplied(true);
        } catch (err) {
            if (err.response?.status === 400) {
                toast.warn("Siz allaqachon ariza yuborgansiz ❗️");
                setIsApplied(true);
            } else {
                toast.error("Xatolik yuz berdi");
            }
            console.error("Xatolik:", err);
        }
    };

    // ✅ Saqlash / unsave qilish funksiyasi
    const toggleSaveVacancy = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                toast.error("Сначала войдите в систему!");
                return;
            }

            const method = isSaved ? "delete" : "post";
            await axios({
                method,
                url: `http://localhost:8000/api/vacancies/jobposts/${data.id}/save/`,
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsSaved(!isSaved);
            toast.success(isSaved ? "Удалено из сохранённых ❌" : "Вакансия сохранена ✅");
        } catch (err) {
            console.error("❌ Toggle save error:", err);
            toast.error("Ошибка при сохранении или удалении вакансии");
        }
    };

    if (loading)
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <p className="text-lg text-[#3066BE] font-semibold">Загрузка вакансии...</p>
                </div>
            </div>
        );

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end items-start p-4 overflow-auto">
            <div
                className="fixed top-0 right-0 z-50 bg-white shadow-lg flex flex-col lg:flex-row rounded-none"
                style={{ width: "1051px", height: "900px" }}
            >
                {/* LEFT */}
                <div className="w-full lg:w-3/4 p-8 overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-6 left-6 z-50 bg-white border-none ml-[-8px]"
                    >
                        <img
                            src="/back.png"
                            alt="Back"
                            className="w-[34px] h-[18px] object-contain bg-white"
                        />
                    </button>

                    <h2 className="w-[433px] text-[30px] leading-[150%] text-black font-semibold mt-12 mb-2">
                        {data?.title}
                    </h2>

                    {/* 🕓 vaqt & 📍 location */}
                    <div className="flex items-center gap-3 mb-4 ml-[2px]">
                        <div className="flex items-center gap-[6px] text-[#AEAEAE] text-[12px] font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                fill="none"
                                stroke="#AEAEAE"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{data?.timeAgo || "—"}</span>
                        </div>

                        <div className="flex items-center gap-[6px] text-[#AEAEAE] text-[12px] font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                fill="none"
                                stroke="#AEAEAE"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{data?.location || "Не указано"}</span>
                        </div>
                    </div>

                    <div className="w-[800px] h-[1px] bg-[#AEAEAE] my-6"></div>

                    <h3 className="text-[18px] text-black font-semibold mb-2">Описание</h3>
                    <p className="text-[15px] text-black font-medium mb-6">
                        {data?.description || "Описание отсутствует."}
                    </p>

                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-[6px] text-[20px] font-medium">
                            💰 <span className="text-[#3066BE]">{data?.budget}</span>
                        </div>
                        <div className="text-[18px] font-semibold">
                            Крайний срок:{" "}
                            {data?.duration
                                ? new Date(data.duration).toLocaleDateString()
                                : "Не указано"}
                        </div>
                    </div>

                    <div className="w-[800px] h-[1px] bg-[#AEAEAE] my-6"></div>

                    <p className="text-[18px] text-black font-semibold mb-3">Навыки и опыт</p>
                    <div className="flex flex-wrap gap-3">
                        {data?.skills?.length ? (
                            data.skills.map((s, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-200 text-black text-[14px] px-4 py-1.5 rounded-full font-medium"
                                >
                  {s}
                </span>
                            ))
                        ) : (
                            <span className="text-[#AEAEAE]">Навыки не указаны</span>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-[calc(100%-150px)] bg-[#AEAEAE] my-[75px] mx-4"></div>

                {/* RIGHT */}
                <div className="w-1/4 mt-[90px] bg-white p-8 flex flex-col items-center gap-4">

                    {/* 🔹 Apply button (dynamic) */}
                    <button
                        onClick={handleApply}
                        disabled={isApplied}
                        className={`w-[168px] h-[59px] rounded-[10px] text-[16px] font-medium transition-all duration-200 flex items-center justify-center
              ${
                            isApplied
                                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                : "bg-[#3066BE] text-white hover:bg-[#2b58a8]"
                        }`}
                    >
                        {isApplied ? "Отклик отправлен ✅" : "Откликнуться"}
                    </button>

                    {/* 🔹 Save / Saved */}
                    <button
                        onClick={toggleSaveVacancy}
                        className={`flex items-center justify-center gap-[10px] text-[16px] font-medium rounded-[10px] w-[168px] h-[59px] border transition-all duration-200
              ${
                            isSaved
                                ? "bg-[#3066BE] text-white border-[#3066BE] hover:bg-[#2b58a8]"
                                : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#f2f7ff]"
                        }`}
                    >
                        <img
                            src="/save.png"
                            alt="save"
                            className={`w-4 h-4 transition-all duration-200 ${
                                isSaved ? "filter brightness-200" : ""
                            }`}
                        />
                        {isSaved ? "Сохранено" : "Сохранить"}
                    </button>
                </div>
            </div>
        </div>
    );
}
