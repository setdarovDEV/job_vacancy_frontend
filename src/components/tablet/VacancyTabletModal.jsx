// src/components/tablet/VacancyTabletModal.jsx - TABLET MODAL (Improved Design)
import React, { useEffect, useState } from "react";
import { X, ArrowLeft, Clock, MapPin, DollarSign, Calendar, Briefcase, Star, Bookmark } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function VacancyTabletModal({ onClose, vacancy }) {
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
            toast.success(isSaved ? "Удалено ❌" : "Сохранено ✅");
        } catch (err) {
            console.error("Toggle save error:", err);
            toast.error("Ошибка");
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-base text-[#3066BE] font-semibold">Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-start p-3 overflow-auto">
            <div className="bg-white shadow-2xl rounded-[20px] flex flex-col mt-4 w-full max-w-[680px] max-h-[90vh] overflow-hidden animate-slideUp">

                {/* ✅ HEADER - Modern */}
                <div className="relative bg-gradient-to-r from-[#3066BE] to-[#4A90E2] px-5 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-[13px] font-medium">Назад</span>
                        </button>

                        <button
                            onClick={toggleSaveVacancy}
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                        >
                            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
                        </button>
                    </div>

                    <h2 className="text-[22px] font-bold leading-[1.3] mt-3 mb-2">
                        {data?.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-white/90 text-[12px]">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{new Date(data?.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{data?.location || "Не указано"}</span>
                        </div>
                    </div>
                </div>

                {/* ✅ CONTENT - Scrollable */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

                    {/* Budget Card */}
                    <div className="bg-gradient-to-br from-[#F0F7FF] to-[#E6F0FF] border border-[#3066BE]/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3066BE]/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-[#3066BE]" />
                            </div>
                            <div>
                                <p className="text-[12px] text-[#6B7280] font-medium">Бюджет</p>
                                <p className="text-[20px] font-bold text-[#3066BE]">{data?.budget || "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-[16px] font-bold text-black mb-2 flex items-center gap-2">
                            <div className="w-1 h-5 bg-[#3066BE] rounded-full"></div>
                            Описание
                        </h3>
                        <p className="text-[14px] text-[#4B5563] leading-relaxed">
                            {data?.description || "Описание отсутствует."}
                        </p>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-[16px] font-bold text-black mb-2 flex items-center gap-2">
                            <div className="w-1 h-5 bg-[#3066BE] rounded-full"></div>
                            Навыки
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data?.skills?.length ? (
                                data.skills.map((s, i) => (
                                    <span
                                        key={i}
                                        className="bg-white border-2 border-[#3066BE]/20 text-[#3066BE] px-3 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#3066BE] hover:text-white transition-all"
                                    >
                                        {s}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[#AEAEAE] text-[13px]">Навыки не указаны</span>
                            )}
                        </div>
                    </div>

                    {/* Additional Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F9FAFB] rounded-xl p-3 border border-gray-200">
                            <p className="text-[11px] text-[#6B7280] mb-1">Тип оплаты</p>
                            <p className="text-[13px] font-semibold text-black">
                                {data?.is_fixed_price ? "Фиксированная" : "Почасовая"}
                            </p>
                        </div>

                        {data?.duration && (
                            <div className="bg-[#F9FAFB] rounded-xl p-3 border border-gray-200">
                                <p className="text-[11px] text-[#6B7280] mb-1">Крайний срок</p>
                                <p className="text-[13px] font-semibold text-black">
                                    {new Date(data.duration).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Rating */}
                    {data?.average_stars > 0 && (
                        <div className="flex items-center gap-2 p-3 bg-[#FFFBEB] rounded-xl border border-yellow-200">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < data.average_stars ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[13px] font-medium text-[#92400E]">
                                {data.average_stars.toFixed(1)} из 5
                            </span>
                        </div>
                    )}
                </div>

                {/* ✅ FOOTER - Action Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 rounded-b-[20px] shadow-lg">
                    <div className="flex flex-col gap-3">
                        {/* Apply */}
                        <button
                            onClick={handleApply}
                            disabled={isApplied}
                            className={`w-full h-[52px] rounded-xl text-[15px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                isApplied
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-[#3066BE] text-white hover:bg-[#2b58a8] active:scale-95 shadow-lg"
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

                        {/* Save */}
                        <button
                            onClick={toggleSaveVacancy}
                            className={`w-full h-[52px] rounded-xl text-[15px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
                                isSaved
                                    ? "bg-[#3066BE] text-white border-[#3066BE] hover:bg-[#2b58a8]"
                                    : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#F0F7FF]"
                            } active:scale-95`}
                        >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
                            {isSaved ? "Сохранено" : "Сохранить"}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}