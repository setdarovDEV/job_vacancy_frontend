import React, { useState } from "react";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PricingPlansTablet from "../components/tablet/PricingPlansTablet.jsx";
import PricingPlansMobile from "../components/mobile/PricingPlansMobile.jsx";


// ==========================
// COMPONENT START
// ==========================
export default function PricingPlans({ currentPlan = "basic", onSelect = () => {} }) {
    // ==========================
    // STATE
    // ==========================
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu] = useState(false);

    const plans = [
        {
            key: "premium",
            name: "Premium",
            price: 20,
            oldPrice: 25,
            badge: null,
            cta: "Купить Premium",
            positive: 5,
            negative: 3,
        },
        {
            key: "basic",
            name: "Basic",
            price: 0,
            oldPrice: null,
            badge: "Ваш текущий план",
            cta: null, // current plan — tugma yo'q
            positive: 5,
            negative: 3,
        },
        {
            key: "pro",
            name: "Pro",
            price: 12,
            oldPrice: 15,
            badge: null,
            cta: "Купить Pro",
            positive: 5,
            negative: 3,
        },
    ];

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

    return (
        <>
            <div className="hidden md:block lg:hidden">
                <PricingPlansTablet />
            </div>
            <div className="block md:hidden">
                <PricingPlansMobile />
            </div>
        <div className="hidden lg:block font-sans relative bg-white">
            {/* ==========================
                        NAVBAR
            ========================== */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                <div
                    className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                    {/* Logo */}
                    <a href="/"><img src="/logo.png" alt="Logo"
                                     className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain"/></a>

                    {/* Center links */}
                    <div
                        className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto text-medium">
                        <a href="/community"
                           className="text-black  hover:text-[#3066BE] transition">{texts[langCode].community}</a>
                        <a href="/vacancies"
                           className="text-black hover:text-[#3066BE] transition">{texts[langCode].vacancies}</a>
                        <a href="/chat"
                           className="text-black hover:text-[#3066BE] transition">{texts[langCode].chat}</a>
                        <a href="/companies"
                           className="text-black hover:text-[#3066BE] transition">{texts[langCode].companies}</a>
                    </div>

                    {/* Right side: flag + login (md va katta) */}
                    <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                        {/* Lang selector */}
                        <div className="relative flex items-center gap-2 cursor-pointer"
                             onClick={() => setShowLang(!showLang)}>
                            <img src={selectedLang.flag} alt={selectedLang.code}
                                 className="w-6 h-4 sm:w-7 sm:h-4 md:w-8 md:h-5 object-cover"/>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
                            </svg>
                            {showLang && (
                                <div
                                    className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                    <div onClick={() => {
                                        setSelectedLang({flag: "/ru.png", code: "RU"});
                                        setShowLang(false);
                                    }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/ru.png" alt="RU" className="w-8 h-5"/>
                                    </div>
                                    <div onClick={() => {
                                        setSelectedLang({flag: "/uz.png", code: "UZ"});
                                        setShowLang(false);
                                    }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uz.png" alt="UZ" className="w-8 h-5"/>
                                    </div>
                                    <div onClick={() => {
                                        setSelectedLang({flag: "/uk.png", code: "EN"});
                                        setShowLang(false);
                                    }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uk.png" alt="EN" className="w-8 h-5"/>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Login/Avatar */}

                        <ProfileDropdown />

                    </div>


                    {/* mobile flag + burger */}
                    <div className="md:hidden flex items-center gap-3 pr-4 sm:pr-6 pt-2">
                        <div className="relative flex items-center gap-1 cursor-pointer"
                             onClick={() => setShowLang(!showLang)}>
                            <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 object-cover"/>
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
                            </svg>
                            {showLang && (
                                <div
                                    className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                    <div onClick={() => {
                                        setSelectedLang({flag: "/ru.png", code: "RU"});
                                        setShowLang(false);
                                    }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/ru.png" alt="RU" className="w-8 h-5"/>
                                    </div>
                                    <div onClick={() => {
                                        setSelectedLang({flag: "/uz.png", code: "UZ"});
                                        setShowLang(false);
                                    }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uz.png" alt="UZ" className="w-8 h-5"/>
                                    </div>
                                    <div onClick={() => {
                                        setSelectedLang({flag: "/uk.png", code: "EN"});
                                        setShowLang(false);
                                    }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uk.png" alt="EN" className="w-8 h-5"/>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Login/Avatar */}
                        <div className="w-[56px] h-[56px] rounded-full overflow-hidden">
                            <img src="/review-user.png" alt="User" className="w-full h-full object-cover" />
                        </div>


                    </div>
                </div>

                {/* mobile dropdown menu */}
                {showMobileMenu && (
                    <div
                        className="absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 z-50">
                        <a href=""
                           className="w-full px-4 py-3 text-center text-[#3066BE] hover:bg-gray-100 hover:text-[#3066BE] transition">
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
                        <button
                            className="mt-3 bg-[#3066BE] text-white px-6 py-2 rounded-md hover:bg-[#274f94] transition text-[15px]">
                            {texts[langCode].login}
                        </button>
                    </div>
                )}
            </nav>

            {/* ========================== */}
            {/*        NOTIFICATION        */}
            {/* ========================== */}
            <div className="bg-white py-4 mt-[90px] mb-[100px]">
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


            <div className="min-h-screen bg-white flex items-start justify-center">
                <div className="w-full max-w-6xl px-4 py-10">
                    <div className="grid md:grid-cols-3 gap-6 items-stretch text-black">
                        {plans.map((p) => (
                            <Card
                                key={p.key}
                                plan={p}
                                isCurrent={currentPlan === p.key}
                                onSelect={() => onSelect(p.key)}
                            />
                        ))}
                    </div>
                </div>
            </div>


            {/* ==========================
                FOOTER SECTION
            ========================== */}
            <footer className="w-full h-[393px] relative overflow-hidden mt-[-150px]">
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
        </div>
        </>
    );
}

function Card({ plan, isCurrent, onSelect }) {
    const {
        name,
        price,
        oldPrice,
        badge,
        cta,
        positive = 5,
        negative = 3,
    } = plan;

    // Vizual parametrlari (skrinshotga mos)
    const wrapBase =
        "relative bg-white rounded-[22px] border shadow-[0_10px_24px_rgba(0,0,0,0.08)]";
    const wrapActive =
        "border-[#2F61C9] bg-[#F4F6FA] shadow-[0_10px_24px_rgba(47,97,201,0.25)]";
    const wrapInactive = "border-[#E6EBF3]";

    return (
        <div className={`${wrapBase} ${isCurrent ? wrapActive : wrapInactive} relative`}>
        {/* Top badge (faqat centre — "Ваш текущий план") */}
            {badge && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="bg-[#2F61C9] w-[357px] h-[65px] text-center text-white text-[20px] font-semibold rounded-t-[18px] rounded-b-none px-6 py-3 shadow-md">
                        <p className="mt-[7px]">{badge}</p>
                    </div>
                </div>
            )}
            <div className={`p-6 md:p-8 ${badge ? "pt-20" : ""}`}>
                {/* Title */}
                <h3 className="text-[24px] md:text-[26px] font-semibold text-center mb-2">{name}</h3>

                {/* Price */}
                <div className="text-center mb-4">
                    {oldPrice ? (
                        <div className="text-gray-400 line-through mb-1 select-none">
                            {oldPrice.toFixed(2)}$
                        </div>
                    ) : (
                        <div className="h-[20px]" />
                    )}
                    <div className="text-[30px] md:text-[32px] font-extrabold tracking-tight">
                        {price.toFixed(2)}$<span className="text-[18px] font-semibold">/месяц</span>
                    </div>
                </div>

                {/* CTA */}
                {cta ? (
                    <button
                        onClick={onSelect}
                        className="w-full bg-[#2F61C9] text-white font-semibold rounded-xl py-3 mt-2 mb-4 hover:opacity-90 transition"
                    >
                        {cta}
                    </button>
                ) : (
                    <div className="h-[44px] mb-4" />
                )}

                {/* Features */}
                <ul className="flex flex-col gap-3 text-[15px]">
                    {Array.from({ length: positive }).map((_, i) => (
                        <li key={`ok-${i}`} className="flex items-center gap-3 text-[#2F61C9]">
                            <CheckIcon />
                            <span className="text-gray-700">Lorem ipsum Lorem ipsum</span>
                        </li>
                    ))}
                    {Array.from({ length: negative }).map((_, i) => (
                        <li key={`no-${i}`} className="flex items-center gap-3 text-[#9BB3E6]">
                            <CrossIcon />
                            <span className="text-gray-400">Lorem ipsum Lorem ipsum</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* --- Minimal SVG ikonlar (external lib’siz) --- */
function CheckIcon() {
    return (
        <svg
            className="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

function CrossIcon() {
    return (
        <svg
            className="w-5 h-5 flex-shrink-0 rotate-45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}