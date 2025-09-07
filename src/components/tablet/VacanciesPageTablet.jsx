import React, {useState, useMemo, useEffect} from "react";
import VacancyModal from "../tablet/VacancyTabletModal.jsx";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";
import UserSearch from "./UserSearchTablet.jsx";
import { X, ChevronDown} from 'lucide-react';
import { buildVacancyParams, fetchVacancies } from "../../utils/vacancyApi";
import api from "../../utils/api";
import {toast} from "react-toastify";

export default function VacancyPageTablet() {
    // ==========================
    // STATES
    // ==========================
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState({min: 0, max: 0});
    const [plan, setPlan] = useState("");
    const [vacancies, setVacancies] = useState([]); // API’dan keladi
    const [activeModalIndex, setActiveModalIndex] = useState(null);

    const [skills, setSkills] = useState([]); // profil skilleri
    const [user, setUser] = useState(null); // localStorage yoki API’dan
    const [profileImage, setProfileImage] = useState(null);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const [activePage, setActivePage] = useState(1);
    const [selectedLang, setSelectedLang] = useState({ code: "RU", flag: "/ru.png" });
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastQuery, setLastQuery] = useState({ title: "", location: "", salary: {min:0,max:0}, plan: "" });
    const [totalPages, setTotalPages] = useState(1); // DRF countdan keladi
    const [currentPage] = useState(1);


    // ==========================
    // HANDLERS
    // ==========================

    async function loadVacancies({ title, location, salary, plan, page }) {
        try {
            setLoading(true);
            setError("");
            const params = buildVacancyParams({ title, location, salary, plan, page });
            const data = await fetchVacancies(params);

            // DRF format deb qabul qilamiz:
            const results = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []);
            setVacancies(results);

            // Pagination
            const count = data?.count ?? results.length;
            const perPage = results.length > 0 && data?.next || data?.previous ? Math.max(results.length, 10) : 10; // taxmin
            setTotalPages(Math.max(1, Math.ceil(count / perPage)));

        } catch (e) {
            console.error(e);
            setError(e?.response?.data?.detail || "Vakansiyalarni olishda xatolik.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const res = await api.get(`/api/vacancies/jobposts/?page=${currentPage}`);
                setVacancies(res.data.results);
                setTotalPages(Math.ceil(res.data.count / 10));
            } catch (err) {
                console.error("Vakansiyalarni olishda xatolik:", err);
            }
        };

        fetchVacancies();
    }, [currentPage]);


    const handleRate = async (jobId, stars) => {
        try {
            await api.post(`/api/vacancies/jobposts/${jobId}/rate/`, { stars });

            const res = await api.get(`/api/vacancies/jobposts/${jobId}/`);
            const updated = res.data;

            setVacancies(prev =>
                prev.map((vac) => (vac.id === jobId ? updated : vac))
            );

            toast.success("Baholandi! ✅");
        } catch (err) {
            toast.error("Baholashda xatolik.");
            console.error("Baho berishda xatolik:", err);
        }
    };

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await api.get("/skills/skills/"); // ← bu to‘g‘rimi, kerak bo‘lsa sozlab beraman
                // dublikatlarni olib tashlaymiz (ixtiyoriy)
                const uniqueSkills = res.data.filter(
                    (skill, index, self) =>
                        index === self.findIndex((s) => s.id === skill.id)
                );
                setSkills(uniqueSkills);
            } catch (err) {
                console.error("Skill'larni olishda xatolik:", err);
            }
        };

        fetchSkills();
    }, []);

    const handleSkillAnswer = async (skillId, answer) => {
        try {
            await api.post("/api/auth/skill-answers/", {
                skill: skillId,
                answer: answer
            });

            // 🔥 Skill UI'dan yo‘qotiladi
            setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
        } catch (err) {
            console.error("Javob yuborishda xatolik:", err);
        }
    };

// ✅ Sahifa yuklanganda avatarni olish
    useEffect(() => {
        api.get("/api/auth/profile/")
            .then((res) => {
                const imagePath = res.data.profile_image;
                if (imagePath) {
                    const imageUrl = `http://127.0.0.1:8000${imagePath}?t=${Date.now()}`;
                    setProfileImage(imageUrl);
                    localStorage.setItem("profile_image", imageUrl);
                }
            })
            .catch((err) => console.error("Avatarni olishda xatolik:", err));
    }, []);

// ✅ Foydalanuvchini olish
    useEffect(() => {
        api.get("/api/auth/me/")
            .then((res) => setUser(res.data))
            .catch((err) => console.error("Foydalanuvchini olishda xatolik:", err));
    }, []);

    const handleSearch = () => {
        const query = { title, location, salary, plan };
        setActivePage(1);
        setLastQuery(query);
        loadVacancies({ ...query, page: 1 });
    };

    React.useEffect(() => {
        const initialQuery = { title: "", location: "", salary: {min:0,max:0}, plan: "" };
        setLastQuery(initialQuery);
        loadVacancies({ ...initialQuery, page: 1 });
    }, []);

    // const handleRate = (vacancyId, stars) => {
    //     console.log(`Vacancy ${vacancyId} rated with ${stars}`);
    //     // yulduzcha bosilganda ishlovchi funksiya
    // };

    // const handleSkillAnswer = (skillId, answer) => {
    //     console.log(`Skill ${skillId} answered: ${answer}`);
    //     // skill javobni API ga yuborish joyi
    // };

    const formatName = (s) =>
        String(s)
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");

    const handlePickUser = (u) => {
        setSelectedUser(u);
        fetchPost({ authorId: u.id, page: 1 });   // ✅ page=1 dan boshlaymiz
    };

    // tilni tanlash uchun misol obyekt
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


    const langCode = useMemo(
        () => (selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU"),
        [selectedLang]
    );

    function SearchModal({
                             title, setTitle,
                             location, setLocation,
                             salary, setSalary,
                             plan, setPlan,
                             onClose, onClear, onSearch
                         }) {
        // ESC bosganda yopish
        React.useEffect(() => {
            const onKey = (e) => e.key === "Escape" && onClose();
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
        }, [onClose]);

        return (
            <div
                className="fixed inset-0 z-[999] flex items-start md:items-center justify-center bg-black/40"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div
                    className="w-[94%] max-w-[920px] bg-white rounded-[20px] shadow-xl overflow-hidden mt-6 md:mt-0 relative">
                    {/* Close (top-right) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 bg-white text-[#3066BE]"
                        aria-label="Close"
                    >
                        <X size={20}/>
                    </button>

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-center text-[20px] md:text-[22px] font-semibold text-black">
                            Поиск вакансий
                        </h3>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                        <div className="bg-[#F4F6FA] rounded-2xl p-4 md:p-6">
                            {/* Title */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Должность"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent px-4 text-[14px] text-black placeholder:text-gray-400 outline-none focus:ring-0"
                                />
                            </div>

                            {/* Selects */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                {/* Region */}
                                <div className="relative">
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none"
                                    >
                                        <option value="">Выберите регион</option>
                                        <option value="Узбекистан">Узбекистан</option>
                                        <option value="Россия">Россия</option>
                                        <option value="Турция">Турция</option>
                                    </select>
                                    <ChevronDown
                                        size={18}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70"
                                    />
                                </div>

                                {/* Salary */}
                                <div className="relative">
                                    <select
                                        value={salary.min && salary.max ? `${salary.min}-${salary.max}` : ""}
                                        onChange={(e) => {
                                            const [min, max] = e.target.value.split("-");
                                            setSalary({
                                                min: min ? Number(min) : 0,
                                                max: max ? Number(max) : 0,
                                            });
                                        }}
                                        className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none"
                                    >
                                        <option value="">Выберите зарплату</option>
                                        <option value="500-1000">500-1000</option>
                                        <option value="1000-1500">1000-1500</option>
                                        <option value="1500-2000">1500-2000</option>
                                    </select>
                                    <ChevronDown
                                        size={18}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70"
                                    />
                                </div>

                                {/* Plan (Premium) */}
                                <div className="relative">
                                    <select
                                        value={plan}
                                        onChange={(e) => setPlan(e.target.value)}
                                        className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none"
                                    >
                                        <option value="">Premium</option>
                                        <option value="Basic">Basic</option>
                                        <option value="Pro">Pro</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                    <ChevronDown
                                        size={18}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-5 flex items-center justify-between">
                        <button
                            onClick={onClear}
                            className="h-[44px] px-5 rounded-[10px] border border-[#3066BE] text-[#3066BE] bg-white hover:bg-[#F5F8FF] transition"
                        >
                            Очистить все
                        </button>

                        <button
                            onClick={onSearch}
                            className="h-[44px] px-6 rounded-[10px] bg-[#3066BE] text-white font-medium hover:bg-[#2757a4] transition"
                        >
                            Поиск
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <>
            <NavbarTabletLogin />
            {/* ========================== */}
            {/* SEARCH BLOK — TABLET       */}
            {/* ========================== */}
            <div className="bg-white md:mt-[90px] md:block mr-[10px] lg:hidden">
                <div className="mx-auto max-w-[960px] px-4 py-3 mt-[-80px]">
                    <div className="flex items-center justify-between gap-3">
                        {/* Search button */}
                        <div className="flex-1 flex justify-center">
                            <button
                                onClick={() => setShowSearchModal(true)}
                                className="max-w-[420px] h-[44px] border-none w-[240px] ml-[50px] rounded-lg bg-[#F4F6FA] border border-gray-200 text-[#6B7280] text-[14px] px-4 flex items-center gap-2 hover:bg-[#EFF3FA] transition"
                            >
                                <img src="/search.png" alt="" className="w-[18px] h-[18px] opacity-70" />
                                <span className="truncate">
            Поиск вакансий
          </span>
                            </button>
                        </div>

                        {/* Bell */}
                        <button
                            className="relative p-2 rounded-md hover:bg-gray-100 bg-white text-black"
                            aria-label="Notifications"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-red-600 text-white text-[10px] grid place-items-center">
          1
        </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            {showSearchModal && (
                <SearchModal
                    title={title}
                    setTitle={setTitle}
                    location={location}
                    setLocation={setLocation}
                    salary={salary}
                    setSalary={setSalary}
                    plan={plan}
                    setPlan={setPlan}
                    onClose={() => setShowSearchModal(false)}
                    onClear={() => {
                        setTitle("");
                        setLocation("");
                        setSalary({ min: 0, max: 0 });
                        setPlan("");
                        setActivePage(1);
                        const q = { title: "", location: "", salary: {min:0,max:0}, plan: "" };
                        setLastQuery(q);
                        loadVacancies({ ...q, page: 1 });
                    }}

                    onSearch={() => {
                        setShowSearchModal(false);
                        handleSearch();
                    }}
                />
            )}



            {/* ========================== */}
            {/* VACANCY SECTION (Tablet) */}
            {/* ========================== */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-center font-extrabold text-[28px] leading-[140%] text-black mb-6">
                    {texts[selectedLang.code].vacancies}
                </h1>

                <div className="mt-4">
                    <h2 className="text-[16px] leading-[140%] font-bold text-black mb-2">
                        {texts[selectedLang.code].publishVacancy}
                    </h2>
                    <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-4"></div>
                    <hr className="border-t border-[#D9D9D9] mb-6" />
                </div>

                {/* Tablet: avval card’lar, keyin profil (stacked) */}
                <div className="flex flex-col gap-8">
                    {/* Vakansiya kartalari */}
                    <div className="w-full flex flex-col gap-4">
                        {vacancies.map((vacancy, index) => (
                            <div key={vacancy.id || index} className="rounded-xl shadow p-4 bg-white hover:shadow-md transition">
                                {/* vaqt */}
                                <div className="flex items-center text-gray-400 text-xs mb-2">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(vacancy.created_at).toLocaleDateString()}
                                </div>

                                <button
                                    onClick={() => setActiveModalIndex(index)}
                                    className="text-[18px] ml-[-21px] font-bold text-black bg-transparent border-none text-left hover:text-[#3066BE] transition"
                                >
                                    {vacancy.title}
                                </button>
                                <p className="text-gray-600 text-sm mb-2">
                                    ${vacancy.budget_min} - ${vacancy.budget_max}
                                </p>

                                <p className="text-gray-500 text-sm mb-3">{vacancy.description}</p>

                                {/* Teglar */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {vacancy.skills?.map((tag, i) => (
                                        <span key={i} className="bg-[#D9D9D9] text-black px-3 py-1 rounded-full text-xs">{tag}</span>
                                    ))}
                                </div>

                                {/* Pastki qator */}
                                <div className="flex flex-wrap items-center justify-between gap-3 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2 relative">
                                        <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                        <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[4px] left-[4px]" />
                                        {vacancy.is_fixed_price ? "Fixed" : "Hourly"}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                onClick={() => handleRate(vacancy.id, i + 1)}
                                                className={`w-5 h-5 cursor-pointer transition ${
                                                    i < (vacancy.average_stars || 0) ? "fill-yellow-400" : "fill-gray-300"
                                                }`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                            </svg>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <img src="/location.png" alt="location" className="w-4 h-4" />
                                        <span className="text-sm">{vacancy.location || "Remote"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Profil / savol kartalari (tablet’da to‘liq eni) */}
                    <div className="w-full flex flex-col gap-4">
                        {/* UI Dizayn savol */}
                        <div className="w-full bg-[#F4F6FA] rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <p className="text-[13px] font-medium text-[#AEAEAE]">Улучшайте свои рабочие места</p>
                                <button className="bg-transparent">
                                    <img src="/three-dots.svg" alt="..." className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-[15px] text-black mt-2">
                                Есть ли у вас этот навык:{" "}
                                <a href="profile/" className="text-[#3066BE]">UI дизайн?</a>
                            </p>

                            {skills.length > 0 ? (
                                <div key={skills[0].id} className="flex gap-3 mt-3">
                                    <button
                                        onClick={() => handleSkillAnswer(skills[0].id, "yes")}
                                        className="flex items-center bg-[#3066BE]/20 text-black text-sm font-medium rounded-[6px] px-4 py-1.5 gap-2"
                                    >
                                        <img src="/check.png" alt="check" className="w-[14px] h-[9px]" />
                                        Да
                                    </button>
                                    <button
                                        onClick={() => handleSkillAnswer(skills[0].id, "no")}
                                        className="flex items-center bg-[#3066BE]/20 text-black text-sm font-medium rounded-[6px] px-4 py-1.5 gap-2"
                                    >
                                        <img src="/cancel.png" alt="x" className="w-[9px] h-[9px]" />
                                        Нет
                                    </button>
                                    <button
                                        onClick={() => handleSkillAnswer(skills[0].id, "skip")}
                                        className="text-[16px] font-medium bg-transparent"
                                    >
                                        Skip
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-4">✅ Barcha skill'lar baholandi</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {activeModalIndex !== null && (
                <VacancyModal
                    vacancy={vacancies[activeModalIndex]}
                    onClose={() => setActiveModalIndex(null)}
                    onBookmarkToggle={(id, next) => console.log("bookmark", id, next)}
                    onApply={(v) => console.log("apply", v)}
                />
            )}


            {/* ========================== */}
            {/* PAGINATION (Tablet) */}
            {/* ========================== */}
            <div className="w-full flex justify-center mt-4 mb-12 px-4">
                <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setActivePage(page)}
                                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-semibold
            ${activePage === page
                                    ? "bg-[#3066BE] text-white border-[#3066BE]"
                                    : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#3066BE]/10"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => activePage < totalPages && setActivePage(activePage + 1)}
                        className="w-9 h-9 rounded-full border-2 border-[#3066BE] bg-white flex items-center justify-center"
                    >
                        <img src="/pagination.png" alt="pagination" className="w-4 h-4 object-contain" />
                    </button>
                </div>
            </div>

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
    )
}