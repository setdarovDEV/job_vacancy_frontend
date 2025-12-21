import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import MobileFooter from "../components/mobile/MobileFooter.jsx";

// ============================================================
// MAIN ACTIVITY COMPONENT
// ============================================================
export default function Activity() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [activeTab, setActiveTab] = useState("applied"); // "saved" or "applied"

    const [savedVacancies, setSavedVacancies] = useState({ items: [], loading: false, error: "" });
    const [applications, setApplications] = useState({ items: [], loading: false, error: "" });

    // Responsive handler
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Load data on tab change
    useEffect(() => {
        if (activeTab === "saved" && savedVacancies.items.length === 0 && !savedVacancies.loading) {
            loadSavedVacancies();
        } else if (activeTab === "applied" && applications.items.length === 0 && !applications.loading) {
            loadApplications();
        }
    }, [activeTab]);

    // ============================================================
    // API CALLS
    // ============================================================
    async function loadSavedVacancies() {
        setSavedVacancies(prev => ({ ...prev, loading: true, error: "" }));
        try {
            const res = await api.get("/api/applications/saved-jobs/");
            const data = res.data?.results || res.data || [];
            console.log("✅ Saved vacancies:", data);
            setSavedVacancies({ items: data, loading: false, error: "" });
        } catch (err) {
            console.error("❌ Load saved error:", err);
            setSavedVacancies(prev => ({
                ...prev,
                loading: false,
                error: "Не удалось загрузить сохранённые вакансии"
            }));
        }
    }

    async function loadApplications() {
        setApplications(prev => ({ ...prev, loading: true, error: "" }));
        try {
            const res = await api.get("/api/applications/my/");
            const data = res.data?.results || res.data || [];
            console.log("✅ Applications:", data);
            setApplications({ items: data, loading: false, error: "" });
        } catch (err) {
            console.error("❌ Load applications error:", err);
            setApplications(prev => ({
                ...prev,
                loading: false,
                error: "Не удалось загрузить отклики"
            }));
        }
    }

    async function handleUnsave(vacancyId) {
        try {
            await api.delete(`/api/vacancies/jobposts/${vacancyId}/save/`);
            setSavedVacancies(prev => ({
                ...prev,
                items: prev.items.filter(v => v.id !== vacancyId)
            }));
        } catch (err) {
            alert("Не удалось удалить из сохранённых");
        }
    }

    // ============================================================
    // RENDER BASED ON SCREEN SIZE
    // ============================================================
    if (isMobile) {
        return (
            <ActivityMobile
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                savedVacancies={savedVacancies}
                applications={applications}
                onUnsave={handleUnsave}
            />
        );
    }

    if (isTablet) {
        return (
            <ActivityTablet
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                savedVacancies={savedVacancies}
                applications={applications}
                onUnsave={handleUnsave}
            />
        );
    }

    return (
        <ActivityDesktop
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            savedVacancies={savedVacancies}
            applications={applications}
            onUnsave={handleUnsave}
        />
    );
}

// ============================================================
// TEXTS
// ============================================================
const TEXTS = {
    RU: {
        community: "Сообщество",
        vacancies: "Вакансии",
        chat: "Чат",
        companies: "Компании",
        logo: "Logo",
        links: [
            "Помощь",
            "Наши вакансии",
            "Реклама на сайте",
            "Требования к ПО",
            "Инвесторам",
            "Каталог компаний",
            "Работа по профессиям"
        ],
        copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
    },
};

// ============================================================
// DESKTOP VERSION (>= 1024px)
// ============================================================
function ActivityDesktop({ activeTab, setActiveTab, savedVacancies, applications, onUnsave }) {
    const t = TEXTS.RU;

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-10 h-[90px]">
                    <Link to="/" className="hover:scale-105 transition-transform">
                        <img src="/logo.png" alt="Logo" className="w-[109px] h-[72px] object-contain" />
                    </Link>

                    <div className="flex gap-8 font-semibold text-[16px]">
                        <Link to="/community" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                            {t.community}
                        </Link>
                        <Link to="/vacancies" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                            {t.vacancies}
                        </Link>
                        <Link to="/chat" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                            {t.chat}
                        </Link>
                        <Link to="/companies" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                            {t.companies}
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-[130px] pb-20 px-8 max-w-[1200px] mx-auto">
                <h1 className="text-[32px] font-bold text-center mb-10">Ваша активность</h1>

                <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`flex-1 py-4 text-[18px] font-semibold transition-colors ${
                                activeTab === "saved"
                                    ? "text-black border-b-[3px] border-black"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Сохранённые вакансии
                        </button>
                        <button
                            onClick={() => setActiveTab("applied")}
                            className={`flex-1 py-4 text-[18px] font-semibold transition-colors ${
                                activeTab === "applied"
                                    ? "text-black border-b-[3px] border-black"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Отклики на вакансии
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[400px]">
                        {activeTab === "saved" ? (
                            <VacancyList
                                items={savedVacancies.items}
                                loading={savedVacancies.loading}
                                error={savedVacancies.error}
                                onUnsave={onUnsave}
                            />
                        ) : (
                            <ApplicationList
                                items={applications.items}
                                loading={applications.loading}
                                error={applications.error}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer - VacanciesPage Style */}
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
                                            className="flex items-center gap-2 text-white hover:text-[#F2F4FD] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300"
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
                                            className="flex items-center gap-2 text-white hover:text-[#F2F4FD] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300"
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
                                <a href="#" className="text-white hover:text-[#F2F4FD] transition">
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                                <a href="#" className="text-white hover:text-[#F2F4FD] transition">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="text-white hover:text-[#F2F4FD] transition">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a href="#" className="text-white hover:text-[#F2F4FD] transition">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ============================================================
// TABLET VERSION (768px - 1023px)
// ============================================================
function ActivityTablet({ activeTab, setActiveTab, savedVacancies, applications, onUnsave }) {
    const t = TEXTS.RU;

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 h-[70px]">
                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="w-[90px] h-[60px] object-contain" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-[100px] pb-16 px-6">
                <h1 className="text-[28px] font-bold text-center mb-8">Ваша активность</h1>

                <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`flex-1 py-3 text-[16px] font-semibold ${
                                activeTab === "saved"
                                    ? "text-black border-b-[3px] border-black"
                                    : "text-gray-500"
                            }`}
                        >
                            Сохранённые вакансии
                        </button>
                        <button
                            onClick={() => setActiveTab("applied")}
                            className={`flex-1 py-3 text-[16px] font-semibold ${
                                activeTab === "applied"
                                    ? "text-black border-b-[3px] border-black"
                                    : "text-gray-500"
                            }`}
                        >
                            Отклики на вакансии
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 min-h-[350px]">
                        {activeTab === "saved" ? (
                            <VacancyList
                                items={savedVacancies.items}
                                loading={savedVacancies.loading}
                                error={savedVacancies.error}
                                onUnsave={onUnsave}
                            />
                        ) : (
                            <ApplicationList
                                items={applications.items}
                                loading={applications.loading}
                                error={applications.error}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer - Tablet */}
            <footer className="relative overflow-hidden md:block lg:hidden mt-[50px] w-full">
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
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-whatsapp" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-instagram" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-facebook" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-twitter" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ============================================================
// MOBILE VERSION (< 768px)
// ============================================================
function ActivityMobile({ activeTab, setActiveTab, savedVacancies, applications, onUnsave }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const t = TEXTS.RU;

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Mobile Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 h-[60px]">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
                        ☰
                    </button>

                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="h-[50px] object-contain" />
                    </Link>

                    <ProfileDropdown />
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}>
                    <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6">{t.logo}</h2>
                        <nav className="space-y-4">
                            {t.links.map((link, i) => (
                                <Link key={i} to="#" className="block text-gray-700 hover:text-[#3066BE]">
                                    {link}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="pt-[80px] pb-12 px-4">
                <h1 className="text-[24px] font-bold text-center mb-6">Ваша активность</h1>

                <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`flex-1 py-3 text-[14px] font-semibold ${
                                activeTab === "saved"
                                    ? "text-black border-b-[2px] border-black"
                                    : "text-gray-500"
                            }`}
                        >
                            Сохранённые вакансии
                        </button>
                        <button
                            onClick={() => setActiveTab("applied")}
                            className={`flex-1 py-3 text-[14px] font-semibold ${
                                activeTab === "applied"
                                    ? "text-black border-b-[2px] border-black"
                                    : "text-gray-500"
                            }`}
                        >
                            Отклики на вакансии
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 min-h-[300px]">
                        {activeTab === "saved" ? (
                            <VacancyList
                                items={savedVacancies.items}
                                loading={savedVacancies.loading}
                                error={savedVacancies.error}
                                onUnsave={onUnsave}
                                compact
                            />
                        ) : (
                            <ApplicationList
                                items={applications.items}
                                loading={applications.loading}
                                error={applications.error}
                                compact
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Mobile */}
            <MobileFooter />
        </div>
    );
}

// ============================================================
// VACANCY LIST (Saved Vacancies)
// ============================================================
function VacancyList({ items, loading, error, onUnsave, compact = false }) {
    if (loading) return <LoadingSkeleton compact={compact} />;
    if (error) return <EmptyState text={error} />;
    if (!items || items.length === 0) return <EmptyState text="Пока нет сохранённых вакансий." />;

    return (
        <div className="space-y-4">
            {items.map(vacancy => (
                <div
                    key={vacancy.id}
                    className={`border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-[#3066BE]/30 transition-all ${compact ? 'text-sm' : ''}`}
                >
                    <h3 className={`font-bold text-black mb-2 ${compact ? 'text-base' : 'text-lg'}`}>
                        {vacancy.title || "Vacancy"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                        {vacancy.company?.name || "—"} • {vacancy.location || "—"}
                    </p>
                    {vacancy.budget_min && vacancy.budget_max && (
                        <p className="text-[#3066BE] font-medium mb-3">
                            {vacancy.budget_min}–{vacancy.budget_max} USD
                        </p>
                    )}
                    <button
                        onClick={() => onUnsave(vacancy.id)}
                        className="text-red-600 text-sm hover:text-red-700"
                    >
                        Удалить из сохранённых
                    </button>
                </div>
            ))}
        </div>
    );
}

// ============================================================
// APPLICATION LIST (Applied Vacancies)
// ============================================================
function ApplicationList({ items, loading, error, compact = false }) {
    if (loading) return <LoadingSkeleton compact={compact} />;
    if (error) return <EmptyState text={error} />;
    if (!items || items.length === 0) return <EmptyState text="Пока нет откликов." />;

    const statusMap = {
        "APPLIED": { text: "Отправлено", class: "bg-blue-100 text-blue-700" },
        "SHORTLISTED": { text: "На рассмотрении", class: "bg-yellow-100 text-yellow-700" },
        "REJECTED": { text: "Отклонено", class: "bg-red-100 text-red-700" },
        "HIRED": { text: "Принято", class: "bg-green-100 text-green-700" },
    };

    return (
        <div className="space-y-4">
            {items.map(app => {
                const job = app.job || {};
                const statusInfo = statusMap[app.status] || { text: app.status, class: "bg-gray-100 text-gray-700" };

                return (
                    <div
                        key={app.id}
                        className={`border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-[#3066BE]/30 transition-all ${compact ? 'text-sm' : ''}`}
                    >
                        <h3 className={`font-bold text-black mb-2 ${compact ? 'text-base' : 'text-lg'}`}>
                            {job.title || "Vacancy"}
                        </h3>

                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
                                {statusInfo.text}
                            </span>
                            {app.created_at && (
                                <span className="text-gray-500 text-xs">
                                    Дата: {new Date(app.created_at).toLocaleDateString('ru-RU')}
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================
// LOADING SKELETON
// ============================================================
function LoadingSkeleton({ compact = false }) {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className={`border border-gray-200 rounded-xl p-4 animate-pulse ${compact ? 'p-3' : ''}`}>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            ))}
        </div>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================
function EmptyState({ text }) {
    return (
        <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-50">📋</div>
            <p className="text-gray-400 text-lg">{text}</p>
        </div>
    );
}