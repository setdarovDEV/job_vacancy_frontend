// src/components/tablet/PricingBodyTablet.jsx
import React, {useState} from "react";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";

/** Rasmga o‘xshash pricing UI (tablet) */
export default function PricingBodyTablet({
                                              currentPlan = "basic",
                                              onSelect = () => {},
                                          }) {

    const [selectedLang, setSelectedLang] = useState({flag: "/ru.png", code: "RU"});
    const [showLang, setShowLang] = useState(false);

    const plans = [
        { key: "premium", name: "Premium", price: 20, oldPrice: 25, cta: "Купить Premium" },
        { key: "basic",   name: "Basic",   price: 0,  oldPrice: null, badge: "Ваш текущий план" },
        { key: "pro",     name: "Pro",     price: 12, oldPrice: 15, cta: "Купить Pro" },
    ];

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
            <NavbarTabletLogin />
            <div className="hidden md:block lg:hidden bg-white min-h-screen">
                {/* ========================== */}
                {/*        NOTIFICATION        */}
                {/* ========================== */}
                <div className="bg-white py-3 md:py-2 mt-[20px] mb-[20px]">
                    <div className="mx-auto w-full max-w-[960px] px-3 md:px-4 flex items-center justify-end">
                        <div className="flex items-center gap-4 md:gap-3">
                            {/* Bell */}
                            <div className="relative cursor-pointer mr-[15px]">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">1</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="mx-auto max-w-[980px] px-4 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                        {plans.map((p, idx) => (
                            <Card
                                key={p.key}
                                plan={p}
                                isCurrent={currentPlan === p.key}
                                emphasized={idx === 1} // markazdagi kartani kattaroq/ko‘k chegara
                                onSelect={() => onSelect(p.key)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ==========================
                FOOTER SECTION
            ========================== */}
            <footer className="relative overflow-hidden md:block lg:hidden mt-[50px] w-full">
                {/* Background */}
                <img
                    src="/footer-bg.png"
                    alt="Footer background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                {/* Content */}
                <div className="relative z-20 w-full px-6 py-8 text-white">
                    {/* Top area */}
                    <div className="flex flex-col gap-6">
                        {/* Logo */}
                        <h2 className="text-[36px] font-black">
                            {texts?.[langCode]?.logo || "Community"}
                        </h2>

                        {/* Links (2 columns) */}
                        <div className="grid grid-cols-2 text-white gap-x-10 gap-y-3">
                            {texts?.[langCode]?.links?.slice(0, 4).map((link, i) => (
                                <a
                                    key={`l-${i}`}
                                    href="#"
                                    className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors"
                                >
                                    <span>›</span> {link}
                                </a>
                            ))}
                            {texts?.[langCode]?.links?.slice(4).map((link, i) => (
                                <a
                                    key={`r-${i}`}
                                    href="#"
                                    className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors"
                                >
                                    <span>›</span> {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[13px] leading-snug">
                                {texts?.[langCode]?.copyright}
                            </p>

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

function Card({ plan, isCurrent, emphasized, onSelect }) {
    const { name, price, oldPrice, badge, cta } = plan;

    // rasmga yaqin o‘lchamlar
    const wrapBase =
        "relative rounded-[26px] bg-white shadow-[0_14px_26px_rgba(0,0,0,0.10)]";
    const wrapEmph = emphasized
        ? "border border-[#2F61C9] bg-[#F4F6FA] shadow-[0_16px_30px_rgba(47,97,201,0.25)]"
        : "border border-[#E8ECF3]";
    const pad = emphasized ? "pt-0" : "pt-0";

    return (
        <div className={`${wrapBase} ${wrapEmph} ${pad} overflow-hidden`}>
            {/* Ko‘k tepa strip (faqat current/basic) */}
            {badge && (
                <div className="h-[56px] w-full bg-[#2F61C9] text-white flex items-center justify-center text-[16px] font-semibold">
                    {badge}
                </div>
            )}

            <div className="px-6 pt-6 pb-7">
                {/* Title */}
                <h3 className="text-[22px] font-semibold text-center text-[#111827] mb-3">
                    {name}
                </h3>

                {/* Price qismi */}
                <div className="text-center mb-4">
                    {oldPrice ? (
                        <div className="text-[#B5BCCD] line-through text-[16px] mb-1 select-none">
                            {oldPrice.toFixed(2)}$
                        </div>
                    ) : (
                        <div className="h-[20px]" />
                    )}
                    <div className="text-[26px] md:text-[28px] font-extrabold tracking-tight text-black">
                        {price.toFixed(2)}$
                        <span className="ml-0.5 text-[18px] font-bold">/месяц</span>
                    </div>
                </div>

                {/* CTA */}
                {cta ? (
                    <button
                        onClick={onSelect}
                        className="w-full h-[44px] rounded-xl bg-[#2F61C9] text-white text-[14px] font-semibold hover:opacity-90 transition mb-5"
                    >
                        {cta}
                    </button>
                ) : (
                    <div className="h-[44px] mb-5" />
                )}

                {/* Features: 5 ta ✓, 3 ta ✗  — rasmga mos ranglar */}
                <ul className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <li key={`ok-${i}`} className="flex items-center gap-3">
                            <CheckIcon className="text-[#2F61C9]" />
                            <span className="text-[#374151] text-[15px]">
                Lorem ipsum Lorem ipsum
              </span>
                        </li>
                    ))}
                    {Array.from({ length: 3 }).map((_, i) => (
                        <li key={`no-${i}`} className="flex items-center gap-3">
                            <CrossIcon className="text-[#9BB3E6]" />
                            <span className="text-[#9CA3AF] text-[15px]">
                Lorem ipsum Lorem ipsum
              </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* ikonlar */
function CheckIcon({ className = "" }) {
    return (
        <svg
            className={`w-[18px] h-[18px] ${className}`}
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
function CrossIcon({ className = "" }) {
    return (
        <svg
            className={`w-[18px] h-[18px] rotate-45 ${className}`}
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
