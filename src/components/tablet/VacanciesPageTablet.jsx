// src/pages/tablet/VacancyPageTablet.jsx - TABLET VERSION
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronDown, Clock, MapPin, Star } from 'lucide-react';
import { toast } from "react-toastify";
import VacancyModal from "../tablet/VacancyTabletModal.jsx";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";
import api from "../../utils/api";

// ============================================
// SEARCH MODAL
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
// MAIN COMPONENT - TABLET
// ============================================
export default function VacancyPageTablet() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState({ min: "", max: "" });
    const [plan, setPlan] = useState("");
    const [vacancies, setVacancies] = useState([]);
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [user, setUser] = useState(null);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const texts = {
        RU: {
            vacancies: "Вакансии",
            publishVacancy: "Опубликовать вакансию",
            logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
        },
    };

    const loadVacancies = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const params = {};

            if (title?.trim()) params.search = title.trim();
            if (location) params.location = location;
            if (plan) params.plan = plan;
            if (salary?.min) params.salary_min = parseFloat(salary.min);
            if (salary?.max) params.salary_max = parseFloat(salary.max);
            params.page = Number(pageNumber);

            const res = await api.get("/api/vacancies/jobposts/", { params });
            const data = res.data;

            const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];

            setVacancies(results);
            const count = data?.count || results.length;
            setTotalPages(Math.ceil(count / 10));
            setCurrentPage(Number(pageNumber));
        } catch (e) {
            console.error("❌ Vakansiyalarni olishda xatolik:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVacancies(currentPage);
    }, [currentPage]);

    const handleRate = async (jobId, stars) => {
        try {
            await api.post(`/api/vacancies/jobposts/${jobId}/rate/`, { stars });
            const res = await api.get(`/api/vacancies/jobposts/${jobId}/`);
            const updated = res.data;
            setVacancies(prev => prev.map((vac) => (vac.id === jobId ? updated : vac)));
            toast.success("Baholandi! ✅");
        } catch (err) {
            toast.error("Baholashda xatolik.");
        }
    };

    useEffect(() => {
        api.get("/api/auth/me/").then((res) => setUser(res.data)).catch(() => {});
    }, []);

    const handleSearch = () => loadVacancies(1);

    const handleClear = useCallback(() => {
        setTitle("");
        setLocation("");
        setSalary({ min: "", max: "" });
        setPlan("");
        setCurrentPage(1);
        loadVacancies(1);
    }, []);

    return (
        <>
            <NavbarTabletLogin />

            <div className="bg-white md:mt-[90px] md:block mr-[10px] lg:hidden">
                <div className="mx-auto max-w-[960px] px-4 py-3 mt-[-80px]">
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowSearchModal(true)}
                            className="max-w-[420px] h-[44px] w-[240px] rounded-lg bg-[#F4F6FA] border border-gray-200 text-[#6B7280] text-[14px] px-4 flex items-center gap-2 hover:bg-[#EFF3FA] transition"
                        >
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
                <h1 className="text-center font-extrabold text-[28px] leading-[140%] text-black mb-6">{texts.RU.vacancies}</h1>

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
                        {texts.RU.publishVacancy}
                    </button>
                    <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-4"></div>
                    <hr className="border-t border-[#D9D9D9] mb-6" />
                </div>

                {/* ✅ IMPROVED VACANCY CARDS - TABLET */}
                <div className="flex flex-col gap-8">
                    <div className="w-full flex flex-col gap-4">
                        {vacancies.map((vacancy, index) => (
                            <div
                                key={vacancy.id || index}
                                className="rounded-2xl bg-white border border-gray-200 p-4 hover:shadow-lg hover:border-[#3066BE]/30 transition-all duration-300 cursor-pointer group"
                                onClick={() => setActiveModalIndex(index)}
                            >
                                {/* Date */}
                                <div className="flex items-center text-[#AEAEAE] text-[12px] mb-2.5">
                                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                                    <span>{new Date(vacancy.created_at).toLocaleDateString()}</span>
                                </div>

                                {/* Title + Budget */}
                                <div className="flex items-start justify-between gap-3 mb-2.5">
                                    <h3 className="text-[18px] leading-[1.3] font-bold text-black group-hover:text-[#3066BE] transition-colors flex-1">
                                        {vacancy.title}
                                    </h3>

                                    <div className="flex items-center gap-1 shrink-0 bg-[#F0F7FF] px-2.5 py-1 rounded-lg">
                                        <span className="text-[#3066BE] text-[14px]">$</span>
                                        <span className="text-[16px] font-bold text-[#3066BE]">
                                            {vacancy.budget || "0"}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[14px] text-gray-500 mb-3 line-clamp-2">
                                    {vacancy.description}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {vacancy.skills?.slice(0, 4).map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-[#F0F4FF] text-[#3066BE] px-2.5 py-1 rounded-full text-[12px] font-medium border border-[#3066BE]/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {vacancy.skills?.length > 4 && (
                                        <span className="text-[#AEAEAE] text-[12px] px-2 py-1">
                                            +{vacancy.skills.length - 4}
                                        </span>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-gray-100 text-[13px]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="relative">
                                            <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                            <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[4px] left-[4px]" />
                                        </div>
                                        <span className="text-[#6B7280]">
                                            {vacancy.is_fixed_price ? "Fixed" : "Hourly"}
                                        </span>
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

            {activeModalIndex !== null && (
                <VacancyModal
                    vacancy={vacancies[activeModalIndex]}
                    onClose={() => setActiveModalIndex(null)}
                />
            )}

            {/* Pagination */}
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

            {/* Footer */}
            <footer className="relative overflow-hidden md:block lg:hidden mt-[50px] w-full">
                <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                <div className="relative z-20 w-full px-6 py-8 text-white">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[36px] font-black">{texts.RU.logo}</h2>

                        <div className="grid grid-cols-2 text-white gap-x-10 gap-y-3">
                            {texts.RU.links.slice(0, 4).map((link, i) => (
                                <a key={`l-${i}`} href="#" className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors">
                                    <span>›</span> {link}
                                </a>
                            ))}
                            {texts.RU.links.slice(4).map((link, i) => (
                                <a key={`r-${i}`} href="#" className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors">
                                    <span>›</span> {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[13px] leading-snug">{texts.RU.copyright}</p>

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
        </>
    );
}