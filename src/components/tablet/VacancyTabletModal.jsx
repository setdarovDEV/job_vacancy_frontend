// src/components/VacancyTabletModal.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { toast } from "react-toastify";
import axios from "axios";

export default function VacancyTabletModal({ onClose, vacancy }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    // ✅ Vakansiya ma'lumotini olish
    useEffect(() => {
        const fetchVacancyDetail = async () => {
            if (!vacancy?.id) return;
            try {
                setLoading(true);
                const res = await api.get(`/api/vacancies/jobposts/${vacancy.id}/`);
                setData(res.data);
                setIsSaved(res.data.is_saved);
                setIsApplied(res.data.is_applied);
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
        if (isApplied) return;
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
                url: `https://jobvacancy-api.duckdns.org/api/vacancies/jobposts/${data.id}/save/`,
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start p-3 overflow-auto">
            <div
                className="bg-white shadow-lg rounded-xl flex flex-col mt-4 w-full max-w-[700px]"
                style={{ maxHeight: "90vh" }}
            >
                {/* HEADER */}
                <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-xl">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-[#3066BE] hover:text-black transition"
                    >
                        <img
                            src="/back.png"
                            alt="Back"
                            className="w-[28px] h-[16px] object-contain"
                        />
                        <span className="text-sm font-medium">Назад</span>
                    </button>

                    <button
                        onClick={toggleSaveVacancy}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <img
                            src="/save.png"
                            alt="save"
                            className={`w-5 h-5 ${isSaved ? "filter brightness-50" : ""}`}
                        />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="overflow-y-auto px-4 py-4" style={{ maxHeight: "calc(90vh - 150px)" }}>
                    <h2 className="text-[22px] leading-[140%] text-black font-semibold mb-3">
                        {data?.title}
                    </h2>

                    {/* Time & Location */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 text-[#AEAEAE] text-[11px] font-medium">
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

                        <div className="flex items-center gap-1.5 text-[#AEAEAE] text-[11px] font-medium">
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
                                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{data?.location || "Не указано"}</span>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-[#AEAEAE] my-4"></div>

                    {/* Description */}
                    <h3 className="text-[15px] text-black font-semibold mb-2">Описание</h3>
                    <p className="text-[13px] text-gray-700 mb-4 leading-relaxed">
                        {data?.description || "Описание отсутствует."}
                    </p>

                    {/* Budget & Deadline */}
                    <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2 text-[14px] font-medium">
                            <span>💰</span>
                            <span className="text-[#3066BE]">{data?.budget || "Не указано"}</span>
                        </div>
                        <div className="text-[13px] text-gray-600">
                            <span className="font-semibold">Крайний срок:</span>{" "}
                            {data?.duration
                                ? new Date(data.duration).toLocaleDateString()
                                : "Не указано"}
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-[#AEAEAE] my-4"></div>

                    {/* Skills */}
                    <p className="text-[15px] text-black font-semibold mb-2">Навыки и опыт</p>
                    <div className="flex flex-wrap gap-2">
                        {data?.skills?.length ? (
                            data.skills.map((s, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-100 border text-black text-[12px] px-3 py-1 rounded-full font-medium"
                                >
                                    {s}
                                </span>
                            ))
                        ) : (
                            <span className="text-[#AEAEAE] text-[13px]">Навыки не указаны</span>
                        )}
                    </div>
                </div>

                {/* FOOTER - ACTION BUTTONS */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-3 rounded-b-xl">
                    {/* Apply button */}
                    <button
                        onClick={handleApply}
                        disabled={isApplied}
                        className={`w-full h-[48px] rounded-lg text-[14px] font-semibold transition-all duration-200 flex items-center justify-center
                            ${
                            isApplied
                                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                : "bg-[#3066BE] text-white hover:bg-[#2b58a8]"
                        }`}
                    >
                        {isApplied ? "Отклик отправлен ✅" : "Откликнуться"}
                    </button>

                    {/* Save button */}
                    <button
                        onClick={toggleSaveVacancy}
                        className={`flex items-center justify-center gap-2 text-[14px] font-semibold rounded-lg w-full h-[48px] border transition-all duration-200
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