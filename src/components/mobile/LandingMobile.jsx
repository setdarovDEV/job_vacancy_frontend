// src/components/mobile/LandingMobile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import api from "../../utils/api";
import MobileNavbarLogin from "./MobileNavbarLogin";

export default function LandingMobile() {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [openMenu, setOpenMenu] = useState(false);
    const [openLang, setOpenLang] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [savedJobs, setSavedJobs] = useState({});

    // ==========================
    // SEARCH FORM STATE
    // ==========================
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // ==========================
    // VACANCIES STATE
    // ==========================
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingVacancies, setLoadingVacancies] = useState(true);
    const [totalVacanciesCount, setTotalVacanciesCount] = useState(0);

    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    const toggleSave = (i) => setSavedJobs(s => ({ ...s, [i]: !s[i] }));

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
            description: "Мы ищем художников, которые помогут нам исправить визуализации упаковки, созданные с помощью ИИ.",
            tags: ["Лого дизайн", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Платеж подтвержден",
            location_vacancy: "Узбекистан",
            recommendedVacancies: "Рекомендуемые вакансии",
            publishVacancy: "Опубликовать вакансию",
            logo: "Logo",
            ctaTitle: "Найдите работу своей мечты сегодня.",
            fillResume: "Заполнить резюме",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО",
                "Инвесторам", "Каталог компаний", "Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            createSite: "Создание сайтов",
            viewMore: "Посмотреть все →",
            noVacancies: "Вакансии не найдены",
            loadingError: "Ошибка загрузки вакансий"
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
            description: "Sun'iy intellekt yordamida yaratilgan qadoqlash vizualizatsiyasini tuzatishga yordam beradigan rassomlarni izlayapmiz.",
            tags: ["Logo dizayn", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "To'lov tasdiqlangan",
            location_vacancy: "O'zbekiston",
            recommendedVacancies: "Tavsiya etilgan vakansiyalar",
            publishVacancy: "Vakansiya e'lon qilish",
            logo: "Logo",
            ctaTitle: "Bugun orzuingizdagi ishni toping.",
            fillResume: "Rezyume to'ldirish",
            links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari",
                "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo'yicha ishlar"],
            copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            createSite: "Sayt yaratish",
            viewMore: "Hammasini ko'rish →",
            noVacancies: "Vakansiyalar topilmadi",
            loadingError: "Vakansiyalarni yuklashda xatolik"
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
            description: "We are looking for artists to help fix packaging visualizations created with AI.",
            tags: ["Logo design", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Payment verified",
            location_vacancy: "Uzbekistan",
            recommendedVacancies: "Recommended vacancies",
            publishVacancy: "Publish a vacancy",
            logo: "Logo",
            ctaTitle: "Find your dream job today.",
            fillResume: "Fill resume",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements",
                "For Investors", "Company Catalog", "Jobs by Profession"],
            copyright: "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            createSite: "Website creation",
            viewMore: "View all →",
            noVacancies: "No vacancies found",
            loadingError: "Error loading vacancies"
        }
    };

    // Categories with realistic counts
    const getCategoriesTexts = () => {
        const categoryCounts = {
            accounting: 45, education: 89, mechanical: 34, legal: 67,
            healthcare: 52, it: 156, engineering: 78, legal2: 41
        };

        const formatCount = (count, lang) => {
            if (lang === "RU") return `${count} открытых вакансий`;
            if (lang === "UZ") return `${count} ta ochiq ish o'rni`;
            return `${count} open vacancies`;
        };

        return {
            RU: [
                { title: "Бухгалтерия", vacancies: formatCount(categoryCounts.accounting, "RU") },
                { title: "Образование", vacancies: formatCount(categoryCounts.education, "RU") },
                { title: "Машиностроение", vacancies: formatCount(categoryCounts.mechanical, "RU") },
                { title: "Юридический", vacancies: formatCount(categoryCounts.legal, "RU") },
                { title: "Здравоохранение", vacancies: formatCount(categoryCounts.healthcare, "RU") },
                { title: "IT & Агентство", vacancies: formatCount(categoryCounts.it, "RU") },
                { title: "Инжиниринг", vacancies: formatCount(categoryCounts.engineering, "RU") },
                { title: "Юридический", vacancies: formatCount(categoryCounts.legal2, "RU") }
            ],
            UZ: [
                { title: "Buxgalteriya", vacancies: formatCount(categoryCounts.accounting, "UZ") },
                { title: "Ta'lim", vacancies: formatCount(categoryCounts.education, "UZ") },
                { title: "Mashinasozlik", vacancies: formatCount(categoryCounts.mechanical, "UZ") },
                { title: "Yuridik", vacancies: formatCount(categoryCounts.legal, "UZ") },
                { title: "Sog'liqni saqlash", vacancies: formatCount(categoryCounts.healthcare, "UZ") },
                { title: "IT & Agentlik", vacancies: formatCount(categoryCounts.it, "UZ") },
                { title: "Muhandislik", vacancies: formatCount(categoryCounts.engineering, "UZ") },
                { title: "Yuridik", vacancies: formatCount(categoryCounts.legal2, "UZ") }
            ],
            EN: [
                { title: "Accounting", vacancies: formatCount(categoryCounts.accounting, "EN") },
                { title: "Education", vacancies: formatCount(categoryCounts.education, "EN") },
                { title: "Mechanical Eng.", vacancies: formatCount(categoryCounts.mechanical, "EN") },
                { title: "Legal", vacancies: formatCount(categoryCounts.legal, "EN") },
                { title: "Healthcare", vacancies: formatCount(categoryCounts.healthcare, "EN") },
                { title: "IT & Agency", vacancies: formatCount(categoryCounts.it, "EN") },
                { title: "Engineering", vacancies: formatCount(categoryCounts.engineering, "EN") },
                { title: "Legal", vacancies: formatCount(categoryCounts.legal2, "EN") }
            ]
        };
    };

    const optionsRegion = [
        { value: "tashkent", label: "Ташкент" },
        { value: "samarkand", label: "Самарканд" },
        { value: "bukhara", label: "Бухара" }
    ];
    const optionsSalary = [
        { value: "500", label: "до 500$" },
        { value: "1000", label: "до 1000$" },
        { value: "2000", label: "до 2000$" }
    ];
    const optionsPlan = [
        { value: "Premium", label: "Premium" },
        { value: "Pro", label: "Pro" },
        { value: "Basic", label: "Basic" }
    ];

    // ✅ FETCH VACANCIES FROM BACKEND
    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                setLoadingVacancies(true);

                const recentResponse = await api.get("/api/vacancies/jobposts/recent/");
                console.log("✅ [MOBILE] Recent vacancies:", recentResponse.data);

                const vacanciesData = Array.isArray(recentResponse.data)
                    ? recentResponse.data
                    : recentResponse.data?.results || [];

                setVacancies(vacanciesData);

                try {
                    const countResponse = await api.get("/api/vacancies/jobposts/", {
                        params: { page: 1, page_size: 1 }
                    });
                    const count = countResponse.data?.count || vacanciesData.length || 0;
                    setTotalVacanciesCount(count);
                } catch (countErr) {
                    console.error("❌ Count fetch error:", countErr);
                    setTotalVacanciesCount(vacanciesData.length);
                }
            } catch (err) {
                console.error("❌ Fetch vacancies error:", err);
                toast.error(texts[langCode].loadingError);
                setVacancies([]);
                setTotalVacanciesCount(0);
            } finally {
                setLoadingVacancies(false);
            }
        };
        fetchVacancies();
    }, []);

    // ✅ HANDLE SEARCH
    const handleSearch = () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (searchText.trim()) {
                params.append("search", searchText.trim());
            }

            const queryString = params.toString();
            navigate(`/vacancies${queryString ? `?${queryString}` : ''}`);
        } catch (err) {
            console.error("❌ Search error:", err);
            toast.error("Qidiruvda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    // ✅ HANDLE VIEW MORE
    const handleViewMore = () => {
        navigate("/vacancies");
    };

    // ✅ HANDLE VACANCY CLICK
    const handleVacancyClick = (vacancyId) => {
        navigate(`/vacancies`);
    };

    const selectStyles = {
        control: (p, s) => ({
            ...p,
            border: "none",
            borderRadius: "0.75rem",
            backgroundColor: "rgba(255,255,255,0.9)",
            height: 44,
            paddingLeft: 8,
            fontSize: 14,
            boxShadow: "none",
            outline: "none"
        }),
        input: (p) => ({ ...p, fontSize: 14 }),
        placeholder: (p) => ({ ...p, fontSize: 14, color: "#AEAEAE" }),
        singleValue: (p) => ({ ...p, fontSize: 14, color: "#000" }),
        indicatorSeparator: () => ({ display: "none" }),
        menu: (p) => ({ ...p, borderRadius: "0.75rem" }),
    };

    return (
        <div className="min-h-screen font-sans bg-white text-black overflow-x-hidden">
            {/* NAVBAR */}
            <MobileNavbarLogin />

            {/* HERO */}
            <section
                className="relative bg-cover bg-center min-h-[76vh] flex items-center justify-center"
                style={{ backgroundImage: `url('/hero.png')` }}
            >
                <div className="absolute inset-0 bg-blue-900/50 z-0" />

                {/* TOP-LEFT: search icon */}
                {!showSearch && (
                    <button
                        aria-label="Search"
                        onClick={() => setShowSearch(true)}
                        className="absolute top-3 left-3 z-20 w-10 h-10 grid place-items-center text-white bg-transparent border-0"
                        style={{ backgroundColor: "transparent", WebkitTapHighlightColor: "transparent" }}
                    >
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z" />
                        </svg>
                    </button>
                )}

                {/* CENTER: text */}
                <div className="relative z-10 px-4 text-center">
                    <p className="text-white text-[15px] font-semibold mb-3">
                        {texts[langCode].applicants}
                    </p>
                    <h1 className="text-white uppercase font-extrabold text-[30px] leading-[36px]">
                        {texts[langCode].resume}
                    </h1>
                </div>

                {/* SEARCH BAR */}
                {showSearch && (
                    <>
                        <div className="absolute inset-0 z-10" onClick={() => setShowSearch(false)} />
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-[84%] max-w-[320px] transition-all">
                            <div className="flex items-center h-10 rounded-lg bg-white/95 px-2 shadow">
                                <svg className="w-4 h-4 text-[#3066BE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z" />
                                </svg>
                                <input
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    type="text"
                                    placeholder={texts[langCode].search}
                                    className="ml-2 flex-1 bg-transparent text-[13px] placeholder:text-[12px] text-[#111] outline-none"
                                    autoFocus
                                />
                                {searchText && (
                                    <button
                                        onClick={() => setSearchText("")}
                                        className="mb-[13px] mr-[2px] border-none text-gray-500 text-base leading-none w-6 h-6 grid place-items-center bg-transparent"
                                        aria-label="Clear"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* bottom white curve */}
                <div className="pointer-events-none absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-10">
                    <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="block w-full h-[40px]">
                        <path d="M0,0 C150,40 350,40 500,0 L500,40 L0,40 Z" fill="#fff"></path>
                    </svg>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="px-4 py-8">
                <h2 className="text-center text-[20px] font-bold mb-6">{texts[langCode].categories}</h2>
                <div className="grid grid-cols-2 gap-3">
                    {getCategoriesTexts()[langCode].map((cat, i) => (
                        <div key={i} className="p-4 rounded-[10px] bg-[#F4F6FA] text-center shadow">
                            <p className="text-[13px] font-semibold">{cat.title}</p>
                            <p className="text-[11px] text-gray-500">{cat.vacancies}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* RECOMMENDED VACANCY */}
            <section className="px-4 pb-4">
                <h3 className="text-center text-[22px] font-extrabold mb-4">
                    {texts[langCode].recommendedVacancies}
                </h3>

                <div className="mb-2">
                    <a href="/login" className="text-[14px] font-semibold text-black">
                        {texts[langCode].publishVacancy}
                    </a>
                    <div className="h-px bg-[#D9D9D9] mt-2" />
                </div>

                {/* Loading State */}
                {loadingVacancies && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* ✅ FIRST 3 VACANCIES */}
                {!loadingVacancies && vacancies.length > 0 && vacancies.slice(0, 3).map((vacancy, k) => (
                    <div key={vacancy.id} className="py-5" onClick={() => handleVacancyClick(vacancy.id)}>
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center text-gray-400 text-[12px]">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {vacancy.published_ago || vacancy.timeAgo || texts[langCode].published}
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); toggleSave(k); }}
                                aria-label="save"
                                className="p-1 -mr-1 active:scale-95 bg-white border-none"
                            >
                                <svg className="w-6 h-6 bg-white" viewBox="0 0 24 24" stroke="#111" strokeWidth="1.8" fill={savedJobs[k] ? "#3066BE" : "none"}>
                                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-3-7 3V4a1 1 0 0 1 1-1z" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <h4 className="text-[20px] font-extrabold text-[#111]">
                                {vacancy.title || texts[langCode].needed}
                            </h4>
                            {k === 1 && (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FFD54F">
                                    <path d="M12 3l7 7-7 7-7-7 7-7z" />
                                </svg>
                            )}
                        </div>

                        <p className="text-gray-500 text-[13px] mt-1">
                            {vacancy.budget || texts[langCode].budget}
                        </p>

                        <p className="text-gray-600 text-[13px] mt-3 line-clamp-2">
                            {vacancy.description || texts[langCode].description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {vacancy.skills && Array.isArray(vacancy.skills) && vacancy.skills.length > 0 ? (
                                vacancy.skills.slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-[12px]">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                texts[langCode].tags.map((t, idx) => (
                                    <span key={idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-[12px]">
                                        {t}
                                    </span>
                                ))
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between text-gray-500 text-[13px]">
                            <div className="flex items-center gap-2">
                                {vacancy.payment_verified && (
                                    <>
                                        <div className="relative w-5 h-5">
                                            <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                            <img src="/check.svg" alt="check" className="absolute inset-0 w-3 h-3 m-auto" />
                                        </div>
                                        {texts[langCode].payment}
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-1">
                                {[...Array(Math.min(vacancy.rating || 4, 5))].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                    </svg>
                                ))}
                                {[...Array(Math.max(0, 5 - (vacancy.rating || 4)))].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                    </svg>
                                ))}
                            </div>

                            <div className="flex items-center gap-1">
                                <img src="/location.png" alt="location" className="w-5 h-4" />
                                {vacancy.location || texts[langCode].location_vacancy}
                            </div>
                        </div>

                        <div className="border-t border-[#AEAEAE] mt-5" />
                    </div>
                ))}

                {/* ✅ FALLBACK */}
                {!loadingVacancies && vacancies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">{texts[langCode].noVacancies}</p>
                    </div>
                )}
            </section>

            {/* ==========================
                🔥 CTA - MARKAZLASHTIRILGAN
            ========================== */}
            <section className="relative w-full bg-[#3066BE] text-white mt-6 px-5 py-10 overflow-hidden">
                <svg className="absolute left-2 top-2 w-28 h-28 opacity-80 pointer-events-none" viewBox="0 0 120 120">
                    <defs>
                        <pattern id="dotp" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="6" cy="6" r="5" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="120" height="120" fill="url(#dotp)" />
                </svg>

                <svg className="absolute right-2 bottom-3 w-28 h-28 opacity-80 pointer-events-none" viewBox="0 0 120 120">
                    <rect width="120" height="120" fill="url(#dotp)" />
                </svg>

                <div className="max-w-[720px] mx-auto text-center relative z-10">
                    <h2 className="text-[28px] leading-[36px] mt-[50px] font-extrabold md:text-[36px] md:leading-[44px] mb-8">
                        {texts[langCode].ctaTitle}
                    </h2>

                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate("/vacancies")}
                            className="w-auto px-8 h-12 rounded-2xl border-2 border-white text-white bg-transparent inline-flex items-center justify-center text-[14px] font-semibold active:scale-95"
                        >
                            {texts[langCode].fillResume}
                        </button>
                    </div>
                </div>
            </section>

            {/* 🔥 NEXT 2 VACANCIES AFTER CTA */}
            {!loadingVacancies && vacancies.length > 3 && (
                <section className="px-4 pb-4">
                    {vacancies.slice(3, 5).map((vacancy, k) => (
                        <div key={vacancy.id} className="py-5" onClick={() => handleVacancyClick(vacancy.id)}>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center text-gray-400 text-[12px]">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {vacancy.published_ago || vacancy.timeAgo || texts[langCode].published}
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleSave(k + 3); }}
                                    aria-label="save"
                                    className="p-1 -mr-1 active:scale-95 bg-white border-none"
                                >
                                    <svg className="w-6 h-6 bg-white" viewBox="0 0 24 24" stroke="#111" strokeWidth="1.8" fill={savedJobs[k + 3] ? "#3066BE" : "none"}>
                                        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-3-7 3V4a1 1 0 0 1 1-1z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <h4 className="text-[20px] font-extrabold text-[#111]">
                                    {vacancy.title || texts[langCode].needed}
                                </h4>
                            </div>

                            <p className="text-gray-500 text-[13px] mt-1">
                                {vacancy.budget || texts[langCode].budget}
                            </p>

                            <p className="text-gray-600 text-[13px] mt-3 line-clamp-2">
                                {vacancy.description || texts[langCode].description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {vacancy.skills && Array.isArray(vacancy.skills) && vacancy.skills.length > 0 ? (
                                    vacancy.skills.slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-[12px]">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    texts[langCode].tags.map((t, idx) => (
                                        <span key={idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-[12px]">
                                            {t}
                                        </span>
                                    ))
                                )}
                            </div>

                            <div className="mt-4 flex items-center justify-between text-gray-500 text-[13px]">
                                <div className="flex items-center gap-2">
                                    {vacancy.payment_verified && (
                                        <>
                                            <div className="relative w-5 h-5">
                                                <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                                <img src="/check.svg" alt="check" className="absolute inset-0 w-3 h-3 m-auto" />
                                            </div>
                                            {texts[langCode].payment}
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    {[...Array(Math.min(vacancy.rating || 4, 5))].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                        </svg>
                                    ))}
                                    {[...Array(Math.max(0, 5 - (vacancy.rating || 4)))].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                        </svg>
                                    ))}
                                </div>

                                <div className="flex items-center gap-1">
                                    <img src="/location.png" alt="location" className="w-5 h-4" />
                                    {vacancy.location || texts[langCode].location_vacancy}
                                </div>
                            </div>

                            <div className="border-t border-[#AEAEAE] mt-5" />
                        </div>
                    ))}
                </section>
            )}

            {/* VIEW MORE BUTTON */}
            <div className="px-4 mt-4 flex justify-end">
                <button
                    onClick={handleViewMore}
                    className="bg-[#3066BE] text-white rounded-2xl h-12 px-4 shadow flex items-center gap-2 active:scale-95"
                >
                    <span className="text-[14px] font-semibold">{texts[langCode].viewMore}</span>
                </button>
            </div>

            {/* FOOTER */}
            <footer className="mt-8">
                <div className="relative">
                    <img src="/footer-bg.png" alt="Footer" className="w-full h-[520px] object-cover" />
                    <div className="absolute inset-0 bg-[#3066BE]/60" />

                    <div className="absolute inset-0 text-white px-6 pt-8 pb-28">
                        <h3 className="text-[40px] font-black mb-6">{texts[langCode].logo}</h3>

                        <ul className="space-y-6">
                            {texts[langCode].links.map((label, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <svg className="w-3 h-3 shrink-0 mb-[-10px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M8 5l8 7-8 7" />
                                    </svg>
                                    <a href="/login" className="text-[16px] text-white mb-[-10px]">{label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="absolute left-3 right-3 bottom-3 bg-white/10 backdrop-blur-md rounded-2xl text-white px-4 py-4">
                        <div className="flex items-start justify-between gap-4 text-[13px] leading-tight">
                            <div>
                                <p className="opacity-90">
                                    {langCode === 'RU' && '© 2025 «HeadHunter – Вакансии».'}
                                    {langCode === 'UZ' && '© 2025 «HeadHunter – Vakansiyalar».'}
                                    {langCode === 'EN' && '© 2025 "HeadHunter – Vacancies".'}
                                </p>
                                <a href="#" className="underline">
                                    {langCode === 'RU' ? 'Карта сайта' : langCode === 'UZ' ? 'Sayt xaritasi' : 'Sitemap'}
                                </a>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-4">
                            <a href="#" aria-label="WhatsApp" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                    <path d="M20 12.4A8.4 8.4 0 1 1 6.9 4.6l-1 3.6 3.6-1A8.4 8.4 0 0 1 20 12.4Z"/>
                                    <path d="M8.5 9.5c.5 1.6 2.4 3.6 4 4l1.4-.7c.3-.2.7 0 .8.3l.7 1.2c.2.4 0 .9-.5 1.1-1.2.6-2.6.8-4.8-.5-2.1-1.3-3.1-3-3.5-4.2-.2-.5 0-1 .5-1.2l1.2-.6c.4-.2.8 0 1 .3l.2.3Z" fill="white" stroke="none"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                    <rect x="3.5" y="3.5" width="17" height="17" rx="4"/>
                                    <circle cx="12" cy="12" r="3.5" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="Facebook" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                    <path d="M13 22v-8h3l.5-3H13V9.2c0-1 .3-1.7 1.9-1.7H17V4.1C16.6 4 15.5 4 14.3 4 11.7 4 10 5.6 10 8.6V11H7v3h3v8h3Z"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="X" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                    <path d="M3 4l7.7 9.3L3.6 20H6l6-5.6L17.8 20H21l-8-9.3L20.4 4H18L12.4 9.2 8.2 4H3z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}