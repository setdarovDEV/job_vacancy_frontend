import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import CompanyModal from "../components/CompanyModal"; // to‘g‘ri path yoz
import ProfileDropdownJobSeeker from "../components/ProfileDropdownJobSeeker.jsx";
import api from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";


import {
    FaCalculator,
    FaGraduationCap,
    FaCogs,
    FaBriefcase,
    FaHeartbeat,
    FaLaptopCode,
    FaIndustry,
    FaGavel
} from "react-icons/fa";
import ProfileDropdown from "../components/ProfileDropdown";

// ==========================
// COMPONENT START
// ==========================
export default function LandingPage() {
    // ==========================
    // STATE
    // ==========================
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [rating, setRating] = useState(0); // Bosilgan yulduzlar soni
    const [selectedSize, setSelectedSize] = useState("");
    const [activePage, setActivePage] = useState(1);
    const totalPages = 5;
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companies, setCompanies] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [openCompanyId, setOpenCompanyId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("open");
        setOpenCompanyId(id);
    }, [location.search]);

    const handleCloseModal = () => {
        setOpenCompanyId(null);
        const params = new URLSearchParams(location.search);
        params.delete("open");
        navigate({ pathname: "/companies", search: params.toString() ? `?${params}` : "" }, { replace: true });
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // ixtiyoriy: tartiblash va qidiruv
                // const params = { ordering: '-avg_rating', search: searchTerm };

                const { data } = await api.get("api/companies/"); // yoki api.get("api/companies/", { params })
                // Pagination-agnostic: data.results bo‘lsa o‘shani olamiz, bo‘lmasa to‘g‘ridan-to‘g‘ri massiv
                const list = Array.isArray(data) ? data : data?.results || [];
                setCompanies(list);
                console.log("Kelgan kompaniyalar:", list);
            } catch (error) {
                console.error("Xatolik:", error);
            }
        };

        fetchCompanies();
    }, []);

    const toMediaUrl = (u, host = "http://localhost:8000") => {
        if (!u) return "/company-fallback.png";
        try { new URL(u); return u; } catch {}
        return u.startsWith("/") ? `${host}${u}` : `${host}/${u}`;
    };



    // const logoSrc = toMediaUrl(company?.logo);

    // ==========================
    // LANG CODE HANDLING
    // ==========================
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    // ==========================
    // TEXTS (MULTILANGUAGE CONTENT)
    // ==========================
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

    // ==========================
    // RETURN JSX
    // ==========================
    return (
        <main className="font-sans relative">
            {/* ==========================
                        NAVBAR
            ========================== */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                    {/* Logo */}
                    <a href="/"><img src="/logo.png" alt="Logo"
                                     className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain"/></a>
                    {/* Center links */}
                    <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                        <a href="/community" className="text-black hover:text-[#3066BE] transition">{texts[langCode].community}</a>
                        <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">{texts[langCode].vacancies}</a>
                        <a href="/chat" className="text-black hover:text-[#3066BE] transition">{texts[langCode].chat}</a>
                        <a href="/companies" className="text-[#3066BE] hover:text-[#3066BE] transition">{texts[langCode].companies}</a>
                    </div>

                    {/* Right side: flag + login (md va katta) */}
                    <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                        {/* Lang selector */}
                        <div className="relative flex items-center gap-2 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                            <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 sm:w-7 sm:h-4 md:w-8 md:h-5 object-cover" />
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                            </svg>
                            {showLang && (
                                <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                    <div onClick={() => { setSelectedLang({ flag: "/ru.png", code: "RU" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/ru.png" alt="RU" className="w-8 h-5" />
                                    </div>
                                    <div onClick={() => { setSelectedLang({ flag: "/uz.png", code: "UZ" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uz.png" alt="UZ" className="w-8 h-5" />
                                    </div>
                                    <div onClick={() => { setSelectedLang({ flag: "/uk.png", code: "EN" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uk.png" alt="EN" className="w-8 h-5" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <ProfileDropdown />

                    </div>

                    {/* Mobile flag + burger */}
                    <div className="md:hidden flex items-center gap-3 pr-4 sm:pr-6 pt-2">
                        <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                            <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 object-cover" />
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                            </svg>
                            {showLang && (
                                <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                    <div onClick={() => { setSelectedLang({ flag: "/ru.png", code: "RU" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/ru.png" alt="RU" className="w-8 h-5" />
                                    </div>
                                    <div onClick={() => { setSelectedLang({ flag: "/uz.png", code: "UZ" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uz.png" alt="UZ" className="w-8 h-5" />
                                    </div>
                                    <div onClick={() => { setSelectedLang({ flag: "/uk.png", code: "EN" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uk.png" alt="EN" className="w-8 h-5" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="bg-white p-2 rounded-md focus:outline-none">
                            <svg className="w-8 h-8" fill="none" stroke="#3066BE" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                    </div>
                </div>

                {/* Mobile dropdown menu */}
                {showMobileMenu && (
                    <div className="absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 z-50">
                        <a href="/community"
                           className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                            {texts[langCode].community}
                        </a>
                        <a href="/vacancies"
                           className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                            {texts[langCode].vacancies}
                        </a>
                        <a href="/chat"
                           className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                            {texts[langCode].chat}
                        </a>
                        <a href="/companies"
                           className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                            {texts[langCode].companies}
                        </a>
                        <button className="mt-3 bg-[#3066BE] text-white px-6 py-2 rounded-md hover:bg-[#274f94] transition text-[15px]">
                            {texts[langCode].login}
                        </button>
                    </div>
                )}

            </nav>

            {/* ========================== */}
            {/*        NOTIFICATION        */}
            {/* ========================== */}
            <div className="bg-white py-4 mt-[90px]">
                <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                    {/* O‘ngdagi iconlar */}
                    <div className="flex items-center gap-6 ml-6 absolute top-[32px] right-[40px] z-20">
                        {/* ? icon */}
                        <div className="cursor-pointer">
                            <span className="text-2xl text-black">?</span>
                        </div>

                        {/* Bell */}
                        <div className="relative cursor-pointer">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">1</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================== */}
            {/*            BODY            */}
            {/* ========================== */}
            <main className="max-w-7xl mx-auto px-4 py-10">
                {/* Title */}
                <h1
                    className="text-[35px] leading-[150%] text-center font-extrabold text-black mb-10"
                >
                    Компании
                </h1>

                {/* Main Layout */}
                <main className="max-w-7xl mx-auto px-4 lg:px-[70px] flex gap-[168px] mt-10">
                    {/* LEFT – FILTER */}
                    <div className="w-full lg:w-[260px] flex flex-col gap-6">
                        {/* Filter Blocks */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[16px] leading-[24px] text-black font-semibold ">
                                Компания:
                            </label>
                            <input
                                type="text"
                                placeholder="Выберите компанию"
                                className="w-[220px] h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-sm outline-none border-none text-black"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[16px] leading-[24px] text-black font-semibold">Локация:</label>
                            <input
                                type="text"
                                placeholder="Выберите локацию"
                                className="w-[220px] h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-sm outline-none border-none text-black"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[16px] leading-[24px] text-black font-semibold">Ключевое слово:</label>
                            <input
                                type="text"
                                placeholder="Образование, интернет"
                                className="w-[220px] h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-sm outline-none border-none text-black"
                            />
                        </div>

                        <div className="w-[231px] h-px bg-[#AEAEAE]"></div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm text-black font-semibold">Должность:</label>
                            <div className="border border-[#AEAEAE] rounded-[2px] p-2 w-[138px] text-black text-sm max-h-[200px] overflow-y-auto border-none">
                                {["Администрация", "Дизайн", "Образование", "Маркетинг", "Разработка"].map((item, i) => (
                                    <label key={i} className="flex items-center gap-2 mb-1">
                                        <input type="checkbox" className="accent-[#3066BE]" />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm text-black font-semibold">Рейтинг компании</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="text-[20px] cursor-pointer transition-colors"
                                        style={{ color: star <= rating ? "#FFBF00" : "#D9D9D9" }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <a className="text-[#3066BE] hover:text-[#3066BE]">и выше</a>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm text-black font-semibold">Размер компании</label>
                            {["1–50", "51–200", "200–500", "500–1000", "1000+", "любой размер"].map((size, i) => (
                                <label key={i} className="flex items-center gap-2 text-sm text-black">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            name="company_size"
                                            value={size}
                                            checked={selectedSize === size}
                                            onChange={() => setSelectedSize(size)}
                                            className="peer w-[18px] h-[18px] rounded-[2px] border border-[#AEAEAE] checked:bg-[#3066BE] checked:border-[#3066BE] appearance-none"
                                        />
                                    </div>
                                    {size}
                                </label>
                            ))}
                        </div>

                    </div>


                    {/* RIGHT – COMPANY LIST */}
                    <main className="flex-1 overflow-x-hidden px-8 py-6">
                        {/* BOSHI – chiziq */}
                        <div className="w-[1000px] ml-[-300px] h-px bg-[#AEAEAE]"></div>

                        {Array.isArray(companies) && companies.length > 0 ? (
                            companies.map((company) => {
                                const logoSrc = toMediaUrl(company?.logo); // ← FAQAT shu item ichida hisoblaymiz
                                return (
                                    <div key={company.id} onClick={() => setSelectedCompany(company)} className="cursor-pointer">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <img
                                                    src={logoSrc}
                                                    alt={`${company.name} Logo`}
                                                    className="w-[70px] h-[70px] rounded-full object-contain mt-5"
                                                    onError={(e) => { e.currentTarget.src = "/company-fallback.png"; }}
                                                />

                                                <button className="text-[30px] bg-white border-none leading-[45px] font-bold text-black ml-[-20px] mt-5">
                                                    {company.name}
                                                </button>

                                                <div className="flex items-center gap-1">
                                                    <p className="text-[15px] leading-[22.5px] font-medium text-[#3066BE] text-center ml-[-20px] mt-5">
                                                        {company.hire_rate ?? "0%"}
                                                    </p>
                                                    <img src="/star.png" alt="" className="mt-5" />
                                                </div>
                                            </div>

                                            <p className="text-[20px] leading-[30px] font-medium text-black">
                                                10+ сотрудников <span className="text-[#3066BE]">•</span> {company.location || "—"}
                                            </p>
                                            <p className="text-[20px] leading-[30px] text-[#AEAEAE] font-normal max-w-[695px]">
                                                {company.industry || "Отрасль не указана..."}
                                            </p>

                                            <div className="flex gap-6 mt-2 text-sm font-medium">
                                                <p className="text-black font-bold">
                                                    {company.open_jobpost_count ?? 0} <span className="text-[#3066BE]">вакансии</span> • {company.jobpost_count ?? 0} <span className="text-[#3066BE]">всего</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-[#AEAEAE] my-6"></div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 text-lg mt-4">Компаниялар mavjud emas yoki yuklanmoqda...</p>
                        )}


                    </main>
                </main>
            </main>

            {selectedCompany && (
                <CompanyModal
                    company={selectedCompany}
                    onClose={() => setSelectedCompany(null)}
                />
            )}

            {openCompanyId && (
                <CompanyModal
                    companyId={openCompanyId}
                    onClose={handleCloseModal}
                />
            )}


            {/* ==========================
                    PAGINATION SECTION
            ========================== */}
            <div className="w-full flex justify-center mt-6 mb-[64px]">
                <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setActivePage(page)}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                                    ${activePage === page
                                    ? "bg-[#3066BE] text-white border-[#3066BE]"
                                    : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#3066BE]/10"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    {/* Arrow Right */}
                    <button
                        onClick={() => activePage < totalPages && setActivePage(activePage + 1)}
                        className="w-10 h-10 rounded-full border-2 border-[#3066BE] bg-white flex items-center justify-center relative"
                    >
                        <img
                            src="/pagination.png"
                            alt="pagination"
                            className="w-5 h-5 object-contain absolute z-10"
                        />
                    </button>

                </div>
            </div>


            {/* ==========================
                FOOTER SECTION
            ========================== */}
            <footer className="w-full h-[393px] relative overflow-hidden">
                {/* Background image */}
                <img
                    src="/footer-bg.png"
                    alt="Footer background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                {/* Content */}
                <div className="relative z-20">
                    <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                        <div className="flex gap-[190px]">
                            {/* Logo */}
                            <div>
                                <h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">
                                    {texts[langCode].logo}
                                </h2>
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-2 gap-[184px]">
                                <div className="flex flex-col gap-[20px]">
                                    {texts[langCode].links.slice(0,4).map((link, idx) => (
                                        <a key={idx} href="#" className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                            <span>&gt;</span> {link}
                                        </a>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-[20px]">
                                    {texts[langCode].links.slice(4).map((link, idx) => (
                                        <a key={idx} href="#" className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                            <span>&gt;</span> {link}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                        <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                            <p>
                                {texts[langCode].copyright}
                            </p>

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
        </main>
    );
}