import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import VacancyModal from "../components/VacancyModal";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import api from "../utils/api";
import { toast } from "react-toastify";
import axios from "axios";


// ==========================
// COMPONENT START
// ==========================
export default function VacancyPage() {
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [selectedLang, setSelectedLang] = useState({flag: "/ru.png", code: "RU"});
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [currentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [skills, setSkills] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState({ min: "", max: "" });
    const [plan, setPlan] = useState("");
    const [vacancies, setVacancies] = useState([]);

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

    // ==========================
    // LANG CODE HANDLING
    // ==========================
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    // Ism formatlash
    const formatName = (fullName) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        if (parts.length < 2) return fullName;
        const firstInitial = parts[0][0].toUpperCase();
        const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        return `${firstInitial}. ${lastName}`;
    };

    const handleSearch = async () => {
        try {
            const params = {};

            if (title?.trim()) params.search = title;
            if (location) params.location = location;
            if (plan) params.plan = plan;
            if (salary.min) params.salary_min = parseFloat(salary.min);
            if (salary.max) params.salary_max = parseFloat(salary.max);

            console.log("🔍 So‘rov params:", params);

            const res = await axios.get("http://localhost:8000/api/vacancies/jobposts/", {
                params,
            });

            console.log("🟢 Natija:", res.data);
            setVacancies(res.data.results || res.data);
        } catch (err) {
            console.error("❌ Qidiruvda xatolik:", err);
        }
    };


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
        <div className="font-sans relative bg-white">

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
                        className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                        <a href="/community"
                           className="text-black hover:text-[#3066BE] transition">{texts[langCode].community}</a>
                        <a href="/vacancies"
                           className="text-[#3066BE] hover:text-[#3066BE] transition">{texts[langCode].vacancies}</a>
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

                        <ProfileDropdown />

                    </div>

                    {/* Mobile flag + burger */}
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
                        <button onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="bg-white p-2 rounded-md focus:outline-none">
                            <svg className="w-8 h-8" fill="none" stroke="#3066BE" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>

                    </div>
                </div>

                {/* Mobile dropdown menu */}
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
            {/* FILTER BAR */}
            {/* ========================== */}
            <div className="bg-white py-4 mt-[90px]">
                <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                    <div className="w-[924px] h-[49px] bg-white rounded-md flex items-center px-4 ml-[258px] overflow-hidden">

                        {/* 🔍 Qidiruv tugma */}
                        <button
                            onClick={handleSearch}
                            className="w-[35px] h-[35px] flex items-center justify-center border-none bg-white text-black rounded-[5px] transition p-1"
                        >
                            <img src="/search.png" alt="search" className="w-[20px] h-[20px] object-contain z-10" />
                        </button>


                        {/* Qidiruv input */}
                        <input
                            type="text"
                            placeholder="Должность"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black placeholder:text-gray-700 focus:outline-none"
                        />


                        {/* Region */}
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black focus:outline-none"
                        >
                            <option value="">Выберите регион</option>
                            <option value="Узбекистан">Узбекистан</option>
                            <option value="Россия">Россия</option>
                            <option value="Турция">Турция</option>
                        </select>


                        {/* Salary */}
                        <select
                            value={`${salary.min}-${salary.max}`}
                            onChange={(e) => {
                                const [min, max] = e.target.value.split("-");
                                setSalary({
                                    min: parseFloat(min),
                                    max: parseFloat(max),
                                });
                            }}

                            className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black focus:outline-none"
                        >
                            <option value="">Выберите зарплату</option>
                            <option value="500-1000">500-1000</option>
                            <option value="1000-1500">1000-1500</option>
                            <option value="1500-2000">1500-2000</option>
                        </select>


                        {/* Plan */}
                        <select
                            value={plan}
                            onChange={(e) => setPlan(e.target.value)}
                            className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black focus:outline-none"
                        >
                            <option value="">Выберите план</option>
                            <option value="Basic">Basic</option>
                            <option value="Pro">Pro</option>
                            <option value="Premium">Premium</option>
                        </select>

                    </div>

                    {/* O‘ngdagi iconlar */}
                    <div className="flex items-center gap-6 ml-6 absolute top-[32px] right-[40px] z-20">
                        <div className="cursor-pointer">
                            <span className="text-2xl text-black">?</span>
                        </div>
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

            {/* ==========================
                    VACANCY SECTION
            ========================== */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-center font-extrabold text-[35px] leading-[150%] text-black mb-10">
                    {texts[selectedLang.code].vacancies}
                </h1>

                <div className="mt-6">
                    <h2 className="text-[18px] leading-[150%] font-bold text-black mb-2">
                        {texts[selectedLang.code].publishVacancy}
                    </h2>
                    <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-6"></div>
                    <hr className="border-t border-[#D9D9D9] mb-6" />
                </div>

                {/* Main flex: chap (card), o‘ng (profil) */}
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Chap: Vakansiya Card */}
                    <div className="lg:w-2/3 w-full flex flex-col gap-6">
                        {vacancies.map((vacancy, index) => (
                            <div key={vacancy.id || index} className="rounded-xl shadow p-6 hover:shadow-lg transition">
                                {/* Vaqt */}
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(vacancy.created_at).toLocaleDateString()}
                                </div>

                                <div className="flex flex-col gap-1 ml-[-28px]">
                                    <button
                                        onClick={() => setActiveModalIndex(index)}
                                        className="text-2xl font-bold mt-[-10px] text-black bg-white border-none hover:text-[#3066BE] transition-colors duration-200 text-left"
                                    >
                                        {vacancy.title}
                                    </button>
                                    <p className="text-gray-600 ml-[27px] mb-[10px] text-sm">
                                        ${vacancy.budget_min} - ${vacancy.budget_max}
                                    </p>
                                </div>

                                <p className="text-gray-400 mb-4">{vacancy.description}</p>

                                {/* Teglar */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {vacancy.skills?.map((tag, index) => (
                                        <span key={index} className="bg-[#D9D9D9] text-black px-3 py-1 rounded-full text-sm">{tag}</span>
                                    ))}
                                </div>

                                {/* Pastki qator */}
                                <div className="flex flex-wrap justify-between items-center gap-3 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2 relative">
                                        <img src="/badge-background.svg" alt="bg" className="w-6 h-6" />
                                        <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[6px] left-[6px]" />
                                        {vacancy.is_fixed_price ? "Fixed" : "Hourly"}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                onClick={() => handleRate(vacancy.id, i + 1)}
                                                className={`w-5 h-5 cursor-pointer transition ${
                                                    i < (vacancy.average_stars || 0)
                                                        ? "fill-yellow-400"
                                                        : "fill-gray-300"
                                                }`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                            </svg>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <img src="/location.png" alt="location" className="w-5 h-5" />
                                        {vacancy.location || "Remote"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* O‘ng: Profil va savol */}
                    <div className="lg:w-1/3 w-full flex flex-col gap-6">
                        {/* Profil */}
                        <div className="w-[374px] h-[184px] bg-[#F4F6FA] border-none rounded-xl p-4 shadow-sm">
                            <div className="px-4 h-[79px] flex items-center gap-3  relative">
                                <img
                                    src={profileImage || "/user.jpg"}
                                    className="w-[60px] h-[60px] rounded-full object-cover cursor-pointer"
                                    alt="avatar"
                                />
                                <div>
                                    <p className="text-[16px] font-semibold underline text-black">
                                        {user ? formatName(user.full_name) : "Yuklanmoqda..."}
                                    </p>
                                    <p className="text-[14px] text-black mt-[4px]">
                                        {user?.title || "Профессия не указана"}
                                    </p>

                                </div>
                            </div>

                            <a
                                href="profile/"
                                className="text-[#3066BE] text-[14px] underline block mb-[14px]"
                            >
                                Заполните ваш профиль
                            </a>


                            <div className="flex items-center gap-2">
                                <div className="w-full h-[5px] bg-black rounded-full"></div>
                                <span className="text-sm font-semibold text-black text-[16px]">100%</span>
                            </div>
                        </div>


                        {/* UI Dizayn savol */}
                        <div className="w-[374px] h-[144px] bg-[#F4F6FA] rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <p className="text-[14px] font-medium text-[#AEAEAE] leading-[100%]">
                                    Улучшайте свои рабочие места
                                </p>
                                <button className="bg-[#F4F6FA] border-none">
                                    <img src="/three-dots.svg" alt="three dots" className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[16px] font-[400] text-black leading-[100%]">
                                    Есть ли у вас этот навык:{" "}
                                    <a href="profile/" className="text-[#3066BE] no-underline">UI дизайн?</a>
                                </p>
                            </div>
                            {skills.length > 0 ? (
                                <div key={skills[0].id}>
                                    <div className="flex gap-3 mt-3">
                                        <button
                                            onClick={() => handleSkillAnswer(skills[0].id, "yes")}
                                            className="flex items-center bg-[#3066BE]/20 border-none text-black text-sm font-medium rounded-[5px] px-[28px] py-[4px] gap-[9px]"
                                        >
                                            <img src="/check.png" alt="check" className="w-[14px] h-[9px]" />
                                            Да
                                        </button>

                                        <button
                                            onClick={() => handleSkillAnswer(skills[0].id, "no")}
                                            className="flex items-center bg-[#3066BE]/20 border-none text-black text-sm font-medium rounded-[5px] px-[28px] py-[4px] gap-[9px]"
                                        >
                                            <img src="/cancel.png" alt="x" className="w-[9px] h-[9px]" />
                                            Нет
                                        </button>

                                        <button
                                            onClick={() => handleSkillAnswer(skills[0].id, "skip")}
                                            className="text-[18px] font-medium bg-[#F4F6FA] border-none text-black leading-none"
                                        >
                                            Skip
                                        </button>
                                    </div>
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
                    onClose={() => setActiveModalIndex(null)}
                    vacancy={vacancies[activeModalIndex]}
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
                    <div
                        className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
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
                                    {texts[langCode].links.slice(0, 4).map((link, idx) => (
                                        <a key={idx} href="#"
                                           className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                            <span>&gt;</span> {link}
                                        </a>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-[20px]">
                                    {texts[langCode].links.slice(4).map((link, idx) => (
                                        <a key={idx} href="#"
                                           className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                            <span>&gt;</span> {link}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                        <div
                            className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                            <p>
                                {texts[langCode].copyright}
                            </p>

                            <div className="flex gap-[20px] text-[24px] mr-[38px]">
                                <a href="#" className="text-white"><i
                                    className="fab fa-whatsapp hover:text-[#F2F4FD]"></i></a>
                                <a href="#" className="text-white"><i
                                    className="fab fa-instagram hover:text-[#F2F4FD]"></i></a>
                                <a href="#" className="text-white"><i
                                    className="fab fa-facebook hover:text-[#F2F4FD]"></i></a>
                                <a href="#" className="text-white"><i
                                    className="fab fa-twitter hover:text-[#F2F4FD]"></i></a>
                            </div>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}

