// src/pages/ActivityTablet.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileDropdown from "../../components/ProfileDropdown.jsx"; // yoki ProfileDropdownJobSeekerTablet
import {
    fetchSavedVacancies,
    removeSavedVacancy,
    fetchApplications,
    formatApplication,
    formatSavedVacancy,
} from "../../utils/activity";
import ResponsivePage from "../../components/ResponsivePage";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";

export default function ActivityTablet() {
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [tab, setTab] = useState("saved");
    const [saved, setSaved] = useState({ items: [], loading: false, error: "" });
    const [applied, setApplied] = useState({ items: [], loading: false, error: "" });

    useEffect(() => {
        // Load data when tab changes
        if (tab === "saved" && !saved.loading) {
            loadSaved();
        } else if (tab === "applied" && !applied.loading) {
            loadApplied();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    async function loadSaved() {
        setSaved((s) => ({ ...s, loading: true, error: "" }));
        try {
            const data = await fetchSavedVacancies();
            // Format each vacancy using formatSavedVacancy
            const formattedItems = (data.results || []).map(formatSavedVacancy).filter(Boolean);
            setSaved({ items: formattedItems, loading: false, error: "" });
        } catch (e) {
            console.error("Error loading saved vacancies:", e);
            setSaved((s) => ({ ...s, loading: false, error: "Не удалось загрузить сохранённые вакансии" }));
        }
    }
    async function loadApplied() {
        setApplied((s) => ({ ...s, loading: true, error: "" }));
        try {
            const data = await fetchApplications();
            // Format each application using formatApplication
            const formattedItems = (data.results || []).map(formatApplication).filter(Boolean);
            setApplied({ items: formattedItems, loading: false, error: "" });
        } catch (e) {
            console.error("Error loading applications:", e);
            setApplied((s) => ({ ...s, loading: false, error: "Не удалось загрузить отклики" }));
        }
    }
    async function onUnsave(id) {
        try {
            await removeSavedVacancy(id);
            setSaved((s) => ({ ...s, items: s.items.filter((v) => v.id !== id) }));
        } catch {
            alert("Не удалось удалить из сохранённых");
        }
    }

    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";
    const texts = {
        RU: {
            activityTitle: "Ваша активность",
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
            activityTitle: "Sizning faolligingiz",
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
            activityTitle: "Your activity",
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
        <ResponsivePage>
            <div className="font-sans relative">
                {/* NAVBAR (tablet) */}
                <NavbarTabletLogin />

                {/* TOP spacer */}
                <div className="h-[76px]" />

                {/* CONTENT (tablet) */}
                <div className="max-w-[960px] mx-auto px-4 pb-10">
                    <h1 className="text-[24px] md:text-[28px] leading-[32px] font-bold text-center mb-5">
                        {texts[langCode].activityTitle}
                    </h1>

                    <div className="bg-white border border-[#E5EAF2] rounded-3xl overflow-hidden">
                        {/* Tabs */}
                        <div className="flex items-end gap-10 h-[64px]">
                            {/* Saved */}
                            <button
                                onClick={() => setTab("saved")}
                                className="relative ml-[24px] border-none mb-[18px] px-0 py-2 bg-transparent focus:outline-none"
                            >
                                <span className={`text-[16px] font-semibold ${tab === "saved" ? "text-black" : "text-gray-500"}`}>
                                  Сохранённые вакансии
                                </span>
                                <span className={`absolute left-0 -bottom-1 h-[3px] w-16 transition ${tab === "saved" ? "bg-black" : "bg-gray-300"}`} />
                            </button>

                            {/* Applied */}
                            <button
                                onClick={() => setTab("applied")}
                                className="relative mb-[18px] border-none px-0 py-2 bg-transparent focus:outline-none"
                            >
                <span className={`text-[16px] font-semibold ${tab === "applied" ? "text-black" : "text-gray-500"}`}>
                  Отклики на вакансии
                </span>
                                <span className={`absolute left-0 -bottom-1 h-[3px] w-16 transition ${tab === "applied" ? "bg-black" : "bg-gray-300"}`} />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[#E5EAF2]" />

                        {/* Lists */}
                        <div className="p-5 md:p-6 min-h-[260px]">
                            {tab === "saved" ? (
                                <SavedList items={saved.items} loading={saved.loading} error={saved.error} onUnsave={onUnsave} />
                            ) : (
                                <AppliedList items={applied.items} loading={applied.loading} error={applied.error} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER — Logo tepada, linklar pastda */}
            <footer className="w-full relative overflow-hidden mt-16">
                {/* Background */}
                <img
                    src="/footer-bg.png"
                    alt="Footer background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                {/* Content */}
                <div className="relative z-20 max-w-[960px] mx-auto px-4 py-10 text-white">
                    {/* Logo */}
                    <div className="mb-8">
                        <h2 className="text-[10px] font-black font-gilroy select-none">
                            {texts[langCode].logo}
                        </h2>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-x-20 gap-y-4 mb-10">
                        <div className="flex flex-col gap-5">
                            {texts[langCode].links.slice(0, 4).map((link, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="flex items-center gap-2 text-white hover:text-[#F2F4FD] text-[18px] leading-[120%] font-gilroy transition-colors"
                                >
                                    <span>›</span> {link}
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-5">
                            {texts[langCode].links.slice(4).map((link, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="flex items-center gap-2 text-white hover:text-[#F2F4FD] text-[18px] leading-[120%] font-gilroy transition-colors"
                                >
                                    <span>›</span> {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="rounded-[12px] bg-[#3066BE]/70 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* chap */}
                        <p className="text-[16px] font-gilroy">
                            {texts[langCode].copyright} ·{" "}
                            <span className="underline">Карта сайта</span>
                        </p>

                        {/* o‘ng */}
                        <a
                            href="#"
                            className="text-[16px] font-gilroy underline underline-offset-4 decoration-white/70 hover:text-white"
                        >
                            <div className="flex items-center gap-5 text-[22px]">
                                <a href="#" className="text-[#F2F4FD] hover:text-[#F2F4FD]"><i className="fab fa-whatsapp"></i></a>
                                <a href="#" className="text-[#F2F4FD] hover:text-[#F2F4FD]"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="text-[#F2F4FD] hover:text-[#F2F4FD]"><i className="fab fa-facebook"></i></a>
                                <a href="#" className="text-[#F2F4FD] hover:text-[#F2F4FD]"><i className="fab fa-twitter"></i></a>
                            </div>
                        </a>
                    </div>
                </div>
            </footer>

        </ResponsivePage>
    );
}

/* ====== Lists (unchanged logic, tablet-friendly classes) ====== */
function SavedList({ items, loading, error, onUnsave }) {
    if (loading) return <SkeletonList />;
    if (error) return <Empty text={error} />;
    if (!items.length) return <Empty text="Пока нет сохранённых вакансий." />;

    return (
        <ul className="flex flex-col gap-3 md:gap-4">
            {items.map((v) => (
                <li key={v.id} className="border border-[#E5EAF2] rounded-2xl p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="font-semibold text-[16px] leading-6 truncate">{v.title || v.name || "Vacancy"}</div>
                        <div className="text-gray-500 text-[13px] mt-1 line-clamp-2">
                            {(v.company?.name || v.company_name || "—") + " • " + (v.location || v.city || "Локация не указана")}
                        </div>
                        <div className="text-[13px] mt-1">{v.salary ? `З/п: ${formatSalary(v.salary)}` : ""}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/vacancies/${v.slug || v.id}`} className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50">
                            Перейти
                        </Link>
                        <button onClick={() => onUnsave(v.id)} className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50" title="Удалить из сохранённых">
                            Удалить
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function AppliedList({ items, loading, error }) {
    if (loading) return <SkeletonList />;
    if (error) return <Empty text={error} />;
    if (!items.length) return <Empty text="Пока нет откликов." />;

    return (
        <ul className="flex flex-col gap-3 md:gap-4">
            {items.map((a) => {
                // formatApplication returns { vacancy: {...}, status, created_at, etc. }
                const vacancy = a.vacancy || a.job || a.job_post || a.post || {};
                const status = a.status || "APPLIED";
                const created = a.created_at || a.created || a.date;
                return (
                    <li key={a.id} className="border border-[#E5EAF2] rounded-2xl p-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="font-semibold text-[16px] leading-6 truncate">{vacancy.title || vacancy.name || "Vacancy"}</div>
                            <div className="text-gray-500 text-[13px] mt-1 line-clamp-2">
                                {(vacancy.company?.name || vacancy.company_name || "—") + " • " + (vacancy.location || vacancy.city || "Локация не указана")}
                            </div>
                            <div className="text-[13px] mt-1">
                                Статус: <span className="font-medium">{status}</span>
                                {created ? <>{" · "}Дата: {new Date(created).toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" })}</> : null}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Link to={`/vacancies/${vacancy.slug || vacancy.id || a.job_post}`} className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50">
                                Перейти
                            </Link>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function Empty({ text }) {
    return <div className="text-center text-gray-400 py-16 text-[14px]">{text}</div>;
}
function SkeletonList() {
    return (
        <ul className="flex flex-col gap-3 md:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="border border-[#E5EAF2] rounded-2xl p-4 animate-pulse">
                    <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                </li>
            ))}
        </ul>
    );
}

function formatSalary(s) {
    if (typeof s === "string") return s;
    if (!s) return "";
    const { from, to, currency } = s || {};
    if (from && to) return `${from.toLocaleString()}–${to.toLocaleString()} ${currency || ""}`.trim();
    if (from) return `от ${from.toLocaleString()} ${currency || ""}`.trim();
    if (to) return `до ${to.toLocaleString()} ${currency || ""}`.trim();
    if (typeof s === "number") return s.toLocaleString();
    return "";
}
