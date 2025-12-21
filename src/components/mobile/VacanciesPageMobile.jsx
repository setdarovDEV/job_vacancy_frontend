// src/pages/mobile/VacanciesPageMobile.jsx - MOBILE VERSION
import React, { useEffect, useState } from "react";
import { Clock, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter";
import FilterModalMobile from "./CompaniesFilterFullModal.jsx";
import VacancyDetailsModalMobile from "./VacancyDetailsModalMobile";
import api from "../../utils/api";

export default function VacanciesPageMobile() {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    // filters
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState({ min: "", max: "" });
    const [plan, setPlan] = useState("");
    const [user, setUser] = useState(null);

    const texts = {
        RU: {
            vacancies: "Вакансии",
            publishVacancy: "Опубликовать вакансию",
            logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
        },
    };

    useEffect(() => {
        let alive = true;
        setLoading(true);

        api.get(`/api/vacancies/jobposts/?page=${currentPage}`)
            .then((res) => {
                if (!alive) return;
                setVacancies(res.data.results || []);
                if (res.data.count) {
                    setTotalPages(Math.ceil(res.data.count / 10));
                }
            })
            .catch((e) => console.error(e))
            .finally(() => alive && setLoading(false));

        return () => { alive = false; };
    }, [currentPage]);

    const handlePageChange = (num) => {
        if (num >= 1 && num <= totalPages) {
            setCurrentPage(num);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleApplyFilters = async (vals) => {
        setShowFilter(false);
        setTitle(vals.title ?? "");
        setLocation(vals.location ?? "");
        setSalary(vals.salary ?? { min: "", max: "" });
        setPlan(vals.plan ?? "");

        try {
            const params = {};
            if (vals.title?.trim()) params.search = vals.title;
            if (vals.location) params.location = vals.location;
            if (vals.plan) params.plan = vals.plan;
            if (vals.salary?.min) params.salary_min = parseFloat(vals.salary.min);
            if (vals.salary?.max) params.salary_max = parseFloat(vals.salary.max);

            const res = await api.get("/api/vacancies/jobposts/", { params });
            setVacancies(res.data.results || res.data || []);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Qidiruvda xatolik:", err);
        }
    };

    const handleRate = async (jobId, stars) => {
        try {
            await api.post(`/api/vacancies/jobposts/${jobId}/rate/`, { stars });
            const res = await api.get(`/api/vacancies/jobposts/${jobId}/`);
            const updated = res.data;
            setVacancies((prev) => prev.map((x) => (x.id === jobId ? updated : x)));
        } catch (e) {
            console.error("Baholashda xatolik:", e);
        }
    };

    useEffect(() => {
        api.get("/api/auth/me/").then((res) => setUser(res.data)).catch(() => {});
    }, []);

    const handlePublishClick = () => {
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
    };

    return (
        <>
            {activeModalIndex !== null && (
                <VacancyDetailsModalMobile
                    open={true}
                    onClose={() => setActiveModalIndex(null)}
                    vacancy={vacancies[activeModalIndex]}
                />
            )}

            <div className="min-h-screen bg-white">
                <MobileNavbar title="Vakansiyalar" />

                {/* Search bar */}
                <div className="px-4 pt-3 flex items-center mt-[20px] justify-between gap-3">
                    <button
                        onClick={() => setShowFilter(true)}
                        className="h-10 w-[143px] ml-[130px] rounded-2xl bg-[#F4F6FA] px-3 pr-4 flex items-center gap-3 active:scale-[.99] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                        aria-label="Open search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
                        </svg>
                        <span className="text-[14px] text-black/70">ПОИСК...</span>
                    </button>
                </div>

                {/* Active filter chips */}
                <div className="flex flex-wrap gap-2 mt-3 px-4">
                    {title ? (<span className="text-[12px] px-3 py-1 rounded-full bg-[#EAF0FF] border border-[#3066BE]/30">{title}</span>) : null}
                    {location ? (<span className="text-[12px] px-3 py-1 rounded-full bg-[#EAF0FF] border border-[#3066BE]/30">{location}</span>) : null}
                    {salary?.min || salary?.max ? (<span className="text-[12px] px-3 py-1 rounded-full bg-[#EAF0FF] border border-[#3066BE]/30">${salary?.min || 0}–${salary?.max || "∞"}</span>) : null}
                    {plan ? (<span className="text-[12px] px-3 py-1 rounded-full bg-[#EAF0FF] border border-[#3066BE]/30">{plan}</span>) : null}
                </div>

                {/* VACANCY SECTION */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                    <h1 className="text-center font-extrabold text-2xl md:text-[35px] leading-[150%] text-black mb-6 md:mb-10">
                        {texts.RU.vacancies}
                    </h1>

                    <div className="mt-4 md:mt-6">
                        <button
                            onClick={handlePublishClick}
                            className="mt-2 px-4 py-2 rounded-xl bg-white text-black text-[14px] font-semibold active:scale-95 transition ml-[-18px]"
                        >
                            {texts.RU.publishVacancy}
                        </button>
                        <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-4 md:mb-6"></div>
                        <hr className="border-t border-[#D9D9D9] mb-4 md:mb-6" />
                    </div>

                    {/* ✅ IMPROVED VACANCY CARDS - MOBILE */}
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
                        <div className="w-full lg:w-2/3 flex flex-col gap-3 md:gap-6">
                            {vacancies.map((vacancy, index) => (
                                <div
                                    key={vacancy.id || index}
                                    className="rounded-2xl bg-white border border-gray-200 p-3 active:scale-[0.99] transition-all shadow-sm"
                                    onClick={() => setActiveModalIndex(index)}
                                >
                                    {/* Date */}
                                    <div className="flex items-center text-black/45 text-[12px] mb-2">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                        <span>{new Date(vacancy.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Title + Budget */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-[17px] leading-[1.2] font-extrabold text-black flex-1">
                                            {vacancy.title}
                                        </h3>

                                        <div className="flex items-center gap-1 shrink-0 bg-[#E8F1FF] px-2 py-1 rounded-md">
                                            <span className="text-[#3066BE] text-[13px] font-bold">
                                                ${vacancy.budget || "0"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[14px] text-black/35 leading-[1.6] mb-3 line-clamp-2">
                                        {vacancy.description}
                                    </p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {vacancy.skills?.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-full bg-[#E5E5E5] text-[13px] text-black/90">
                                                {tag}
                                            </span>
                                        ))}
                                        {vacancy.skills?.length > 3 && (
                                            <span className="px-2 py-1.5 text-[13px] text-black/50">
                                                +{vacancy.skills.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* Footer */}
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

                {/* Pagination */}
                <div className="w-full flex justify-center mt-8 mb-20">
                    <div className="flex items-center gap-3">
                        {[...Array(totalPages)].map((_, i) => {
                            const num = i + 1;
                            return (
                                <button
                                    key={num}
                                    onClick={() => handlePageChange(num)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-[15px] font-semibold transition-all duration-200 ${num === currentPage ? "bg-[#3066BE] border-[#3066BE] text-white" : "bg-white border-[#3066BE] text-[#3066BE] hover:bg-[#3066BE] hover:text-white"}`}
                                >
                                    {num}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-[#3066BE] transition ${currentPage === totalPages ? "opacity-40 cursor-not-allowed border-[#B0C4DE]" : "hover:bg-[#3066BE] hover:text-white border-[#3066BE]"}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <MobileFooter />

                <FilterModalMobile
                    open={showFilter}
                    onClose={() => setShowFilter(false)}
                    onApply={handleApplyFilters}
                    initial={{ title, location, salary, plan }}
                />
            </div>
        </>
    );
}