// src/components/VacancyModal.jsx - DESKTOP MODAL (Improved Design)
import React, { useEffect, useState } from "react";
import { X, Clock, MapPin, DollarSign, Calendar, Briefcase, Star } from "lucide-react";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function VacancyModal({ onClose, vacancy }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

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

        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [vacancy?.id]);

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
        }
    };

    const toggleSaveVacancy = async () => {
        try {
            const method = isSaved ? "delete" : "post";
            await api({ method, url: `/api/vacancies/jobposts/${data.id}/save/` });
            setIsSaved(!isSaved);
            toast.success(isSaved ? "Удалено из сохранённых ❌" : "Вакансия сохранена ✅");
        } catch (err) {
            console.error("❌ Toggle save error:", err);
            toast.error("Ошибка при сохранении");
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg text-[#3066BE] font-semibold">Загрузка вакансии...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[1100px] max-h-[90vh] flex flex-col overflow-hidden animate-slideIn">

                {/* ✅ HEADER - Modern Design */}
                <div className="relative bg-gradient-to-r from-[#3066BE] to-[#4A90E2] px-8 py-6 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 group"
                    >
                        <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    </button>

                    <h2 className="text-[28px] font-bold leading-[1.3] pr-16 mb-3">
                        {data?.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-[13px]">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Опубликовано {new Date(data?.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{data?.location || "Не указано"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{data?.is_fixed_price ? "Fixed Price" : "Hourly Rate"}</span>
                        </div>
                    </div>
                </div>

                {/* ✅ BODY - Two Column Layout */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col lg:flex-row min-h-full">

                        {/* LEFT COLUMN - Content */}
                        <div className="flex-1 p-8 space-y-6">

                            {/* Budget Card */}
                            <div className="bg-gradient-to-br from-[#F0F7FF] to-[#E6F0FF] border border-[#3066BE]/20 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-[#3066BE]/10 flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-[#3066BE]" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-[#6B7280] font-medium">Бюджет проекта</p>
                                        <p className="text-[24px] font-bold text-[#3066BE]">{data?.budget || "Не указано"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-[18px] font-bold text-black mb-3 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-[#3066BE] rounded-full"></div>
                                    Описание вакансии
                                </h3>
                                <p className="text-[15px] text-[#4B5563] leading-relaxed">
                                    {data?.description || "Описание отсутствует."}
                                </p>
                            </div>

                            {/* Skills */}
                            <div>
                                <h3 className="text-[18px] font-bold text-black mb-3 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-[#3066BE] rounded-full"></div>
                                    Навыки и опыт
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data?.skills?.length ? (
                                        data.skills.map((s, i) => (
                                            <span
                                                key={i}
                                                className="bg-white border-2 border-[#3066BE]/20 text-[#3066BE] px-4 py-2 rounded-full text-[14px] font-medium hover:bg-[#3066BE] hover:text-white transition-all duration-200 cursor-default"
                                            >
                                                {s}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[#AEAEAE] text-[14px]">Навыки не указаны</span>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            {data?.duration && (
                                <div className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-xl border border-gray-200">
                                    <Calendar className="w-5 h-5 text-[#6B7280]" />
                                    <div>
                                        <p className="text-[13px] text-[#6B7280] font-medium">Крайний срок</p>
                                        <p className="text-[15px] font-semibold text-black">
                                            {new Date(data.duration).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Rating */}
                            {data?.average_stars > 0 && (
                                <div className="flex items-center gap-2 p-4 bg-[#FFFBEB] rounded-xl border border-yellow-200">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={`${i < data.average_stars ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[14px] font-medium text-[#92400E]">
                                        {data.average_stars.toFixed(1)} из 5
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN - Actions */}
                        <div className="lg:w-[320px] bg-[#F9FAFB] border-l border-gray-200 p-6 flex flex-col gap-4">

                            {/* Apply Button */}
                            <button
                                onClick={handleApply}
                                disabled={isApplied}
                                className={`w-full h-[56px] rounded-xl text-[16px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                                    isApplied
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-[#3066BE] text-white hover:bg-[#2b58a8] active:scale-95"
                                }`}
                            >
                                {isApplied ? (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Отклик отправлен
                                    </>
                                ) : (
                                    "Откликнуться"
                                )}
                            </button>

                            {/* Save Button */}
                            <button
                                onClick={toggleSaveVacancy}
                                className={`w-full h-[56px] rounded-xl text-[16px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
                                    isSaved
                                        ? "bg-[#3066BE] text-white border-[#3066BE] hover:bg-[#2b58a8]"
                                        : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#F0F7FF]"
                                } active:scale-95`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill={isSaved ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                {isSaved ? "Сохранено" : "Сохранить"}
                            </button>

                            <div className="h-px bg-gray-300 my-2"></div>

                            {/* Info Cards */}
                            <div className="space-y-3">
                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                    <p className="text-[12px] text-[#6B7280] mb-1">Тип оплаты</p>
                                    <p className="text-[14px] font-semibold text-black">
                                        {data?.is_fixed_price ? "Фиксированная" : "Почасовая"}
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                    <p className="text-[12px] text-[#6B7280] mb-1">Местоположение</p>
                                    <p className="text-[14px] font-semibold text-black">
                                        {data?.location || "Удалённо"}
                                    </p>
                                </div>

                                {data?.company_name && (
                                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                                        <p className="text-[12px] text-[#6B7280] mb-1">Компания</p>
                                        <p className="text-[14px] font-semibold text-black">
                                            {data.company_name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}