import React, { useEffect, useState, useMemo } from "react";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter";
import FilterModalMobile from "./CompaniesFilterFullModal.jsx";
import VacancyDetailsModalMobile from "./VacancyDetailsModalMobile";
import { MapPin, Bell, Bookmark } from "lucide-react";
import api from "../../utils/api";
import axios from "axios";

export default function VacanciesPageMobile() {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [detailsVacancy, setDetailsVacancy] = useState(null);
    const [activeModalIndex, setActiveModalIndex] = useState(null);

    // filters
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState({ min: "", max: "" });
    const [plan, setPlan] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);

    const currentPage = 1; // mobilda hozircha 1 sahifa (paginationsiz); kerak bo‘lsa qo‘shamiz

    // Fetch vacancies
    useEffect(() => {
        let alive = true;
        setLoading(true);
        api
            .get(`/api/vacancies/jobposts/?page=${currentPage}`)
            .then((res) => {
                if (!alive) return;
                setVacancies(res.data.results || res.data || []);
            })
            .catch((e) => console.error(e))
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
    }, []);

    // Apply search from modal
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

            const res = await axios.get("http://localhost:8000/api/vacancies/jobposts/", { params });
            setVacancies(res.data.results || res.data || []);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Qidiruvda xatolik:", err);
        }
    };

    const openDetails = (v) => setDetailsVacancy(v);
    const closeDetails = () => setDetailsVacancy(null);

    const handleRate = async (jobId, stars) => {
        try {
            await api.post(`/api/vacancies/jobposts/${jobId}/rate/`, { stars });
            const res = await api.get(`/api/vacancies/jobposts/${jobId}/`);
            const updated = res.data;
            setVacancies((prev) => prev.map((x) => (x.id === jobId ? updated : x)));
            if (detailsVacancy?.id === jobId) setDetailsVacancy(updated);
        } catch (e) {
            console.error("Baholashda xatolik:", e);
        }
    };

    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const langCode = selectedLang?.code === "GB" ? "EN" : (selectedLang?.code || "RU");

    const texts = {
        RU: {
            community: "Сообщество", vacancies: "Вакансии", chat: "Чат", companies: "Компании",
            keyword: "Ключевое слово:", position: "Должность", location: "Местоположение:",
            selectRegion: "Выберите регион", salary: "Зарплата:", selectSalary: "Выберите зарплату",
            plan: "План:", premium: "Выберите план", applicants: "2000 + соискателей, 200 + компаний, 100 + работодателей",
            resume: "ОСТАВЬТЕ РЕЗЮМЕ & ПОЛУЧИТЕ ЖЕЛАЕМУЮ РАБОТУ!", login: "Войти",
            categories: "Выбрать по категории", search: "Поиск...",
            published: "Опубликовано 2 часа назад",
            needed: "Нужен графический дизайнер",
            budget: "Бюджет: 100$-200$",
            description: "Мы ищем художников, которые помогут нам исправить визуализации упаковки, созданные с помощью ИИ. В частности, мы хотим исправить логотипы на каждом рендере. У нас есть большой набор данных логотипов + изображений, созданных с помощью ИИ.",
            tags: ["Лого дизайн", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Платеж подтвержден",
            location_vacancy: "Узбекистан",
            recommendedVacancies: "Рекомендуемые вакансии",
            publishVacancy: "Опубликовать вакансию",
            logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО",
                "Инвесторам", "Каталог компаний", "Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            createSite: "Создание сайтов",
            viewMore: "Посмотреть все →"
        },
        UZ: {
            community: "Jamiyat", vacancies: "Vakansiyalar", chat: "Chat", companies: "Kompaniyalar",
            keyword: "Kalit so'z:", position: "Lavozim", location: "Joylashuv:",
            selectRegion: "Hududni tanlang", salary: "Maosh:", selectSalary: "Maoshni tanlang",
            plan: "Reja:", premium: "Rejani tanlang", applicants: "2000 + nomzodlar, 200 + kompaniyalar, 100 + ish beruvchilar",
            resume: "REZYUMENI QOLDIRING & ISTALGAN ISHNI OLING!", login: "Kirish",
            categories: "Kategoriyani tanlang", search: "Qidiruv...",
            published: "2 soat oldin e'lon qilindi",
            needed: "Grafik dizayner kerak",
            budget: "Byudjet: 100$-200$",
            description: "Sun'iy intellekt yordamida yaratilgan qadoqlash vizualizatsiyasini tuzatishga yordam beradigan rassomlarni izlayapmiz. Xususan, biz har bir renderdagi logotiplarni to‘g‘rilamoqchimiz. Bizda sun'iy intellekt bilan yaratilgan katta logotiplar + tasvirlar bazasi bor.",
            tags: ["Logo dizayn", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "To‘lov tasdiqlangan",
            location_vacancy: "O‘zbekiston",
            recommendedVacancies: "Tavsiya etilgan vakansiyalar",
            publishVacancy: "Vakansiya e’lon qilish",
            logo: "Logo",
            links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari",
                "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo‘yicha ishlar"],
            copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            createSite: "Sayt yaratish",
            viewMore: "Hammasini ko‘rish →"
        },
        EN: {
            community: "Community", vacancies: "Vacancies", chat: "Chat", companies: "Companies",
            keyword: "Keyword:", position: "Position", location: "Location:",
            selectRegion: "Select region", salary: "Salary:", selectSalary: "Select salary",
            plan: "Plan:", premium: "Select plan", applicants: "2000+ applicants, 200+ companies, 100+ employers",
            resume: "LEAVE A RESUME & GET THE JOB YOU WANT!", login: "Login",
            categories: "Choose by category", search: "Search...",
            published: "Published 2 hours ago",
            needed: "Graphic designer needed",
            budget: "Budget: $100-$200",
            description: "We are looking for artists to help fix packaging visualizations created with AI. Specifically, we want to fix the logos on each render. We have a large dataset of logos + images created with AI.",
            tags: ["Logo design", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Payment verified",
            location_vacancy: "Uzbekistan",
            recommendedVacancies: "Recommended vacancies",
            publishVacancy: "Publish a vacancy",
            logo: "Logo",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements",
                "For Investors", "Company Catalog", "Jobs by Profession"],
            copyright: "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            createSite: "Website creation",
            viewMore: "View all →"
        }
    };


    return (
        <>

        {activeModalIndex !== null && (
            <VacancyDetailsModalMobile
                open={true}
                onClose={() => setActiveModalIndex(null)}
                vacancy={vacancies[activeModalIndex]}
                company={{
                    // ixtiyoriy, bo‘sh qoldirsangiz ham ishlaydi
                    name: vacancies[activeModalIndex]?.company_name,
                    logo: vacancies[activeModalIndex]?.company_logo,
                    total_jobs: vacancies[activeModalIndex]?.company_total_jobs,
                    hire_rate: vacancies[activeModalIndex]?.company_hire_rate,
                    open_jobs: vacancies[activeModalIndex]?.company_open_jobs,
                    rating_text: vacancies[activeModalIndex]?.company_rating_text,
                    rating_count: vacancies[activeModalIndex]?.company_rating_count,
                    city_time: vacancies[activeModalIndex]?.company_city_time,
                }}
            />
        )}

        <div className="min-h-screen bg-white">
            <MobileNavbar title="Vakansiyalar" />

            <div className="flex items-center justify-end gap-4">
                {/* Bell with badge */}
                <button
                    className="w-10 h-10 flex items-center justify-center border-none rounded-full bg-white text-black"
                    aria-label="Notifications"
                >
                    <div className="relative">
                        <Bell className="w-5 h-5" />
                        <span
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-semibold z-10"
                        >
                          1
                        </span>
                    </div>
                </button>

            </div>

            {/* Search bar — like input + separate filter icon */}
            <div className="px-4 pt-3 flex items-center justify-between gap-3">
                {/* Pill (looks like input, opens modal) */}
                <button
                    onClick={() => setShowFilter(true)}
                    className="h-10 w-[143px] ml-[116px] rounded-2xl bg-[#F4F6FA] px-3 pr-4 flex items-center gap-3 active:scale-[.99] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                    aria-label="Open search"
                >
                    {/* left icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/>
                    </svg>

                    <span className="text-[14px] text-black/70">ПОИСК...</span>
                </button>
            </div>

            {/* Active filter chips (qoladi) */}
            <div className="flex flex-wrap gap-2 mt-3 px-4">
                {title ? (
                    <span className="text-[12px] px-3 py-1 rounded-full bg-[#EAF0FF] border border-[#3066BE]/30">{title}</span>
                ) : null}
                {location ? (
                    <span className="text-[12px] px-3 py-1 rounded-full bg-[#EAF0FF] border border-[#3066BE]/30">{location}</span>
                ) : null}
                {salary?.min || salary?.max ? (
                    <span className="text-[12px] px-3 py-1 rounded-full bg-[#EAF0FF] border border-[#3066BE]/30">
      ${salary?.min || 0}–${salary?.max || "∞"}
    </span>
                ) : null}
                {plan ? (
                    <span className="text-[12px] px-3 py-1 rounded-full bg-[#EAF0FF] border border-[#3066BE]/30">{plan}</span>
                ) : null}
            </div>

            {/* ==========================
        VACANCY SECTION (responsive, mobile-first)
========================== */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                <h1 className="text-center font-extrabold text-2xl md:text-[35px] leading-[150%] text-black mb-6 md:mb-10">
                    {texts[selectedLang.code].vacancies}
                </h1>

                <div className="mt-4 md:mt-6">
                    <h2 className="text-[16px] md:text-[18px] leading-[150%] font-bold text-black mb-2">
                        {texts[selectedLang.code].publishVacancy}
                    </h2>
                    <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-4 md:mb-6"></div>
                    <hr className="border-t border-[#D9D9D9] mb-4 md:mb-6" />
                </div>

                {/* Main flex: chap (card), o‘ng (profil) */}
                <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
                    {/* Chap: Vakansiya Card */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-3 md:gap-6">
                        {vacancies.map((vacancy, index) => (
                            <div
                                key={vacancy.id || index}
                                className="rounded-2xl border border-black/10 md:border-0 md:shadow p-3 md:p-6 hover:shadow-lg transition"
                            >
                                {/* Vaqt */}
                                <div className="flex items-center text-black/45 text-[12px] md:text-sm mb-2 md:mb-2.5">
                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(vacancy.created_at).toLocaleDateString()}
                                </div>

                                {/* Sarlavha + byudjet */}
                                <div className="flex flex-col gap-0.5 md:ml-[-28px]">
                                    <button
                                        onClick={() => setActiveModalIndex(index)}
                                        className="text-[17px] md:text-2xl border-none leading-[1.2] bg-white font-extrabold md:mt-[-10px] text-black text-left hover:text-[#3066BE] transition-colors"
                                    >
                                        <p className="ml-[-22px]">{vacancy.title}</p>
                                    </button>
                                    <p className="text-[12px] md:text-sm text-black/55 md:ml-[27px] mb-[6px] md:mb-[10px]">
                                        ${vacancy.budget_min} - ${vacancy.budget_max}
                                    </p>
                                </div>

                                {/* Tavsif */}
                                <p className="text-[14px] md:text-[15px] text-black/35 md:text-gray-400 leading-[1.6] md:mb-4 mb-3 line-clamp-2 md:line-clamp-none">
                                    {vacancy.description}
                                </p>

                                {/* Teglar */}
                                <div className="flex flex-wrap gap-2.5 md:gap-2.5 mb-3 md:mb-4">
                                    {vacancy.skills?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-3.5 py-1.5 rounded-full bg-[#E5E5E5] text-[13px] md:text-sm text-black/90"
                                        >
                                          {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Pastki qator */}
                                <div className="flex justify-between items-center text-[13px] md:text-sm text-black/55 md:text-gray-400 mt-3">
                                    {/* To‘lov turi */}
                                    <div className="flex items-center gap-2 relative">
                                        <img src="/badge-background.svg" alt="bg" className="w-5 h-5 md:w-6 md:h-6" />
                                        <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[6px] left-[6px]" />
                                        {vacancy.is_fixed_price ? "Fixed" : "Hourly"}
                                    </div>

                                    {/* Yulduzlar */}
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                onClick={() => handleRate(vacancy.id, i + 1)}
                                                className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer transition ${
                                                    i < (vacancy.average_stars || 0) ? "fill-[#FFC107]" : "fill-[#E0E0E0]"
                                                }`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Lokatsiya */}
                                    <div className="flex items-center gap-1.5">
                                        <img src="/location.png" alt="location" className="w-4 h-4 md:w-5 md:h-5" />
                                        {vacancy.location || "Remote"}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <MobileFooter />

            {/* MODALS as full pages */}
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
