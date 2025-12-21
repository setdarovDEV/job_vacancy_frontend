// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import {
    FaCalculator, FaGraduationCap, FaCogs, FaBriefcase,
    FaHeartbeat, FaLaptopCode, FaIndustry, FaGavel
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import DashboardTablet from "../components/tablet/DashboardTablet.jsx";
import LandingMobile from "../components/mobile/LandingMobile.jsx";

// ==========================
// COMPONENT START
// ==========================
export default function Dashboard() {
    const navigate = useNavigate();

    // ==========================
    // STATE
    // ==========================
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

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

    // ==========================
    // LANG CODE HANDLING
    // ==========================
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    // ==========================
    // TEXTS (MULTILANGUAGE CONTENT)
    // ==========================
    const texts = {
        RU: { community:"Сообщество", vacancies:"Вакансии", chat:"Чат", companies:"Компании",
            keyword:"Ключевое слово:", position:"Должность", location:"Местоположение:",
            selectRegion:"Выберите регион", salary:"Зарплата:", selectSalary:"Выберите зарплату",
            plan:"План:", premium:"Выберите план", applicants:"2000 + соискателей, 200 + компаний, 100 + работодателей",
            resume:"ОСТАВЬТЕ РЕЗЮМЕ & ПОЛУЧИТЕ ЖЕЛАЕМУЮ РАБОТУ!", login:"Войти",
            categories:"Выбрать по категории", search:"Поиск...",
            published:"Опубликовано 2 часа назад",
            needed:"Нужен графический дизайнер",
            budget:"Бюджет: 100$-200$",
            description:"Мы ищем художников, которые помогут нам исправить визуализации упаковки, созданные с помощью ИИ. В частности, мы хотим исправить логотипы на каждом рендере. У нас есть большой набор данных логотипов + изображений, созданных с помощью ИИ.",
            tags:["Лого дизайн","Adobe Illustrator","Adobe Photoshop"],
            payment:"Платеж подтвержден",
            location_vacancy:"Узбекистан",
            recommendedVacancies:"Рекомендуемые вакансии",
            publishVacancy:"Опубликовать вакансию",
            logo:"Logo",
            links:["Помощь","Наши вакансии","Реклама на сайте","Требования к ПО","Инвесторам","Каталог компаний","Работа по профессиям"],
            copyright:"© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            createSite:"Создание сайтов",
            viewMore:"Посмотреть все →",
            noVacancies:"Вакансии не найдены",
            loadingError:"Ошибка загрузки вакансий",
            ctaTitle:"Найдите работу своей мечты сегодня.",
            fillResume:"Заполнить резюме",
            register:"Зарегистрироваться"
        },
        UZ: { community:"Jamiyat", vacancies:"Vakansiyalar", chat:"Chat", companies:"Kompaniyalar",
            keyword:"Kalit so'z:", position:"Lavozim", location:"Joylashuv:",
            selectRegion:"Hududni tanlang", salary:"Maosh:", selectSalary:"Maoshni tanlang",
            plan:"Reja:", premium:"Rejani tanlang", applicants:"2000 + nomzodlar, 200 + kompaniyalar, 100 + ish beruvchilar",
            resume:"REZYUMENI QOLDIRING & ISTALGAN ISHNI OLING!", login:"Kirish",
            categories:"Kategoriyani tanlang", search:"Qidiruv...",
            published:"2 soat oldin e'lon qilindi",
            needed:"Grafik dizayner kerak",
            budget:"Byudjet: 100$-200$",
            description:"Sun'iy intellekt yordamida yaratilgan qadoqlash vizualizatsiyasini tuzatishga yordam beradigan rassomlarni izlayapmiz. Xususan, biz har bir renderdagi logotiplarni to'g'rilamoqchimiz. Bizda sun'iy intellekt bilan yaratilgan katta logotiplar + tasvirlar bazasi bor.",
            tags:["Logo dizayn","Adobe Illustrator","Adobe Photoshop"],
            payment:"To'lov tasdiqlangan",
            location_vacancy:"O'zbekiston",
            recommendedVacancies:"Tavsiya etilgan vakansiyalar",
            publishVacancy:"Vakansiya e'lon qilish",
            logo:"Logo",
            links:["Yordam","Bizning vakantiyalar","Saytda reklama","Dasturiy ta'minot talablari","Investorlar uchun","Kompaniyalar katalogi","Kasblar bo'yicha ishlar"],
            copyright:"© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            createSite:"Sayt yaratish",
            viewMore:"Hammasini ko'rish →",
            noVacancies:"Vakansiyalar topilmadi",
            loadingError:"Vakansiyalarni yuklashda xatolik",
            ctaTitle:"Bugun orzuingizdagi ishni toping.",
            fillResume:"Rezyume to'ldirish",
            register:"Ro'yxatdan o'tish"
        },
        EN: { community:"Community", vacancies:"Vacancies", chat:"Chat", companies:"Companies",
            keyword:"Keyword:", position:"Position", location:"Location:",
            selectRegion:"Select region", salary:"Salary:", selectSalary:"Select salary",
            plan:"Plan:", premium:"Select plan", applicants:"2000+ applicants, 200+ companies, 100+ employers",
            resume:"LEAVE A RESUME & GET THE JOB YOU WANT!", login:"Login",
            categories:"Choose by category", search:"Search...",
            published:"Published 2 hours ago",
            needed:"Graphic designer needed",
            budget:"Budget: $100-$200",
            description:"We are looking for artists to help fix packaging visualizations created with AI. Specifically, we want to fix the logos on each render. We have a large dataset of logos + images created with AI.",
            tags:["Logo design","Adobe Illustrator","Adobe Photoshop"],
            payment:"Payment verified",
            location_vacancy:"Uzbekistan",
            recommendedVacancies:"Recommended vacancies",
            publishVacancy:"Publish a vacancy",
            logo:"Logo",
            links:["Help","Our Vacancies","Advertising on site","Software Requirements","For Investors","Company Catalog","Jobs by Profession"],
            copyright:"© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            createSite:"Website creation",
            viewMore:"View all →",
            noVacancies:"No vacancies found",
            loadingError:"Error loading vacancies",
            ctaTitle:"Find your dream job today.",
            fillResume:"Fill resume",
            register:"Register"
        }
    };

    // quick alias
    const t = texts[langCode];

    // ==========================
    // CATEGORIES TEXTS (Realistic static counts)
    // ==========================
    const getCategoriesTexts = () => {
        const categoryCounts = {
            accounting: 45,
            education: 89,
            mechanical: 34,
            legal: 67,
            healthcare: 52,
            it: 156,
            engineering: 78,
            legal2: 41
        };

        const formatCount = (count, lang) => {
            if (lang === "RU") return `${count} открытых вакансий`;
            if (lang === "UZ") return `${count} ta ochiq ish o'rni`;
            return `${count} open vacancies`;
        };

        return {
            RU: [
                { icon: FaCalculator, title: "Бухгалтерия", vacancies: formatCount(categoryCounts.accounting, "RU") },
                { icon: FaGraduationCap, title: "Образование", vacancies: formatCount(categoryCounts.education, "RU") },
                { icon: FaCogs, title: "Машиностроение", vacancies: formatCount(categoryCounts.mechanical, "RU") },
                { icon: FaBriefcase, title: "Юридический", vacancies: formatCount(categoryCounts.legal, "RU") },
                { icon: FaHeartbeat, title: "Здравоохранение", vacancies: formatCount(categoryCounts.healthcare, "RU") },
                { icon: FaLaptopCode, title: "IT & Агентство", vacancies: formatCount(categoryCounts.it, "RU") },
                { icon: FaIndustry, title: "Инжиниринг", vacancies: formatCount(categoryCounts.engineering, "RU") },
                { icon: FaGavel, title: "Юридический", vacancies: formatCount(categoryCounts.legal2, "RU") }
            ],
            UZ: [
                { icon: FaCalculator, title: "Buxgalteriya", vacancies: formatCount(categoryCounts.accounting, "UZ") },
                { icon: FaGraduationCap, title: "Ta'lim", vacancies: formatCount(categoryCounts.education, "UZ") },
                { icon: FaCogs, title: "Mashinasozlik", vacancies: formatCount(categoryCounts.mechanical, "UZ") },
                { icon: FaBriefcase, title: "Yuridik", vacancies: formatCount(categoryCounts.legal, "UZ") },
                { icon: FaHeartbeat, title: "Sog'liqni saqlash", vacancies: formatCount(categoryCounts.healthcare, "UZ") },
                { icon: FaLaptopCode, title: "IT & Agentlik", vacancies: formatCount(categoryCounts.it, "UZ") },
                { icon: FaIndustry, title: "Muhandislik", vacancies: formatCount(categoryCounts.engineering, "UZ") },
                { icon: FaGavel, title: "Yuridik", vacancies: formatCount(categoryCounts.legal2, "UZ") }
            ],
            EN: [
                { icon: FaCalculator, title: "Accounting", vacancies: formatCount(categoryCounts.accounting, "EN") },
                { icon: FaGraduationCap, title: "Education", vacancies: formatCount(categoryCounts.education, "EN") },
                { icon: FaCogs, title: "Mechanical Eng.", vacancies: formatCount(categoryCounts.mechanical, "EN") },
                { icon: FaBriefcase, title: "Legal", vacancies: formatCount(categoryCounts.legal, "EN") },
                { icon: FaHeartbeat, title: "Healthcare", vacancies: formatCount(categoryCounts.healthcare, "EN") },
                { icon: FaLaptopCode, title: "IT & Agency", vacancies: formatCount(categoryCounts.it, "EN") },
                { icon: FaIndustry, title: "Engineering", vacancies: formatCount(categoryCounts.engineering, "EN") },
                { icon: FaGavel, title: "Legal", vacancies: formatCount(categoryCounts.legal2, "EN") }
            ]
        };
    };

    // ==========================
    // SELECT OPTIONS
    // ==========================
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

    // ==========================
    // FETCH VACANCIES FROM BACKEND
    // ==========================
    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                setLoadingVacancies(true);

                const recentResponse = await api.get("/api/vacancies/jobposts/recent/");
                console.log("✅ Recent vacancies response:", recentResponse.data);

                const vacanciesData = Array.isArray(recentResponse.data)
                    ? recentResponse.data
                    : recentResponse.data?.results || [];

                setVacancies(vacanciesData);

                try {
                    const countResponse = await api.get("/api/vacancies/jobposts/", {
                        params: { page: 1, page_size: 1 }
                    });
                    console.log("✅ Count response:", countResponse.data);

                    const count = countResponse.data?.count || vacanciesData.length || 331;
                    setTotalVacanciesCount(count);
                    console.log("📊 Total vacancies count:", count);
                } catch (countErr) {
                    console.error("❌ Count fetch error:", countErr);
                    setTotalVacanciesCount(vacanciesData.length || 331);
                }
            } catch (err) {
                console.error("❌ Fetch vacancies error:", err);
                toast.error(t.loadingError);
                setVacancies([]);
                setTotalVacanciesCount(331);
            } finally {
                setLoadingVacancies(false);
            }
        };
        fetchVacancies();
    }, []);

    // ==========================
    // HANDLE SEARCH
    // ==========================
    const handleSearch = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (searchKeyword.trim()) {
                params.append("search", searchKeyword.trim());
            }
            if (selectedRegion?.value) {
                params.append("location", selectedRegion.value);
            }
            if (selectedSalary?.value) {
                params.append("salary_max", selectedSalary.value);
            }
            if (selectedPlan?.value) {
                params.append("plan", selectedPlan.value);
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

    // ==========================
    // HANDLE VIEW MORE
    // ==========================
    const handleViewMore = () => {
        navigate("/vacancies");
    };

    // ==========================
    // HANDLE VACANCY CLICK
    // ==========================
    const handleVacancyClick = (vacancyId) => {
        navigate(`/vacancies`);
    };

    return (
        <>
            <div className="hidden lg:block font-sans relative">
                {/* NAVBAR */}
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md" aria-label="Primary">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        <a href="/" aria-label="Home">
                            <img src="/logo.png" alt="Logo" className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain" />
                        </a>

                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">{t.community}</a>
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">{t.vacancies}</a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">{t.chat}</a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">{t.companies}</a>
                        </div>

                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            <ProfileDropdown />
                        </div>

                        <div className="md:hidden flex items-center gap-3 pr-4 sm:pr-6 pt-2">
                            <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                                <img src={selectedLang.flag} alt={`${selectedLang.code} flag`} className="w-6 h-4 object-cover" />
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
                                </svg>
                                {showLang && (
                                    <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                        <div onClick={() => { setSelectedLang({flag: "/ru.png", code: "RU"}); setShowLang(false); }}
                                             className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                            <img src="/ru.png" alt="RU flag" className="w-8 h-5" />
                                        </div>
                                        <div onClick={() => { setSelectedLang({flag: "/uz.png", code: "UZ"}); setShowLang(false); }}
                                             className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                            <img src="/uz.png" alt="UZ flag" className="w-8 h-5" />
                                        </div>
                                        <div onClick={() => { setSelectedLang({flag: "/uk.png", code: "EN"}); setShowLang(false); }}
                                             className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                            <img src="/uk.png" alt="EN flag" className="w-8 h-5" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="bg-white p-2 rounded-md focus:outline-none" aria-label="Open menu">
                                <svg className="w-8 h-8" fill="none" stroke="#3066BE" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {showMobileMenu && (
                        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 z-50">
                            <a href="/community" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">{t.community}</a>
                            <a href="/vacancies" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">{t.vacancies}</a>
                            <a href="/chat" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">{t.chat}</a>
                            <a href="/companies" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">{t.companies}</a>
                            <button className="mt-3 bg-[#3066BE] text-white px-6 py-2 rounded-md hover:bg-[#274f94] transition text-[15px]" type="button">
                                {t.login}
                            </button>
                        </div>
                    )}
                </nav>

                {/* SEARCH INPUT */}
                <div className="hidden md:block absolute top-[132px] left-[70px] z-50 w-[250px]">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t.search}
                            className="w-full h-[47px] pl-4 pr-10 rounded-md border-2 border-white bg-transparent text-white placeholder-white focus:outline-none"
                            aria-label="Search"
                        />
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6" stroke="white" fill="none" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z"/>
                        </svg>
                    </div>
                </div>

                <div className="md:hidden absolute top-[80px] left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-[344px]">
                    {!showSearch ? (
                        <button
                            onClick={() => setShowSearch(true)}
                            className="bg-white p-2 rounded-full shadow-md focus:outline-none flex items-center justify-center"
                            type="button"
                            aria-label="Open search"
                        >
                            <svg className="w-6 h-6" stroke="#3066BE" fill="none" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z"/>
                            </svg>
                        </button>
                    ) : (
                        <div className="relative flex h-[47px] items-center border-2 border-white rounded-md px-4">
                            <svg className="w-6 h-6 mr-2" stroke="white" fill="none" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z"/>
                            </svg>
                            <input
                                type="text"
                                placeholder={t.search}
                                className="flex-1 bg-transparent text-white placeholder-white border-none focus:outline-none"
                                aria-label="Search"
                            />
                            <button
                                onClick={() => setShowSearch(false)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-2xl bg-transparent border-none focus:outline-none"
                                type="button"
                                aria-label="Close search"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                {/* HERO SECTION */}
                <section
                    className="relative bg-cover bg-center min-h-[100vh] flex flex-col justify-center items-center text-center"
                    style={{ backgroundImage: `url('/hero.png')`, clipPath: "ellipse(80% 100% at 50% 0)" }}
                    aria-label="Hero"
                >
                    <div className="absolute inset-0 bg-blue-900 opacity-50" style={{ clipPath: "ellipse(80% 100% at 50% 0)" }}></div>

                    <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center px-4">
                        <p className="text-white text-[18px] sm:text-[22px] md:text-[24px] font-semibold mb-4">
                            {t.applicants}
                        </p>
                        <h1 className="text-white uppercase text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-extrabold leading-tight md:leading-[75px] lg:leading-[85px] text-center">
                            {t.resume.split("&")[0]} &<br/>{t.resume.split("&")[1]}
                        </h1>

                        <div className="mt-8 sm:mt-10 w-full bg-white/30 backdrop-blur-md shadow-2xl rounded-xl p-4 sm:p-6 flex flex-wrap gap-4 sm:gap-6 items-end justify-center">
                            <div className="flex flex-col w-full sm:w-52">
                                <span className="text-[14px] sm:text-[16px] mb-1 text-[#000]">
                                    {t.keyword}
                                </span>
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder={t.position}
                                    className="border-none rounded-xl px-5 h-12 w-full bg-white/80 shadow-sm text-[16px] text-left text-[#000] placeholder:text-[#AEAEAE] focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col w-full sm:w-52">
                                <span className="text-[14px] sm:text-[16px] mb-1 text-[#000]">
                                    {t.location}
                                </span>
                                <Select
                                    placeholder={t.selectRegion}
                                    options={optionsRegion}
                                    value={selectedRegion}
                                    onChange={setSelectedRegion}
                                    styles={selectStyles()}
                                />
                            </div>
                            <div className="flex flex-col w-full sm:w-52">
                                <span className="text-[14px] sm:text-[16px] mb-1 text-[#000]">
                                    {t.salary}
                                </span>
                                <Select
                                    placeholder={t.selectSalary}
                                    options={optionsSalary}
                                    value={selectedSalary}
                                    onChange={setSelectedSalary}
                                    styles={selectStyles()}
                                />
                            </div>
                            <div className="flex flex-col w-full sm:w-52">
                                <span className="text-[14px] sm:text-[16px] mb-1 text-[#000]">
                                    {t.plan}
                                </span>
                                <Select
                                    placeholder={t.premium}
                                    options={optionsPlan}
                                    value={selectedPlan}
                                    onChange={setSelectedPlan}
                                    styles={selectStyles()}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-[#3066BE] text-white w-full sm:w-20 h-12 rounded-xl hover:bg-[#254f99] transition flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                type="button"
                                aria-label="Search"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                {/* CATEGORIES SECTION */}
                <div className="py-16 px-6 max-w-6xl mx-auto">
                    <h2 className="text-center text-3xl font-bold text-[#000000] mb-12">{t.categories}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {getCategoriesTexts()[langCode].map((cat, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center p-6 rounded-[10px] transition text-[#000000]"
                                style={{ backgroundColor: "#F4F6FA", boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                            >
                                <cat.icon className="text-[#3066BE] text-4xl mb-4" aria-hidden="true" />
                                <h3 className="text-lg font-semibold mb-1">{cat.title}</h3>
                                <p className="text-gray-400 text-sm">{cat.vacancies}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* VACANCY SECTION */}
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <h1 className="text-center font-extrabold text-[35px] leading-[150%] text-black mb-10">
                        {t.recommendedVacancies}
                    </h1>

                    <SectionHeader title={t.publishVacancy} />

                    {loadingVacancies && (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-12 h-12 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* 🔥 FIRST 3 VACANCIES */}
                    {!loadingVacancies && vacancies.length > 0 && vacancies.slice(0, 3).map((vacancy, index) => (
                        <div key={vacancy.id} className="max-w-5xl mx-auto px-6 py-6">
                            <div
                                className="rounded-xl shadow p-6 mb-6 hover:shadow-lg transition cursor-pointer"
                                onClick={() => handleVacancyClick(vacancy.id)}
                            >
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {vacancy.published_ago || vacancy.timeAgo || t.published}
                                </div>

                                <h2 className="text-2xl font-bold text-black mb-1">
                                    {vacancy.title || t.needed}
                                </h2>

                                <p className="text-gray-400 mb-4">
                                    {vacancy.budget || t.budget}
                                </p>

                                <p className="text-gray-500 mb-4 line-clamp-2">
                                    {vacancy.description || t.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {vacancy.skills && Array.isArray(vacancy.skills) && vacancy.skills.length > 0 ? (
                                        vacancy.skills.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        t.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                                                {tag}
                                            </span>
                                        ))
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-gray-400">
                                    <div className="flex items-center gap-2">
                                        {vacancy.payment_verified && (
                                            <>
                                                <div className="relative w-6 h-6">
                                                    <img src="/badge-background.svg" alt="bg" className="w-6 h-6" />
                                                    <img src="/check.svg" alt="check" className="absolute inset-0 w-3 h-3 m-auto" />
                                                </div>
                                                <span>{t.payment}</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {[...Array(Math.min(vacancy.rating || 4, 5))].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                            </svg>
                                        ))}
                                        {[...Array(Math.max(0, 5 - (vacancy.rating || 4)))].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                            </svg>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="relative w-5 h-5">
                                            <img src="/location.png" alt="location" className="w-9 h-5" />
                                        </div>
                                        {vacancy.location || t.location_vacancy}
                                    </div>
                                </div>
                            </div>
                            {index < 2 && (
                                <hr className="border-t border-[#D9D9D9] mb-6" />
                            )}
                        </div>
                    ))}

                    {!loadingVacancies && vacancies.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">{t.noVacancies}</p>
                        </div>
                    )}
                </div>

                {/* ==========================
                    🔥 CTA SECTION - DESKTOP DIZAYNI (QIZ RASMI BILAN)
                ========================== */}
                <section className="w-full bg-[#3066BE] relative overflow-visible flex items-center">
                    {/* Chap tomondagi dumaloqlar */}
                    <img
                        src="/dots-bg.png"
                        alt="dots"
                        className="absolute top-0 left-0 w-[200px] h-auto opacity-60"
                    />

                    {/* Kontent Container */}
                    <div className="max-w-6xl mx-auto flex items-center justify-between px-6 w-full">
                        {/* Chap: Qiz rasmi */}
                        <div className="relative flex-shrink-0">
                            <img
                                src="/call-center.png"
                                alt="girl"
                                className="w-[420px] object-contain relative z-20"
                            />
                        </div>

                        {/* O'ng: Matn va tugmalar */}
                        <div className="text-white max-w-lg ml-6">
                            <h2 className="text-3xl font-bold mb-6 leading-snug">
                                {t.ctaTitle}
                            </h2>
                            <div className="flex gap-4 flex-wrap">
                                <button
                                    onClick={() => navigate("/vacancies")}
                                    className="px-6 py-3 border-2 border-white bg-[#3066BE] text-white rounded-md hover:bg-white hover:text-[#3066BE] transition font-semibold"
                                >
                                    {t.fillResume}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🔥 NEXT 2 VACANCIES AFTER CTA */}
                {!loadingVacancies && vacancies.length > 3 && (
                    <div className="max-w-5xl mx-auto px-6 py-12">
                        {vacancies.slice(3, 5).map((vacancy, index) => (
                            <div key={vacancy.id}>
                                <div className="max-w-5xl mx-auto px-6 py-6">
                                    <div
                                        className="rounded-xl shadow p-6 mb-6 hover:shadow-lg transition cursor-pointer"
                                        onClick={() => handleVacancyClick(vacancy.id)}
                                    >
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {vacancy.published_ago || vacancy.timeAgo || t.published}
                                        </div>

                                        <h2 className="text-2xl font-bold text-black mb-1">
                                            {vacancy.title || t.needed}
                                        </h2>

                                        <p className="text-gray-400 mb-4">
                                            {vacancy.budget || t.budget}
                                        </p>

                                        <p className="text-gray-500 mb-4 line-clamp-2">
                                            {vacancy.description || t.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {vacancy.skills && Array.isArray(vacancy.skills) && vacancy.skills.length > 0 ? (
                                                vacancy.skills.slice(0, 3).map((skill, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                t.tags.map((tag, tagIndex) => (
                                                    <span key={tagIndex} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                                                        {tag}
                                                    </span>
                                                ))
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-gray-400">
                                            <div className="flex items-center gap-2">
                                                {vacancy.payment_verified && (
                                                    <>
                                                        <div className="relative w-6 h-6">
                                                            <img src="/badge-background.svg" alt="bg" className="w-6 h-6" />
                                                            <img src="/check.svg" alt="check" className="absolute inset-0 w-3 h-3 m-auto" />
                                                        </div>
                                                        <span>{t.payment}</span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {[...Array(Math.min(vacancy.rating || 4, 5))].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                                    </svg>
                                                ))}
                                                {[...Array(Math.max(0, 5 - (vacancy.rating || 4)))].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
                                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                                    </svg>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="relative w-5 h-5">
                                                    <img src="/location.png" alt="location" className="w-9 h-5" />
                                                </div>
                                                {vacancy.location || t.location_vacancy}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {index < 1 && (
                                    <hr className="border-t border-[#D9D9D9] mb-6" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end pr-[75px] mt-10 mb-[74px]">
                    <button
                        onClick={handleViewMore}
                        className="bg-[#3066BE] text-white px-6 py-3 rounded-lg hover:bg-[#254f99] transition-colors duration-300"
                    >
                        {t.viewMore}
                    </button>
                </div>

                {/* FOOTER SECTION */}
                <footer className="w-full h-[393px] relative overflow-hidden">
                    <img src="/footer-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/50 z-10" />
                    <div className="relative z-20">
                        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                            <div className="flex gap-[190px]">
                                <div>
                                    <h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">{t.logo}</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-[184px]">
                                    <div className="flex flex-col gap-[20px]">
                                        {t.links.slice(0,4).map((link, idx) => (
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
                                    <a href="#" className="text-white" aria-label="WhatsApp"><i className="fab fa-whatsapp hover:text-[#F2F4FD]"></i></a>
                                    <a href="#" className="text-white" aria-label="Instagram"><i className="fab fa-instagram hover:text-[#F2F4FD]"></i></a>
                                    <a href="#" className="text-white" aria-label="Facebook"><i className="fab fa-facebook hover:text-[#F2F4FD]"></i></a>
                                    <a href="#" className="text-white" aria-label="Twitter"><i className="fab fa-twitter hover:text-[#F2F4FD]"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Tablet (md - lg) */}
            <div className="hidden md:block lg:hidden">
                <DashboardTablet />
            </div>

            {/* Mobile (sm va undan kichik) */}
            <div className="block md:hidden">
                <LandingMobile />
            </div>
        </>
    );
}

/* ==========================
   SMALL SUBCOMPONENTS
========================== */

function SectionHeader({ title }) {
    return (
        <div className="max-w-5xl mx-auto px-6 mt-6">
            <h2 className="text-[18px] leading-[150%] font-bold text-black mb-2">{title}</h2>
            <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-6"></div>
            <hr className="border-t border-[#D9D9D9] mb-6" />
        </div>
    );
}

/* ==========================
   SELECT CUSTOM STYLES
========================== */
function selectStyles() {
    return {
        control: (provided, state) => ({
            ...provided,
            border: "none",
            borderRadius: "0.75rem",
            backgroundColor: "rgba(255,255,255,0.8)",
            height: "48px",
            paddingLeft: "8px",
            fontSize: "16px",
            color: "#000000",
            boxShadow: "none",
            outline: "none",
            borderColor: "transparent",
            "&:hover": { border: "none", boxShadow: "none", outline: "none" },
            ...(state.isFocused && { border: "none", boxShadow: "none", outline: "none", borderColor: "transparent" })
        }),
        input: (p) => ({ ...p, fontSize: "16px", color: "#000", outline: "none", boxShadow: "none", border: "none", textAlign: "left" }),
        placeholder: (p) => ({ ...p, fontSize: "16px", color: "#AEAEAE", textAlign: "left" }),
        singleValue: (p) => ({ ...p, fontSize: "16px", color: "#000", textAlign: "left" }),
        indicatorSeparator: () => ({ display: "none" }),
        menu: (p) => ({ ...p, borderRadius: "0.75rem", backgroundColor: "rgba(255,255,255,0.95)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)" }),
        option: (p, state) => ({ ...p, backgroundColor: state.isFocused ? "rgba(0,0,0,0.05)" : "transparent", color: "#000", cursor: "pointer" })
    };
}