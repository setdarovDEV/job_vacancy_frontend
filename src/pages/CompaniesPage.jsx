// src/pages/CompaniesPage.jsx - ENHANCED VERSION
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Briefcase, X, ChevronDown, ChevronUp, SlidersHorizontal, ChevronRight, ArrowLeft, Building2, Users, TrendingUp } from "lucide-react";
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
    followers: "подписчиков",
    vacancies_word: "вакансии",
    total: "всего",
    reviews: "отзывов",
    links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
    copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
};

// ============================================
// REVIEW FORM COMPONENT
// ============================================
function ReviewForm({ companyId, companyName, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [text, setText] = useState("");
    const [country, setCountry] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Пожалуйста, выберите рейтинг");
            return;
        }

        if (!text.trim()) {
            setError("Пожалуйста, напишите отзыв");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            await api.post(`/api/companies/${companyId}/reviews/`, {
                rating,
                text: text.trim(),
                country: country.trim() || undefined
            });

            toast.success("Отзыв успешно добавлен! ✅");

            // Reset form
            setRating(0);
            setText("");
            setCountry("");

            // Trigger parent refresh
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error("Review submit error:", err);
            const errorMsg = err.response?.data?.detail || "Не удалось отправить отзыв";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Stars */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ваша оценка компании:
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110 active:scale-95"
                        >
                            <Star
                                className="w-8 h-8"
                                fill={star <= (hoveredRating || rating) ? "#FFBF00" : "none"}
                                stroke={star <= (hoveredRating || rating) ? "#FFBF00" : "#D9D9D9"}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-2 text-sm text-gray-600 self-center">
                            {rating === 5 ? "Отлично!" : rating === 4 ? "Хорошо" : rating === 3 ? "Нормально" : rating === 2 ? "Плохо" : "Ужасно"}
                        </span>
                    )}
                </div>
            </div>

            {/* Review Text */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ваш отзыв:
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Расскажите о вашем опыте работы в ${companyName}...`}
                    className="w-full h-32 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none transition-all"
                    maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">{text.length}/1000 символов</p>
            </div>

            {/* Country (optional) */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Страна (необязательно):
                </label>
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Узбекистан"
                    className="w-full h-11 bg-white border border-gray-300 rounded-xl px-4 text-gray-900 placeholder-gray-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={submitting}
                className={`w-full h-12 rounded-xl font-semibold text-white transition-all ${
                    submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:shadow-lg active:scale-95"
                }`}
            >
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Отправка...
                    </span>
                ) : (
                    "Опубликовать отзыв"
                )}
            </button>
        </form>
    );
}

// ============================================
// COMPANY MODAL (DESKTOP)
// ============================================
function DesktopCompanyModal({ company: companyProp, companyId: companyIdProp, onClose }) {
    const id = companyIdProp ?? companyProp?.id ?? null;
    const [company, setCompany] = useState(companyProp || null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [vacancies, setVacancies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loadingVacancies, setLoadingVacancies] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access_token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                // Fetch company, stats, and vacancies count simultaneously
                const [{ data: c }, { data: s }, { data: v }] = await Promise.all([
                    api.get(`/api/companies/${id}/`, { headers }),
                    api.get(`/api/companies/${id}/stats/`, { headers }),
                    api.get(`/api/companies/${id}/vacancies/`, { headers }).catch(() => ({ data: [] }))
                ]);

                if (isMounted) {
                    setCompany(c);

                    // Calculate actual vacancy count from API response
                    const vacancyList = Array.isArray(v) ? v : v?.results || [];
                    const actualVacancyCount = vacancyList.length;

                    // Update stats with correct vacancy count
                    setStats({
                        ...s,
                        vacancies_count: actualVacancyCount
                    });

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

    // Load vacancies when tab is active
    useEffect(() => {
        if (activeTab === "vacancies" && id && vacancies.length === 0) {
            const fetchVacancies = async () => {
                try {
                    setLoadingVacancies(true);
                    const { data } = await api.get(`/api/companies/${id}/vacancies/`);
                    const vacancyList = Array.isArray(data) ? data : data?.results || [];
                    setVacancies(vacancyList);

                    // Update stats with actual vacancy count
                    setStats(prev => ({
                        ...prev,
                        vacancies_count: vacancyList.length
                    }));
                } catch (e) {
                    console.error("Error loading vacancies:", e);
                } finally {
                    setLoadingVacancies(false);
                }
            };
            fetchVacancies();
        }
    }, [activeTab, id, vacancies.length]);

    // Load reviews when tab is active
    useEffect(() => {
        if (activeTab === "reviews" && id && reviews.length === 0) {
            const fetchReviews = async () => {
                try {
                    setLoadingReviews(true);
                    const { data } = await api.get(`/api/companies/${id}/reviews/`);
                    setReviews(Array.isArray(data) ? data : data?.results || []);
                } catch (e) {
                    console.error("Error loading reviews:", e);
                } finally {
                    setLoadingReviews(false);
                }
            };
            fetchReviews();
        }
    }, [activeTab, id, reviews.length]);

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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-auto animate-fadeIn">
            <div className="absolute top-0 right-0 bg-white shadow-2xl flex flex-col rounded-l-3xl max-h-screen overflow-y-auto animate-slideInRight" style={{ width: "1051px" }}>
                {/* Gradient Banner */}
                <div className="relative h-[214px] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3066BE]/20 via-[#4A90E2]/10 to-[#3066BE]/30" />
                    <img src={bannerSrc} alt="cover" className="w-full h-full object-cover mix-blend-overlay" />

                    <button onClick={onClose} className="absolute top-5 left-5 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                        <ArrowLeft className="w-5 h-5 text-[#3066BE]" />
                    </button>
                </div>

                <div className="w-full px-[69px] flex flex-col gap-8 mt-[30px] pb-12">
                    {/* Header Section */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col items-center gap-4 -mt-16">
                            <div className="w-[98px] h-[98px] rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl hover:shadow-2xl transition-shadow">
                                <img src={logoSrc} alt={`${company.name} Logo`} className="w-full h-full object-contain" />
                            </div>
                            <div className="text-center">
                                <p className="text-[32px] font-bold text-gray-900 leading-tight">{company.name}</p>
                                <div className="mt-2 flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{company.location || "Узбекистан"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-5">
                            <button
                                onClick={toggleFollow}
                                className={`px-6 h-11 rounded-xl font-semibold transition-all duration-300 ${
                                    isFollowing
                                        ? "bg-gradient-to-r from-[#E8EEF9] to-[#D4E3FF] text-[#3066BE] shadow-md hover:shadow-lg"
                                        : "border-2 border-[#3066BE] bg-white text-[#3066BE] hover:bg-[#3066BE] hover:text-white shadow-md hover:shadow-lg"
                                } active:scale-95`}
                            >
                                {isFollowing ? "✓ Вы подписаны" : "Подписаться"}
                            </button>
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className="px-6 h-11 bg-gradient-to-r from-[#3066BE] to-[#4A90E2] text-white rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95"
                            >
                                ⭐ Оставить отзыв
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards as Buttons */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border transition-all text-left ${
                                activeTab === "overview"
                                    ? "border-[#3066BE] shadow-lg ring-2 ring-[#3066BE]/20"
                                    : "border-blue-100 hover:shadow-md hover:border-[#3066BE]"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
                                    activeTab === "overview" ? "bg-[#3066BE]" : "bg-white"
                                }`}>
                                    <Users className={`w-6 h-6 transition-colors ${
                                        activeTab === "overview" ? "text-white" : "text-[#3066BE]"
                                    }`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats?.followers_count || 0}</p>
                                    <p className="text-sm text-gray-600">Подписчиков</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab("vacancies")}
                            className={`bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border transition-all text-left ${
                                activeTab === "vacancies"
                                    ? "border-green-600 shadow-lg ring-2 ring-green-600/20"
                                    : "border-green-100 hover:shadow-md hover:border-green-600"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
                                    activeTab === "vacancies" ? "bg-green-600" : "bg-white"
                                }`}>
                                    <Briefcase className={`w-6 h-6 transition-colors ${
                                        activeTab === "vacancies" ? "text-white" : "text-green-600"
                                    }`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats?.vacancies_count || 0}</p>
                                    <p className="text-sm text-gray-600">Вакансий</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-2xl border transition-all text-left ${
                                activeTab === "reviews"
                                    ? "border-amber-600 shadow-lg ring-2 ring-amber-600/20"
                                    : "border-amber-100 hover:shadow-md hover:border-amber-600"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
                                    activeTab === "reviews" ? "bg-amber-500" : "bg-white"
                                }`}>
                                    <Star className={`w-6 h-6 transition-colors ${
                                        activeTab === "reviews" ? "text-white" : "text-amber-500"
                                    }`} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{Number(company.avg_rating || 0.0).toFixed(1)}</p>
                                    <p className="text-sm text-gray-600">Рейтинг</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "overview" && (
                        <>
                            {/* CTA Card */}
                            <div className="relative mt-8 p-8 bg-gradient-to-br from-[#3066BE] via-[#4A90E2] to-[#3066BE] rounded-3xl overflow-hidden shadow-xl">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-bold text-white mb-3">
                                        Найдите то, что подходит именно вам — быстрее. ✨
                                    </h3>
                                    <p className="text-lg text-white/90 mb-6 max-w-2xl">
                                        Получите персонализированную информацию о работе в компании {company.name} за один быстрый шаг.
                                    </p>
                                    <button className="px-8 h-12 bg-white text-[#3066BE] rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95">
                                        📄 Заполнить резюме
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mt-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-4">О компании</h4>
                                <p className="text-base leading-relaxed text-gray-700">
                                    {company.description || "Описание пока не добавлено."}
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === "vacancies" && (
                        <div className="mt-6">
                            {loadingVacancies ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-10 h-10 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : vacancies.length === 0 ? (
                                <div className="text-center py-16">
                                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-xl text-gray-500 mb-2">Вакансий пока нет</p>
                                    <p className="text-sm text-gray-400">Компания еще не добавила открытые позиции</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {vacancies.map((vacancy) => (
                                        <div
                                            key={vacancy.id}
                                            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#3066BE] hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => window.location.href = `/vacancies/${vacancy.id}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#3066BE] transition-colors mb-2">
                                                        {vacancy.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {vacancy.location || company.location || "—"}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="w-4 h-4" />
                                                            {vacancy.employment_type || "Полная занятость"}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 line-clamp-2 text-sm">
                                                        {vacancy.description}
                                                    </p>
                                                </div>
                                                <div className="ml-4 text-right">
                                                    <p className="text-2xl font-bold text-[#3066BE]">
                                                        {vacancy.salary_min && vacancy.salary_max
                                                            ? `$${vacancy.salary_min}-${vacancy.salary_max}`
                                                            : vacancy.salary_min
                                                                ? `от $${vacancy.salary_min}`
                                                                : "По договоренности"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(vacancy.created_at).toLocaleDateString("ru-RU")}
                                                    </p>
                                                </div>
                                            </div>
                                            {vacancy.skills && vacancy.skills.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {vacancy.skills.slice(0, 5).map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-blue-50 text-[#3066BE] rounded-lg text-xs font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="mt-6 space-y-6">
                            {/* Review Form */}
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-amber-500" fill="currentColor" />
                                    Оставить отзыв
                                </h3>

                                <ReviewForm
                                    companyId={id}
                                    companyName={company.name}
                                    onSuccess={() => {
                                        // Reload reviews
                                        setReviews([]);
                                        setLoadingReviews(false);
                                    }}
                                />
                            </div>

                            {/* Reviews List */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Все отзывы</h3>
                                {loadingReviews ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="w-10 h-10 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-xl text-gray-500 mb-2">Отзывов пока нет</p>
                                        <p className="text-sm text-gray-400">Будьте первым, кто оставит отзыв о компании</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl font-bold text-[#3066BE] flex-shrink-0">
                                                        {review.user_name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <p className="font-bold text-gray-900">{review.user_name || "Пользователь"}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {new Date(review.created_at).toLocaleDateString("ru-RU")}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className="w-4 h-4"
                                                                        fill={i < review.rating ? "#FFBF00" : "none"}
                                                                        stroke={i < review.rating ? "#FFBF00" : "#D9D9D9"}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 leading-relaxed">{review.text}</p>
                                                        {review.country && (
                                                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                {review.country}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================
// TABLET COMPANY MODAL
// ============================================
function TabletCompanyModal({ company: companyProp, companyId: companyIdProp, onClose }) {
    const id = companyIdProp ?? companyProp?.id ?? null;
    const [company, setCompany] = useState(companyProp || null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [vacancies, setVacancies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loadingVacancies, setLoadingVacancies] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access_token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const [{ data: c }, { data: s }, { data: v }] = await Promise.all([
                    api.get(`/api/companies/${id}/`, { headers }),
                    api.get(`/api/companies/${id}/stats/`, { headers }),
                    api.get(`/api/companies/${id}/vacancies/`, { headers }).catch(() => ({ data: [] }))
                ]);

                if (isMounted) {
                    setCompany(c);
                    const vacancyList = Array.isArray(v) ? v : v?.results || [];
                    setStats({ ...s, vacancies_count: vacancyList.length });
                    setIsFollowing(!!s?.is_following);
                }
            } catch (e) {
                console.error("Tablet modal error:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        if (activeTab === "vacancies" && id && vacancies.length === 0) {
            const fetchVacancies = async () => {
                try {
                    setLoadingVacancies(true);
                    const { data } = await api.get(`/api/companies/${id}/vacancies/`);
                    const vacancyList = Array.isArray(data) ? data : data?.results || [];
                    setVacancies(vacancyList);
                    setStats(prev => ({ ...prev, vacancies_count: vacancyList.length }));
                } catch (e) {
                    console.error("Error loading vacancies:", e);
                } finally {
                    setLoadingVacancies(false);
                }
            };
            fetchVacancies();
        }
    }, [activeTab, id, vacancies.length]);

    useEffect(() => {
        if (activeTab === "reviews" && id && reviews.length === 0) {
            const fetchReviews = async () => {
                try {
                    setLoadingReviews(true);
                    const { data } = await api.get(`/api/companies/${id}/reviews/`);
                    setReviews(Array.isArray(data) ? data : data?.results || []);
                } catch (e) {
                    console.error("Error loading reviews:", e);
                } finally {
                    setLoadingReviews(false);
                }
            };
            fetchReviews();
        }
    }, [activeTab, id, reviews.length]);

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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-auto animate-fadeIn">
            <div className="absolute top-0 right-0 bg-white shadow-2xl flex flex-col rounded-l-3xl max-h-screen overflow-y-auto animate-slideInRight" style={{ width: "720px" }}>
                {/* Gradient Banner */}
                <div className="relative h-[180px] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3066BE]/20 via-[#4A90E2]/10 to-[#3066BE]/30" />
                    <img src={bannerSrc} alt="cover" className="w-full h-full object-cover mix-blend-overlay" />

                    <button onClick={onClose} className="absolute top-4 left-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                        <ArrowLeft className="w-5 h-5 text-[#3066BE]" />
                    </button>
                </div>

                <div className="w-full px-8 flex flex-col gap-6 mt-6 pb-10">
                    {/* Header Section */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col items-center gap-3 -mt-14">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white bg-white shadow-xl hover:shadow-2xl transition-shadow">
                                <img src={logoSrc} alt={`${company.name} Logo`} className="w-full h-full object-contain" />
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900 leading-tight">{company.name}</p>
                                <div className="mt-1 flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="text-sm">{company.location || "Узбекистан"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={toggleFollow}
                                className={`px-5 h-10 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                    isFollowing
                                        ? "bg-gradient-to-r from-[#E8EEF9] to-[#D4E3FF] text-[#3066BE] shadow-md hover:shadow-lg"
                                        : "border-2 border-[#3066BE] bg-white text-[#3066BE] hover:bg-[#3066BE] hover:text-white shadow-md hover:shadow-lg"
                                } active:scale-95`}
                            >
                                {isFollowing ? "✓ Подписаны" : "Подписаться"}
                            </button>
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className="px-5 h-10 bg-gradient-to-r from-[#3066BE] to-[#4A90E2] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all active:scale-95"
                            >
                                ⭐ Отзыв
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border transition-all text-left ${
                                activeTab === "overview"
                                    ? "border-[#3066BE] shadow-lg ring-2 ring-[#3066BE]/20"
                                    : "border-blue-100 hover:shadow-md hover:border-[#3066BE]"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-colors ${
                                    activeTab === "overview" ? "bg-[#3066BE]" : "bg-white"
                                }`}>
                                    <Users className={`w-5 h-5 transition-colors ${
                                        activeTab === "overview" ? "text-white" : "text-[#3066BE]"
                                    }`} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{stats?.followers_count || 0}</p>
                                    <p className="text-xs text-gray-600">Подписчиков</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab("vacancies")}
                            className={`bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border transition-all text-left ${
                                activeTab === "vacancies"
                                    ? "border-green-600 shadow-lg ring-2 ring-green-600/20"
                                    : "border-green-100 hover:shadow-md hover:border-green-600"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-colors ${
                                    activeTab === "vacancies" ? "bg-green-600" : "bg-white"
                                }`}>
                                    <Briefcase className={`w-5 h-5 transition-colors ${
                                        activeTab === "vacancies" ? "text-white" : "text-green-600"
                                    }`} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{stats?.vacancies_count || 0}</p>
                                    <p className="text-xs text-gray-600">Вакансий</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border transition-all text-left ${
                                activeTab === "reviews"
                                    ? "border-amber-600 shadow-lg ring-2 ring-amber-600/20"
                                    : "border-amber-100 hover:shadow-md hover:border-amber-600"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-colors ${
                                    activeTab === "reviews" ? "bg-amber-500" : "bg-white"
                                }`}>
                                    <Star className={`w-5 h-5 transition-colors ${
                                        activeTab === "reviews" ? "text-white" : "text-amber-500"
                                    }`} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{Number(company.avg_rating || 0.0).toFixed(1)}</p>
                                    <p className="text-xs text-gray-600">Рейтинг</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Tab Content - Desktop bilan bir xil */}
                    {activeTab === "overview" && (
                        <>
                            <div className="relative mt-6 p-6 bg-gradient-to-br from-[#3066BE] via-[#4A90E2] to-[#3066BE] rounded-2xl overflow-hidden shadow-xl">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Найдите то, что подходит именно вам — быстрее. ✨
                                    </h3>
                                    <p className="text-sm text-white/90 mb-5">
                                        Получите персонализированную информацию о работе в компании {company.name} за один быстрый шаг.
                                    </p>
                                    <button className="px-6 h-10 bg-white text-[#3066BE] rounded-xl font-semibold text-sm hover:shadow-lg transition-all active:scale-95">
                                        📄 Заполнить резюме
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h4 className="text-lg font-bold text-gray-900 mb-3">О компании</h4>
                                <p className="text-sm leading-relaxed text-gray-700">
                                    {company.description || "Описание пока не добавлено."}
                                </p>
                            </div>
                        </>
                    )}

                    {/* Vacancies va Reviews - Desktop bilan bir xil, faqat text-sm */}
                    {activeTab === "vacancies" && (
                        <div className="mt-4">
                            {loadingVacancies ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="w-8 h-8 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : vacancies.length === 0 ? (
                                <div className="text-center py-12">
                                    <Briefcase className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                                    <p className="text-lg text-gray-500 mb-1">Вакансий пока нет</p>
                                    <p className="text-xs text-gray-400">Компания еще не добавила открытые позиции</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {vacancies.map((vacancy) => (
                                        <div
                                            key={vacancy.id}
                                            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#3066BE] hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => window.location.href = `/vacancies/${vacancy.id}`}
                                        >
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#3066BE] transition-colors mb-2">
                                                {vacancy.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {vacancy.location || company.location || "—"}
                                                </span>
                                                <span>•</span>
                                                <span>{vacancy.employment_type || "Полная занятость"}</span>
                                            </div>
                                            <p className="text-gray-600 line-clamp-2 text-xs">
                                                {vacancy.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="mt-4 space-y-5">
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                                    Оставить отзыв
                                </h3>
                                <ReviewForm
                                    companyId={id}
                                    companyName={company.name}
                                    onSuccess={() => {
                                        setReviews([]);
                                        setLoadingReviews(false);
                                    }}
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Все отзывы</h3>
                                {loadingReviews ? (
                                    <div className="flex items-center justify-center py-10">
                                        <div className="w-8 h-8 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                        <Star className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                                        <p className="text-lg text-gray-500 mb-1">Отзывов пока нет</p>
                                        <p className="text-xs text-gray-400">Будьте первым</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-lg font-bold text-[#3066BE] flex-shrink-0">
                                                        {review.user_name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div>
                                                                <p className="font-bold text-gray-900 text-sm">{review.user_name || "Пользователь"}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(review.created_at).toLocaleDateString("ru-RU")}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className="w-3.5 h-3.5"
                                                                        fill={i < review.rating ? "#FFBF00" : "none"}
                                                                        stroke={i < review.rating ? "#FFBF00" : "#D9D9D9"}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 leading-relaxed text-sm">{review.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mobile Company Detail — saqlanadi (keyingi qismda)
// ... (mobile components continue with enhanced styling)

export default function CompaniesPage() {
    const navigate = useNavigate();
    const location = useLocation();

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

    const t = TEXTS;

    useEffect(() => {
        api.get("/api/auth/me/")
            .then((res) => setUser(res.data))
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
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
            `}</style>

            {/* DESKTOP VERSION */}
            <div className="hidden lg:block font-sans relative bg-gradient-to-b from-gray-50 to-white min-h-screen">
                {/* Enhanced Navbar */}
                <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-10 h-[90px]">
                        <a href="/" className="hover:scale-105 transition-transform">
                            <img src="/logo.png" alt="Logo" className="w-[109px] h-[72px] object-contain" />
                        </a>

                        <div className="flex gap-8 font-semibold text-[16px]">
                            <a href="/community" className="text-gray-700 hover:text-[#3066BE] transition-colors relative group">
                                {t.community}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3066BE] group-hover:w-full transition-all duration-300" />
                            </a>
                            <a href="/vacancies" className="text-gray-700 hover:text-[#3066BE] transition-colors relative group">
                                {t.vacancies}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3066BE] group-hover:w-full transition-all duration-300" />
                            </a>
                            <a href="/chat" className="text-gray-700 hover:text-[#3066BE] transition-colors relative group">
                                {t.chat}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3066BE] group-hover:w-full transition-all duration-300" />
                            </a>
                            <a href="/companies" className="text-[#3066BE] font-bold relative">
                                {t.companies}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3066BE]" />
                            </a>
                        </div>

                        <ProfileDropdown />
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4 py-10 mt-[90px]">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
                            {t.companies}
                        </h1>
                        <p className="text-xl text-gray-600">Найдите лучших работодателей для вашей карьеры</p>
                    </div>

                    <div className="flex gap-8">
                        {/* SIDEBAR FILTERS */}
                        <aside className="w-[280px] flex-shrink-0">
                            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.companyLabel}</label>
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={t.selectCompany}
                                        className="w-full h-11 bg-gray-50 rounded-xl px-4 text-sm outline-none border border-gray-200 focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.locationLabel}</label>
                                    <input
                                        type="text"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        placeholder={t.selectLocation}
                                        className="w-full h-11 bg-gray-50 rounded-xl px-4 text-sm outline-none border border-gray-200 focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.keywordLabel}</label>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder={t.keywordPlaceholder}
                                        className="w-full h-11 bg-gray-50 rounded-xl px-4 text-sm outline-none border border-gray-200 focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                                    />
                                </div>

                                <div className="h-px bg-gray-200" />

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t.position}</label>
                                    <div className="space-y-2">
                                        {["Администрация", "Дизайн", "Образование", "Маркетинг", "Разработка"].map((item, i) => (
                                            <label key={i} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="w-4 h-4 accent-[#3066BE] rounded" />
                                                <span className="text-sm text-gray-700 group-hover:text-[#3066BE] transition-colors">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t.rating}</label>
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Star
                                                    className="w-6 h-6"
                                                    fill={star <= rating ? "#FFBF00" : "none"}
                                                    stroke={star <= rating ? "#FFBF00" : "#D9D9D9"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs text-[#3066BE] font-medium">{t.andHigher}</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t.companySize}</label>
                                    <div className="space-y-2">
                                        {["1–50", "51–200", "200–500", "500–1000", "1000+", "любой размер"].map((s, i) => (
                                            <label key={i} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="company_size"
                                                    value={s}
                                                    checked={size === s}
                                                    onChange={() => setSize(s)}
                                                    className="w-4 h-4 accent-[#3066BE]"
                                                />
                                                <span className="text-sm text-gray-700 group-hover:text-[#3066BE] transition-colors">{s}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleClear}
                                    className="w-full h-10 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors active:scale-95"
                                >
                                    Очистить фильтры
                                </button>
                            </div>
                        </aside>

                        {/* COMPANIES LIST */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <div className="w-16 h-16 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-500">Загрузка компаний...</p>
                                    </div>
                                </div>
                            ) : companies.length === 0 ? (
                                <div className="text-center py-16">
                                    <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                    <p className="text-xl text-gray-500">Компании не найдены</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {companies.map((company) => {
                                        const logoSrc = mediaUrl(company?.logo);
                                        return (
                                            <div
                                                key={company.id}
                                                onClick={() => setSelectedCompany(company)}
                                                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#3066BE] hover:shadow-lg transition-all cursor-pointer group"
                                            >
                                                <div className="flex gap-5">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 group-hover:border-[#3066BE] transition-colors">
                                                            <img
                                                                src={logoSrc}
                                                                alt={`${company.name} Logo`}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = "/company-fallback.png";
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#3066BE] transition-colors">
                                                                    {company.name}
                                                                </h3>
                                                                <div className="flex items-center gap-3 mt-2 text-gray-600">
                                                                    <span className="flex items-center gap-1">
                                                                        <Users className="w-4 h-4" />
                                                                        <span className="text-sm">10+ сотрудников</span>
                                                                    </span>
                                                                    <span className="text-[#3066BE]">•</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-4 h-4" />
                                                                        <span className="text-sm">{company.location || "—"}</span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 rounded-lg border border-amber-200">
                                                                <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                                                                <span className="text-sm font-bold text-amber-700">{Number(company.avg_rating || 4.0).toFixed(1)}</span>
                                                            </div>
                                                        </div>

                                                        <p className="mt-3 text-gray-600 line-clamp-2">
                                                            {company.industry || company.description || "Отрасль не указана"}
                                                        </p>

                                                        <div className="mt-4 flex items-center gap-6">
                                                            <div className="flex items-center gap-2">
                                                                <Briefcase className="w-4 h-4 text-[#3066BE]" />
                                                                <span className="font-semibold text-gray-900">
                                                                    {company.employer_vacancies_count || company.jobpost_count || company.vacancies_count || 0}
                                                                </span>
                                                                <span className="text-sm text-gray-600">открытых вакансий</span>
                                                            </div>
                                                            <span className="text-gray-300">•</span>
                                                            <div className="flex items-center gap-2">
                                                                <Star className="w-4 h-4 text-gray-400" />
                                                                <span className="font-semibold text-gray-900">{company.reviews_count || 0}</span>
                                                                <span className="text-sm text-gray-600">отзывов</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-[#3066BE] transition-colors self-center" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-10 gap-2">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-11 h-11 rounded-xl font-semibold transition-all ${
                                                    page === pageNum
                                                        ? "bg-gradient-to-r from-[#3066BE] to-[#4A90E2] text-white shadow-lg scale-110"
                                                        : "bg-white text-gray-700 border border-gray-300 hover:border-[#3066BE] hover:text-[#3066BE] hover:shadow-md"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {page < totalPages && (
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            className="w-11 h-11 rounded-xl bg-white border border-gray-300 hover:border-[#3066BE] hover:shadow-md transition-all flex items-center justify-center"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-600" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {selectedCompany && (
                    <div className="hidden lg:block">
                        <DesktopCompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
                    </div>
                )}

                {/* Enhanced Footer */}
                <footer className="relative overflow-hidden mt-20">
                    <img src="/footer-bg.png" alt="Footer" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3066BE]/60 via-[#4A90E2]/50 to-[#3066BE]/60 z-10" />

                    <div className="relative z-20 max-w-[1440px] mx-auto px-6 py-12">
                        <div className="flex justify-between gap-32">
                            <div>
                                <h2 className="text-5xl font-black text-white mb-8">{t.logo}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-24">
                                <div className="space-y-4">
                                    {t.links.slice(0, 4).map((link, idx) => (
                                        <a key={idx} href="#" className="flex items-center gap-2 text-white/90 hover:text-white text-lg transition-colors group">
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            {link}
                                        </a>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    {t.links.slice(4).map((link, idx) => (
                                        <a key={idx} href="#" className="flex items-center gap-2 text-white/90 hover:text-white text-lg transition-colors group">
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            {link}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 flex justify-between items-center">
                            <p className="text-white/90">{t.copyright}</p>
                            <div className="flex gap-5 text-2xl">
                                {["whatsapp", "instagram", "facebook", "twitter"].map((social) => (
                                    <a key={social} href="#" className="text-white/80 hover:text-white hover:scale-110 transition-all">
                                        <i className={`fab fa-${social}`} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ============================================ */}
            {/* TABLET VERSION (md:lg) - ENHANCED */}
            {/* ============================================ */}
            <div className="hidden md:block lg:hidden">
                <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
                    <div className="w-full max-w-[960px] mx-auto flex items-center justify-between px-4 h-[90px]">
                        <a href="/">
                            <img src="/logo.png" alt="Logo" className="w-[90px] h-[60px] object-contain" />
                        </a>

                        <div className="flex gap-6 font-semibold text-[14px]">
                            <a href="/community" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                                {t.community}
                            </a>
                            <a href="/vacancies" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                                {t.vacancies}
                            </a>
                            <a href="/chat" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                                {t.chat}
                            </a>
                            <a href="/companies" className="text-[#3066BE] font-bold">
                                {t.companies}
                            </a>
                        </div>

                        <ProfileDropdown />
                    </div>
                </nav>

                <div className="mx-auto max-w-[1024px] px-4 py-6 mt-[90px] bg-gradient-to-b from-gray-50 to-white min-h-screen">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.companies}</h1>
                        <p className="text-gray-600">Лучшие работодатели для вашей карьеры</p>
                    </div>

                    <div className="grid grid-cols-12 gap-5">
                        {/* FILTER SIDEBAR */}
                        <aside className="col-span-4">
                            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.companyLabel}</label>
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={t.selectCompany}
                                        className="w-full h-10 bg-gray-50 rounded-xl px-3 text-sm outline-none border border-gray-200 focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.locationLabel}</label>
                                    <input
                                        type="text"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        placeholder={t.selectLocation}
                                        className="w-full h-10 bg-gray-50 rounded-xl px-3 text-sm outline-none border border-gray-200 focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.keywordLabel}</label>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder={t.keywordPlaceholder}
                                        className="w-full h-10 bg-gray-50 rounded-xl px-3 text-sm outline-none border border-gray-200 focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                                    />
                                </div>

                                <div className="h-px bg-gray-200" />

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.rating}</label>
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Star
                                                    className="w-5 h-5"
                                                    fill={star <= rating ? "#FFBF00" : "none"}
                                                    stroke={star <= rating ? "#FFBF00" : "#D9D9D9"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs text-[#3066BE]">{t.andHigher}</span>
                                </div>

                                <button
                                    onClick={handleClear}
                                    className="w-full h-9 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Очистить
                                </button>
                            </div>
                        </aside>

                        {/* COMPANIES LIST */}
                        <section className="col-span-8">
                            {loading ? (
                                <div className="flex items-center justify-center h-48">
                                    <div className="w-12 h-12 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : companies.length === 0 ? (
                                <div className="text-center py-12">
                                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Компании не найдены</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {companies.map((company) => {
                                        const logoSrc = mediaUrl(company?.logo);
                                        return (
                                            <div
                                                key={company.id}
                                                onClick={() => setSelectedCompany(company)}
                                                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#3066BE] hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 group-hover:border-[#3066BE] transition-colors flex-shrink-0">
                                                        <img
                                                            src={logoSrc}
                                                            alt={company.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/company-fallback.png";
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#3066BE] transition-colors truncate">
                                                                    {company.name}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                                                    <span className="flex items-center gap-1">
                                                                        <Users className="w-3.5 h-3.5" />
                                                                        10+ сотрудников
                                                                    </span>
                                                                    <span className="text-[#3066BE]">•</span>
                                                                    <span>{company.location || "—"}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                                                                <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
                                                                <span className="text-xs font-bold text-amber-700">{Number(company.avg_rating || 4.0).toFixed(1)}</span>
                                                            </div>
                                                        </div>

                                                        <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                                                            {company.industry || "Отрасль не указана"}
                                                        </p>

                                                        <div className="mt-3 flex items-center gap-4 text-xs">
                                                            <span className="font-semibold text-gray-900">
                                                                {company.employer_vacancies_count || company.jobpost_count || company.vacancies_count || 0} <span className="text-[#3066BE] font-normal">вакансии</span>
                                                            </span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="font-semibold text-gray-900">
                                                                {company.reviews_count || 0} <span className="text-[#3066BE] font-normal">отзывов</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6 gap-2">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                                                    page === pageNum
                                                        ? "bg-[#3066BE] text-white shadow-md"
                                                        : "bg-white text-gray-700 border border-gray-300 hover:border-[#3066BE]"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {selectedCompany && (
                    <div className="hidden md:block lg:hidden">
                        <TabletCompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
                    </div>
                )}

                {/* Footer */}
                <footer className="relative overflow-hidden mt-16">
                    <img src="/footer-bg.png" alt="Footer" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                    <div className="relative z-20 w-full px-6 py-8 text-white">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-3xl font-black">{t.logo}</h2>

                            <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                                {t.links.map((link, i) => (
                                    <a key={i} href="#" className="flex items-center gap-2 text-white/90 hover:text-white text-sm transition-colors group">
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-4">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm">{t.copyright}</p>
                                <div className="flex gap-4 text-lg">
                                    {["whatsapp", "instagram", "facebook", "twitter"].map((s) => (
                                        <a key={s} href="#" className="text-white/80 hover:text-white transition-colors">
                                            <i className={`fab fa-${s}`} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ============================================ */}
            {/* MOBILE VERSION - ENHANCED */}
            {/* ============================================ */}
            <div className="block md:hidden min-h-screen bg-white">
                {user ? <MobileNavbarLogin /> : <MobileNavbar />}

                <div className="mt-[60px] pb-20">
                    <div className="bg-gradient-to-b from-blue-50/50 to-white px-4 py-6">
                        <h1 className="text-center text-2xl font-extrabold text-gray-900 mb-2">{t.companies}</h1>
                        <p className="text-center text-sm text-gray-600">Найдите идеального работодателя</p>
                    </div>

                    <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200">
                        <button className="text-sm font-semibold text-gray-900 relative group">
                            {t.addCompany}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 group-hover:bg-[#3066BE] transition-colors" />
                        </button>

                        <button
                            onClick={() => setShowFilters(true)}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-900 bg-white border-none"
                        >
                            {t.filter}
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="w-10 h-10 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : companies.length === 0 ? (
                            <div className="text-center py-16">
                                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Компании не найдены</p>
                            </div>
                        ) : (
                            companies.map((c) => {
                                const logoSrc = mediaUrl(c?.logo);
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCompany(c)}
                                        className="w-full text-left border-none active:bg-gray-50 transition-colors bg-white"
                                    >
                                        <div className="px-4 py-5">
                                            <div className="flex gap-3">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0">
                                                    <img
                                                        src={logoSrc}
                                                        alt={c?.name}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/company-fallback.png";
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-bold text-gray-900 truncate">{c?.name || "—"}</h3>
                                                        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                                                            <Star className="w-3 h-3 text-amber-500" fill="currentColor" />
                                                            <span className="text-xs font-bold text-amber-700">{Number(c?.avg_rating || 4.0).toFixed(1)}</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-2">
                                                        1000+ сотрудников <span className="text-[#3066BE]">•</span> {c?.location || "Узбекистан"}
                                                    </p>

                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                        {c?.description || "Описание отсутствует"}
                                                    </p>

                                                    <div className="flex items-center gap-6 text-xs">
                                                        <div>
                                                        <span className="font-bold text-gray-900">
                                                            {c?.employer_vacancies_count || c?.jobpost_count || c?.vacancies_count || 0}
                                                        </span>{" "}
                                                            <span className="text-[#3066BE]">вакансии</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-gray-900">{c?.reviews_count || 0}</span>{" "}
                                                            <span className="text-[#3066BE]">отзывов</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <ChevronRight className="w-5 h-5 text-gray-400 self-center flex-shrink-0" />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="py-6">
                            <div className="flex items-center justify-center gap-2">
                                {[...Array(totalPages)].map((_, i) => {
                                    const num = i + 1;
                                    return (
                                        <button
                                            key={num}
                                            onClick={() => setPage(num)}
                                            className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                                                num === page
                                                    ? "bg-[#3066BE] text-white shadow-md"
                                                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#3066BE]"
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {selectedCompany && (
                    <MobileCompanyDetail
                        company={selectedCompany}
                        onClose={() => setSelectedCompany(null)}
                    />
                )}

                <MobileFilterModal
                    open={showFilters}
                    onClose={() => setShowFilters(false)}
                    query={query}
                    setQuery={setQuery}
                    location={locationFilter}
                    setLocation={setLocationFilter}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    rating={rating}
                    setRating={setRating}
                    size={size}
                    setSize={setSize}
                    onClear={handleClear}
                    onApply={() => setShowFilters(false)}
                />

                <MobileFooter />
            </div>
        </>
    );
}

// ============================================
// MOBILE COMPANY DETAIL MODAL - FULL FEATURED
// ============================================
function MobileCompanyDetail({ company: companyProp, companyId: companyIdProp, onClose }) {
    const id = companyIdProp ?? companyProp?.id ?? null;
    const [company, setCompany] = useState(companyProp || null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [vacancies, setVacancies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loadingVacancies, setLoadingVacancies] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access_token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const [{ data: c }, { data: s }, { data: v }] = await Promise.all([
                    api.get(`/api/companies/${id}/`, { headers }),
                    api.get(`/api/companies/${id}/stats/`, { headers }),
                    api.get(`/api/companies/${id}/vacancies/`, { headers }).catch(() => ({ data: [] }))
                ]);

                if (isMounted) {
                    setCompany(c);
                    const vacancyList = Array.isArray(v) ? v : v?.results || [];
                    setStats({ ...s, vacancies_count: vacancyList.length });
                    setIsFollowing(!!s?.is_following);
                }
            } catch (e) {
                console.error("Mobile modal error:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        if (activeTab === "vacancies" && id && vacancies.length === 0) {
            const fetchVacancies = async () => {
                try {
                    setLoadingVacancies(true);
                    const { data } = await api.get(`/api/companies/${id}/vacancies/`);
                    const vacancyList = Array.isArray(data) ? data : data?.results || [];
                    setVacancies(vacancyList);
                    setStats(prev => ({ ...prev, vacancies_count: vacancyList.length }));
                } catch (e) {
                    console.error("Error loading vacancies:", e);
                } finally {
                    setLoadingVacancies(false);
                }
            };
            fetchVacancies();
        }
    }, [activeTab, id, vacancies.length]);

    useEffect(() => {
        if (activeTab === "reviews" && id && reviews.length === 0) {
            const fetchReviews = async () => {
                try {
                    setLoadingReviews(true);
                    const { data } = await api.get(`/api/companies/${id}/reviews/`);
                    setReviews(Array.isArray(data) ? data : data?.results || []);
                } catch (e) {
                    console.error("Error loading reviews:", e);
                } finally {
                    setLoadingReviews(false);
                }
            };
            fetchReviews();
        }
    }, [activeTab, id, reviews.length]);

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

    if (!id || loading || !company) {
        return (
            <div className="fixed inset-0 z-[110] bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const logoSrc = mediaUrl(company?.logo);
    const rating = Number(company?.avg_rating ?? 0.0).toFixed(1);

    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col">
            {/* Header */}
            <div className="h-14 flex items-center px-4 border-b border-gray-200 bg-white">
                <button onClick={onClose} className="p-2 bg-white border-none -ml-2">
                    <ArrowLeft className="w-5 h-5 text-[#3066BE]" />
                </button>
                <span className="ml-3 text-base font-semibold text-gray-900">{company?.name}</span>
            </div>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
                {/* Cover */}
                <div className="w-full h-28 relative overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                    <img src="/kompaniya-modal.png" alt="cover" className="w-full h-full object-cover mix-blend-overlay" />
                </div>

                {/* Profile Section */}
                <section className="px-4 -mt-8 relative z-10">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border-2 border-white shadow-lg">
                            <img
                                src={logoSrc}
                                onError={(e) => {
                                    e.currentTarget.src = "/company-fallback.png";
                                }}
                                alt={company?.name || "Company"}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">{company?.name || "—"}</h1>
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    1000+ сотрудников
                                </span>
                                <span className="text-[#3066BE]">•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {company?.location || "Узбекистан"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                            <span className="text-sm font-bold text-amber-700">{rating}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleFollow}
                            className={`h-9 px-4 rounded-xl font-semibold text-sm transition-all ${
                                isFollowing
                                    ? "bg-blue-50 text-[#3066BE] border border-blue-200"
                                    : "bg-white border-2 border-[#3066BE] text-[#3066BE] active:bg-blue-50"
                            }`}
                        >
                            {isFollowing ? "✓ Подписаны" : "Подписаться"}
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className="h-9 px-4 rounded-xl bg-[#3066BE] text-white text-sm font-semibold active:bg-[#2555A3]"
                        >
                            ⭐ Оставить отзыв
                        </button>
                    </div>
                </section>

                {/* Stats Cards as Buttons */}
                <section className="px-4 py-4">
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border transition-all ${
                                activeTab === "overview"
                                    ? "border-[#3066BE] shadow-md ring-2 ring-[#3066BE]/20"
                                    : "border-blue-100"
                            }`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                                    activeTab === "overview" ? "bg-[#3066BE]" : "bg-white"
                                }`}>
                                    <Users className={`w-4 h-4 ${
                                        activeTab === "overview" ? "text-white" : "text-[#3066BE]"
                                    }`} />
                                </div>
                                <p className="text-lg font-bold text-gray-900">{stats?.followers_count || 0}</p>
                                <p className="text-[10px] text-gray-600">Подписчиков</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab("vacancies")}
                            className={`bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border transition-all ${
                                activeTab === "vacancies"
                                    ? "border-green-600 shadow-md ring-2 ring-green-600/20"
                                    : "border-green-100"
                            }`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                                    activeTab === "vacancies" ? "bg-green-600" : "bg-white"
                                }`}>
                                    <Briefcase className={`w-4 h-4 ${
                                        activeTab === "vacancies" ? "text-white" : "text-green-600"
                                    }`} />
                                </div>
                                <p className="text-lg font-bold text-gray-900">{stats?.vacancies_count || 0}</p>
                                <p className="text-[10px] text-gray-600">Вакансий</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`bg-gradient-to-br from-amber-50 to-yellow-50 p-3 rounded-xl border transition-all ${
                                activeTab === "reviews"
                                    ? "border-amber-600 shadow-md ring-2 ring-amber-600/20"
                                    : "border-amber-100"
                            }`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                                    activeTab === "reviews" ? "bg-amber-500" : "bg-white"
                                }`}>
                                    <Star className={`w-4 h-4 ${
                                        activeTab === "reviews" ? "text-white" : "text-amber-500"
                                    }`} fill="currentColor" />
                                </div>
                                <p className="text-lg font-bold text-gray-900">{rating}</p>
                                <p className="text-[10px] text-gray-600">Рейтинг</p>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="px-4 pb-6 space-y-4">
                        {/* CTA Card */}
                        <div className="rounded-2xl bg-gradient-to-br from-[#3066BE] via-[#4A90E2] to-[#3066BE] p-4 overflow-hidden shadow-lg">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Найдите то, что подходит именно вам — быстрее. ✨
                                </h3>
                                <p className="text-sm text-white/90 mb-3 leading-relaxed">
                                    Получите персонализированную информацию о работе в компании {company?.name} за один быстрый шаг.
                                </p>
                                <button className="px-5 h-9 bg-white text-[#3066BE] rounded-xl font-semibold text-sm active:scale-95 transition-transform">
                                    📄 Заполнить резюме
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-900 mb-2">О компании</h4>
                            <p className="text-sm leading-relaxed text-gray-700">
                                {company?.description || "Описание отсутствует."}
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === "vacancies" && (
                    <div className="px-4 pb-6">
                        {loadingVacancies ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : vacancies.length === 0 ? (
                            <div className="text-center py-12">
                                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-base text-gray-500 mb-1">Вакансий пока нет</p>
                                <p className="text-xs text-gray-400">Компания еще не добавила открытые позиции</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {vacancies.map((vacancy) => (
                                    <div
                                        key={vacancy.id}
                                        className="bg-white rounded-xl p-4 border border-gray-200 active:bg-gray-50 transition-all"
                                        onClick={() => window.location.href = `/vacancies/${vacancy.id}`}
                                    >
                                        {/* Header - Title & Salary */}
                                        <div className="flex justify-between items-start gap-3 mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-base font-bold text-gray-900 leading-snug mb-2">
                                                    {vacancy.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {vacancy.location || company.location || "—"}
                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                        <Briefcase className="w-3 h-3" />
                                                        {vacancy.employment_type || "Полная занятость"}
                                    </span>
                                                </div>
                                            </div>

                                            {/* Salary Badge */}
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-base font-bold text-[#3066BE] whitespace-nowrap">
                                                    {vacancy.salary_min && vacancy.salary_max
                                                        ? `$${vacancy.salary_min}-${vacancy.salary_max}`
                                                        : vacancy.salary_min
                                                            ? `от $${vacancy.salary_min}`
                                                            : "По договоренности"}
                                                </p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">
                                                    {new Date(vacancy.created_at).toLocaleDateString("ru-RU")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                                            {vacancy.description}
                                        </p>

                                        {/* Skills Tags */}
                                        {vacancy.skills && vacancy.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {vacancy.skills.slice(0, 5).map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-blue-50 text-[#3066BE] rounded-md text-[10px] font-medium"
                                                    >
                                        {skill}
                                    </span>
                                                ))}
                                                {vacancy.skills.length > 5 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-medium">
                                        +{vacancy.skills.length - 5}
                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div className="px-4 pb-6 space-y-4">
                        {/* Review Form */}
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200">
                            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                                Оставить отзыв
                            </h3>
                            <ReviewForm
                                companyId={id}
                                companyName={company.name}
                                onSuccess={() => {
                                    setReviews([]);
                                    setLoadingReviews(false);
                                }}
                            />
                        </div>

                        {/* Reviews List */}
                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-3">Все отзывы</h3>
                            {loadingReviews ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-[#3066BE] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-base text-gray-500 mb-1">Отзывов пока нет</p>
                                    <p className="text-xs text-gray-400">Будьте первым</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-base font-bold text-[#3066BE] flex-shrink-0">
                                                    {review.user_name?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">{review.user_name || "Пользователь"}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(review.created_at).toLocaleDateString("ru-RU")}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className="w-3 h-3"
                                                                    fill={i < review.rating ? "#FFBF00" : "none"}
                                                                    stroke={i < review.rating ? "#FFBF00" : "#D9D9D9"}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed text-sm">{review.text}</p>
                                                    {review.country && (
                                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {review.country}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div style={{ height: "calc(env(safe-area-inset-bottom) + 16px)" }} />
            </main>
        </div>
    );
}

// ============================================
// FILTER MODAL (MOBILE) - ENHANCED
// ============================================
function MobileFilterModal({
                               open,
                               onClose,
                               query,
                               setQuery,
                               location,
                               setLocation,
                               keyword,
                               setKeyword,
                               rating,
                               setRating,
                               size,
                               setSize,
                               onClear,
                               onApply,
                           }) {
    const [showRoles, setShowRoles] = useState(true);
    const ROLES = ["Администрация", "Дизайн", "Образование", "Маркетинг", "Разработка"];

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            {/* Header */}
            <div className="h-[56px] border-b border-gray-200 flex items-center justify-center relative px-4 bg-white">
                <p className="text-base font-semibold text-gray-900">Фильтр компаний</p>
                <button onClick={onClose} className="absolute right-3 p-2 bg-white border-none rounded-lg active:bg-gray-100" aria-label="Close">
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50" style={{ paddingBottom: "calc(100px + env(safe-area-inset-bottom))" }}>
                <div className="px-4 py-5 space-y-5 bg-white">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900">Компания:</label>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Выберите компанию"
                            className="w-full h-11 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 text-sm outline-none focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900">Локация:</label>
                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Выберите локацию"
                            className="w-full h-11 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 text-sm outline-none focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900">Ключевое слово:</label>
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Образование, интернет"
                            className="w-full h-11 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 text-sm outline-none focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20 transition-all"
                        />
                    </div>
                </div>

                <div className="h-2 bg-gray-100" />

                <div className="bg-white px-4 py-5">
                    <button
                        onClick={() => setShowRoles((v) => !v)}
                        className="w-full flex items-center justify-between bg-white border-none"
                    >
                        <span className="text-sm font-semibold text-gray-900">Должность</span>
                        {showRoles ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                    </button>

                    {showRoles && (
                        <div className="mt-3 space-y-2">
                            {ROLES.map((r, i) => (
                                <label key={i} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 accent-[#3066BE] rounded" />
                                    <span className="text-sm text-gray-700">{r}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-2 bg-gray-100" />

                <div className="bg-white px-4 py-5 space-y-5">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">Рейтинг компании</p>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setRating(s === rating ? 0 : s)}
                                    className="p-1 active:scale-95 bg-white border-none"
                                    aria-label={`rating ${s}`}
                                >
                                    <Star className="w-6 h-6" color={s <= rating ? "#FFBF00" : "#D9D9D9"} fill={s <= rating ? "#FFBF00" : "#D9D9D9"} />
                                </button>
                            ))}
                            <span className="ml-2 text-xs text-[#3066BE] font-medium">и выше</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-3 text-gray-900">Размер компании</p>
                        <div className="space-y-2">
                            {["1-50", "51-200", "200-500", "500-1000", "1000+", "любой размер"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="company_size" className="w-4 h-4 accent-[#3066BE]" checked={size === opt} onChange={() => setSize(opt)} />
                                    <span className="text-sm text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}>
                <button onClick={onClear} className="h-10 px-5 rounded-xl border-2 border-gray-300 text-gray-700 text-sm font-medium active:bg-gray-50">
                    Очистить
                </button>
                <button onClick={onApply} className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#3066BE] to-[#4A90E2] text-white text-sm font-semibold active:opacity-90 shadow-md">
                    Применить фильтр
                </button>
            </div>
        </div>
    );
}