// src/pages/LandingPage.jsx
import React, { useState } from "react";
import Select from "react-select";
import {
    FaCalculator, FaGraduationCap, FaCogs, FaBriefcase,
    FaHeartbeat, FaLaptopCode, FaIndustry, FaGavel
} from "react-icons/fa";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import DashboardTablet from "../components/tablet/DashboardTablet.jsx";

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
    const [showSearch, setShowSearch] = useState(false);

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
            viewMore:"Посмотреть все →"
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
            description:"Sun'iy intellekt yordamida yaratilgan qadoqlash vizualizatsiyasini tuzatishga yordam beradigan rassomlarni izlayapmiz. Xususan, biz har bir renderdagi logotiplarni to‘g‘rilamoqchimiz. Bizda sun'iy intellekt bilan yaratilgan katta logotiplar + tasvirlar bazasi bor.",
            tags:["Logo dizayn","Adobe Illustrator","Adobe Photoshop"],
            payment:"To‘lov tasdiqlangan",
            location_vacancy:"O‘zbekiston",
            recommendedVacancies:"Tavsiya etilgan vakansiyalar",
            publishVacancy:"Vakansiya e’lon qilish",
            logo:"Logo",
            links:["Yordam","Bizning vakantiyalar","Saytda reklama","Dasturiy ta'minot talablari","Investorlar uchun","Kompaniyalar katalogi","Kasblar bo‘yicha ishlar"],
            copyright:"© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            createSite:"Sayt yaratish",
            viewMore:"Hammasini ko‘rish →"
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
            viewMore:"View all →"
        }
    };

    // quick alias
    const t = texts[langCode];

    // ==========================
    // CATEGORIES TEXTS
    // ==========================
    const categoriesTexts = {
        RU: [
            { icon: FaCalculator, title: "Бухгалтерия", vacancies: "331 открытых вакансий" },
            { icon: FaGraduationCap, title: "Образование", vacancies: "331 открытых вакансий" },
            { icon: FaCogs, title: "Машиностроение", vacancies: "331 открытых вакансий" },
            { icon: FaBriefcase, title: "Юридический", vacancies: "331 открытых вакансий" },
            { icon: FaHeartbeat, title: "Здравоохранение", vacancies: "331 открытых вакансий" },
            { icon: FaLaptopCode, title: "IT & Агентство", vacancies: "331 открытых вакансий" },
            { icon: FaIndustry, title: "Инжиниринг", vacancies: "331 открытых вакансий" },
            { icon: FaGavel, title: "Юридический", vacancies: "331 открытых вакансий" }
        ],
        UZ: [
            { icon: FaCalculator, title: "Buxgalteriya", vacancies: "331 ta ochiq ish o‘rni" },
            { icon: FaGraduationCap, title: "Ta'lim", vacancies: "331 ta ochiq ish o‘rni" },
            { icon: FaCogs, title: "Mashinasozlik", vacancies: "331 ta ochiq ish o‘rni" },
            { icon: FaBriefcase, title: "Yuridik", vacancies: "331 ta ochiq ish o‘rni" },
            { icon: FaHeartbeat, title: "Sog‘liqni saqlash", vacancies: "331 ta ochiq ish o‘rni" },
            { icon: FaLaptopCode, title: "IT & Agentlik", vacancies: "331 ta ochiq ish o‘rni" },
            { icon: FaIndustry, title: "Muhandislik", vacancies: "331 ta ochiq ish o‘rni" },
            { icon: FaGavel, title: "Yuridik", vacancies: "331 ta ochiq ish o‘rni" }
        ],
        EN: [
            { icon: FaCalculator, title: "Accounting", vacancies: "331 open vacancies" },
            { icon: FaGraduationCap, title: "Education", vacancies: "331 open vacancies" },
            { icon: FaCogs, title: "Mechanical Eng.", vacancies: "331 open vacancies" },
            { icon: FaBriefcase, title: "Legal", vacancies: "331 open vacancies" },
            { icon: FaHeartbeat, title: "Healthcare", vacancies: "331 open vacancies" },
            { icon: FaLaptopCode, title: "IT & Agency", vacancies: "331 open vacancies" },
            { icon: FaIndustry, title: "Engineering", vacancies: "331 open vacancies" },
            { icon: FaGavel, title: "Legal", vacancies: "331 open vacancies" }
        ]
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
        { value: "premium", label: "Premium" },
        { value: "basic", label: "Basic" }
    ];

    return (
        <>
            <div className="hidden lg:block font-sans relative">
                {/* ==========================
                NAVBAR
        ========================== */}
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md" aria-label="Primary">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        {/* Logo */}
                        <a href="/" aria-label="Home">
                            <img src="/logo.png" alt="Logo" className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain" />
                        </a>

                        {/* Center links */}
                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">{t.community}</a>
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">{t.vacancies}</a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">{t.chat}</a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">{t.companies}</a>
                        </div>

                        {/* Right side */}
                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            {/* Lang selector */}
                            <div className="relative flex items-center gap-2 cursor-pointer" onClick={() => setShowLang(!showLang)} aria-haspopup="listbox" aria-expanded={showLang}>
                                <img src={selectedLang.flag} alt={`${selectedLang.code} flag`} className="w-6 h-4 sm:w-7 sm:h-4 md:w-8 md:h-5 object-cover" />
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
                                </svg>
                                {showLang && (
                                    <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50" role="listbox">
                                        {[
                                            {flag:"/ru.png", code:"RU", alt:"RU"},
                                            {flag:"/uz.png", code:"UZ", alt:"UZ"},
                                            {flag:"/uk.png", code:"EN", alt:"EN"}
                                        ].map(opt => (
                                            <div
                                                key={opt.code}
                                                onClick={() => { setSelectedLang({flag: opt.flag, code: opt.code}); setShowLang(false); }}
                                                className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                                role="option"
                                                aria-selected={langCode === opt.code}
                                            >
                                                <img src={opt.flag} alt={`${opt.alt} flag`} className="w-8 h-5" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <ProfileDropdown />
                        </div>

                        {/* mobile flag + burger */}
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

                    {/* mobile dropdown menu */}
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

                {/* ==========================
           SEARCH INPUT HERO USTIDA
        ========================== */}
                {/* DESKTOP */}
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

                {/* MOBILE / TABLET */}
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

                {/* ==========================
                HERO SECTION
        ========================== */}
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
                            <LabeledInput label={t.keyword} placeholder={t.position} />
                            <LabeledSelect label={t.location} placeholder={t.selectRegion} options={optionsRegion} />
                            <LabeledSelect label={t.salary} placeholder={t.selectSalary} options={optionsSalary} />
                            <LabeledSelect label={t.plan} placeholder={t.premium} options={optionsPlan} />
                            <button className="bg-[#3066BE] text-white w-full sm:w-20 h-12 rounded-xl hover:bg-[#254f99] transition flex items-center justify-center shadow-sm" type="button" aria-label="Search">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ==========================
                CATEGORIES SECTION
        ========================== */}
                <div className="py-16 px-6 max-w-6xl mx-auto">
                    <h2 className="text-center text-3xl font-bold text-[#000000] mb-12">{t.categories}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {categoriesTexts[langCode].map((cat, idx) => (
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

                {/* ==========================
                VACANCY SECTION
        ========================== */}
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <h1 className="text-center font-extrabold text-[35px] leading-[150%] text-black mb-10">
                        {t.recommendedVacancies}
                    </h1>

                    <SectionHeader title={t.publishVacancy} />
                    <VacancyCard t={t} />
                    <hr className="border-t border-[#D9D9D9] mb-6" />

                    <VacancyCard t={t} />
                    <hr className="border-t border-[#D9D9D9] mb-6" />

                    <VacancyCard t={t} />
                    <hr className="border-t border-[#D9D9D9] mb-6" />
                </div>
                {/* ==========================
                        CTA SECTION
                ========================== */}
                <section className="w-full bg-[#3066BE] py-12 relative overflow-visible">
                    {/* Orqa fon dumaloqlar */}
                    <img
                        src="/dots-bg.png"
                        alt="dots"
                        className="absolute top-0 left-0 w-[300px] h-auto opacity-60"
                    />

                    {/* Kontent */}
                    <div className="max-w-7xl mx-auto flex items-center justify-between px-6 relative z-10 overflow-visible">
                        {/* Qiz */}
                        <div className="relative overflow-visible">
                            <img
                                src="/call-center.png"
                                alt="girl"
                                className="w-[350px] object-contain relative z-20"
                                style={{ transform: "scale(1.8) translateX(-30px) translateY(-20px)" }}
                            />
                        </div>
                        {/* Matn va tugmalar */}
                        <div className="text-white max-w-md ml-6">
                            <h2 className="text-4xl font-bold mb-6">
                                Найдите работу своей мечты сегодня.
                            </h2>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 border-2 border-white bg-[#3066BE] text-white rounded-md hover:bg-white hover:text-[#3066BE] transition font-semibold">
                                    Заполнить резюме
                                </button>
                                <button className=" text-black px-6 py-3 bg-white rounded-md hover:bg-[#f0f0f0] transition font-semibold">
                                    Зарегистрироваться
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==========================
                        VACANCY SECTION
                ========================== */}
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="max-w-5xl mx-auto px-6 py-6">
                        <div className="rounded-xl shadow p-6 mb-6 hover:shadow-lg transition">

                            {/* Yuqori vaqt */}
                            <div className="flex items-center text-gray-400 text-sm mb-2">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {texts[selectedLang.code].published}
                            </div>

                            {/* Nom */}
                            <h2 className="text-2xl font-bold text-black mb-1">
                                {texts[selectedLang.code].needed}
                            </h2>

                            {/* Byudjet */}
                            <p className="text-gray-400 mb-4">
                                {texts[selectedLang.code].budget}
                            </p>

                            {/* Description */}
                            <p className="text-gray-500 mb-4">
                                {texts[selectedLang.code].description}
                            </p>

                            {/* Taglar */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {texts[selectedLang.code].tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Pastki qator */}
                            <div className="flex items-center justify-between text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-6 h-6">
                                        <img src="/badge-background.svg" alt="bg" className="w-6 h-6" />
                                        <img src="/check.svg" alt="check" className="absolute inset-0 w-3 h-3 m-auto" />
                                    </div>
                                    {texts[selectedLang.code].payment}
                                </div>

                                <div className="flex items-center gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09L5.82 12.5
                                    1 8.91l6.09-.9L10 2.5l2.91
                                    5.51 6.09.9-4.82 3.59
                                    1.698 5.59z"/>
                                        </svg>
                                    ))}
                                    <svg className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09L5.82 12.5
                                    1 8.91l6.09-.9L10 2.5l2.91
                                    5.51 6.09.9-4.82 3.59
                                    1.698 5.59z"/>
                                    </svg>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative w-5 h-5">
                                        <img src="/location.png" alt="location" className="w-9 h-5" />
                                    </div>
                                    {texts[selectedLang.code].location_vacancy}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="border-t border-[#D9D9D9] mb-6" />

                    <div className="max-w-5xl mx-auto px-6 py-6">
                        <div className="rounded-xl shadow p-6 mb-6 hover:shadow-lg transition">

                            {/* Yuqori vaqt */}
                            <div className="flex items-center text-gray-400 text-sm mb-2">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {texts[selectedLang.code].published}
                            </div>

                            {/* Nom */}
                            <h2 className="text-2xl font-bold text-black mb-1">
                                {texts[selectedLang.code].needed}
                            </h2>

                            {/* Byudjet */}
                            <p className="text-gray-400 mb-4">
                                {texts[selectedLang.code].budget}
                            </p>

                            {/* Description */}
                            <p className="text-gray-500 mb-4">
                                {texts[selectedLang.code].description}
                            </p>

                            {/* Taglar */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {texts[selectedLang.code].tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Pastki qator */}
                            <div className="flex items-center justify-between text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-6 h-6">
                                        <img src="/badge-background.svg" alt="bg" className="w-6 h-6" />
                                        <img src="/check.svg" alt="check" className="absolute inset-0 w-3 h-3 m-auto" />
                                    </div>
                                    {texts[selectedLang.code].payment}
                                </div>

                                <div className="flex items-center gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09L5.82 12.5
                                    1 8.91l6.09-.9L10 2.5l2.91
                                    5.51 6.09.9-4.82 3.59
                                    1.698 5.59z"/>
                                        </svg>
                                    ))}
                                    <svg className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09L5.82 12.5
                                    1 8.91l6.09-.9L10 2.5l2.91
                                    5.51 6.09.9-4.82 3.59
                                    1.698 5.59z"/>
                                    </svg>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative w-5 h-5">
                                        <img src="/location.png" alt="location" className="w-9 h-5" />
                                    </div>
                                    {texts[selectedLang.code].location_vacancy}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="border-t border-[#D9D9D9] mb-6" />
                </div>

                <div className="flex justify-end pr-[75px] mt-10 mb-[74px]">
                    <button className="bg-[#3066BE] text-white px-6 py-3 rounded-lg hover:bg-[#254f99] transition-colors duration-300">
                        {texts[langCode].viewMore}
                    </button>
                </div>

                {/* ==========================
                FOOTER SECTION
                ========================== */}
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

            {/* Tablet / Mobile */}
            <div className="block lg:hidden">
                <DashboardTablet />
            </div>
        </>
    );
}

/* ==========================
   SMALL SUBCOMPONENTS
========================== */

function LabeledInput({ label, placeholder }) {
    return (
        <div className="flex flex-col w-full sm:w-52">
            <span className="text-[14px] sm:text-[16px] mb-1 text-[#000]">{label}</span>
            <input
                type="text"
                placeholder={placeholder}
                className="border-none rounded-xl px-5 h-12 w-full bg-white/80 shadow-sm text-[16px] text-left text-[#000] placeholder:text-[#AEAEAE] focus:outline-none"
            />
        </div>
    );
}

function LabeledSelect({ label, placeholder, options }) {
    return (
        <div className="flex flex-col w-full sm:w-52">
            <span className="text-[14px] sm:text-[16px] mb-1 text-[#000]">{label}</span>
            <Select placeholder={placeholder} options={options} styles={selectStyles()} />
        </div>
    );
}

function SectionHeader({ title }) {
    return (
        <div className="max-w-5xl mx-auto px-6 mt-6">
            <h2 className="text-[18px] leading-[150%] font-bold text-black mb-2">{title}</h2>
            <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-6"></div>
            <hr className="border-t border-[#D9D9D9] mb-6" />
        </div>
    );
}

function VacancyCard({ t }) {
    return (
        <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="rounded-xl shadow p-6 mb-6 hover:shadow-lg transition">
                {/* Top time */}
                <div className="flex items-center text-gray-400 text-sm mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {t.published}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-black mb-1">{t.needed}</h2>

                {/* Budget */}
                <p className="text-gray-400 mb-4">{t.budget}</p>

                {/* Description */}
                <p className="text-gray-500 mb-4">{t.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {t.tags.map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">{tag}</span>
                    ))}
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6" aria-hidden="true">
                            <img src="/badge-background.svg" alt="" className="w-6 h-6" />
                            <img src="/check.svg" alt="" className="absolute inset-0 w-3 h-3 m-auto" />
                        </div>
                        {t.payment}
                    </div>

                    <div className="flex items-center gap-1" aria-label="Rating">
                        {[...Array(4)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                            </svg>
                        ))}
                        <svg className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                        </svg>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5" aria-hidden="true">
                            <img src="/location.png" alt="" className="w-9 h-5" />
                        </div>
                        {t.location_vacancy}
                    </div>
                </div>
            </div>
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
