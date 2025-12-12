// src/pages/CompaniesPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Briefcase, X, ChevronDown, ChevronUp, SlidersHorizontal, ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown";
import MobileNavbar from "../components/mobile/MobileNavbar";
import MobileNavbarLogin from "../components/mobile/MobileNavbarLogin";
import MobileFooter from "../components/mobile/MobileFooter";

// ============================================
// HELPERS
// ============================================
const API_BASE = (api?.defaults?.baseURL || "https://jobvacancy-api.duckdns.org").replace(/\/+$/, "");
const API_ORIGIN = API_BASE.replace(/\/api$/i, "");

const mediaUrl = (path, fallback = "/company-fallback.png") => {
    if (!path || typeof path !== "string") return fallback;
    if (/^(?:https?:)?\/\//i.test(path) || /^data:/i.test(path) || /^blob:/i.test(path)) return path;
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${API_ORIGIN}${p}`;
};

const debounce = (fn, d = 400) => {
    let t;
    return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), d);
    };
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
        addCompany: "Добавить компанию",
        filter: "Фильтр",
        companyLabel: "Компания:",
        locationLabel: "Локация:",
        keywordLabel: "Ключевое слово:",
        selectCompany: "Выберите компанию",
        selectLocation: "Выберите локацию",
        keywordPlaceholder: "Образование, интернет",
        position: "Должность:",
        rating: "Рейтинг компании",
        andHigher: "и выше",
        companySize: "Размер компании",
        logo: "Logo",
        links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
        copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
    },
    UZ: {
        community: "Jamiyat",
        vacancies: "Vakansiyalar",
        chat: "Chat",
        companies: "Kompaniyalar",
        login: "Kirish",
        addCompany: "Kompaniya qo'shish",
        filter: "Filtr",
        companyLabel: "Kompaniya:",
        locationLabel: "Joylashuv:",
        keywordLabel: "Kalit so'z:",
        selectCompany: "Kompaniyani tanlang",
        selectLocation: "Joyni tanlang",
        keywordPlaceholder: "Ta'lim, internet",
        position: "Lavozim:",
        rating: "Kompaniya reytingi",
        andHigher: "va yuqori",
        companySize: "Kompaniya hajmi",
        logo: "Logo",
        links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari", "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo'yicha ishlar"],
        copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
    },
};

// ============================================
// COMPANY MODAL (DESKTOP/TABLET)
// ============================================
function CompanyModal({ company: companyProp, companyId: companyIdProp, onClose }) {
    const id = companyIdProp ?? companyProp?.id ?? null;
    const [company, setCompany] = useState(companyProp || null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access_token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const [{ data: c }, { data: s }] = await Promise.all([
                    api.get(`/api/companies/${id}/`, { headers }),
                    api.get(`/api/companies/${id}/stats/`, { headers }),
                ]);
                if (isMounted) {
                    setCompany(c);
                    setStats(s);
                    setIsFollowing(!!s?.is_following);
                }
            } catch (e) {
                console.error("Company modal error:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const toggleFollow = async () => {
        if (!id) return;
        try {
            await api.post(`/api/companies/${id}/toggle-follow/`);
            const { data: s } = await api.get(`/api/companies/${id}/stats/`);
            setStats(s);
            setIsFollowing(!!s.is_following);
            toast.success(s.is_following ? "Вы подписаны ✅" : "Отписка успешна");
        } catch (e) {
            console.error("Follow toggle error:", e);
            toast.error("Ошибка");
        }
    };

    if (!id || loading || !company) return null;

    const bannerSrc = mediaUrl(company?.banner) || "/kompaniya-modal.png";
    const logoSrc = mediaUrl(company?.logo) || "/google.png";

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-auto">
            <div className="absolute top-0 right-0 bg-white shadow-lg flex flex-col rounded-none max-h-screen overflow-y-auto" style={{ width: "1051px" }}>
                <div className="relative h-[214px] w-full">
                    <img src={bannerSrc} alt="cover" className="w-full h-full object-cover blur-sm brightness-90" />
                    <button onClick={onClose} className="absolute top-[20px] left-[20px] z-[9999] w-[34px] h-[18px] bg-transparent border-none p-0">
                        <img src="/back.png" alt="exit" className="w-full h-full object-contain" />
                    </button>
                </div>

                <div className="w-full px-[69px] flex flex-col gap-8 mt-[30px]">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col items-center gap-[14px]">
                            <div className="w-[78px] h-[78px] rounded-full overflow-hidden border-4 border-white bg-white">
                                <img src={logoSrc} alt={`${company.name} Logo`} className="w-full h-full object-contain" />
                            </div>
                            <p className="text-[30px] font-bold text-black leading-[45px]">{company.name}</p>
                        </div>

                        <div className="flex gap-4 mt-[20px]">
                            <button onClick={toggleFollow} className={isFollowing ? "px-5 h-[44px] bg-[#E8EEF9] text-[#3066BE] rounded-md font-semibold" : "px-5 h-[44px] border border-[#3066BE] bg-white text-[#3066BE] rounded-md font-semibold hover:bg-[#3066BE]/10"}>
                                {isFollowing ? "Вы подписаны" : "Подписаться"}
                            </button>
                            <button className="px-6 h-[44px] bg-[#3066BE] text-white rounded-md text-[15px] font-semibold hover:opacity-90 transition">Оставить отзыв</button>
                        </div>
                    </div>

                    <div className="mt-8 px-6 py-8 border border-[#3066BE] bg-[#F4F6FA] rounded-[30px] w-[906px] h-[273px]">
                        <h3 className="text-[30px] leading-[36px] text-[#3066BE] font-bold max-w-[1000px] mb-[17px]">Найдите то, что подходит именно вам — быстрее.</h3>
                        <p className="text-[20px] leading-[30px] text-[#AEAEAE] font-[400] max-w-[807px] mb-[19px]">Получите персонализированную информацию о работе в компании {company.name} за один быстрый шаг.</p>
                    </div>

                    <div className="max-w-[902px] mx-auto mt-10 mb-[87px]">
                        <p className="text-[20px] leading-[30px] text-black font-medium">{company.description ? company.description : "Описание пока не добавлено."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MOBILE COMPANY DETAIL MODAL
// ============================================
function MobileCompanyDetail({ company, onClose }) {
    const [isFollowing, setIsFollowing] = useState(false);

    const toggleFollow = async () => {
        try {
            await api.post(`/api/companies/${company.id}/toggle-follow/`);
            setIsFollowing(!isFollowing);
            toast.success(isFollowing ? "Отписка успешна" : "Вы подписаны ✅");
        } catch (e) {
            toast.error("Ошибка");
        }
    };

    const logo = mediaUrl(company?.logo);
    const rating = Number(company?.avg_rating ?? 4.0).toFixed(1);

    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col">
            <div className="h-[60px] flex items-center justify-between px-4 border-b">
                <button onClick={onClose} className="p-2 bg-white border-none">
                    <ArrowLeft className="w-5 h-5 text-[#3066BE]" />
                </button>
            </div>

            <main className="flex-1 overflow-y-auto">
                <div className="w-full h-[120px] relative overflow-hidden mb-[50px]">
                    <img src="/kompaniya-modal.png" alt="cover" className="w-full h-full object-cover" />
                </div>

                <section className="px-4 -mt-8">
                    <div className="flex items-start gap-3">
                        <img src={logo} onError={(e) => { e.currentTarget.src = "/company-fallback.png"; }} alt={company?.name || "Company"} className="w-14 h-14 rounded-full object-contain bg-white border shadow" />

                        <div className="flex-1">
                            <h1 className="text-[22px] font-bold leading-none text-black">{company?.name || "—"}</h1>

                            <div className="mt-2 flex items-center gap-3 text-[13px] text-black">
                                <span className="inline-flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    1000+ сотрудников
                                </span>
                                <span className="text-[#3066BE]">•</span>
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {company?.location || "Узбекистан"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <button onClick={toggleFollow} className={isFollowing ? "h-9 px-4 rounded-xl bg-[#E8EEF9] text-[#3066BE] text-[14px] font-semibold" : "h-9 px-4 rounded-xl border bg-white border-[#3066BE] text-[#3066BE] text-[14px] font-semibold"}>
                            {isFollowing ? "Вы подписаны" : "Подписаться"}
                        </button>
                        <button className="h-9 px-4 rounded-xl bg-[#3066BE] text-white text-[14px] font-semibold">Оставить отзыв</button>

                        <div className="ml-auto inline-flex items-center gap-1 text-[14px] text-[#3066BE]">
                            <span className="font-semibold">{rating}</span>
                            <Star className="w-4 h-4" color="#3066BE" fill="#3066BE" />
                        </div>
                    </div>
                </section>

                <section className="px-4 py-5">
                    <div className="rounded-2xl border border-[#3066BE]">
                        <div className="p-4">
                            <h3 className="text-[16px] font-semibold text-[#3066BE]">Найдите то, что подходит именно вам — быстрее.</h3>
                            <p className="text-[14px] text-black/80 mt-2">Получите персонализированную информацию о работе в компании {company?.name || "—"} за один быстрый шаг.</p>
                        </div>
                    </div>
                </section>

                <section className="px-4">
                    <p className="text-[14px] leading-[22px] text-black/90">{company?.description || "Описание отсутствует."}</p>
                </section>

                <div style={{ height: "calc(env(safe-area-inset-bottom) + 16px)" }} />
            </main>
        </div>
    );
}

// ============================================
// FILTER MODAL (MOBILE)
// ============================================
function MobileFilterModal({ open, onClose, query, setQuery, location, setLocation, keyword, setKeyword, rating, setRating, size, setSize, onClear, onApply }) {
    const [showRoles, setShowRoles] = useState(true);
    const ROLES = ["Администрация", "Дизайн", "Образование", "Маркетинг", "Разработка"];

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            <div className="h-[60px] border-b border-[#AEAEAE] flex items-center justify-center relative px-4">
                <p className="text-[15px] font-semibold text-black">Фильтр компаний</p>
                <button onClick={onClose} className="absolute right-3 p-2 bg-white border-none rounded-md active:scale-95" aria-label="Close">
                    <X className="w-5 h-5 text-[#3066BE]" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "calc(120px + env(safe-area-inset-bottom))" }}>
                <div className="px-4 py-4 space-y-5">
                    <div>
                        <label className="block text-[15px] font-semibold mb-2 text-black">Компания:</label>
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Выберите компанию" className="w-full h-11 bg-[#F4F6FA] border-none text-black rounded-xl px-3 text-[14px] outline-none" />
                    </div>

                    <div>
                        <label className="block text-[15px] font-semibold mb-2">Локация:</label>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Выберите локацию" className="w-full h-11 bg-[#F4F6FA] border-none text-black rounded-xl px-3 text-[14px] outline-none" />
                    </div>

                    <div>
                        <label className="block text-[15px] font-semibold mb-2">Ключевое слово:</label>
                        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Образование, интернет" className="w-full h-11 bg-[#F4F6FA] border-none text-black rounded-xl px-3 text-[14px] outline-none" />
                    </div>
                </div>

                <div className="h-px bg-[#AEAEAE]" />

                <div className="px-4 py-4">
                    <button onClick={() => setShowRoles((v) => !v)} className="w-full flex items-center justify-between bg-white border-none text-black">
                        <span className="text-[15px] font-semibold bg-white text-black ml-[-18px]">Должность</span>
                        {showRoles ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {showRoles && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                            {ROLES.map((r, i) => (
                                <label key={i} className="flex items-center gap-2 text-[14px]">
                                    <input type="checkbox" className="w-4 h-4 accent-[#3066BE] text-black" />
                                    <p className="text-black">{r}</p>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-[#AEAEAE]" />

                <div className="px-4 py-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[15px] font-semibold text-black">Рейтинг компании</p>
                            <div className="mt-2 flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button key={s} onClick={() => setRating(s === rating ? 0 : s)} className="p-1 active:scale-95 bg-white border-none" aria-label={`rating ${s}`}>
                                        <Star className="w-5 h-5" color={s <= rating ? "#FFBF00" : "#D9D9D9"} fill={s <= rating ? "#FFBF00" : "#D9D9D9"} />
                                    </button>
                                ))}
                                <button onClick={() => rating > 0 && setRating(rating)} className="ml-2 text-[#3066BE] bg-white text-[14px] font-medium">
                                    и выше
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-[15px] font-semibold mb-2 text-black">Размер компании</p>
                        <div className="grid grid-cols-1 gap-2">
                            {["1-50", "51-200", "200-500", "500-1000", "1000+", "любой размер"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 text-[14px]">
                                    <input type="radio" name="company_size" className="w-4 h-4 accent-[#3066BE]" checked={size === opt} onChange={() => setSize(opt)} />
                                    <p className="text-black">{opt}</p>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-4 pt-2">
                    <div className="flex items-center justify-between">
                        <button onClick={onClear} className="h-10 px-4 rounded-xl border border-[#3066BE] text-[#3066BE] text-[14px] font-medium bg-white active:scale-95">
                            Очистить все
                        </button>
                        <button onClick={onApply} className="h-10 px-6 rounded-xl bg-[#3066BE] text-white text-[14px] font-semibold active:scale-95">
                            Поиск
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function CompaniesPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [query, setQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [keyword, setKeyword] = useState("");
    const [rating, setRating] = useState(0);
    const [size, setSize] = useState("");

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";
    const t = TEXTS[langCode] || TEXTS.RU;

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

    const fetchCompanies = async (pageNum = 1) => {
        try {
            setLoading(true);
            const params = {
                page: pageNum,
                search: keyword || undefined,
                company: query || undefined,
                location: locationFilter || undefined,
                rating_min: rating || undefined,
                size: size || undefined,
            };

            const { data } = await api.get("/api/companies/", { params });
            const list = Array.isArray(data) ? data : data?.results || [];
            setCompanies(list);
            setTotalPages(Math.ceil((data?.count || 1) / 10));
        } catch (e) {
            console.error("Fetch companies error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies(page);
    }, [page, query, locationFilter, keyword, rating, size]);

    const handleClear = () => {
        setQuery("");
        setLocationFilter("");
        setKeyword("");
        setRating(0);
        setSize("");
        setPage(1);
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
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">
                                {t.vacancies}
                            </a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">
                                {t.chat}
                            </a>
                            <a href="/companies" className="text-[#3066BE]">
                                {t.companies}
                            </a>
                        </div>

                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            <ProfileDropdown />
                        </div>
                    </div>
                </nav>

                <div className="bg-white py-4 mt-[90px]">
                    <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between"></div>
                </div>

                <main className="max-w-7xl mx-auto px-4 py-10">
                    <h1 className="text-[35px] leading-[150%] text-center font-extrabold text-black mb-10">{t.companies}</h1>

                    <div className="max-w-7xl mx-auto px-4 lg:px-[70px] flex gap-[168px] mt-10">
                        <div className="w-full lg:w-[260px] flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-[16px] leading-[24px] text-black font-semibold">{t.companyLabel}</label>
                                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.selectCompany} className="w-[220px] h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-sm outline-none border-none text-black" />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[16px] leading-[24px] text-black font-semibold">{t.locationLabel}</label>
                                <input type="text" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} placeholder={t.selectLocation} className="w-[220px] h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-sm outline-none border-none text-black" />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[16px] leading-[24px] text-black font-semibold">{t.keywordLabel}</label>
                                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={t.keywordPlaceholder} className="w-[220px] h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-sm outline-none border-none text-black" />
                            </div>

                            <div className="w-[231px] h-px bg-[#AEAEAE]"></div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm text-black font-semibold">{t.position}</label>
                                <div className="rounded-[2px] p-2 w-[138px] text-black text-sm max-h-[200px] overflow-y-auto border-none">
                                    {["Администрация", "Дизайн", "Образование", "Маркетинг", "Разработка"].map((item, i) => (
                                        <label key={i} className="flex items-center gap-2 mb-1">
                                            <input type="checkbox" className="accent-[#3066BE]" />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm text-black font-semibold">{t.rating}</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} onClick={() => setRating(star)} className="text-[20px] cursor-pointer transition-colors" style={{ color: star <= rating ? "#FFBF00" : "#D9D9D9" }}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[#3066BE]">{t.andHigher}</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm text-black font-semibold">{t.companySize}</label>
                                {["1–50", "51–200", "200–500", "500–1000", "1000+", "любой размер"].map((s, i) => (
                                    <label key={i} className="flex items-center gap-2 text-sm text-black">
                                        <input type="radio" name="company_size" value={s} checked={size === s} onChange={() => setSize(s)} className="peer w-[18px] h-[18px] rounded-[2px] border border-[#AEAEAE] checked:bg-[#3066BE] checked:border-[#3066BE] appearance-none" />
                                        {s}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <main className="flex-1 overflow-x-hidden px-8 py-6">
                            <div className="w-[1000px] ml-[-300px] h-px bg-[#AEAEAE]"></div>

                            {loading ? (
                                <p className="text-gray-400 text-lg mt-4">Загрузка...</p>
                            ) : companies.length === 0 ? (
                                <p className="text-gray-400 text-lg mt-4">Компании не найдены</p>
                            ) : (
                                companies.map((company) => {
                                    const logoSrc = mediaUrl(company?.logo);
                                    return (
                                        <div key={company.id} onClick={() => setSelectedCompany(company)} className="cursor-pointer">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <img src={logoSrc} alt={`${company.name} Logo`} className="w-[70px] h-[70px] rounded-full object-contain mt-5" onError={(e) => { e.currentTarget.src = "/company-fallback.png"; }} />

                                                    <button className="text-[30px] bg-white border-none leading-[45px] font-bold text-black ml-[-20px] mt-5">{company.name}</button>

                                                    <div className="flex items-center gap-1">
                                                        <p className="text-[15px] leading-[22.5px] font-medium text-[#3066BE] text-center ml-[-20px] mt-5">{company.hire_rate ?? "0%"}</p>
                                                        <img src="/star.png" alt="" className="mt-5" />
                                                    </div>
                                                </div>

                                                <p className="text-[20px] leading-[30px] font-medium text-black">
                                                    10+ сотрудников <span className="text-[#3066BE]">•</span> {company.location || "—"}
                                                </p>
                                                <p className="text-[20px] leading-[30px] text-[#AEAEAE] font-normal max-w-[695px]">{company.industry || "Отрасль не указана..."}</p>

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
                            )}
                        </main>
                    </div>
                </main>

                {selectedCompany && <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}

                <div className="w-full flex justify-center mt-6 mb-[64px]">
                    <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${page === pageNum ? "bg-[#3066BE] text-white border-[#3066BE]" : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#3066BE]/10"}`}>
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button onClick={() => page < totalPages && setPage(page + 1)} className="w-10 h-10 rounded-full border-2 border-[#3066BE] bg-white flex items-center justify-center relative">
                            <img src="/pagination.png" alt="pagination" className="w-5 h-5 object-contain absolute z-10" />
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
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">
                                {t.vacancies}
                            </a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">
                                {t.chat}
                            </a>
                            <a href="/companies" className="text-[#3066BE]">
                                {t.companies}
                            </a>
                        </div>

                        <ProfileDropdown />
                    </div>
                </nav>

                <div className="mx-auto max-w-[1024px] px-3 md:px-4 py-6 mt-[90px]">
                    <h1 className="text-center text-[28px] font-bold mb-4">{t.companies}</h1>

                    <div className="grid grid-cols-12 gap-5">
                        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
                            <div className="w-full flex flex-col gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[16px] leading-[24px] text-black font-semibold">{t.companyLabel}</label>
                                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.selectCompany} className="w-full h-[44px] md:h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-[13px] md:text-sm outline-none border-none text-black" />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[16px] leading-[24px] text-black font-semibold">{t.locationLabel}</label>
                                    <input type="text" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} placeholder={t.selectLocation} className="w-full h-[44px] md:h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-[13px] md:text-sm outline-none border-none text-black" />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[16px] leading-[24px] text-black font-semibold">{t.keywordLabel}</label>
                                    <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={t.keywordPlaceholder} className="w-full h-[44px] md:h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-[13px] md:text-sm outline-none border-none text-black" />
                                </div>
                            </div>
                        </aside>

                        <section className="col-span-12 md:col-span-8 lg:col-span-9">
                            {loading ? (
                                <p className="text-gray-400 text-lg mt-4">Загрузка...</p>
                            ) : companies.length === 0 ? (
                                <p className="text-gray-400 text-lg mt-4">Компании не найдены</p>
                            ) : (
                                companies.map((company) => {
                                    const logoSrc = mediaUrl(company?.logo);
                                    return (
                                        <div key={company.id} onClick={() => setSelectedCompany(company)} className="cursor-pointer">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                                    <img src={logoSrc} alt={`${company.name} Logo`} className="w-[56px] h-[56px] md:w-[70px] md:h-[70px] rounded-full object-contain mt-3 md:mt-5" onError={(e) => { e.currentTarget.src = "/company-fallback.png"; }} />

                                                    <button className="text-[22px] md:text-[30px] bg-white border-none leading-[32px] md:leading-[45px] font-bold text-black ml-[-12px] md:ml-[-20px] mt-3 md:mt-5">{company.name}</button>

                                                    <div className="flex items-center gap-1">
                                                        <p className="text-[13px] md:text-[15px] leading-[20px] md:leading-[22.5px] font-medium text-[#3066BE] text-center ml-[-12px] md:ml-[-20px] mt-3 md:mt-5">{company.hire_rate ?? "0%"}</p>
                                                        <img src="/star.png" alt="" className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] mt-3 md:mt-5" />
                                                    </div>
                                                </div>

                                                <p className="text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] font-medium text-black">
                                                    10+ сотрудников <span className="text-[#3066BE]">•</span> {company.location || "—"}
                                                </p>

                                                <p className="text-[14px] md:text-[20px] leading-[21px] md:leading-[30px] text-[#AEAEAE] font-normal max-w-[695px]">{company.industry || "Отрасль не указана..."}</p>

                                                <div className="flex gap-4 md:gap-6 mt-1 md:mt-2 text-[13px] md:text-sm font-medium">
                                                    <p className="text-black font-bold">
                                                        {company.open_jobpost_count ?? 0} <span className="text-[#3066BE]">вакансии</span> • {company.jobpost_count ?? 0} <span className="text-[#3066BE]">всего</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full h-px bg-[#AEAEAE] my-5 md:my-6"></div>
                                        </div>
                                    );
                                })
                            )}
                        </section>
                    </div>
                </div>

                {selectedCompany && <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}

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
                    <h1 className="text-center text-[22px] font-extrabold mt-4 text-black">{t.companies}</h1>

                    <div className="px-4 mt-8 mb-2 flex items-center justify-between">
                        <button onClick={() => console.log("Добавить компанию")} className="text-[16px] font-semibold text-black bg-white border-none">
                            {t.addCompany}
                            <span className="block h-[2px] w-[76px] bg-black/20 mt-1" />
                        </button>

                        <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 text-[16px] font-semibold bg-white border-none text-black">
                            {t.filter}
                            <SlidersHorizontal className="w-5 h-5 translate-y-[1px]" />
                        </button>
                    </div>
                    <div className="h-[1px] w-full bg-black/20" />

                    <div className="divide-y divide-black/10">
                        {loading ? (
                            <p className="px-4 py-6 text-sm text-black/60">Загрузка...</p>
                        ) : companies.length === 0 ? (
                            <p className="px-4 py-6 text-sm text-black/60">Компании не найдены</p>
                        ) : (
                            companies.map((c) => {
                                const logoSrc = mediaUrl(c?.logo);
                                return (
                                    <>
                                        <button key={c.id} onClick={() => setSelectedCompany(c)} className="w-full text-left border-none active:opacity-95 bg-white">
                                            <div className="px-4 py-6">
                                                <div className="flex items-start gap-3">
                                                    <img src={logoSrc} alt={`${c?.name || "Company"} Logo`} className="w-10 h-10 rounded-full object-contain" onError={(e) => { e.currentTarget.src = "/company-fallback.png"; }} />

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[20px] text-black font-semibold leading-none truncate">{c?.name || "—"}</p>
                                                            <div className="flex items-center gap-1 text-[#3066BE]">
                                                                <span className="text-[15px] leading-none font-semibold">{c?.avg_rating ?? "4.0"}</span>
                                                                <Star className="w-4 h-4" color="#3066BE" fill="#3066BE" />
                                                            </div>
                                                        </div>

                                                        <p className="mt-4 text-[16px] text-black">
                                                            1000+ сотрудников <span className="text-[#3066BE]">•</span> {c?.location || "Узбекистан"}
                                                        </p>

                                                        <p className="mt-4 text-[16px] text-black/30 line-clamp-2">{c?.description || "Описание отсутствует"}</p>

                                                        <div className="mt-6 flex items-center gap-10">
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-[16px] font-semibold text-black">{c?.open_jobpost_count ?? 10}</span>
                                                                <span className="text-[16px] text-[#3066BE]">вакансии</span>
                                                            </div>

                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-[16px] font-semibold text-black">{c?.reviews_count ?? 0}</span>
                                                                <span className="text-[16px] text-[#3066BE]">отзывов</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                        <div className="h-[1px] w-full bg-black/20" />
                                    </>
                                );
                            })
                        )}
                    </div>

                    <div className="py-6">
                        <div className="flex items-center justify-center gap-3">
                            {[...Array(totalPages)].map((_, i) => {
                                const num = i + 1;
                                return (
                                    <button key={num} onClick={() => setPage(num)} className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-[15px] font-semibold transition-all duration-200 ${num === page ? "bg-[#3066BE] border-[#3066BE] text-white" : "bg-white border-[#3066BE] text-[#3066BE] hover:bg-[#3066BE] hover:text-white"}`}>
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {selectedCompany && <MobileCompanyDetail company={selectedCompany} onClose={() => setSelectedCompany(null)} />}

                <MobileFilterModal open={showFilters} onClose={() => setShowFilters(false)} query={query} setQuery={setQuery} location={locationFilter} setLocation={setLocationFilter} keyword={keyword} setKeyword={setKeyword} rating={rating} setRating={setRating} size={size} setSize={setSize} onClear={handleClear} onApply={() => setShowFilters(false)} />

                <MobileFooter />
            </div>
        </>
    );
}