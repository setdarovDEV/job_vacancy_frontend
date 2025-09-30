// src/pages/ApplicantProfileByApplication.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import { normalizeName } from "../utils/normalizeName";
import ApplicantProfileByApplicationTablet from "../components/tablet/ApplicantProfileByApplicationTablet.jsx";
import EmployerApplicationsMobile from "../components/mobile/EmployerApplicationsMobile.jsx";

export default function ApplicantProfileByApplication() {
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu] = useState(false);

    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --- URL helper: backenddan kelgan relative pathlarni to‘liq URLga aylantirish
    const makeAbsUrl = (path) => {
        if (!path) return "";
        const s = String(path).trim();
        if (/^https?:\/\//i.test(s)) return s;
        const base = (api?.defaults?.baseURL || "").replace(/\/+$/, ""); // .../api
        const clean = s.replace(/^\/+/, ""); // boshidagi / larni olamiz
        return `${base}/${clean}`;
    };

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError("");

        api
            .get(`/api/applications/${applicationId}/applicant/`)
            .then((res) => {
                if (!alive) return;
                const d = res.data || {};

                // media yo‘llarini to‘liq qilamiz
                const avatar = d.avatar ? makeAbsUrl(d.avatar) : "";
                const certificates = Array.isArray(d.certificates)
                    ? d.certificates.map((c) => ({ ...c, file_url: makeAbsUrl(c.file_url || c.file) }))
                    : [];
                const portfolio_projects = Array.isArray(d.portfolio_projects)
                    ? d.portfolio_projects.map((p) => ({
                        ...p,
                        media: Array.isArray(p.media)
                            ? p.media.map((m) => ({ ...m, file_url: makeAbsUrl(m.file_url || m.file) }))
                            : [],
                    }))
                    : [];

                setData({ ...d, avatar, certificates, portfolio_projects });
            })
            .catch((e) => {
                if (!alive) return;
                setError(e?.response?.data?.detail || "Profilni yuklashda xatolik.");
            })
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [applicationId]);

    if (loading) return <div className="p-6">Yuklanmoqda…</div>;
    if (error)
        return (
            <div className="p-6">
                <div className="text-red-600 mb-3">{error}</div>
                <button className="px-4 py-2 rounded border" onClick={() => navigate(-1)}>
                    ← Orqaga
                </button>
            </div>
        );
    if (!data) return <div className="p-6">Ma’lumot topilmadi</div>;

    const skills = Array.isArray(data.skills) ? data.skills : [];
    const languages = Array.isArray(data.languages) ? data.languages : [];
    const educations = Array.isArray(data.educations) ? data.educations : [];
    const portfolio = Array.isArray(data.portfolio_projects) ? data.portfolio_projects : [];
    const certificates = Array.isArray(data.certificates) ? data.certificates : [];
    const experiences = Array.isArray(data.experiences) ? data.experiences : [];

    const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

    // ==========================
    // LANG CODE HANDLING
    // ==========================
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    // ==========================
    // TEXTS (MULTILANGUAGE CONTENT)
    // ==========================
    const texts = {
        RU: {
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            keyword: "Ключевое слово:",
            position: "Должность",
            location: "Местоположение:",
            selectRegion: "Выберите регион",
            salary: "Зарплата:",
            selectSalary: "Выберите зарплату",
            plan: "План:",
            premium: "Выберите план",
            applicants: "2000 + соискателей, 200 + компаний, 100 + работодателей",
            resume: "ОСТАВЬТЕ РЕЗЮМЕ & ПОЛУЧИТЕ ЖЕЛАЕМУЮ РАБОТУ!",
            login: "Войти",
            categories: "Выбрать по категории",
            search: "Поиск...",
            published: "Опубликовано 2 часа назад",
            needed: "Нужен графический дизайнер",
            budget: "Бюджет: 100$-200$",
            description:
                "Мы ищем художников, которые помогут нам исправить визуализации упаковки, созданные с помощью ИИ. В частности, мы хотим исправить логотипы на каждом рендере. У нас есть большой набор данных логотипов + изображений, созданных с помощью ИИ.",
            tags: ["Лого дизайн", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Платеж подтвержден",
            location_vacancy: "Узбекистан",
            recommendedVacancies: "Рекомендуемые вакансии",
            publishVacancy: "Опубликовать вакансию",
            logo: "Logo",
            links: [
                "Помощь",
                "Наши вакансии",
                "Реклама на сайте",
                "Требования к ПО",
                "Инвесторам",
                "Каталог компаний",
                "Работа по профессиям",
            ],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            createSite: "Создание сайтов",
            viewMore: "Посмотреть все →",
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            keyword: "Kalit so'z:",
            position: "Lavozim",
            location: "Joylashuv:",
            selectRegion: "Hududni tanlang",
            salary: "Maosh:",
            selectSalary: "Maoshni tanlang",
            plan: "Reja:",
            premium: "Rejani tanlang",
            applicants: "2000 + nomzodlar, 200 + kompaniyalar, 100 + ish beruvchilar",
            resume: "REZYUMENI QOLDIRING & ISTALGAN ISHNI OLING!",
            login: "Kirish",
            categories: "Kategoriyani tanlang",
            search: "Qidiruv...",
            published: "2 soat oldin e'lon qilindi",
            needed: "Grafik dizayner kerak",
            budget: "Byudjet: 100$-200$",
            description:
                "Sun'iy intellekt yordamida yaratilgan qadoqlash vizualizatsiyasini tuzatishga yordam beradigan rassomlarni izlayapmiz. Xususan, biz har bir renderdagi logotiplarni to‘g‘rilamoqchimiz. Bizda sun'iy intellekt bilan yaratilgan katta logotiplar + tasvirlar bazasi bor.",
            tags: ["Logo dizayn", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "To‘lov tasdiqlangan",
            location_vacancy: "O‘zbekiston",
            recommendedVacancies: "Tavsiya etilgan vakansiyalar",
            publishVacancy: "Vakansiya e’lon qilish",
            logo: "Logo",
            links: [
                "Yordam",
                "Bizning vakantiyalar",
                "Saytda reklama",
                "Dasturiy ta'minot talablari",
                "Investorlar uchun",
                "Kompaniyalar katalogi",
                "Kasblar bo‘yicha ishlar",
            ],
            copyright:
                "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            createSite: "Sayt yaratish",
            viewMore: "Hammasini ko‘rish →",
        },
        EN: {
            community: "Community",
            vacancies: "Vacancies",
            chat: "Chat",
            companies: "Companies",
            keyword: "Keyword:",
            position: "Position",
            location: "Location:",
            selectRegion: "Select region",
            salary: "Salary:",
            selectSalary: "Select salary",
            plan: "Plan:",
            premium: "Select plan",
            applicants: "2000+ applicants, 200+ companies, 100+ employers",
            resume: "LEAVE A RESUME & GET THE JOB YOU WANT!",
            login: "Login",
            categories: "Choose by category",
            search: "Search...",
            published: "Published 2 hours ago",
            needed: "Graphic designer needed",
            budget: "Budget: $100-$200",
            description:
                "We are looking for artists to help fix packaging visualizations created with AI. Specifically, we want to fix the logos on each render. We have a large dataset of logos + images created with AI.",
            tags: ["Logo design", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Payment verified",
            location_vacancy: "Uzbekistan",
            recommendedVacancies: "Recommended vacancies",
            publishVacancy: "Publish a vacancy",
            logo: "Logo",
            links: [
                "Help",
                "Our Vacancies",
                "Advertising on site",
                "Software Requirements",
                "For Investors",
                "Company Catalog",
                "Jobs by Profession",
            ],
            copyright: "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            createSite: "Website creation",
            viewMore: "View all →",
        },
    };

    return (
        <>
            <div className="hidden md:block lg:hidden ">
                <ApplicantProfileByApplicationTablet />
            </div>
            <div className="block md:hidden">
                <EmployerApplicationsMobile />
            </div>

            <div className="hidden lg:block font-sans relative">
                {/* ========================== NAVBAR ========================== */}
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        {/* Logo */}
                        <a href="/">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain"
                            />
                        </a>

                        {/* Center links */}
                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto text-medium">
                            <a href="/community" className="text-black  hover:text-[#3066BE] transition">
                                {texts[langCode].community}
                            </a>
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].vacancies}
                            </a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].chat}
                            </a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].companies}
                            </a>
                        </div>

                        {/* Right side */}
                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            {/* Lang selector */}
                            <div className="relative flex items-center gap-2 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                                <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 sm:w-7 sm:h-4 md:w-8 md:h-5 object-cover" />
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                    />
                                </svg>
                                {showLang && (
                                    <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                        <div
                                            onClick={() => {
                                                setSelectedLang({ flag: "/ru.png", code: "RU" });
                                                setShowLang(false);
                                            }}
                                            className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                        >
                                            <img src="/ru.png" alt="RU" className="w-8 h-5" />
                                        </div>
                                        <div
                                            onClick={() => {
                                                setSelectedLang({ flag: "/uz.png", code: "UZ" });
                                                setShowLang(false);
                                            }}
                                            className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                        >
                                            <img src="/uz.png" alt="UZ" className="w-8 h-5" />
                                        </div>
                                        <div
                                            onClick={() => {
                                                setSelectedLang({ flag: "/uk.png", code: "EN" });
                                                setShowLang(false);
                                            }}
                                            className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                        >
                                            <img src="/uk.png" alt="EN" className="w-8 h-5" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Login/Avatar */}
                            <ProfileDropdown />
                        </div>

                        {/* mobile flag + avatar */}
                        <div className="md:hidden flex items-center gap-3 pr-4 sm:pr-6 pt-2">
                            <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                                <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 object-cover" />
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                    />
                                </svg>
                            </div>
                            <div className="w-[56px] h-[56px] rounded-full overflow-hidden">
                                <img src="/review-user.png" alt="User" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* mobile dropdown menu */}
                    {showMobileMenu && (
                        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 z-50">
                            <a href="" className="w-full px-4 py-3 text-center text-[#3066BE] hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].community}
                            </a>
                            <a href="/vacancies" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].vacancies}
                            </a>
                            <a href="/chat" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].chat}
                            </a>
                            <a href="/companies" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].companies}
                            </a>
                            <button className="mt-3 bg-[#3066BE] text-white px-6 py-2 rounded-md hover:bg-[#274f94] transition text-[15px]">
                                {texts[langCode].login}
                            </button>
                        </div>
                    )}
                </nav>

                {/* ========================== NOTIFICATION ========================== */}
                <div className="bg-white py-4 mt-[90px] mb-[67px]">
                    <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                        <div className="flex items-center gap-6 ml-6 absolute top-[32px] right-[40px] z-20">
                            <div className="cursor-pointer">
                                <span className="text-2xl text-black">?</span>
                            </div>

                            <div className="relative cursor-pointer">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">1</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================== BODY ========================== */}
                <div className="max-w-7xl w-[1176px] mx-auto px-4 py-8 mt-[-70px]">
                    {/* USER CARD */}
                    <div className="w-full bg-white border border-[#AEAEAE] mt-[67px] min-h-[1006px] rounded-[25px] overflow-visible">
                        {/* === TOP PANEL === */}
                        <div className="w-full h-[136px] px-6 py-4 flex items-center justify-between border-b border-[#AEAEAE]">
                            {/* LEFT - Avatar + Name */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-[70px] h-[70px]">
                                    <img
                                        src={data.avatar || "/user-white.jpg"}
                                        alt={data.full_name || "avatar"}
                                        onError={(e) => (e.currentTarget.src = "/user-white.jpg")}
                                        className="w-full h-full object-cover rounded-full border"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-[24px] font-bold text-black mt-2">{normalizeName(data.full_name)}</h2>
                                    <p className="text-[15px] text-[#AEAEAE] font-medium flex items-center gap-1">{data.position || "—"}</p>
                                </div>
                            </div>

                            {/* RIGHT - Back */}
                            <div className="flex gap-3">
                                <button
                                    className="w-[222px] h-[59px] bg-[#3066BE] text-white font-semibold rounded-[10px] hover:bg-[#2452a6] transition"
                                    onClick={() => navigate(-1)}
                                >
                                    Orqaga
                                </button>
                            </div>
                        </div>

                        {/* === MAIN WRAPPER === */}
                        <div className="w-full min-h-full overflow-visible bg-white">
                            <div className="flex max-w-[1176px] mx-auto w-full h-auto">
                                {/* LEFT PANEL */}
                                <div className="w-[60%] px-6 py-6 border-r border-[#AEAEAE]">
                                    {/* Часов в неделю */}
                                    <div className="pb-4 px-4 py-3 mb-[30px]">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[24px] leading-[36px] font-bold text-black">Часов в неделю</h3>
                                        </div>

                                        <p className="text-[15px] leading-[22px] text-black mt-1 font-medium">
                                            {data.work_hours_per_week || "—"}
                                        </p>
                                        <p className="text-[15px] leading-[22px] text-[#AEAEAE] mt-1 font-medium">
                                            Открыт для заключения контракта на найм
                                        </p>
                                    </div>

                                    {/* Языки */}
                                    <div className="pb-4 px-4 py-3 mb-[30px]">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[24px] leading-[36px] font-bold text-black">Языки</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {languages.length === 0 ? (
                                                <span className="text-[#AEAEAE]">—</span>
                                            ) : (
                                                languages.map((l, i) => (
                                                    <span key={i} className="px-3 text-black py-1 rounded-full border bg-[#D9D9D9] text-sm">
                            {l.language} — {l.level}
                          </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Образование */}
                                    <div className="pb-4 px-4 py-3">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[24px] leading-[36px] font-bold text-black">Образование</h3>
                                        </div>
                                        <div className="mt-3 flex flex-col gap-3">
                                            {educations.length === 0 ? (
                                                <span className="text-[#AEAEAE]">—</span>
                                            ) : (
                                                educations.map((e, i) => (
                                                    <div key={i} className="text-[15px] leading-[22px] text-black">
                                                        <div className="font-semibold">{e.academy_name}</div>
                                                        <div className="text-[#4b5563]">{e.degree}</div>
                                                        <div className="text-[#9ca3af]">
                                                            {e.start_year} — {e.end_year}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT PANEL */}
                                <div className="flex justify-center px-6 py-6 w-full">
                                    <div className="w-[762px]">
                                        {/* О себе */}
                                        <div className="w-full bg-white border-none rounded-xl p-6">
                                            <h3 className="text-[24px] leading-[36px] font-bold text-[#000000] mb-[10px]">О себе</h3>
                                            <p className="text-[#000] text-[16px] leading-relaxed whitespace-pre-line">{data.bio || "—"}</p>
                                        </div>

                                        {/* Divider */}
                                        <div className="w-full h-[1px] bg-[#AEAEAE] my-[36px]"></div>

                                        {/* Портфолио */}
                                        <div className="w-full bg-white border-none rounded-xl p-6">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-[24px] leading-[36px] font-bold text-[#000000] mb-[10px]">Портфолио</h3>
                                            </div>
                                            {portfolio.length === 0 ? (
                                                <div className="text-[#AEAEAE]">—</div>
                                            ) : (
                                                <div className="flex flex-col gap-4">
                                                    {portfolio.map((p) => (
                                                        <div key={p.id} className="border rounded-[12px] p-4">
                                                            <div className="font-semibold text-black">{p.title}</div>
                                                            {p.description && (
                                                                <div className="text-[14px] text-[#AEAEAE] mt-1 whitespace-pre-line">{p.description}</div>
                                                            )}
                                                            {p.skills_list?.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    {p.skills_list.map((s, idx) => (
                                                                        <span key={idx} className="px-3 py-1 border text-black bg-[#D9D9D9] rounded-full text-sm">
                                      {s}
                                    </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {p.media?.length > 0 && (
                                                                <div className="flex flex-wrap gap-3 mt-3">
                                                                    {p.media.map((m, idx) => (
                                                                        <a key={idx} href={m.file_url} target="_blank" rel="noreferrer" className="block" title={m.file_type}>
                                                                            {m.file_type === "image" ? (
                                                                                <img
                                                                                    src={m.file_url}
                                                                                    alt="media"
                                                                                    className="w-[120px] h-[80px] object-cover rounded border"
                                                                                    onError={(e) => {
                                                                                        e.currentTarget.style.display = "none";
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <span className="text-sm underline text-[#3066BE]">{(m.file_type || "file").toUpperCase()}</span>
                                                                            )}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Divider */}
                                        <div className="w-full h-[1px] bg-[#AEAEAE] my-[36px]"></div>

                                        {/* Навыки */}
                                        <div className="w-full bg-white border-none rounded-xl p-4 mt-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">Навыки</h3>
                                            </div>

                                            <div className="flex flex-wrap gap-2 justify-start mt-[21px]">
                                                {skills.length === 0 ? (
                                                    <span className="bg-[#D9D9D9] text-sm text-[#AEAEAE] px-4 py-1 rounded-full">—</span>
                                                ) : (
                                                    skills.slice(0, 20).map((skill, idx) => (
                                                        <span key={`sk-${idx}`} className="bg-[#D9D9D9] text-[15px] text-black px-4 py-1 rounded-full border border-gray-300">
                              {typeof skill === "string" ? skill : skill?.name || "Skill"}
                            </span>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========================== SERTIFIKAT ========================== */}
                    <div className="w-full bg-white border border-[#AEAEAE] mt-[67px] rounded-[25px] overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-[#AEAEAE] h-[94.5px]">
                            <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">Сертификаты</h3>
                        </div>

                        {certificates.length === 0 ? (
                            <div className="flex items-center justify-center text-center px-4 py-10">
                                <p className="text-[#AEAEAE] text-[20px] leading-[30px] max-w-[604px] font-[400]">—</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-6 p-6">
                                {certificates.map((c) => (
                                    <div key={c.id} className="cursor-pointer border border-[#D9D9D9] rounded-[15px] overflow-hidden shadow-sm">
                                        {/\. (png|jpg|jpeg|webp)$/i.test(c.file_url) ? (
                                            <img src={c.file_url} alt={c.name} className="w-full h-max object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-[200px] bg-gray-100 text-gray-500">Fayl</div>
                                        )}
                                        <div className="p-4">
                                            <h4 className="text-lg font-semibold">{c.name}</h4>
                                            <p className="text-sm text-gray-500">{c.organization}</p>
                                            <p className="text-sm text-gray-400">{fmtDate(c.issue_date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ========================== Experience ========================== */}
                    <div className="w-full bg-white border border-[#AEAEAE] mt-[30px] rounded-[25px] p-6">
                        <h3 className="text-[24px] leading-[36px] font-bold text-[#000000] mb-2">Опыт работы</h3>
                        {experiences.length === 0 ? (
                            <div className="text-[#AEAEAE]">—</div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {experiences.map((ex) => (
                                    <div key={ex.id} className="border rounded-[12px] p-4">
                                        <div className="font-semibold text-black">
                                            {ex.position} @ {ex.company_name}
                                        </div>
                                        <div className="text-sm text-[#6b7280]">
                                            {fmtDate(ex.start_date)} — {ex.end_date ? fmtDate(ex.end_date) : "Hozir"}
                                            {(ex.city || ex.country) && ` • ${[ex.city, ex.country].filter(Boolean).join(", ")}`}
                                        </div>
                                        {ex.description && <div className="text-[14px] text-[#4b5563] mt-1 whitespace-pre-line">{ex.description}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================== FOOTER ========================== */}
                <footer className="w-full h-[393px] relative overflow-hidden">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                    <div className="relative z-20">
                        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                            <div className="flex gap-[190px]">
                                <div>
                                    <h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">{texts[langCode].logo}</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-[184px]">
                                    <div className="flex flex-col gap-[20px]">
                                        {texts[langCode].links.slice(0, 4).map((link, idx) => (
                                            <a
                                                key={idx}
                                                href="#"
                                                className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300"
                                            >
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-[20px]">
                                        {texts[langCode].links.slice(4).map((link, idx) => (
                                            <a
                                                key={idx}
                                                href="#"
                                                className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300"
                                            >
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                            <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                                <p>{texts[langCode].copyright}</p>

                                <div className="flex gap-[20px] text-[24px] mr-[38px]">
                                    <a href="#" className="text-white">
                                        <i className="fab fa-whatsapp hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-instagram hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-facebook hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-twitter hover:text-[#F2F4FD]"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
