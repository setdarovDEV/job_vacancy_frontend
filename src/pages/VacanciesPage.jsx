// src/pages/VacanciesPage.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown, ArrowLeft, Bookmark, BookmarkCheck, Clock, MapPin, DollarSign, CalendarRange, Star } from "lucide-react";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import MobileFooter from "../components/mobile/MobileFooter.jsx";
import MobileNavbarLogin from "../components/mobile/MobileNavbarLogin.jsx";
import MobileNavbar from "../components/mobile/MobileNavbar.jsx";

// ============================================
// HELPERS
// ============================================
const formatName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length < 2) return fullName;
    const firstInitial = parts[0][0].toUpperCase();
    const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return `${firstInitial}. ${lastName}`;
};

const timeAgo = (iso) => {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const sec = Math.max(1, Math.floor(diff / 1000));
    if (sec < 60) return `${sec} с`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} мин`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} ч`;
    const d = Math.floor(hr / 24);
    return `${d} д`;
};

// ============================================
// TEXTS
// ============================================
const TEXTS = {
    RU: {
        community: "Сообщество",
        vacancies: "Вакансии",
        chat: "Чат",
        companies: "Компании",
        login: "Войти",
        publishVacancy: "Опубликовать вакансию",
        selectRegion: "Выберите регион",
        selectSalary: "Выберите зарплату",
        selectPlan: "Выберите план",
        search: "Поиск",
        clear: "Очистить все",
        position: "Должность",
        logo: "Logo",
        links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
        copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
        description: "Описание",
        skillsExperience: "Навыки и опыт",
        aboutClient: "О клиенте",
        budget: "Бюджет",
        deadline: "Крайний срок",
        apply: "Откликнуться",
        applied: "Отклик отправлен",
        save: "Сохранить",
        saved: "Сохранено",
        payment: "Платеж подтвержден",
        otherJobs: "Другие открытые вакансии этого клиента",
    },
    UZ: {
        community: "Jamiyat",
        vacancies: "Vakansiyalar",
        chat: "Chat",
        companies: "Kompaniyalar",
        login: "Kirish",
        publishVacancy: "Vakansiya e'lon qilish",
        selectRegion: "Hududni tanlang",
        selectSalary: "Maoshni tanlang",
        selectPlan: "Rejani tanlang",
        search: "Qidiruv",
        clear: "Hammasini tozalash",
        position: "Lavozim",
        logo: "Logo",
        links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari", "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo'yicha ishlar"],
        copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
        description: "Tavsif",
        skillsExperience: "Ko'nikmalar va tajriba",
        aboutClient: "Mijoz haqida",
        budget: "Byudjet",
        deadline: "Muddat",
        apply: "Ariza yuborish",
        applied: "Ariza yuborildi",
        save: "Saqlash",
        saved: "Saqlangan",
        payment: "To'lov tasdiqlangan",
        otherJobs: "Mijozning boshqa vakansiyalari",
    },
};

// ============================================
// VACANCY MODAL (DESKTOP/TABLET)
// ============================================
function VacancyModal({ vacancy, onClose }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!vacancy?.id) return;
            try {
                setLoading(true);
                const res = await api.get(`/api/vacancies/jobposts/${vacancy.id}/`);
                setData(res.data);
                setIsSaved(res.data.is_saved);
                setIsApplied(res.data.is_applied);
            } catch (err) {
                console.error("Fetch detail error:", err);
                toast.error("Ошибка загрузки");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [vacancy?.id]);

    const handleApply = async () => {
        if (isApplied) return;
        try {
            await api.post("/api/applications/apply/", { job_post: data.id, cover_letter: "" });
            toast.success("Ariza yuborildi ✅");
            setIsApplied(true);
        } catch (err) {
            if (err.response?.status === 400) {
                toast.warn("Siz allaqachon ariza yuborgansiz ❗️");
                setIsApplied(true);
            } else {
                toast.error("Xatolik yuz berdi");
            }
        }
    };

    const toggleSave = async () => {
        try {
            const method = isSaved ? "delete" : "post";
            await api({ method, url: `/api/vacancies/jobposts/${data.id}/save/` });
            setIsSaved(!isSaved);
            toast.success(isSaved ? "Удалено ❌" : "Сохранено ✅");
        } catch (err) {
            console.error("Toggle save error:", err);
            toast.error("Ошибка");
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    if (loading) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end items-start p-4 overflow-auto">
            <div className="fixed top-0 right-0 z-50 bg-white shadow-lg flex flex-col lg:flex-row rounded-none w-full max-w-[1051px] h-[900px]">
                {/* LEFT */}
                <div className="w-full lg:w-3/4 p-8 overflow-y-auto">
                    <button onClick={onClose} className="absolute top-6 left-6 z-50 bg-white border-none ml-[-8px]">
                        <img src="/back.png" alt="Back" className="w-[34px] h-[18px] object-contain bg-white" />
                    </button>

                    <h2 className="w-[433px] text-[30px] leading-[150%] text-black font-semibold mt-12 mb-2">{data?.title}</h2>

                    <div className="flex items-center gap-3 mb-4 ml-[2px]">
                        <div className="flex items-center gap-[6px] text-[#AEAEAE] text-[12px] font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo(data?.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-[6px] text-[#AEAEAE] text-[12px] font-medium">
                            <MapPin className="w-3 h-3" />
                            <span>{data?.location || "Не указано"}</span>
                        </div>
                    </div>

                    <div className="w-[800px] h-[1px] bg-[#AEAEAE] my-6"></div>

                    <h3 className="text-[18px] text-black font-semibold mb-2">Описание</h3>
                    <p className="text-[15px] text-black font-medium mb-6">{data?.description || "Описание отсутствует."}</p>

                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-[6px] text-[20px] font-medium">
                            💰 <span className="text-[#3066BE]">{data?.budget}</span>
                        </div>
                    </div>

                    <div className="w-[800px] h-[1px] bg-[#AEAEAE] my-6"></div>

                    <p className="text-[18px] text-black font-semibold mb-3">Навыки и опыт</p>
                    <div className="flex flex-wrap gap-3">
                        {data?.skills?.length ? (
                            data.skills.map((s, i) => (
                                <span key={i} className="bg-gray-200 text-black text-[14px] px-4 py-1.5 rounded-full font-medium">
                                    {s}
                                </span>
                            ))
                        ) : (
                            <span className="text-[#AEAEAE]">Навыки не указаны</span>
                        )}
                    </div>
                </div>

                <div className="w-px h-[calc(100%-150px)] bg-[#AEAEAE] my-[75px] mx-4"></div>

                {/* RIGHT */}
                <div className="w-1/4 mt-[90px] bg-white p-8 flex flex-col items-center gap-4">
                    <button
                        onClick={handleApply}
                        disabled={isApplied}
                        className={`w-[168px] h-[59px] rounded-[10px] text-[16px] font-medium transition-all duration-200 flex items-center justify-center ${
                            isApplied ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-[#3066BE] text-white hover:bg-[#2b58a8]"
                        }`}
                    >
                        {isApplied ? "Отклик отправлен ✅" : "Откликнуться"}
                    </button>

                    <button
                        onClick={toggleSave}
                        className={`flex items-center justify-center gap-[10px] text-[16px] font-medium rounded-[10px] w-[168px] h-[59px] border transition-all duration-200 ${
                            isSaved
                                ? "bg-[#3066BE] text-white border-[#3066BE] hover:bg-[#2b58a8]"
                                : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#f2f7ff]"
                        }`}
                    >
                        <img src="/save.png" alt="save" className={`w-4 h-4 transition-all duration-200 ${isSaved ? "filter brightness-200" : ""}`} />
                        {isSaved ? "Сохранено" : "Сохранить"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// SEARCH MODAL (TABLET)
// ============================================
function SearchModal({ onClose, onSearch, onClear, initialTitle, initialLocation, initialSalary, initialPlan }) {
    const [localTitle, setLocalTitle] = useState(initialTitle || "");
    const [localLocation, setLocalLocation] = useState(initialLocation || "");
    const [localSalary, setLocalSalary] = useState(initialSalary || { min: "", max: "" });
    const [localPlan, setLocalPlan] = useState(initialPlan || "");

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[999] flex items-start md:items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-[94%] max-w-[920px] bg-white rounded-[20px] shadow-xl overflow-hidden mt-6 md:mt-0 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 bg-white text-[#3066BE]">
                    <X size={20} />
                </button>

                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-center text-[20px] md:text-[22px] font-semibold text-black">Поиск вакансий</h3>
                </div>

                <div className="px-6 py-5">
                    <div className="bg-[#F4F6FA] rounded-2xl p-4 md:p-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Должность"
                                value={localTitle}
                                onChange={(e) => setLocalTitle(e.target.value)}
                                className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent px-4 text-[14px] text-black placeholder:text-gray-400 outline-none focus:ring-0"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                            <div className="relative">
                                <select
                                    value={localLocation}
                                    onChange={(e) => setLocalLocation(e.target.value)}
                                    className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none"
                                >
                                    <option value="">Выберите регион</option>
                                    <option value="Узбекистан">Узбекистан</option>
                                    <option value="Россия">Россия</option>
                                    <option value="Турция">Турция</option>
                                </select>
                                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70" />
                            </div>

                            <div className="relative">
                                <select
                                    value={localSalary.min && localSalary.max ? `${localSalary.min}-${localSalary.max}` : ""}
                                    onChange={(e) => {
                                        const [min, max] = e.target.value.split("-");
                                        setLocalSalary({ min, max });
                                    }}
                                    className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none"
                                >
                                    <option value="">Выберите зарплату</option>
                                    <option value="500-1000">500-1000</option>
                                    <option value="1000-1500">1000-1500</option>
                                    <option value="1500-2000">1500-2000</option>
                                </select>
                                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70" />
                            </div>

                            <div className="relative">
                                <select
                                    value={localPlan}
                                    onChange={(e) => setLocalPlan(e.target.value)}
                                    className="w-full h-[52px] rounded-xl bg-[#F4F6FA] border border-transparent pr-10 pl-4 text-[14px] text-black outline-none appearance-none"
                                >
                                    <option value="">Premium</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Premium">Premium</option>
                                </select>
                                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 flex items-center justify-between">
                    <button onClick={onClear} className="h-[44px] px-5 rounded-[10px] border border-[#3066BE] text-[#3066BE] bg-white hover:bg-[#F5F8FF] transition">
                        Очистить все
                    </button>

                    <button
                        onClick={() => {
                            onSearch(localTitle, localLocation, localSalary, localPlan);
                            onClose();
                        }}
                        className="h-[44px] px-6 rounded-[10px] bg-[#3066BE] text-white font-medium hover:bg-[#2757a4] transition"
                    >
                        Поиск
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MOBILE VACANCY MODAL
// ============================================
function MobileVacancyModal({ vacancy, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!vacancy?.id) return;
            try {
                setLoading(true);
                const res = await api.get(`/api/vacancies/jobposts/${vacancy.id}/`);
                setData(res.data);
            } catch (err) {
                console.error("Fetch detail error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();

        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [vacancy?.id]);

    if (loading) return null;

    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col">
            <div className="h-[60px] flex items-center justify-between px-4 border-b">
                <button onClick={onClose} className="p-2 bg-white border-none">
                    <ArrowLeft className="w-5 h-5 text-[#3066BE]" />
                </button>
            </div>

            <main className="flex-1 overflow-y-auto">
                <div className="px-5 pt-3 pb-4 border-b">
                    <h1 className="text-[20px] font-extrabold text-black">{data?.title}</h1>
                    <div className="mt-2 flex items-center gap-4 text-[13px] text-black/45">
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Опубликовано {new Date(data?.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {data?.location || "Узбекистан"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col divide-y divide-gray-300">
                    <section className="p-4">
                        <h2 className="text-[15px] font-semibold mb-2 text-black">Описание</h2>
                        <p className="text-[14px] leading-relaxed text-black/80">{data?.description}</p>
                    </section>

                    <section className="p-4 space-y-3 text-black">
                        <p className="flex items-center gap-2 text-[15px] font-medium">
                            <span className="text-xl">$</span>
                            <span>{data?.budget}</span>
                        </p>
                    </section>

                    <section className="p-4">
                        <h2 className="text-[15px] font-semibold mb-3 text-black">Навыки и опыт</h2>
                        <div className="flex flex-wrap gap-2">
                            {data?.skills?.map((tag, i) => (
                                <span key={i} className="bg-[#E5E5E5] text-black text-[13px] px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="p-4 space-y-2">
                        <h2 className="text-[15px] font-semibold">О клиенте</h2>
                        <div className="flex items-center gap-2 text-[13px] text-black/70">
                            <img src="/check.svg" alt="verified" className="w-4 h-4" />
                            Платеж подтвержден
                        </div>
                    </section>
                </div>

                <div className="p-4">
                    <button className="w-full h-12 rounded-xl bg-[#3066BE] text-white font-medium">Откликнуться</button>
                </div>
            </main>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function VacanciesPage() {
    const navigate = useNavigate();

    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState({ min: "", max: "" });
    const [plan, setPlan] = useState("");

    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";
    const t = TEXTS[langCode];

    useEffect(() => {
        api.get("/api/auth/me/")
            .then((res) => setUser(res.data))
            .catch(() => {});
    }, []);

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
            .catch(() => {});
    }, []);

    const fetchVacancies = async (page = 1) => {
        try {
            setLoading(true);
            const params = { page };
            if (title?.trim()) params.search = title;
            if (location) params.location = location;
            if (plan) params.plan = plan;
            if (salary?.min) params.salary_min = parseFloat(salary.min);
            if (salary?.max) params.salary_max = parseFloat(salary.max);

            const res = await api.get("/api/vacancies/jobposts/", { params });
            setVacancies(res.data.results || []);
            setTotalPages(Math.ceil((res.data.count || 1) / 10));
        } catch (err) {
            console.error("Fetch vacancies error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacancies(currentPage);
    }, [currentPage]);

    const handleSearch = () => fetchVacancies(1);

    const handleClear = () => {
        setTitle("");
        setLocation("");
        setSalary({ min: "", max: "" });
        setPlan("");
        setCurrentPage(1);
        fetchVacancies(1);
    };

    const handleRate = async (jobId, stars) => {
        try {
            await api.post(`/api/vacancies/jobposts/${jobId}/rate/`, { stars });
            const res = await api.get(`/api/vacancies/jobposts/${jobId}/`);
            setVacancies((prev) => prev.map((vac) => (vac.id === jobId ? res.data : vac)));
            toast.success("Baholandi! ✅");
        } catch (err) {
            toast.error("Baholashda xatolik.");
        }
    };

    const handleProfileRedirect = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Avval tizimga kiring!");
            navigate("/login");
            return;
        }
        navigate("/profile");
    };

    return (
        <>
            {/* ============================================ */}
            {/* DESKTOP VERSION (lg:) */}
            {/* ============================================ */}
            <div className="hidden lg:block font-sans relative bg-white">
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        <a href="/">
                            <img src="/logo.png" alt="Logo" className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain" />
                        </a>

                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">
                                {t.community}
                            </a>
                            <a href="/vacancies" className="text-[#3066BE] hover:text-[#3066BE] transition">
                                {t.vacancies}
                            </a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">
                                {t.chat}
                            </a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">
                                {t.companies}
                            </a>
                        </div>

                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            <ProfileDropdown />
                        </div>
                    </div>
                </nav>

                <div className="bg-white py-4 mt-[90px]">
                    <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                        <div className="w-[924px] h-[49px] bg-white rounded-md flex items-center px-4 ml-[258px] overflow-hidden">
                            <button onClick={handleSearch} className="w-[35px] h-[35px] flex items-center justify-center border-none bg-white text-black rounded-[5px] transition p-1">
                                <img src="/search.png" alt="search" className="w-[20px] h-[20px] object-contain z-10" />
                            </button>

                            <input
                                type="text"
                                placeholder="Должность"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black placeholder:text-gray-700 focus:outline-none"
                            />

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

                            <select
                                value={`${salary.min}-${salary.max}`}
                                onChange={(e) => {
                                    const [min, max] = e.target.value.split("-");
                                    setSalary({ min: parseFloat(min), max: parseFloat(max) });
                                }}
                                className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black focus:outline-none"
                            >
                                <option value="">Выберите зарплату</option>
                                <option value="500-1000">500-1000</option>
                                <option value="1000-1500">1000-1500</option>
                                <option value="1500-2000">1500-2000</option>
                            </select>

                            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-[160px] h-[35px] rounded-none text-sm bg-[#F4F6FA] border-none text-black focus:outline-none">
                                <option value="">Выберите план</option>
                                <option value="Basic">Basic</option>
                                <option value="Pro">Pro</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="text-center font-extrabold text-[35px] leading-[150%] text-black mb-10">{t.vacancies}</h1>

                    <div className="mt-6">
                        <h2
                            onClick={() => {
                                if (!user) return toast.error("Пользователь не найден.");
                                if (user.role === "EMPLOYER") {
                                    navigate("/home");
                                } else if (user.role === "JOB_SEEKER") {
                                    toast.warn("Вы не можете создавать вакансии.");
                                } else {
                                    toast.info("Пожалуйста, войдите в систему.");
                                }
                            }}
                            className="text-[18px] leading-[150%] font-bold text-black mb-2 cursor-pointer hover:text-[#3066BE] transition-colors duration-200"
                        >
                            {t.publishVacancy}
                        </h2>
                        <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-6"></div>
                        <hr className="border-t border-[#D9D9D9] mb-6" />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="lg:w-2/3 w-full flex flex-col gap-6">
                            {vacancies.map((vacancy, index) => (
                                <div key={vacancy.id || index} className="rounded-xl shadow p-6 hover:shadow-lg transition">
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
                                        <p className="text-gray-600 ml-[27px] mb-[10px] text-sm">{vacancy.budget ? `$${vacancy.budget.replace(/[^\d–-]/g, "").replace(/[–-]/, " - $")}` : "$0 - $0"}</p>
                                    </div>

                                    <p className="text-gray-400 mb-4">{vacancy.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {vacancy.skills?.map((tag, index) => (
                                            <span key={index} className="bg-[#D9D9D9] text-black px-3 py-1 rounded-full text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

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
                                                    className={`w-5 h-5 cursor-pointer transition ${i < (vacancy.average_stars || 0) ? "fill-yellow-400" : "fill-gray-300"}`}
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

                        <div className="lg:w-1/3 w-full flex flex-col gap-6">
                            <div className="w-[374px] h-[184px] bg-[#F4F6FA] border-none rounded-xl p-4 shadow-sm">
                                <div className="px-4 h-[79px] flex items-center gap-3 relative">
                                    <img src={profileImage || "/user1.png"} className="w-[60px] h-[60px] rounded-full object-cover cursor-pointer" alt="avatar" />
                                    <div>
                                        <p className="text-[16px] font-semibold underline text-black">{user ? formatName(user.full_name) : "Yuklanmoqda..."}</p>
                                        <p className="text-[14px] text-black mt-[4px]">{user?.title || "Профессия не указана"}</p>
                                    </div>
                                </div>
                                <a onClick={handleProfileRedirect} className="text-[#3066BE] text-[14px] underline block mb-[14px] cursor-pointer">
                                    Заполните ваш профиль
                                </a>
                                <div className="flex items-center gap-2">
                                    <div className="w-full h-[5px] bg-black rounded-full"></div>
                                    <span className="text-sm font-semibold text-black text-[16px]">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {activeModalIndex !== null && <VacancyModal vacancy={vacancies[activeModalIndex]} onClose={() => setActiveModalIndex(null)} />}

                <div className="w-full flex justify-center mt-6 mb-[64px]">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative transition ${
                                currentPage === 1 ? "border-gray-300 opacity-50 cursor-not-allowed" : "border-[#3066BE] hover:bg-[#3066BE]/10 bg-white"
                            }`}
                        >
                            <img src="/pagination.png" alt="prev" className="w-5 h-5 object-contain absolute z-10 rotate-180" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition ${
                                        currentPage === page ? "bg-[#3066BE] text-white border-[#3066BE]" : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#3066BE]/10"
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative transition ${
                                currentPage === totalPages ? "border-gray-300 opacity-50 cursor-not-allowed" : "border-[#3066BE] hover:bg-[#3066BE]/10 bg-white"
                            }`}
                        >
                            <img src="/pagination.png" alt="next" className="w-5 h-5 object-contain absolute z-10" />
                        </button>
                    </div>
                </div>

                <footer className="w-full h-[393px] relative overflow-hidden">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                    <div className="relative z-20">
                        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                            <div className="flex gap-[190px]">
                                <div>
                                    <h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">{t.logo}</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-[184px]">
                                    <div className="flex flex-col gap-[20px]">
                                        {t.links.slice(0, 4).map((link, idx) => (
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
                                        {t.links.slice(4).map((link, idx) => (
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
                                <p>{t.copyright}</p>

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

            {/* ============================================ */}
            {/* TABLET VERSION (md:lg) */}
            {/* ============================================ */}
            <div className="hidden md:block lg:hidden">
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[960px] mx-auto flex items-center justify-between px-4 h-[90px]">
                        <a href="/">
                            <img src="/logo.png" alt="Logo" className="w-[90px] h-[60px] object-contain" />
                        </a>

                        <div className="flex gap-6 font-semibold text-[14px] tracking-wide">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">
                                {t.community}
                            </a>
                            <a href="/vacancies" className="text-[#3066BE]">
                                {t.vacancies}
                            </a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">
                                {t.chat}
                            </a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">
                                {t.companies}
                            </a>
                        </div>

                        <ProfileDropdown />
                    </div>
                </nav>

                <div className="bg-white mt-[90px] py-3">
                    <div className="mx-auto max-w-[960px] px-4">
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowSearchModal(true)}
                                className="max-w-[420px] h-[44px] w-[240px] rounded-lg bg-[#F4F6FA] border border-gray-200 text-[#6B7280] text-[14px] px-4 flex items-center gap-2 hover:bg-[#EFF3FA] transition"
                            >
                                <img src="/search.png" alt="" className="w-[18px] h-[18px] opacity-70" />
                                <span>Поиск вакансий</span>
                            </button>
                        </div>
                    </div>
                </div>

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
                        onClear={handleClear}
                        onSearch={handleSearch}
                    />
                )}

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-center font-extrabold text-[28px] leading-[140%] text-black mb-6">{t.vacancies}</h1>

                    <div className="mt-4">
                        <button
                            onClick={() => {
                                if (!user) return toast.error("Пользователь не найден. Войдите в систему.");
                                if (user.role === "JOB_SEEKER") {
                                    toast.warning("Вы не можете публиковать вакансии.");
                                } else if (user.role === "EMPLOYER") {
                                    window.location.href = "/profile";
                                } else {
                                    toast.info("Пожалуйста, войдите в систему.");
                                }
                            }}
                            className="bg-white text-black font-medium border-none text-[15px] px-6 py-2 rounded-md transition ml-[-26px]"
                        >
                            {t.publishVacancy}
                        </button>
                        <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-4"></div>
                        <hr className="border-t border-[#D9D9D9] mb-6" />
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="w-full flex flex-col gap-4">
                            {vacancies.map((vacancy, index) => (
                                <div key={vacancy.id || index} className="rounded-xl shadow p-4 bg-white hover:shadow-md transition">
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
                                    <p className="text-gray-600 text-sm mb-2">{vacancy.budget ? `$${vacancy.budget}` : "—"}</p>

                                    <p className="text-gray-500 text-sm mb-3">{vacancy.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {vacancy.skills?.map((tag, i) => (
                                            <span key={i} className="bg-[#D9D9D9] text-black px-3 py-1 rounded-full text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

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
                                                    className={`w-5 h-5 cursor-pointer transition ${i < (vacancy.average_stars || 0) ? "fill-yellow-400" : "fill-gray-300"}`}
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
                    </div>
                </div>

                {activeModalIndex !== null && <VacancyModal vacancy={vacancies[activeModalIndex]} onClose={() => setActiveModalIndex(null)} />}

                <div className="w-full flex justify-center mt-4 mb-12 px-4">
                    <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition ${
                                        currentPage === page ? "bg-[#3066BE] text-white border-[#3066BE]" : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#3066BE]/10"
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <footer className="relative overflow-hidden mt-[50px] w-full">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                    <div className="relative z-20 w-full px-6 py-8 text-white">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-[36px] font-black">{t.logo}</h2>

                            <div className="grid grid-cols-2 text-white gap-x-10 gap-y-3">
                                {t.links.slice(0, 4).map((link, i) => (
                                    <a key={`l-${i}`} href="#" className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors">
                                        <span>›</span> {link}
                                    </a>
                                ))}
                                {t.links.slice(4).map((link, i) => (
                                    <a key={`r-${i}`} href="#" className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors">
                                        <span>›</span> {link}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4 w-full">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <p className="text-[13px] leading-snug">{t.copyright}</p>

                                <div className="flex items-center gap-4 text-[20px]">
                                    <a href="#" className="text-white hover:opacity-90">
                                        <i className="fab fa-whatsapp" />
                                    </a>
                                    <a href="#" className="text-white hover:opacity-90">
                                        <i className="fab fa-instagram" />
                                    </a>
                                    <a href="#" className="text-white hover:opacity-90">
                                        <i className="fab fa-facebook" />
                                    </a>
                                    <a href="#" className="text-white hover:opacity-90">
                                        <i className="fab fa-twitter" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ============================================ */}
            {/* MOBILE VERSION (default) */}
            {/* ============================================ */}
            <div className="block md:hidden min-h-screen bg-white">
                {/* Conditional Navbar based on user authentication */}
                {user ? <MobileNavbarLogin /> : <MobileNavbar />}

                <div className="mt-[60px]">
                    <div className="px-4 pt-3 flex items-center justify-between gap-3">
                        <button onClick={() => setShowSearchModal(true)} className="h-10 w-[143px] ml-[130px] rounded-2xl bg-[#F4F6FA] px-3 pr-4 flex items-center gap-3 active:scale-[.99]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
                            </svg>

                            <span className="text-[14px] text-black/70">ПОИСК...</span>
                        </button>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <h1 className="text-center font-extrabold text-2xl leading-[150%] text-black mb-6">{t.vacancies}</h1>

                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    if (!user) {
                                        alert("Сначала войдите в систему / Avval tizimga kiring");
                                        return;
                                    }
                                    if (user.role === "JOB_SEEKER") {
                                        alert("❗️Вы не можете публиковать вакансии (faqat ish beruvchilar uchun).");
                                    } else if (user.role === "EMPLOYER") {
                                        navigate("/profile");
                                    } else {
                                        alert("Bu amal siz uchun mavjud emas.");
                                    }
                                }}
                                className="mt-2 px-4 py-2 rounded-xl bg-white text-black text-[14px] font-semibold active:scale-95 transition ml-[-18px]"
                            >
                                {t.publishVacancy}
                            </button>
                            <div className="w-[52px] h-[4px] bg-[#D9D9D9] rounded mb-4"></div>
                            <hr className="border-t border-[#D9D9D9] mb-4" />
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="w-full flex flex-col gap-3">
                                {vacancies.map((vacancy, index) => (
                                    <div key={vacancy.id || index} className="rounded-2xl border border-black/10 p-3 hover:shadow-lg transition">
                                        <div className="flex items-center text-black/45 text-[12px] mb-2">
                                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {new Date(vacancy.created_at).toLocaleDateString()}
                                        </div>

                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                onClick={() => setActiveModalIndex(index)}
                                                className="text-[17px] leading-[1.2] bg-white font-extrabold text-black text-left hover:text-[#3066BE] transition-colors border-none ml-[-22px]"
                                            >
                                                {vacancy.title}
                                            </button>
                                            <p className="text-[12px] text-black/55 mb-[6px]">{vacancy.budget ? vacancy.budget : "Зарплата не указана"}</p>
                                        </div>

                                        <p className="text-[14px] text-black/35 leading-[1.6] mb-3 line-clamp-2">{vacancy.description}</p>

                                        <div className="flex flex-wrap gap-2.5 mb-3">
                                            {vacancy.skills?.map((tag, i) => (
                                                <span key={i} className="px-3.5 py-1.5 rounded-full bg-[#E5E5E5] text-[13px] text-black/90">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center text-[13px] text-black/55 mt-3">
                                            <div className="flex items-center gap-2 relative">
                                                <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                                <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[6px] left-[6px]" />
                                                {vacancy.is_fixed_price ? "Fixed" : "Hourly"}
                                            </div>

                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        onClick={() => handleRate(vacancy.id, i + 1)}
                                                        className={`w-4 h-4 cursor-pointer transition ${i < (vacancy.average_stars || 0) ? "fill-[#FFC107]" : "fill-[#E0E0E0]"}`}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                                    </svg>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <img src="/location.png" alt="location" className="w-4 h-4" />
                                                {vacancy.location || "Remote"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center mt-8 mb-20">
                        <div className="flex items-center gap-3">
                            {[...Array(totalPages)].map((_, i) => {
                                const num = i + 1;
                                return (
                                    <button
                                        key={num}
                                        onClick={() => setCurrentPage(num)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-[15px] font-semibold transition-all duration-200 ${
                                            num === currentPage ? "bg-[#3066BE] border-[#3066BE] text-white" : "bg-white border-[#3066BE] text-[#3066BE] hover:bg-[#3066BE] hover:text-white"
                                        }`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {activeModalIndex !== null && <MobileVacancyModal vacancy={vacancies[activeModalIndex]} onClose={() => setActiveModalIndex(null)} />}

                {showSearchModal && (
                    <SearchModal
                        initialTitle={title}
                        initialLocation={location}
                        initialSalary={salary}
                        initialPlan={plan}
                        onClose={() => setShowSearchModal(false)}
                        onSearch={(newTitle, newLocation, newSalary, newPlan) => {
                            setTitle(newTitle);
                            setLocation(newLocation);
                            setSalary(newSalary);
                            setPlan(newPlan);
                            handleSearch();
                        }}
                        onClear={handleClear}
                    />
                )}

                <MobileFooter />
            </div>
        </>
    );
}