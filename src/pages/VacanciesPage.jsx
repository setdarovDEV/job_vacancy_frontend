// src/pages/VacanciesPage.jsx - COMPLETE VERSION (Desktop + Tablet + Mobile)
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown, ArrowLeft, Clock, MapPin, DollarSign, Star } from "lucide-react";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import MobileFooter from "../components/mobile/MobileFooter.jsx";
import MobileNavbarLogin from "../components/mobile/MobileNavbarLogin.jsx";
import MobileNavbar from "../components/mobile/MobileNavbar.jsx";

// ============================================
// HELPERS
// ============================================
const formatName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length < 2) return fullName;
    const firstInitial = parts[0][0].toUpperCase();
    const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return `${firstInitial}. ${lastName}`;
};

const timeAgo = (iso) => {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const sec = Math.max(1, Math.floor(diff / 1000));
    if (sec < 60) return `${sec} с`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} мин`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} ч`;
    const d = Math.floor(hr / 24);
    return `${d} д`;
};

// ============================================
// TEXTS
// ============================================
const TEXTS = {
    RU: {
        community: "Сообщество",
        vacancies: "Вакансии",
        chat: "Чат",
        companies: "Компании",
        publishVacancy: "Опубликовать вакансию",
        logo: "Logo",
        links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
        copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
    },
};

// ============================================
// VACANCY MODAL (DESKTOP/TABLET) - IMPROVED DESIGN ✨
// ============================================
function VacancyModal({ vacancy, onClose }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!vacancy?.id) return;
            try {
                setLoading(true);
                const res = await api.get(`/api/vacancies/jobposts/${vacancy.id}/`);
                setData(res.data);
                setIsSaved(res.data.is_saved);
                setIsApplied(res.data.is_applied);
            } catch (err) {
                console.error("Fetch detail error:", err);
                toast.error("Ошибка загрузки");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [vacancy?.id]);

    const handleApply = async () => {
        if (isApplied) return;
        try {
            await api.post("/api/applications/apply/", { job_post: data.id, cover_letter: "" });
            toast.success("Ariza yuborildi ✅");
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

    const toggleSave = async () => {
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

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-pulse">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg text-[#3066BE] font-semibold">Загрузка вакансии...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto animate-fadeIn">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[1100px] max-h-[90vh] flex flex-col overflow-hidden animate-slideIn">

                {/* ✅ HEADER - Modern Gradient Design */}
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
                            <span>Опубликовано {timeAgo(data?.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{data?.location || "Не указано"}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                            <span className="text-[12px] font-medium">
                                {data?.is_fixed_price ? "Fixed Price" : "Hourly Rate"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ✅ BODY - Two Column Layout */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col lg:flex-row min-h-full">

                        {/* LEFT COLUMN - Content */}
                        <div className="flex-1 p-8 space-y-6">

                            {/* Budget Card - Chiroyli dizayn */}
                            <div className="bg-gradient-to-br from-[#F0F7FF] to-[#E6F0FF] border border-[#3066BE]/20 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3">
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

                            {/* Skills - Improved */}
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

                            {/* Rating Display */}
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
                                onClick={toggleSave}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
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
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

// ============================================
// SEARCH MODAL (TABLET)
// ============================================
function SearchModal({ onClose, onSearch, onClear, initialTitle, initialLocation, initialSalary, initialPlan }) {
    const [localTitle, setLocalTitle] = useState(initialTitle || "");
    const [localLocation, setLocalLocation] = useState(initialLocation || "");
    const [localSalary, setLocalSalary] = useState(initialSalary || { min: "", max: "" });
    const [localPlan, setLocalPlan] = useState(initialPlan || "");

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[999] flex items-start md:items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-[94%] max-w-[920px] bg-white rounded-[20px] shadow-xl overflow-hidden mt-6 md:mt-0 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 bg-white text-[#3066BE]">
                    <X size={20} />
                </button>

                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-center text-[20px] md:text-[22px] font-semibold text-black">Поиск вакансий</h3>
                </div>

                <div className="px-6 py-5">
                    <div className="bg-[#F4F6FA] rounded-2xl p-4 md:p-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Должность"
                                value={localTitle}
                                onChange={(e) => setLocalTitle(e.target.value)}
                                className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent px-4 text-[14px] text-black placeholder:text-gray-400 outline-none focus:ring-0"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                            <div className="relative">
                                <select value={localLocation} onChange={(e) => setLocalLocation(e.target.value)} className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none">
                                    <option value="">Выберите регион</option>
                                    <option value="Узбекистан">Узбекистан</option>
                                    <option value="Россия">Россия</option>
                                    <option value="Турция">Турция</option>
                                </select>
                                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70" />
                            </div>

                            <div className="relative">
                                <select
                                    value={localSalary.min && localSalary.max ? `${localSalary.min}-${localSalary.max}` : ""}
                                    onChange={(e) => {
                                        const [min, max] = e.target.value.split("-");
                                        setLocalSalary({ min, max });
                                    }}
                                    className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none"
                                >
                                    <option value="">Выберите зарплату</option>
                                    <option value="500-1000">500-1000</option>
                                    <option value="1000-1500">1000-1500</option>
                                    <option value="1500-2000">1500-2000</option>
                                </select>
                                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70" />
                            </div>

                            <div className="relative">
                                <select value={localPlan} onChange={(e) => setLocalPlan(e.target.value)} className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none">
                                    <option value="">Premium</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Premium">Premium</option>
                                </select>
                                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 flex items-center justify-between">
                    <button onClick={onClear} className="h-[44px] px-5 rounded-[10px] border border-[#3066BE] text-[#3066BE] bg-white hover:bg-[#F5F8FF] transition">
                        Очистить все
                    </button>

                    <button
                        onClick={() => {
                            onSearch(localTitle, localLocation, localSalary, localPlan);
                            onClose();
                        }}
                        className="h-[44px] px-6 rounded-[10px] bg-[#3066BE] text-white font-medium hover:bg-[#2757a4] transition"
                    >
                        Поиск
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MOBILE VACANCY MODAL - IMPROVED DESIGN ✨
// ============================================
function MobileVacancyModal({ vacancy, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!vacancy?.id) return;
            try {
                setLoading(true);
                const res = await api.get(`/api/vacancies/jobposts/${vacancy.id}/`);
                setData(res.data);
                setIsSaved(res.data.is_saved);
                setIsApplied(res.data.is_applied);
            } catch (err) {
                console.error("Fetch detail error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();

        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [vacancy?.id]);

    const handleApply = async () => {
        if (isApplied) return;
        try {
            await api.post("/api/applications/apply/", { job_post: data.id, cover_letter: "" });
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

    const toggleSave = async () => {
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
            <div className="fixed inset-0 z-[110] bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-base text-[#3066BE] font-semibold">Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col overflow-hidden">

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
                        onClick={toggleSave}
                        className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                        <svg
                            className={`w-[18px] h-[18px] text-white ${isSaved ? "fill-white" : ""}`}
                            viewBox="0 0 24 24"
                            fill={isSaved ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>

                <h1 className="text-[20px] font-bold leading-[1.3] mb-2">
                    {data?.title || "Без названия"}
                </h1>

                <div className="flex items-center gap-3 text-white/90 text-[11px]">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {data?.created_at ? new Date(data.created_at).toLocaleDateString() : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {data?.location || "Не указано"}
                    </span>
                </div>
            </div>

            {/* ✅ BODY - Scrollable Content */}
            <main className="flex-1 min-h-0 overflow-y-auto bg-[#F9FAFB]">

                {/* Budget Card - Chiroyli */}
                <div className="mx-4 mt-4 mb-3 bg-gradient-to-br from-[#F0F7FF] to-[#E6F0FF] border border-[#3066BE]/20 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#3066BE]/10 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-[#3066BE]" />
                        </div>
                        <div>
                            <p className="text-[11px] text-[#6B7280] font-medium mb-0.5">Бюджет проекта</p>
                            <p className="text-[20px] font-bold text-[#3066BE]">
                                {data?.budget || "Не указано"}
                            </p>
                            <p className="text-[11px] text-[#6B7280] mt-0.5">
                                {data?.is_fixed_price ? "Фиксированная цена" : "Почасовая оплата"}
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
                            {data?.description || "Описание не указано"}
                        </p>
                    </section>

                    {/* Skills */}
                    {data?.skills?.length > 0 && (
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
                            О клиенте
                        </h2>

                        {/* Rating */}
                        {data?.average_stars > 0 && (
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
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Отправлено
                            </>
                        ) : (
                            "Откликнуться"
                        )}
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={toggleSave}
                        className={`w-[48px] h-[48px] rounded-xl transition-all duration-200 flex items-center justify-center border-2 ${
                            isSaved
                                ? "bg-[#3066BE] border-[#3066BE]"
                                : "bg-white border-[#3066BE]"
                        } active:scale-95`}
                    >
                        <svg
                            className={`w-5 h-5 ${isSaved ? "fill-white text-white" : "text-[#3066BE]"}`}
                            viewBox="0 0 24 24"
                            fill={isSaved ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function VacanciesPage() {
    const navigate = useNavigate();
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState({ min: "", max: "" });
    const [plan, setPlan] = useState("");
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const t = TEXTS.RU;

    useEffect(() => {
        api.get("/api/auth/me/").then((res) => setUser(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        api.get("/api/auth/profile/").then((res) => {
            const imagePath = res.data.profile_image;
            if (imagePath) {
                const baseURL = api.defaults.baseURL || "https://jobvacancy-api.duckdns.org";
                const imageUrl = imagePath.startsWith("http") ? imagePath : `${baseURL}${imagePath}`;
                setProfileImage(`${imageUrl}?t=${Date.now()}`);
                localStorage.setItem("profile_image", imageUrl);
            }
        }).catch(() => {});
    }, []);

    const fetchVacancies = async (page = 1) => {
        try {
            setLoading(true);
            const params = { page };
            if (title?.trim()) params.search = title;
            if (location) params.location = location;
            if (plan) params.plan = plan;
            if (salary?.min) params.salary_min = parseFloat(salary.min);
            if (salary?.max) params.salary_max = parseFloat(salary.max);

            const res = await api.get("/api/vacancies/jobposts/", { params });
            setVacancies(res.data.results || []);
            setTotalPages(Math.ceil((res.data.count || 1) / 10));
        } catch (err) {
            console.error("Fetch vacancies error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacancies(currentPage);
    }, [currentPage]);

    const handleSearch = () => fetchVacancies(1);

    const handleClear = () => {
        setTitle("");
        setLocation("");
        setSalary({ min: "", max: "" });
        setPlan("");
        setCurrentPage(1);
        fetchVacancies(1);
    };

    const handleRate = async (jobId, stars) => {
        try {
            await api.post(`/api/vacancies/jobposts/${jobId}/rate/`, { stars });
            const res = await api.get(`/api/vacancies/jobposts/${jobId}/`);
            setVacancies((prev) => prev.map((vac) => (vac.id === jobId ? res.data : vac)));
            toast.success("Baholandi! ✅");
        } catch (err) {
            toast.error("Baholashda xatolik.");
        }
    };

    const handleProfileRedirect = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Avval tizimga kiring!");
            navigate("/login");
            return;
        }
        navigate("/profile");
    };

    return (
        <>
            {/* ============================================ */}
            {/* DESKTOP VERSION (lg:) */}
            {/* ============================================ */}
            <div className="hidden lg:block font-sans relative bg-white">
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        <a href="/"><img src="/logo.png" alt="Logo" className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain" /></a>

                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">{t.community}</a>
                            <a href="/vacancies" className="text-[#3066BE] hover:text-[#3066BE] transition">{t.vacancies}</a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">{t.chat}</a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">{t.companies}</a>
                        </div>

                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            <ProfileDropdown />
                        </div>
                    </div>
                </nav>

                <div className="bg-white py-4 mt-[90px]">
                    <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                        <div className="w-[924px] h-[49px] bg-white rounded-md flex items-center px-4 ml-[258px] overflow-hidden">
                            <button onClick={handleSearch} className="w-[35px] h-[35px] flex items-center justify-center border-none bg-white text-black rounded-[5px] transition p-1">
                                <img src="/search.png" alt="search" className="w-[20px] h-[20px] object-contain z-10" />
                            </button>

                            <input type="text" placeholder="Должность" value={title} onChange={(e) => setTitle(e.target.value)} className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black placeholder:text-gray-700 focus:outline-none" />

                            <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black focus:outline-none">
                                <option value="">Выберите регион</option>
                                <option value="Узбекистан">Узбекистан</option>
                                <option value="Россия">Россия</option>
                                <option value="Турция">Турция</option>
                            </select>

                            <select
                                value={`${salary.min}-${salary.max}`}
                                onChange={(e) => {
                                    const [min, max] = e.target.value.split("-");
                                    setSalary({ min: parseFloat(min), max: parseFloat(max) });
                                }}
                                className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black focus:outline-none"
                            >
                                <option value="">Выберите зарплату</option>
                                <option value="500-1000">500-1000</option>
                                <option value="1000-1500">1000-1500</option>
                                <option value="1500-2000">1500-2000</option>
                            </select>

                            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black focus:outline-none">
                                <option value="">Выберите план</option>
                                <option value="Basic">Basic</option>
                                <option value="Pro">Pro</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="text-center font-extrabold text-[35px] leading-[150%] text-black mb-10">{t.vacancies}</h1>

                    <div className="mt-6">
                        <h2
                            onClick={() => {
                                if (!user) return toast.error("Пользователь не найден.");
                                if (user.role === "EMPLOYER") {
                                    navigate("/home");
                                } else if (user.role === "JOB_SEEKER") {
                                    toast.warn("Вы не можете создавать вакансии.");
                                } else {
                                    toast.info("Пожалуйста, войдите в систему.");
                                }
                            }}
                            className="text-[18px] leading-[150%] font-bold text-black mb-2 cursor-pointer hover:text-[#3066BE] transition-colors duration-200"
                        >
                            {t.publishVacancy}
                        </h2>
                        <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-6"></div>
                        <hr className="border-t border-[#D9D9D9] mb-6" />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* ✅ VACANCY CARDS - IMPROVED DESIGN */}
                        <div className="lg:w-2/3 w-full flex flex-col gap-5">
                            {vacancies.map((vacancy, index) => (
                                <div
                                    key={vacancy.id || index}
                                    className="bg-white rounded-[15px] border border-gray-200 p-6 hover:shadow-xl hover:border-[#3066BE]/30 transition-all duration-300 cursor-pointer group"
                                    onClick={() => setActiveModalIndex(index)}
                                >
                                    <div className="flex items-center text-[#AEAEAE] text-[13px] font-medium mb-3">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        <span>Опубликовано {timeAgo(vacancy.created_at)}</span>
                                    </div>

                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <h3 className="text-[22px] leading-[1.3] font-bold text-black group-hover:text-[#3066BE] transition-colors max-w-[70%]">
                                            {vacancy.title}
                                        </h3>

                                        <div className="flex items-center gap-1.5 shrink-0 bg-[#F0F7FF] px-3 py-1.5 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-[#3066BE]" />
                                            <span className="text-[18px] font-bold text-[#3066BE]">{vacancy.budget || "0"}</span>
                                        </div>
                                    </div>

                                    <p className="text-[15px] text-[#6B7280] leading-relaxed mb-4 line-clamp-2">
                                        {vacancy.description || "Описание отсутствует."}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {vacancy.skills?.length > 0 ? (
                                            vacancy.skills.slice(0, 5).map((tag, idx) => (
                                                <span key={idx} className="bg-[#F0F4FF] text-[#3066BE] px-3 py-1.5 rounded-full text-[13px] font-medium border border-[#3066BE]/20 hover:bg-[#3066BE] hover:text-white transition-colors">
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[#AEAEAE] text-[13px]">Навыки не указаны</span>
                                        )}
                                        {vacancy.skills?.length > 5 && (
                                            <span className="text-[#AEAEAE] text-[13px] px-2 py-1">+{vacancy.skills.length - 5} еще</span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <img src="/badge-background.svg" alt="bg" className="w-6 h-6" />
                                                <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[6px] left-[6px]" />
                                            </div>
                                            <span className="text-[14px] text-[#6B7280] font-medium">
                                                {vacancy.is_fixed_price ? "Fixed Price" : "Hourly Rate"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRate(vacancy.id, i + 1);
                                                    }}
                                                    className={`cursor-pointer transition-all hover:scale-110 ${i < (vacancy.average_stars || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 hover:fill-yellow-300"}`}
                                                />
                                            ))}
                                            <span className="ml-1 text-[13px] text-[#6B7280]">
                                                ({vacancy.average_stars?.toFixed(1) || "0.0"})
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-[#6B7280]" />
                                            <span className="text-[14px] text-[#6B7280] font-medium">{vacancy.location || "Remote"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ✅ USER PROFILE SIDEBAR - IMPROVED */}
                        <div className="lg:w-1/3 w-full">
                            <div className="sticky top-24">
                                <div className="bg-gradient-to-br from-white to-[#F8FAFF] border border-gray-200 rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative group cursor-pointer" onClick={handleProfileRedirect}>
                                            <img src={profileImage || "/user1.png"} className="w-[70px] h-[70px] rounded-full object-cover ring-4 ring-[#3066BE]/20 group-hover:ring-[#3066BE]/40 transition-all" alt="avatar" onError={(e) => { e.target.src = "/user1.png"; }} />
                                            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-all" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[17px] font-bold text-black truncate hover:text-[#3066BE] transition-colors cursor-pointer">
                                                {user ? formatName(user.full_name) : "Загрузка..."}
                                            </p>
                                            <p className="text-[14px] text-[#6B7280] mt-1 truncate">{user?.title || "Профессия не указана"}</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4" />

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[14px] text-[#6B7280] font-medium">Профиль заполнен</span>
                                            <span className="text-[16px] font-bold text-[#3066BE]">100%</span>
                                        </div>

                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#3066BE] to-[#4A90E2] rounded-full transition-all duration-500" style={{ width: "100%" }} />
                                        </div>

                                        <a onClick={handleProfileRedirect} className="flex items-center justify-between w-full px-4 py-3 bg-[#F0F7FF] hover:bg-[#E6F0FF] rounded-lg transition-colors cursor-pointer group">
                                            <span className="text-[14px] text-[#3066BE] font-medium group-hover:underline">Посмотреть профиль</span>
                                            <svg className="w-4 h-4 text-[#3066BE] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {activeModalIndex !== null && <VacancyModal vacancy={vacancies[activeModalIndex]} onClose={() => setActiveModalIndex(null)} />}

                <div className="w-full flex justify-center mt-6 mb-[64px]">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative transition ${currentPage === 1 ? "border-gray-300 opacity-50 cursor-not-allowed" : "border-[#3066BE] hover:bg-[#3066BE]/10 bg-white"}`}
                        >
                            <img src="/pagination.png" alt="prev" className="w-5 h-5 object-contain absolute z-10 rotate-180" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition ${currentPage === page ? "bg-[#3066BE] text-white border-[#3066BE]" : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#3066BE]/10"}`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative transition ${currentPage === totalPages ? "border-gray-300 opacity-50 cursor-not-allowed" : "border-[#3066BE] hover:bg-[#3066BE]/10 bg-white"}`}
                        >
                            <img src="/pagination.png" alt="next" className="w-5 h-5 object-contain absolute z-10" />
                        </button>
                    </div>
                </div>

                <footer className="w-full h-[393px] relative overflow-hidden">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                    <div className="relative z-20">
                        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                            <div className="flex gap-[190px]">
                                <div><h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">{t.logo}</h2></div>

                                <div className="grid grid-cols-2 gap-[184px]">
                                    <div className="flex flex-col gap-[20px]">
                                        {t.links.slice(0, 4).map((link, idx) => (
                                            <a key={idx} href="#" className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-[20px]">
                                        {t.links.slice(4).map((link, idx) => (
                                            <a key={idx} href="#" className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                            <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                                <p>{t.copyright}</p>
                                <div className="flex gap-[20px] text-[24px] mr-[38px]">
                                    <a href="#" className="text-white"><i className="fab fa-whatsapp hover:text-[#F2F4FD]"></i></a>
                                    <a href="#" className="text-white"><i className="fab fa-instagram hover:text-[#F2F4FD]"></i></a>
                                    <a href="#" className="text-white"><i className="fab fa-facebook hover:text-[#F2F4FD]"></i></a>
                                    <a href="#" className="text-white"><i className="fab fa-twitter hover:text-[#F2F4FD]"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ============================================ */}
            {/* TABLET VERSION (md:lg) */}
            {/* ============================================ */}
            <div className="hidden md:block lg:hidden">
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[960px] mx-auto flex items-center justify-between px-4 h-[90px]">
                        <a href="/"><img src="/logo.png" alt="Logo" className="w-[90px] h-[60px] object-contain" /></a>

                        <div className="flex gap-6 font-semibold text-[14px] tracking-wide">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">{t.community}</a>
                            <a href="/vacancies" className="text-[#3066BE]">{t.vacancies}</a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">{t.chat}</a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">{t.companies}</a>
                        </div>

                        <ProfileDropdown />
                    </div>
                </nav>

                <div className="bg-white mt-[90px] py-3">
                    <div className="mx-auto max-w-[960px] px-4">
                        <div className="flex justify-center">
                            <button onClick={() => setShowSearchModal(true)} className="max-w-[420px] h-[44px] w-[240px] rounded-lg bg-[#F4F6FA] border border-gray-200 text-[#6B7280] text-[14px] px-4 flex items-center gap-2 hover:bg-[#EFF3FA] transition">
                                <img src="/search.png" alt="" className="w-[18px] h-[18px] opacity-70" />
                                <span>Поиск вакансий</span>
                            </button>
                        </div>
                    </div>
                </div>

                {showSearchModal && (
                    <SearchModal
                        initialTitle={title}
                        initialLocation={location}
                        initialSalary={salary}
                        initialPlan={plan}
                        onClose={() => setShowSearchModal(false)}
                        onClear={handleClear}
                        onSearch={(newTitle, newLocation, newSalary, newPlan) => {
                            setTitle(newTitle);
                            setLocation(newLocation);
                            setSalary(newSalary);
                            setPlan(newPlan);
                            handleSearch();
                        }}
                    />
                )}

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-center font-extrabold text-[28px] leading-[140%] text-black mb-6">{t.vacancies}</h1>

                    <div className="mt-4">
                        <button
                            onClick={() => {
                                if (!user) return toast.error("Пользователь не найден. Войдите в систему.");
                                if (user.role === "JOB_SEEKER") {
                                    toast.warning("Вы не можете публиковать вакансии.");
                                } else if (user.role === "EMPLOYER") {
                                    window.location.href = "/profile";
                                } else {
                                    toast.info("Пожалуйста, войдите в систему.");
                                }
                            }}
                            className="bg-white text-black font-medium border-none text-[15px] px-6 py-2 rounded-md transition ml-[-26px]"
                        >
                            {t.publishVacancy}
                        </button>
                        <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-4"></div>
                        <hr className="border-t border-[#D9D9D9] mb-6" />
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="w-full flex flex-col gap-4">
                            {vacancies.map((vacancy, index) => (
                                <div
                                    key={vacancy.id || index}
                                    className="rounded-2xl bg-white border border-gray-200 p-4 hover:shadow-lg hover:border-[#3066BE]/30 transition-all duration-300 cursor-pointer group"
                                    onClick={() => setActiveModalIndex(index)}
                                >
                                    <div className="flex items-center text-[#AEAEAE] text-[12px] mb-2.5">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                        <span>{new Date(vacancy.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-start justify-between gap-3 mb-2.5">
                                        <h3 className="text-[18px] leading-[1.3] font-bold text-black group-hover:text-[#3066BE] transition-colors flex-1">
                                            {vacancy.title}
                                        </h3>

                                        <div className="flex items-center gap-1 shrink-0 bg-[#F0F7FF] px-2.5 py-1 rounded-lg">
                                            <span className="text-[#3066BE] text-[14px]">$</span>
                                            <span className="text-[16px] font-bold text-[#3066BE]">{vacancy.budget || "0"}</span>
                                        </div>
                                    </div>

                                    <p className="text-[14px] text-gray-500 mb-3 line-clamp-2">{vacancy.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {vacancy.skills?.slice(0, 4).map((tag, i) => (
                                            <span key={i} className="bg-[#F0F4FF] text-[#3066BE] px-2.5 py-1 rounded-full text-[12px] font-medium border border-[#3066BE]/20">
                                                {tag}
                                            </span>
                                        ))}
                                        {vacancy.skills?.length > 4 && (
                                            <span className="text-[#AEAEAE] text-[12px] px-2 py-1">+{vacancy.skills.length - 4}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-gray-100 text-[13px]">
                                        <div className="flex items-center gap-1.5">
                                            <div className="relative">
                                                <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                                <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[4px] left-[4px]" />
                                            </div>
                                            <span className="text-[#6B7280]">{vacancy.is_fixed_price ? "Fixed" : "Hourly"}</span>
                                        </div>

                                        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    onClick={(e) => { e.stopPropagation(); handleRate(vacancy.id, i + 1); }}
                                                    className={`cursor-pointer ${i < (vacancy.average_stars || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                                            <span className="text-[#6B7280]">{vacancy.location || "Remote"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {activeModalIndex !== null && <VacancyModal vacancy={vacancies[activeModalIndex]} onClose={() => setActiveModalIndex(null)} />}

                <div className="w-full flex justify-center mt-4 mb-12 px-4">
                    <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition ${currentPage === page ? "bg-[#3066BE] text-white border-[#3066BE]" : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#3066BE]/10"}`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <footer className="relative overflow-hidden md:block lg:hidden mt-[50px] w-full">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                    <div className="relative z-20 w-full px-6 py-8 text-white">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-[36px] font-black">{t.logo}</h2>

                            <div className="grid grid-cols-2 text-white gap-x-10 gap-y-3">
                                {t.links.slice(0, 4).map((link, i) => (
                                    <a key={`l-${i}`} href="#" className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors">
                                        <span>›</span> {link}
                                    </a>
                                ))}
                                {t.links.slice(4).map((link, i) => (
                                    <a key={`r-${i}`} href="#" className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors">
                                        <span>›</span> {link}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4 w-full">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <p className="text-[13px] leading-snug">{t.copyright}</p>

                                <div className="flex items-center gap-4 text-[20px]">
                                    <a href="#" className="text-white hover:opacity-90"><i className="fab fa-whatsapp" /></a>
                                    <a href="#" className="text-white hover:opacity-90"><i className="fab fa-instagram" /></a>
                                    <a href="#" className="text-white hover:opacity-90"><i className="fab fa-facebook" /></a>
                                    <a href="#" className="text-white hover:opacity-90"><i className="fab fa-twitter" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ============================================ */}
            {/* MOBILE VERSION (default) */}
            {/* ============================================ */}
            <div className="block md:hidden min-h-screen bg-white">
                {user ? <MobileNavbarLogin /> : <MobileNavbar />}

                <div className="mt-[60px]">
                    <div className="px-4 pt-3 flex items-center justify-between gap-3">
                        <button onClick={() => setShowSearchModal(true)} className="h-10 w-[143px] ml-[130px] rounded-2xl bg-[#F4F6FA] px-3 pr-4 flex items-center gap-3 active:scale-[.99]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
                            </svg>
                            <span className="text-[14px] text-black/70">ПОИСК...</span>
                        </button>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <h1 className="text-center font-extrabold text-2xl leading-[150%] text-black mb-6">{t.vacancies}</h1>

                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    if (!user) {
                                        alert("Сначала войдите в систему / Avval tizimga kiring");
                                        return;
                                    }
                                    if (user.role === "JOB_SEEKER") {
                                        alert("❗️Вы не можете публиковать вакансии (faqat ish beruvchilar uchun).");
                                    } else if (user.role === "EMPLOYER") {
                                        navigate("/profile");
                                    } else {
                                        alert("Bu amal siz uchun mavjud emas.");
                                    }
                                }}
                                className="mt-2 px-4 py-2 rounded-xl bg-white text-black text-[14px] font-semibold active:scale-95 transition ml-[-18px]"
                            >
                                {t.publishVacancy}
                            </button>
                            <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-4"></div>
                            <hr className="border-t border-[#D9D9D9] mb-4" />
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="w-full flex flex-col gap-3">
                                {vacancies.map((vacancy, index) => (
                                    <div
                                        key={vacancy.id || index}
                                        className="rounded-2xl bg-white border border-gray-200 p-3 active:scale-[0.99] transition-all shadow-sm"
                                        onClick={() => setActiveModalIndex(index)}
                                    >
                                        <div className="flex items-center text-black/45 text-[12px] mb-2">
                                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                                            <span>{new Date(vacancy.created_at).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="text-[17px] leading-[1.2] font-extrabold text-black flex-1">{vacancy.title}</h3>

                                            <div className="flex items-center gap-1 shrink-0 bg-[#E8F1FF] px-2 py-1 rounded-md">
                                                <span className="text-[#3066BE] text-[13px] font-bold">${vacancy.budget || "0"}</span>
                                            </div>
                                        </div>

                                        <p className="text-[14px] text-black/35 leading-[1.6] mb-3 line-clamp-2">{vacancy.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {vacancy.skills?.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="px-3 py-1.5 rounded-full bg-[#E5E5E5] text-[13px] text-black/90">{tag}</span>
                                            ))}
                                            {vacancy.skills?.length > 3 && (
                                                <span className="px-2 py-1.5 text-[13px] text-black/50">+{vacancy.skills.length - 3}</span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center text-[13px] text-black/55 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5 relative">
                                                <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                                <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[6px] left-[6px]" />
                                                {vacancy.is_fixed_price ? "Fixed" : "Hourly"}
                                            </div>

                                            <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        onClick={(e) => { e.stopPropagation(); handleRate(vacancy.id, i + 1); }}
                                                        className={`${i < (vacancy.average_stars || 0) ? "fill-[#FFC107] text-[#FFC107]" : "fill-[#E0E0E0] text-[#E0E0E0]"}`}
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>{vacancy.location || "Remote"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center mt-8 mb-20">
                        <div className="flex items-center gap-3">
                            {[...Array(totalPages)].map((_, i) => {
                                const num = i + 1;
                                return (
                                    <button
                                        key={num}
                                        onClick={() => setCurrentPage(num)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-[15px] font-semibold transition-all duration-200 ${num === currentPage ? "bg-[#3066BE] border-[#3066BE] text-white" : "bg-white border-[#3066BE] text-[#3066BE] hover:bg-[#3066BE] hover:text-white"}`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {activeModalIndex !== null && <MobileVacancyModal vacancy={vacancies[activeModalIndex]} onClose={() => setActiveModalIndex(null)} />}

                {showSearchModal && (
                    <SearchModal
                        initialTitle={title}
                        initialLocation={location}
                        initialSalary={salary}
                        initialPlan={plan}
                        onClose={() => setShowSearchModal(false)}
                        onSearch={(newTitle, newLocation, newSalary, newPlan) => {
                            setTitle(newTitle);
                            setLocation(newLocation);
                            setSalary(newSalary);
                            setPlan(newPlan);
                            handleSearch();
                        }}
                        onClear={handleClear}
                    />
                )}

                <MobileFooter />
            </div>
        </>
    );
}