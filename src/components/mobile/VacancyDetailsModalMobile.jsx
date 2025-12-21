// src/components/mobile/VacancyMobileModal.jsx - MOBILE MODAL (Improved Design)
import React, { useEffect, useState } from "react";
import { X, ArrowLeft, Clock, MapPin, DollarSign, Calendar, Briefcase, Star, Bookmark, CheckCircle } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function VacancyMobileModal({ vacancy, onClose }) {
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
                toast.error("Xatolik yuz berdi");
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
            toast.success("Ariza yuborildi ✅");
            setIsApplied(true);
        } catch (err) {
            if (err.response?.status === 400) {
                toast.warn("Allaqachon yuborilgan ❗️");
                setIsApplied(true);
            } else {
                toast.error("Xatolik");
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
            <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-base text-[#3066BE] font-semibold">Загрузка...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden">

            {/* ✅ HEADER - Modern Gradient */}
            <div className="flex-shrink-0 bg-gradient-to-r from-[#3066BE] to-[#4A90E2] px-4 py-3 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>

                    <h2 className="text-[14px] font-bold">Детали вакансии</h2>

                    <button
                        onClick={toggleSaveVacancy}
                        className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                        <Bookmark size={18} className={`text-white ${isSaved ? "fill-white" : ""}`} />
                    </button>
                </div>

                <h1 className="text-[20px] font-bold leading-[1.3] mb-2">
                    {data.title || "Без названия"}
                </h1>

                <div className="flex items-center gap-3 text-white/90 text-[11px]">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {data.created_at ? new Date(data.created_at).toLocaleDateString() : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {data.is_remote ? "Удалённо" : (data.location || "Не указано")}
                    </span>
                </div>
            </div>

            {/* ✅ BODY - Scrollable Content */}
            <main className="flex-1 min-h-0 overflow-y-auto bg-[#F9FAFB]">

                {/* Budget Card */}
                <div className="mx-4 mt-4 mb-3 bg-gradient-to-br from-[#F0F7FF] to-[#E6F0FF] border border-[#3066BE]/20 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#3066BE]/10 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-[#3066BE]" />
                        </div>
                        <div>
                            <p className="text-[11px] text-[#6B7280] font-medium mb-0.5">Бюджет проекта</p>
                            <p className="text-[20px] font-bold text-[#3066BE]">
                                {data.budget || "Не указано"}
                            </p>
                            <p className="text-[11px] text-[#6B7280] mt-0.5">
                                {data.is_fixed_price ? "Фиксированная цена" : "Почасовая оплата"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="bg-white divide-y divide-gray-200">

                    {/* Description */}
                    <section className="p-4">
                        <h2 className="text-[15px] font-bold mb-2 text-black flex items-center gap-2">
                            <div className="w-1 h-5 bg-[#3066BE] rounded-full"></div>
                            Описание
                        </h2>
                        <p className="text-[14px] leading-relaxed text-[#4B5563]">
                            {data.description || "Описание не указано"}
                        </p>
                    </section>

                    {/* Skills */}
                    {data.skills?.length > 0 && (
                        <section className="p-4">
                            <h2 className="text-[15px] font-bold mb-3 text-black flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#3066BE] rounded-full"></div>
                                Навыки и опыт
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="bg-white border-2 border-[#3066BE]/20 text-[#3066BE] text-[13px] px-3 py-1.5 rounded-full font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Additional Info */}
                    <section className="p-4 space-y-3">
                        <h2 className="text-[15px] font-bold text-black flex items-center gap-2">
                            <div className="w-1 h-5 bg-[#3066BE] rounded-full"></div>
                            Дополнительно
                        </h2>

                        {data.duration && (
                            <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-gray-200">
                                <Calendar className="w-5 h-5 text-[#6B7280]" />
                                <div>
                                    <p className="text-[12px] text-[#6B7280] font-medium">Крайний срок</p>
                                    <p className="text-[14px] font-semibold text-black">
                                        {new Date(data.duration).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {data.payment_verified && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-[13px] text-green-700 font-medium">
                                    Платеж подтвержден
                                </span>
                            </div>
                        )}

                        {data.average_stars > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-[#FFFBEB] rounded-xl border border-yellow-200">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < data.average_stars ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[13px] font-medium text-[#92400E]">
                                    {data.average_stars.toFixed(1)} из 5
                                </span>
                            </div>
                        )}
                    </section>

                    {/* Company Info */}
                    {data.company && (
                        <section className="p-4">
                            <h2 className="text-[15px] font-bold mb-3 text-black flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#3066BE] rounded-full"></div>
                                О компании
                            </h2>

                            <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-gray-200">
                                <div className="w-12 h-12 bg-[#3066BE] text-white rounded-full flex items-center justify-center font-bold text-[18px]">
                                    {data.company.name?.charAt(0) || "C"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[14px] text-black truncate">
                                        {data.company.name}
                                    </p>
                                    {data.company.industry && (
                                        <p className="text-[12px] text-[#6B7280] truncate">
                                            {data.company.industry}
                                        </p>
                                    )}
                                    {data.company.location && (
                                        <p className="text-[12px] text-[#6B7280] truncate">
                                            {data.company.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <div className="h-24" />
            </main>

            {/* ✅ FOOTER - Sticky Action Buttons */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 shadow-xl">
                <div className="flex gap-2">
                    {/* Apply Button */}
                    <button
                        onClick={handleApply}
                        disabled={isApplied}
                        className={`flex-1 h-[48px] rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-[14px] ${
                            isApplied
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-[#3066BE] text-white hover:bg-[#2b58a8] active:scale-95 shadow-lg"
                        }`}
                    >
                        {isApplied ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Отправлено
                            </>
                        ) : (
                            "Откликнуться"
                        )}
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={toggleSaveVacancy}
                        className={`w-[48px] h-[48px] rounded-xl transition-all duration-200 flex items-center justify-center border-2 ${
                            isSaved
                                ? "bg-[#3066BE] border-[#3066BE]"
                                : "bg-white border-[#3066BE]"
                        } active:scale-95`}
                    >
                        <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white text-white" : "text-[#3066BE]"}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}