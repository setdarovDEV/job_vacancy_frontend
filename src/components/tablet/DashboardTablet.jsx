import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";
import { toast } from "react-toastify";
import Select from "react-select";
import api from "../../utils/api";
import {
    FaBriefcase,
    FaCalculator,
    FaCogs,
    FaGavel,
    FaGraduationCap,
    FaHeartbeat,
    FaIndustry,
    FaLaptopCode
} from "react-icons/fa";

export default function DashboardTablet() {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);

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
            description: "Мы ищем художников...",
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
            viewMore: "Посмотреть все →",
            noVacancies: "Вакансии не найдены",
            loadingError: "Ошибка загрузки вакансий"
        },
        UZ: {
            community: "Jamiyat", vacancies: "Vakansiyalar", chat: "Chat", companies: "Kompaniyalar",
            keyword: "Kalit so'z:", position: "Lavozim", location: "Joylashuv:",
            selectRegion: "Hududni tanlang", salary: "Maosh:", selectSalary: "Maoshni tanlang",
            plan: "Reja:", premium: "Rejani tanlang", applicants: "2000 + nomzodlar...",
            resume: "REZYUMENI QOLDIRING & ISTALGAN ISHNI OLING!", login: "Kirish",
            categories: "Kategoriyani tanlang", search: "Qidiruv...",
            published: "2 soat oldin e'lon qilindi",
            needed: "Grafik dizayner kerak",
            budget: "Byudjet: 100$-200$",
            description: "Sun'iy intellekt...",
            tags: ["Logo dizayn", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "To'lov tasdiqlangan",
            location_vacancy: "O'zbekiston",
            recommendedVacancies: "Tavsiya etilgan vakansiyalar",
            publishVacancy: "Vakansiya e'lon qilish",
            logo: "Logo",
            links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari",
                "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo'yicha ishlar"],
            copyright: "© 2025 «HeadHunter – Vakansiyalar»...",
            createSite: "Sayt yaratish",
            viewMore: "Hammasini ko'rish →",
            noVacancies: "Vakansiyalar topilmadi",
            loadingError: "Vakansiyalarni yuklashda xatolik"
        },
        EN: {
            community: "Community", vacancies: "Vacancies", chat: "Chat", companies: "Companies",
            keyword: "Keyword:", position: "Position", location: "Location:",
            selectRegion: "Select region", salary: "Salary:", selectSalary: "Select salary",
            plan: "Plan:", premium: "Select plan", applicants: "2000+ applicants...",
            resume: "LEAVE A RESUME & GET THE JOB YOU WANT!", login: "Login",
            categories: "Choose by category", search: "Search...",
            published: "Published 2 hours ago",
            needed: "Graphic designer needed",
            budget: "Budget: $100-$200",
            description: "We are looking for artists...",
            tags: ["Logo design", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Payment verified",
            location_vacancy: "Uzbekistan",
            recommendedVacancies: "Recommended vacancies",
            publishVacancy: "Publish a vacancy",
            logo: "Logo",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements",
                "For Investors", "Company Catalog", "Jobs by Profession"],
            copyright: "© 2025 «HeadHunter – Vacancies»...",
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
                console.log("✅ [TABLET] Recent vacancies:", recentResponse.data);

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

    // ✅ HANDLE VIEW MORE
    const handleViewMore = () => {
        navigate("/vacancies");
    };

    // ✅ HANDLE VACANCY CLICK
    const handleVacancyClick = (vacancyId) => {
        navigate(`/vacancies`);
    };

    return (
        <>
        <NavbarTabletLogin />

        {/* HERO SECTION */}
        <section
            className="relative bg-cover bg-center min-h-[80vh] flex flex-col justify-center items-center text-center"
            style={{
                backgroundImage: `url('/hero.png')`,
                clipPath: "ellipse(80% 100% at 50% 0)"
            }}
        >
            <div
                className="absolute inset-0 bg-blue-900 opacity-50"
                style={{ clipPath: "ellipse(80% 100% at 50% 0)" }}
            ></div>

            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center px-4">
                <p className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-3 md:mb-4">
                    {texts[langCode].applicants}
                </p>

                <h1 className="text-white uppercase text-[26px] sm:text-[36px] md:text-[42px] font-extrabold leading-tight text-center">
                    {texts[langCode].resume.split("&")[0]} &<br />
                    {texts[langCode].resume.split("&")[1]}
                </h1>

                {/* Search Form */}
                <div className="mt-6 sm:mt-8 w-full max-w-[580px] mx-auto bg-white/30 backdrop-blur-md shadow-2xl rounded-xl p-3 md:p-4">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-end gap-3 md:gap-4">
                        {/* Keyword */}
                        <div className="min-w-0">
                                <span className="block text-[12px] md:text-[13px] text-white/95 mb-1 font-medium">
                                    {texts[langCode].keyword}
                                </span>
                            <input
                                type="text"
                                placeholder={texts[langCode].position}
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full h-11 border-none rounded-xl px-3 bg-white/80 shadow-sm text-[14px] text-black placeholder:text-[#AEAEAE] focus:outline-none"
                            />
                        </div>

                        {/* Location */}
                        <div className="min-w-0">
                                <span className="block text-[12px] md:text-[13px] text-white/95 mb-1 font-medium">
                                    {texts[langCode].location}
                                </span>
                            <Select
                                placeholder={texts[langCode].selectRegion}
                                options={optionsRegion}
                                value={selectedRegion}
                                onChange={setSelectedRegion}
                                styles={selectStyles()}
                                menuPortalTarget={document.body}
                            />
                        </div>

                        {/* Salary */}
                        <div className="min-w-0">
                                <span className="block text-[12px] md:text-[13px] text-white/95 mb-1 font-medium">
                                    {texts[langCode].salary}
                                </span>
                            <Select
                                placeholder={texts[langCode].selectSalary}
                                options={optionsSalary}
                                value={selectedSalary}
                                onChange={setSelectedSalary}
                                styles={selectStyles()}
                                menuPortalTarget={document.body}
                            />
                        </div>

                        {/* Plan */}
                        <div className="min-w-0">
                                <span className="block text-[12px] md:text-[13px] text-white/95 mb-1 font-medium">
                                    {texts[langCode].plan}
                                </span>
                            <Select
                                placeholder={texts[langCode].premium}
                                options={optionsPlan}
                                value={selectedPlan}
                                onChange={setSelectedPlan}
                                styles={selectStyles()}
                                menuPortalTarget={document.body}
                            />
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="h-11 w-11 aspect-square rounded-xl bg-[#3066BE] hover:bg-[#254f99] shadow-sm grid place-items-center p-0 leading-none flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Search"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg
                                        className="w-6 h-6 block align-middle text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CATEGORIES */}
        <div className="md:block lg:hidden py-6 px-3 mx-auto max-w-[960px]">
            <h2 className="text-center text-lg font-bold text-black mb-5">
                {texts[langCode].categories}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {getCategoriesTexts()[langCode].map((cat, idx) => (
                    <div
                        key={idx}
                        className="min-w-0 h-[80px] md:h-[90px] rounded-md bg-[#F4F6FA] flex flex-col items-center justify-center px-2 text-center shadow-sm hover:shadow-md transition"
                    >
                        <cat.icon className="text-[#3066BE] text-lg md:text-xl mb-1" />
                        <h3 className="text-[11px] text-black md:text-[12px] font-medium leading-tight truncate w-full">
                            {cat.title}
                        </h3>
                        <p className="text-gray-400 text-[9px] md:text-[10px] leading-tight">
                            {cat.vacancies}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* VACANCY SECTION */}
        <div className="hidden md:block lg:hidden mx-auto max-w-[940px] px-4 py-8">
            <h2 className="text-center font-extrabold text-[24px] leading-tight text-black mb-6">
                {texts[langCode].recommendedVacancies}
            </h2>

            <div className="mb-4">
                <h3 className="text-[14px] font-semibold text-black">
                    {texts[langCode].publishVacancy}
                </h3>
                <div className="w-[52px] h-[3px] bg-[#D9D9D9] rounded mt-2" />
                <hr className="border-t w-[560px] border-[#AEAEAE] mt-3" />
            </div>

            {/* Loading State */}
            {loadingVacancies && (
                <div className="flex justify-center items-center py-12">
                    <div className="w-12 h-12 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* ✅ BACKENDDAN KELGAN VAKANSIYALAR */}
            {!loadingVacancies && vacancies.length > 0 && (
                <div className="space-y-5">
                    {vacancies.slice(0, 3).map((vacancy, index) => (
                        <React.Fragment key={vacancy.id}>
                            <VacancyCardTablet
                                vacancy={vacancy}
                                texts={texts}
                                lang={langCode}
                                onClick={() => handleVacancyClick(vacancy.id)}
                            />
                            {index < 2 && <hr className="border-t w-[560px] border-[#AEAEAE] mt-3" />}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* ✅ FALLBACK: Agar vakansiya yo'q bo'lsa */}
            {!loadingVacancies && vacancies.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">{texts[langCode].noVacancies}</p>
                </div>
            )}
        </div>

        {/* CTA SECTION */}
        <section className="w-full bg-[#3066BE] relative overflow-visible flex items-center">
            <img
                src="/dots-bg.png"
                alt="dots"
                className="absolute top-0 left-0 w-[200px] h-auto opacity-60"
            />

            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 w-full">
                <div className="relative flex-shrink-0">
                    <img
                        src="/call-center.png"
                        alt="girl"
                        className="w-[420px] object-contain relative z-20"
                    />
                </div>

                <div className="text-white max-w-lg ml-6">
                    <h2 className="text-3xl font-bold mb-6 leading-snug">
                        Найдите работу своей мечты сегодня.
                    </h2>
                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={() => navigate("/vacancies")}
                            className="px-6 py-3 border-2 border-white bg-[#3066BE] text-white rounded-md hover:bg-white hover:text-[#3066BE] transition font-semibold"
                        >
                            Заполнить резюме
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* ADDITIONAL VACANCIES */}
        {!loadingVacancies && vacancies.length > 3 && (
            <div className="hidden md:block lg:hidden mx-auto max-w-[940px] px-4 py-8">
                <div className="space-y-5">
                    {vacancies.slice(3, 5).map((vacancy, index) => (
                        <React.Fragment key={vacancy.id}>
                            <VacancyCardTablet
                                vacancy={vacancy}
                                texts={texts}
                                lang={langCode}
                                onClick={() => handleVacancyClick(vacancy.id)}
                            />
                            {index < 1 && <hr className="border-t w-[560px] border-[#AEAEAE] mt-3" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        )}

        {/* VIEW MORE BUTTON */}
        <div className="flex justify-end pr-[75px] mt-10 mb-[74px]">
            <button
                onClick={handleViewMore}
                className="bg-[#3066BE] text-white px-6 py-3 rounded-lg hover:bg-[#254f99] transition-colors duration-300"
            >
                {texts[langCode].viewMore}
            </button>
        </div>

        {/* FOOTER */}
        <footer className="relative overflow-hidden md:block lg:hidden">
            <img
                src="/footer-bg.png"
                alt="Footer background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

            <div className="relative z-20 max-w-[960px] mx-auto px-4 py-8 text-white">
                <div className="flex flex-col gap-6">
                    <h2 className="text-[36px] font-black">{texts[langCode].logo}</h2>

                    <div className="grid grid-cols-2 text-white gap-x-10 gap-y-3">
                        {texts[langCode].links.slice(0, 4).map((link, i) => (

                            <a key={`l-${i}`}
                            href="#"
                            className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors"
                            >
                            <span>›</span> {link}
                    </a>
                    ))}
                    {texts[langCode].links.slice(4).map((link, i) => (

                        <a key={`r-${i}`}
                        href="#"
                        className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors"
                        >
                        <span>›</span> {link}
                </a>
                ))}
            </div>
        </div>

        <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-[13px] leading-snug">
                    {texts[langCode].copyright}
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

// ✅ VACANCY CARD COMPONENT WITH BACKEND DATA
function VacancyCardTablet({ vacancy, texts, lang, onClick }) {
    return (
        <article
            className="w-[552px] h-[244px] rounded-md border-none border-[#E9EEF5] bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition ml-0 cursor-pointer"
            onClick={onClick}
        >
            {/* Time */}
            <div className="flex items-center text-[12px] text-gray-400 mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {vacancy.published_ago || vacancy.timeAgo || texts[lang].published}
            </div>

            {/* Title */}
            <h3 className="text-[18px] md:text-[20px] font-extrabold text-black mb-1">
                {vacancy.title || texts[lang].needed}
            </h3>

            {/* Budget */}
            <p className="text-[12px] text-gray-500 mb-3">
                {vacancy.budget || texts[lang].budget}
            </p>

            {/* Description */}
            <p className="text-[13px] text-gray-600 mb-3 line-clamp-3">
                {vacancy.description || texts[lang].description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
                {vacancy.skills && Array.isArray(vacancy.skills) && vacancy.skills.length > 0 ? (
                    vacancy.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-full text-[12px]">
                            {skill}
                        </span>
                    ))
                ) : (
                    texts[lang].tags.map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-full text-[12px]">
                            {tag}
                        </span>
                    ))
                )}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between text-gray-500">
                <div className="flex items-center gap-2 text-[12px]">
                    {vacancy.payment_verified && (
                        <>
                            <span className="relative inline-flex items-center justify-center w-5 h-5">
                                <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                <img src="/check.svg" alt="check" className="absolute w-3 h-3" />
                            </span>
                            {texts[lang].payment}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-0.5">
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

                <div className="flex items-center gap-1 text-[12px]">
                    <img src="/location.png" alt="location" className="w-5 h-5" />
                    {vacancy.location || texts[lang].location_vacancy}
                </div>
            </div>
        </article>
    );
}

const selectStyles = () => ({
    control: (base, state) => ({
        ...base,
        height: 44,
        minHeight: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.8)',
        boxShadow: 'none',
        border: 'none',
        fontSize: 13.5,
        paddingLeft: 6,
        cursor: 'pointer',
        '&:hover,&:focus,&:focus-visible,&:focus-within': {
            boxShadow: 'none',
            border: 'none',
            outline: 'none',
        },
    }),
    placeholder: (base) => ({
        ...base,
        fontSize: 12,
        color: '#A0A0A0',
    }),
    singleValue: (base) => ({
        ...base,
        fontSize: 13.5,
        color: '#000',
    }),
    input: (base) => ({
        ...base,
        fontSize: 13.5,
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menuPortal: (base) => ({ ...base, zIndex: 50 }),
    menu: (base) => ({
        ...base,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.95)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        zIndex: 50,
    }),
    option: (base, state) => ({
        ...base,
        fontSize: 13.5,
        backgroundColor: state.isFocused ? 'rgba(0,0,0,0.05)' : 'transparent',
        color: '#000',
        cursor: 'pointer',
    }),
});