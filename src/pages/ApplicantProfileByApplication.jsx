import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, MapPin, Mail, Phone, ExternalLink, X, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import { chatApi } from "../utils/chat.js";
import CreateCompanyModal from "../components/CreateCompanyModal.jsx";
import MobileFooter from "../components/mobile/MobileFooter.jsx";

// ============================================================
// MAIN EMPLOYER APPLICATIONS COMPONENT
// ============================================================
export default function EmployerApplications() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [applications, setApplications] = useState({ items: [], loading: false, error: "" });
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Responsive handler
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Load applications
    useEffect(() => {
        loadApplications(currentPage);
    }, [currentPage]);

    // ============================================================
    // API CALLS
    // ============================================================
    async function loadApplications(page = 1) {
        setApplications(prev => ({ ...prev, loading: true, error: "" }));
        try {
            // GET /api/applications/my/applications/ - employer's all applications
            const res = await api.get("/api/applications/my/applications/", {
                params: { page }
            });
            const data = res.data?.results || res.data || [];
            console.log("✅ Applications for employer:", data);

            setApplications({
                items: data,
                loading: false,
                error: ""
            });

            setTotalPages(Math.ceil((res.data?.count || data.length) / 10));
        } catch (err) {
            console.error("❌ Load applications error:", err);
            setApplications(prev => ({
                ...prev,
                loading: false,
                error: "Не удалось загрузить отклики"
            }));
        }
    }

    async function viewApplicantProfile(applicationId) {
        try {
            // GET /api/applications/{pk}/applicant/ - full applicant profile
            const res = await api.get(`/api/applications/${applicationId}/applicant/`);
            console.log("✅ Full applicant profile:", res.data);
            setSelectedApplicant(res.data);
        } catch (err) {
            console.error("❌ Load applicant profile error:", err);
            toast.error("Не удалось загрузить профиль");
        }
    }

    // ============================================================
    // RENDER BASED ON SCREEN SIZE
    // ============================================================
    if (isMobile) {
        return (
            <EmployerApplicationsMobile
                applications={applications}
                onViewProfile={viewApplicantProfile}
                selectedApplicant={selectedApplicant}
                onCloseProfile={() => setSelectedApplicant(null)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        );
    }

    if (isTablet) {
        return (
            <EmployerApplicationsTablet
                applications={applications}
                onViewProfile={viewApplicantProfile}
                selectedApplicant={selectedApplicant}
                onCloseProfile={() => setSelectedApplicant(null)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        );
    }

    return (
        <EmployerApplicationsDesktop
            applications={applications}
            onViewProfile={viewApplicantProfile}
            selectedApplicant={selectedApplicant}
            onCloseProfile={() => setSelectedApplicant(null)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
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
        applicationsTitle: "Отклики",
        companiesTitle: "Компании",
        addCompany: "Указав название вашей компании, вы можете повысить доверие сотрудников.",
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
function EmployerApplicationsDesktop({ applications, onViewProfile, selectedApplicant, onCloseProfile, currentPage, totalPages, onPageChange }) {
    const t = TEXTS.RU;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        api.get("/api/auth/profile/").then(res => {
            const profileImage = res.data.profile_image;
            let avatarUrl = "/user-white.jpg";
            
            if (profileImage) {
                const baseURL = api.defaults.baseURL || "http://127.0.0.1:8000";
                avatarUrl = profileImage.startsWith("http")
                    ? profileImage
                    : `${baseURL}${profileImage}`;
            }
            
            setUser({
                full_name: `${res.data.first_name || ""} ${res.data.last_name || ""}`.trim() || res.data.username,
                location: res.data.location || "Ташкент, Узбекистан - 22:16 местное время",
                avatar: avatarUrl
            });
        }).catch(console.error);
    }, []);

    // ==========================
    // COMPANY HANDLERS
    // ==========================
    const fetchCompanies = async () => {
        try {
            const response = await api.get("/api/companies/");
            const data = Array.isArray(response.data) ? response.data : response.data.results;
            setCompanies(data || []);
        } catch (err) {
            console.error("❌ Kompaniyalarni olishda xatolik:", err);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleEditCompanies = (company) => {
        if (!isEditable) return;
        setSelectedCompany(company);
        setShowCompanyModal(true);
    };

    const handleDeleteCompanies = async (companyId) => {
        if (!isEditable) return;
        const confirm = window.confirm("Kompaniyani o'chirmoqchimisiz?");
        if (!confirm) return;

        try {
            await api.delete(`/api/companies/${companyId}/`);
            alert("Kompaniya o'chirildi ✅");
            fetchCompanies();
        } catch (err) {
            console.error("❌ O'chirishda xatolik:", err.response?.data || err.message);
            alert("Xatolik: " + JSON.stringify(err.response?.data));
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-10 h-[90px]">
                    <Link to="/">
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
            <div className="pt-[130px] pb-20 px-8 max-w-[1400px] mx-auto">
                {/* User Header Card */}
                <div className="bg-white rounded-[24px] border border-gray-200 p-6 mb-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-[80px] h-[80px]">
                                <img
                                    src={user?.avatar || "/user-white.jpg"}
                                    alt="User"
                                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                                    onError={(e) => { 
                                        e.target.src = "/user-white.jpg"; 
                                    }}
                                />
                            </div>
                            <div>
                                <h2 className="text-[24px] font-bold text-black mb-1">
                                    {user?.full_name || "Loading..."}
                                </h2>
                                <p className="text-[14px] text-gray-500 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {user?.location || "Локация не указана"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/profile/settings")}
                            className="px-6 py-3 bg-[#3066BE] text-white rounded-xl font-semibold hover:bg-[#2757a4] transition-all"
                        >
                            Настройки профиля
                        </button>
                    </div>
                </div>

                {/* Applications Section */}
                <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-[24px] font-bold text-black">{t.applicationsTitle}</h3>
                    </div>

                    <div className="p-6">
                        {applications.loading ? (
                            <LoadingSkeleton />
                        ) : applications.error ? (
                            <EmptyState text={applications.error} />
                        ) : applications.items.length === 0 ? (
                            <EmptyState text="Пока нет откликов на ваши вакансии." />
                        ) : (
                            <div className="space-y-4">
                                {applications.items.map(app => (
                                    <ApplicationCard
                                        key={app.id}
                                        application={app}
                                        onViewProfile={() => onViewProfile(app.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 p-6 border-t border-gray-200">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => onPageChange(i + 1)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                                        currentPage === i + 1
                                            ? "bg-[#3066BE] text-white"
                                            : "bg-white text-[#3066BE] border-2 border-[#3066BE] hover:bg-[#3066BE]/10"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Companies Section */}
                <div className="bg-white rounded-[24px] border border-[#AEAEAE] overflow-visible shadow-sm">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[#AEAEAE] h-[94.5px]">
                        <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">
                            {t.companiesTitle}
                        </h3>

                        {companies.length === 0 && (
                            <div
                                onClick={() => { if (isEditable) setShowCompanyModal(true); }}
                                className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition ${
                                    isEditable
                                        ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#F0F7FF]"
                                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                }`}
                            >
                                <Plus size={25} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>
                        )}
                    </div>

                    {/* COMPANIES LIST */}
                    {companies.length > 0 ? (
                        <div className="w-full px-[45px] mt-[25px] mb-[50px]">
                            {companies.map((company) => (
                                <div key={company.id} className="w-full border-b border-[#D9D9D9] py-6 last:border-b-0">
                                    <div className="flex items-start gap-6">
                                        {/* LOGO */}
                                        <div className="flex-shrink-0">
                                            {company.logo ? (
                                                <img
                                                    src={company.logo}
                                                    alt={company.name}
                                                    className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                                    onError={(e) => {
                                                        console.error("❌ Logo yuklanmadi:", company.logo);
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}

                                            {/* Fallback */}
                                            <div
                                                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-sm"
                                                style={{ display: company.logo ? 'none' : 'flex' }}
                                            >
                                                {company.name?.charAt(0)?.toUpperCase() || 'C'}
                                            </div>
                                        </div>

                                        {/* COMPANY INFO */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-2xl font-bold text-black mb-2">
                                                {company.name}
                                            </h4>

                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold text-gray-700">Industry:</span>{' '}
                                                    {company.industry || 'Not specified'}
                                                </p>

                                                {company.website && (
                                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-sm text-[#3066BE] hover:underline block"
                                                    >
                                                        🌐 {company.website}
                                                    </a>
                                                )}

                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <img src="/location.png" alt="location" className="w-4 h-4" />
                                                    {company.location || 'Location not specified'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        {isEditable && (
                                            <div className="flex gap-2 flex-shrink-0">
                                                <div
                                                    onClick={() => handleEditCompanies(company)}
                                                    className={`w-[35px] h-[35px] rounded-full flex items-center justify-center transition ${
                                                        isEditable
                                                            ? "border-2 border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                            : "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Pencil size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>

                                                <div
                                                    onClick={() => handleDeleteCompanies(company.id)}
                                                    className={`w-[35px] h-[35px] rounded-full flex items-center justify-center transition ${
                                                        isEditable
                                                            ? "border-2 border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                            : "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Trash2 size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 text-lg py-16">
                            <p className="font-medium">Компанияlar мавжуд эмас</p>
                            <p className="text-sm mt-2">
                                {isEditable
                                    ? 'Янги компания қўшиш учун "+" тугмасини босинг'
                                    : 'Компания яратиш учун "Предпросмотр" режимини ёқинг'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Applicant Profile Modal */}
            {selectedApplicant && (
                <ApplicantProfileModal
                    applicant={selectedApplicant}
                    onClose={onCloseProfile}
                />
            )}

            {/* Company Modal */}
            {showCompanyModal && (
                <CreateCompanyModal
                    onClose={() => {
                        setShowCompanyModal(false);
                        setSelectedCompany(null);
                    }}
                    onSuccess={fetchCompanies}
                    company={selectedCompany}
                />
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}

// ============================================================
// TABLET VERSION (768px - 1023px)
// ============================================================
function EmployerApplicationsTablet({ applications, onViewProfile, selectedApplicant, onCloseProfile, currentPage, totalPages, onPageChange }) {
    const t = TEXTS.RU;
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        api.get("/api/auth/profile/").then(res => {
            const profileImage = res.data.profile_image;
            let avatarUrl = "/user-white.jpg";
            
            if (profileImage) {
                const baseURL = api.defaults.baseURL || "http://127.0.0.1:8000";
                avatarUrl = profileImage.startsWith("http")
                    ? profileImage
                    : `${baseURL}${profileImage}`;
            }
            
            setUser({
                full_name: `${res.data.first_name || ""} ${res.data.last_name || ""}`.trim() || res.data.username,
                location: res.data.location || "Ташкент, Узбекистан",
                avatar: avatarUrl
            });
        }).catch(console.error);
    }, []);

    // ==========================
    // COMPANY HANDLERS
    // ==========================
    const fetchCompanies = async () => {
        try {
            const response = await api.get("/api/companies/");
            const data = Array.isArray(response.data) ? response.data : response.data.results;
            setCompanies(data || []);
        } catch (err) {
            console.error("❌ Kompaniyalarni olishda xatolik:", err);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleEditCompanies = (company) => {
        if (!isEditable) return;
        setSelectedCompany(company);
        setShowCompanyModal(true);
    };

    const handleDeleteCompanies = async (companyId) => {
        if (!isEditable) return;
        const confirm = window.confirm("Kompaniyani o'chirmoqchimisiz?");
        if (!confirm) return;

        try {
            await api.delete(`/api/companies/${companyId}/`);
            alert("Kompaniya o'chirildi ✅");
            fetchCompanies();
        } catch (err) {
            console.error("❌ O'chirishda xatolik:", err.response?.data || err.message);
            alert("Xatolik: " + JSON.stringify(err.response?.data));
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 h-[70px]">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
                        ☰
                    </button>

                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="w-[90px] h-[60px] object-contain" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <ProfileDropdown />
                    </div>
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
            <div className="pt-[100px] pb-16 px-6">
                {/* User Header */}
                <div className="bg-white rounded-[20px] border border-gray-200 p-5 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative w-[70px] h-[70px]">
                            <img
                                src={user?.avatar || "/user-white.jpg"}
                                alt="User"
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => { 
                                    e.target.src = "/user-white.jpg"; 
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[20px] font-bold text-black">
                                {user?.full_name || "Loading..."}
                            </h2>
                            <p className="text-[13px] text-gray-500">
                                {user?.location || "—"}
                            </p>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-[#3066BE] text-white rounded-xl font-semibold">
                        Настройки профиля
                    </button>
                </div>

                {/* Applications */}
                <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm mb-6">
                    <div className="p-5 border-b border-gray-200">
                        <h3 className="text-[20px] font-bold text-black">{t.applicationsTitle}</h3>
                    </div>

                    <div className="p-5">
                        {applications.loading ? (
                            <LoadingSkeleton compact />
                        ) : applications.items.length === 0 ? (
                            <EmptyState text="Пока нет откликов." compact />
                        ) : (
                            <div className="space-y-3">
                                {applications.items.map(app => (
                                    <ApplicationCard
                                        key={app.id}
                                        application={app}
                                        onViewProfile={() => onViewProfile(app.id)}
                                        compact
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 p-5 border-t border-gray-200">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => onPageChange(i + 1)}
                                    className={`w-9 h-9 rounded-full text-sm font-semibold ${
                                        currentPage === i + 1
                                            ? "bg-[#3066BE] text-white"
                                            : "bg-white text-[#3066BE] border-2 border-[#3066BE]"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Companies */}
                <div className="bg-white rounded-[20px] border border-[#AEAEAE] overflow-visible shadow-sm">
                    <div className="flex justify-between items-center px-5 py-4 border-b border-[#AEAEAE]">
                        <h3 className="text-[20px] font-bold text-[#000000]">
                            {t.companiesTitle}
                        </h3>

                        {companies.length === 0 && (
                            <div
                                onClick={() => { if (isEditable) setShowCompanyModal(true); }}
                                className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition ${
                                    isEditable
                                        ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#F0F7FF]"
                                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                }`}
                            >
                                <Plus size={20} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>
                        )}
                    </div>

                    {/* COMPANIES LIST */}
                    {companies.length > 0 ? (
                        <div className="w-full px-5 mt-4 mb-5">
                            {companies.map((company) => (
                                <div key={company.id} className="w-full border-b border-[#D9D9D9] py-4 last:border-b-0">
                                    <div className="flex items-start gap-4">
                                        {/* LOGO */}
                                        <div className="flex-shrink-0">
                                            {company.logo ? (
                                                <img
                                                    src={company.logo}
                                                    alt={company.name}
                                                    className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}

                                            {/* Fallback */}
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
                                                style={{ display: company.logo ? 'none' : 'flex' }}
                                            >
                                                {company.name?.charAt(0)?.toUpperCase() || 'C'}
                                            </div>
                                        </div>

                                        {/* COMPANY INFO */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-black mb-1">
                                                {company.name}
                                            </h4>

                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-600">
                                                    <span className="font-semibold text-gray-700">Industry:</span>{' '}
                                                    {company.industry || 'Not specified'}
                                                </p>

                                                {company.website && (
                                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-xs text-[#3066BE] hover:underline block"
                                                    >
                                                        🌐 {company.website}
                                                    </a>
                                                )}

                                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                                    <img src="/location.png" alt="location" className="w-3 h-3" />
                                                    {company.location || 'Location not specified'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        {isEditable && (
                                            <div className="flex gap-2 flex-shrink-0">
                                                <div
                                                    onClick={() => handleEditCompanies(company)}
                                                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition ${
                                                        isEditable
                                                            ? "border-2 border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                            : "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Pencil size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>

                                                <div
                                                    onClick={() => handleDeleteCompanies(company.id)}
                                                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition ${
                                                        isEditable
                                                            ? "border-2 border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                            : "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Trash2 size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 text-sm py-12 px-5">
                            <p className="font-medium">Компанияlar мавжуд эмас</p>
                            <p className="text-xs mt-2">
                                {isEditable
                                    ? 'Янги компания қўшиш учун "+" тугмасини босинг'
                                    : 'Компания яратиш учун "Предпросмотр" режимини ёқинг'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedApplicant && (
                <ApplicantProfileModal
                    applicant={selectedApplicant}
                    onClose={onCloseProfile}
                    compact
                />
            )}

            {/* Company Modal */}
            {showCompanyModal && (
                <CreateCompanyModal
                    onClose={() => {
                        setShowCompanyModal(false);
                        setSelectedCompany(null);
                    }}
                    onSuccess={fetchCompanies}
                    company={selectedCompany}
                />
            )}

            <FooterTablet />
        </div>
    );
}

// ============================================================
// MOBILE VERSION (< 768px)
// ============================================================
function EmployerApplicationsMobile({ applications, onViewProfile, selectedApplicant, onCloseProfile, currentPage, totalPages, onPageChange }) {
    const t = TEXTS.RU;
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        api.get("/api/auth/profile/").then(res => {
            const profileImage = res.data.profile_image;
            let avatarUrl = "/user-white.jpg";
            
            if (profileImage) {
                const baseURL = api.defaults.baseURL || "http://127.0.0.1:8000";
                avatarUrl = profileImage.startsWith("http")
                    ? profileImage
                    : `${baseURL}${profileImage}`;
            }
            
            setUser({
                full_name: `${res.data.first_name || ""} ${res.data.last_name || ""}`.trim() || res.data.username,
                location: "Ташкент, Узбекистан",
                avatar: avatarUrl
            });
        }).catch(console.error);
    }, []);

    // ==========================
    // COMPANY HANDLERS
    // ==========================
    const fetchCompanies = async () => {
        try {
            const response = await api.get("/api/companies/");
            const data = Array.isArray(response.data) ? response.data : response.data.results;
            setCompanies(data || []);
        } catch (err) {
            console.error("❌ Kompaniyalarni olishda xatolik:", err);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleEditCompanies = (company) => {
        if (!isEditable) return;
        setSelectedCompany(company);
        setShowCompanyModal(true);
    };

    const handleDeleteCompanies = async (companyId) => {
        if (!isEditable) return;
        const confirm = window.confirm("Kompaniyani o'chirmoqchimisiz?");
        if (!confirm) return;

        try {
            await api.delete(`/api/companies/${companyId}/`);
            alert("Kompaniya o'chirildi ✅");
            fetchCompanies();
        } catch (err) {
            console.error("❌ O'chirishda xatolik:", err.response?.data || err.message);
            alert("Xatolik: " + JSON.stringify(err.response?.data));
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Mobile Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 h-[60px]">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl">
                        ☰
                    </button>

                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="h-[50px] object-contain" />
                    </Link>

                    <ProfileDropdown />
                </div>
            </nav>

            {/* Menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}>
                    <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-white p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">{t.logo}</h2>
                        <nav className="space-y-3">
                            {t.links.map((link, i) => (
                                <Link key={i} to="#" className="block text-gray-700 text-sm">
                                    {link}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="pt-[80px] pb-12 px-4">
                {/* User Card */}
                <div className="bg-white rounded-[16px] border border-gray-200 p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-[60px] h-[60px]">
                            <img
                                src={user?.avatar || "/user-white.jpg"}
                                alt="User"
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => { 
                                    e.target.src = "/user-white.jpg"; 
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-bold">{user?.full_name || "..."}</h2>
                            <p className="text-[12px] text-gray-500">{user?.location}</p>
                        </div>
                    </div>
                </div>

                {/* Applications */}
                <div className="mb-4">
                    <h3 className="text-[20px] font-bold mb-3">{t.applicationsTitle}</h3>

                    {applications.loading ? (
                        <LoadingSkeleton compact />
                    ) : applications.items.length === 0 ? (
                        <EmptyState text="Пока нет откликов." compact />
                    ) : (
                        <div className="space-y-3">
                            {applications.items.map(app => (
                                <ApplicationCard
                                    key={app.id}
                                    application={app}
                                    onViewProfile={() => onViewProfile(app.id)}
                                    compact
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => onPageChange(i + 1)}
                                    className={`w-8 h-8 rounded-full text-sm font-semibold ${
                                        currentPage === i + 1
                                            ? "bg-[#3066BE] text-white"
                                            : "bg-white text-[#3066BE] border border-[#3066BE]"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Companies */}
                <div className="bg-white rounded-[16px] border border-[#AEAEAE] overflow-visible shadow-sm">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-[#AEAEAE]">
                        <h3 className="text-[18px] font-bold text-[#000000]">
                            {t.companiesTitle}
                        </h3>

                        {companies.length === 0 && (
                            <div
                                onClick={() => { if (isEditable) setShowCompanyModal(true); }}
                                className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition ${
                                    isEditable
                                        ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#F0F7FF]"
                                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                }`}
                            >
                                <Plus size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>
                        )}
                    </div>

                    {/* COMPANIES LIST */}
                    {companies.length > 0 ? (
                        <div className="w-full px-4 mt-3 mb-4">
                            {companies.map((company) => (
                                <div key={company.id} className="w-full border-b border-[#D9D9D9] py-3 last:border-b-0">
                                    <div className="flex items-start gap-3">
                                        {/* LOGO */}
                                        <div className="flex-shrink-0">
                                            {company.logo ? (
                                                <img
                                                    src={company.logo}
                                                    alt={company.name}
                                                    className="w-14 h-14 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}

                                            {/* Fallback */}
                                            <div
                                                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                                                style={{ display: company.logo ? 'none' : 'flex' }}
                                            >
                                                {company.name?.charAt(0)?.toUpperCase() || 'C'}
                                            </div>
                                        </div>

                                        {/* COMPANY INFO */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-black mb-1">
                                                {company.name}
                                            </h4>

                                            <div className="space-y-0.5">
                                                <p className="text-[11px] text-gray-600">
                                                    <span className="font-semibold text-gray-700">Industry:</span>{' '}
                                                    {company.industry || 'Not specified'}
                                                </p>

                                                {company.website && (
                                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-[11px] text-[#3066BE] hover:underline block"
                                                    >
                                                        🌐 {company.website}
                                                    </a>
                                                )}

                                                <p className="text-[11px] text-gray-600 flex items-center gap-1">
                                                    <img src="/location.png" alt="location" className="w-3 h-3" />
                                                    {company.location || 'Location not specified'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        {isEditable && (
                                            <div className="flex gap-1.5 flex-shrink-0">
                                                <div
                                                    onClick={() => handleEditCompanies(company)}
                                                    className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition ${
                                                        isEditable
                                                            ? "border-2 border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                            : "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Pencil size={14} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>

                                                <div
                                                    onClick={() => handleDeleteCompanies(company.id)}
                                                    className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition ${
                                                        isEditable
                                                            ? "border-2 border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                            : "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Trash2 size={14} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 text-xs py-10 px-4">
                            <p className="font-medium">Компанияlar мавжуд эмас</p>
                            <p className="text-[10px] mt-1">
                                {isEditable
                                    ? 'Янги компания қўшиш учун "+" тугмасини босинг'
                                    : 'Компания яратиш учун "Предпросмотр" режимини ёқинг'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedApplicant && (
                <ApplicantProfileModal
                    applicant={selectedApplicant}
                    onClose={onCloseProfile}
                    mobile
                />
            )}

            {/* Company Modal */}
            {showCompanyModal && (
                <CreateCompanyModal
                    onClose={() => {
                        setShowCompanyModal(false);
                        setSelectedCompany(null);
                    }}
                    onSuccess={fetchCompanies}
                    company={selectedCompany}
                />
            )}

            <FooterMobile />
        </div>
    );
}

// ============================================================
// APPLICATION CARD COMPONENT
// ============================================================
function ApplicationCard({ application, onViewProfile, compact = false }) {
    const navigate = useNavigate();
    const applicant = application.applicant || {};
    const job = application.job || {};

    // Chat funksiyasi
    const handleWrite = async (e) => {
        e.stopPropagation();
        try {
            console.log("📝 handleWrite called with applicationId:", application.id);
            console.log("📋 Application data:", application);
            
            // Application'dan userId ni topish
            const userId = application.userId || 
                          application.user?.id || 
                          applicant?.id || 
                          applicant?.user?.id;
            
            console.log("👤 Extracted userId:", userId);
            
            let room;
            
            // Agar userId bor bo'lsa, to'g'ridan-to'g'ri chat yaratamiz
            if (userId) {
                console.log("✅ Using userId directly:", userId);
                const chatRes = await api.post("/api/chats/get_or_create/", { user_id: userId });
                console.log("💬 Chat response:", chatRes.data);
                room = {
                    id: chatRes.data.id,
                    peer: chatRes.data.other_user || applicant,
                };
            } else {
                // Aks holda, getOrCreateByApplication funksiyasini ishlatamiz
                console.log("🔄 Using getOrCreateByApplication function");
                room = await chatApi.getOrCreateByApplication(application.id);
            }
            
            console.log("✅ Room data:", room);
            console.log("🚀 Navigating to chat page with roomId:", room.id);
            
            // Chat sahifasiga o'tamiz
            navigate(`/chat?room=${room.id}`, { 
                state: { 
                    peer: room.peer, 
                    ts: Date.now() 
                } 
            });
        } catch (err) {
            console.error("❌ handleWrite failed", err);
            console.error("Error details:", err.response?.data || err.message);
            toast.error("Chat xonasini ochishda xatolik: " + (err.message || "Noma'lum xatolik"));
        }
    };

    return (
        <div className={`bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-[#3066BE]/30 transition-all ${compact ? 'p-3' : 'p-5'}`}>
            <div className="flex items-start gap-4">
                <img
                    src={applicant.avatar || "/user1.png"}
                    alt={applicant.full_name || "User"}
                    className={`rounded-full object-cover ${compact ? 'w-[50px] h-[50px]' : 'w-[60px] h-[60px]'}`}
                    onError={(e) => { e.target.src = "/user1.png"; }}
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`font-bold text-black ${compact ? 'text-[16px]' : 'text-[18px]'}`}>
                            {applicant.full_name || "Applicant"} {applicant.average_stars > 0 && (
                            <span className="inline-flex items-center gap-1 ml-2">
                                    <Star size={compact ? 14 : 16} className="fill-yellow-400 text-yellow-400" />
                                    <span className={`text-yellow-600 ${compact ? 'text-[13px]' : 'text-[15px]'}`}>
                                        {applicant.average_stars.toFixed(1)}
                                    </span>
                                </span>
                        )}
                        </h3>
                    </div>

                    <p className={`text-gray-600 mb-2 ${compact ? 'text-[13px]' : 'text-[14px]'}`}>
                        {applicant.position || "Должность не указана"} • {applicant.bio ? applicant.bio.substring(0, 50) + "..." : "веб дизайнер"}
                    </p>

                    {/* Bio Preview */}
                    {applicant.bio && (
                        <p className={`text-gray-500 line-clamp-2 mb-3 ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
                            {applicant.bio}
                        </p>
                    )}

                    {/* Skills */}
                    {applicant.skills && applicant.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {applicant.skills.slice(0, 3).map((skill, i) => (
                                <span
                                    key={i}
                                    className={`bg-gray-100 text-gray-700 rounded-full font-medium ${compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1 text-[12px]'}`}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleWrite}
                            className={`flex-1 border-2 border-[#3066BE] text-[#3066BE] rounded-lg font-semibold hover:bg-[#3066BE]/10 transition-all ${compact ? 'py-2 text-[13px]' : 'py-2.5 text-[14px]'}`}
                        >
                            Написать
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewProfile();
                            }}
                            className={`flex-1 bg-[#3066BE] text-white rounded-lg font-semibold hover:bg-[#2757a4] transition-all ${compact ? 'py-2 text-[13px]' : 'py-2.5 text-[14px]'}`}
                        >
                            Посмотреть профиль
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// APPLICANT PROFILE MODAL
// ============================================================
function ApplicantProfileModal({ applicant, onClose, compact = false, mobile = false }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    if (mobile) {
        return (
            <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
                {/* Mobile Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <X size={20} />
                    </button>
                    <h2 className="text-[18px] font-bold flex-1">Профиль кандидата</h2>
                </div>

                {/* Content */}
                <div className="p-4">
                    <FullProfileContent applicant={applicant} compact mobile />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
            <div className={`bg-white rounded-[24px] shadow-2xl ${compact ? 'w-full max-w-[600px]' : 'w-full max-w-[900px]'} max-h-[90vh] overflow-hidden flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className={`font-bold ${compact ? 'text-[20px]' : 'text-[24px]'}`}>Профиль кандидата</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <FullProfileContent applicant={applicant} compact={compact} />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// FULL PROFILE CONTENT
// ============================================================
function FullProfileContent({ applicant, compact = false, mobile = false }) {
    const size = mobile ? 'mobile' : compact ? 'compact' : 'desktop';

    return (
        <div className="space-y-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-4">
                <img
                    src={applicant.avatar || "/user1.png"}
                    alt={applicant.full_name}
                    className={`rounded-full object-cover ${mobile ? 'w-[70px] h-[70px]' : compact ? 'w-[80px] h-[80px]' : 'w-[100px] h-[100px]'}`}
                    onError={(e) => { e.target.src = "/user1.png"; }}
                />

                <div className="flex-1">
                    <h3 className={`font-bold text-black ${mobile ? 'text-[20px]' : compact ? 'text-[22px]' : 'text-[26px]'}`}>
                        {applicant.full_name || "Applicant"}
                    </h3>
                    <p className={`text-gray-600 ${mobile ? 'text-[13px]' : 'text-[15px]'}`}>
                        {applicant.position || "Должность не указана"}
                    </p>

                    {applicant.average_stars > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={mobile ? 14 : 16}
                                    className={`${i < applicant.average_stars ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
                                />
                            ))}
                            <span className={`ml-1 text-gray-600 ${mobile ? 'text-[12px]' : 'text-[14px]'}`}>
                                {applicant.average_stars.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bio */}
            {applicant.bio && (
                <div>
                    <h4 className={`font-bold text-black mb-2 ${mobile ? 'text-[16px]' : 'text-[18px]'}`}>О себе</h4>
                    <p className={`text-gray-700 leading-relaxed ${mobile ? 'text-[13px]' : 'text-[15px]'}`}>
                        {applicant.bio}
                    </p>
                </div>
            )}

            {/* Skills */}
            {applicant.skills && applicant.skills.length > 0 && (
                <div>
                    <h4 className={`font-bold text-black mb-3 ${mobile ? 'text-[16px]' : 'text-[18px]'}`}>Навыки</h4>
                    <div className="flex flex-wrap gap-2">
                        {applicant.skills.map((skill, i) => (
                            <span
                                key={i}
                                className={`bg-[#F0F4FF] text-[#3066BE] rounded-full font-medium border border-[#3066BE]/20 ${mobile ? 'px-3 py-1 text-[12px]' : 'px-4 py-1.5 text-[13px]'}`}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Work Experience */}
            {applicant.experiences && applicant.experiences.length > 0 && (
                <div>
                    <h4 className={`font-bold text-black mb-3 ${mobile ? 'text-[16px]' : 'text-[18px]'}`}>Опыт работы</h4>
                    <div className="space-y-4">
                        {applicant.experiences.map((exp, i) => (
                            <div key={i} className="border-l-2 border-[#3066BE] pl-4">
                                <h5 className={`font-semibold text-black ${mobile ? 'text-[14px]' : 'text-[16px]'}`}>
                                    {exp.position}
                                </h5>
                                <p className={`text-gray-600 ${mobile ? 'text-[12px]' : 'text-[14px]'}`}>
                                    {exp.company_name} • {exp.city}, {exp.country}
                                </p>
                                <p className={`text-gray-500 ${mobile ? 'text-[11px]' : 'text-[13px]'}`}>
                                    {exp.start_date} - {exp.end_date || "Настоящее время"}
                                </p>
                                {exp.description && (
                                    <p className={`text-gray-700 mt-2 ${mobile ? 'text-[12px]' : 'text-[14px]'}`}>
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {applicant.educations && applicant.educations.length > 0 && (
                <div>
                    <h4 className={`font-bold text-black mb-3 ${mobile ? 'text-[16px]' : 'text-[18px]'}`}>Образование</h4>
                    <div className="space-y-3">
                        {applicant.educations.map((edu, i) => (
                            <div key={i} className="border-l-2 border-[#3066BE] pl-4">
                                <h5 className={`font-semibold ${mobile ? 'text-[14px]' : 'text-[16px]'}`}>
                                    {edu.academy_name}
                                </h5>
                                <p className={`text-gray-600 ${mobile ? 'text-[12px]' : 'text-[14px]'}`}>
                                    {edu.degree}
                                </p>
                                <p className={`text-gray-500 ${mobile ? 'text-[11px]' : 'text-[13px]'}`}>
                                    {edu.start_year} - {edu.end_year}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Languages */}
            {applicant.languages && applicant.languages.length > 0 && (
                <div>
                    <h4 className={`font-bold text-black mb-3 ${mobile ? 'text-[16px]' : 'text-[18px]'}`}>Языки</h4>
                    <div className="flex flex-wrap gap-2">
                        {applicant.languages.map((lang, i) => (
                            <span
                                key={i}
                                className={`bg-gray-100 text-gray-700 rounded-lg font-medium ${mobile ? 'px-3 py-1 text-[12px]' : 'px-4 py-2 text-[14px]'}`}
                            >
                                {lang.language} - {lang.level}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Portfolio */}
            {applicant.portfolio_projects && applicant.portfolio_projects.length > 0 && (
                <div>
                    <h4 className={`font-bold text-black mb-3 ${mobile ? 'text-[16px]' : 'text-[18px]'}`}>Портфолио</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {applicant.portfolio_projects.map((project, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-4">
                                <h5 className={`font-semibold mb-2 ${mobile ? 'text-[14px]' : 'text-[16px]'}`}>
                                    {project.title}
                                </h5>
                                <p className={`text-gray-600 mb-2 ${mobile ? 'text-[12px]' : 'text-[14px]'}`}>
                                    {project.description}
                                </p>
                                {project.skills_list && project.skills_list.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {project.skills_list.map((skill, j) => (
                                            <span
                                                key={j}
                                                className={`bg-blue-50 text-blue-600 rounded px-2 py-0.5 ${mobile ? 'text-[10px]' : 'text-[11px]'}`}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
                <div key={i} className={`border border-gray-200 rounded-xl animate-pulse ${compact ? 'p-3' : 'p-5'}`}>
                    <div className="flex gap-4">
                        <div className={`rounded-full bg-gray-200 ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================
function EmptyState({ text, compact = false }) {
    return (
        <div className={`text-center ${compact ? 'py-12' : 'py-20'}`}>
            <div className={`${compact ? 'text-4xl' : 'text-6xl'} mb-4 opacity-50`}>📋</div>
            <p className={`text-gray-400 ${compact ? 'text-base' : 'text-lg'}`}>{text}</p>
        </div>
    );
}

// ============================================================
// FOOTER COMPONENTS
// ============================================================
function Footer() {
    const t = TEXTS.RU;
    return (
        <footer className="w-full h-[393px] relative overflow-hidden">
            <img src="/footer-bg.png" alt="Footer" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

            <div className="relative z-20">
                <div className="max-w-[1440px] mx-auto px-6 py-10 flex gap-[190px] text-white">
                    <div>
                        <h2 className="text-[48px] font-black">{t.logo}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-[184px]">
                        <div className="flex flex-col gap-[20px]">
                            {t.links.slice(0, 4).map((link, idx) => (
                                <a key={idx} href="#" className="flex items-center text-white gap-2 hover:text-[#F2F4FD] transition">
                                    <span>&gt;</span> {link}
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-[20px]">
                            {t.links.slice(4).map((link, idx) => (
                                <a key={idx} href="#" className="flex items-center text-white gap-2 hover:text-[#F2F4FD] transition">
                                    <span>&gt;</span> {link}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#3066BE]/70 h-[103px] rounded-[12px] mx-[38px]">
                    <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center">
                        <p className="text-white">{t.copyright}</p>
                        <div className="flex gap-[20px] text-[24px] text-white">
                            <a href="#" className="text-white"><i className="fab fa-whatsapp"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-facebook"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterTablet() {
    const t = TEXTS.RU;
    return (
        <footer className="relative overflow-hidden mt-[50px]">
            <img src="/footer-bg.png" alt="Footer" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

            <div className="relative z-20 px-6 py-8 text-white">
                <h2 className="text-[36px] font-black mb-6">{t.logo}</h2>

                <div className="grid grid-cols-2 gap-x-10 gap-y-3 mb-6">
                    {t.links.map((link, i) => (
                        <a key={i} href="#" className="flex text-white items-center gap-2 text-[15px] hover:text-[#E7ECFF]">
                            <span>›</span> {link}
                        </a>
                    ))}
                </div>

                <div className="bg-[#3066BE]/70 rounded-[10px] px-4 py-4">
                    <div className="flex justify-between items-center gap-4">
                        <p className="text-[13px] text-white">{t.copyright}</p>
                        <div className="flex gap-4 text-[20px] text-white">
                            <a href="#" className="text-white"><i className="fab fa-whatsapp" /></a>
                            <a href="#" className="text-white"><i className="fab fa-instagram" /></a>
                            <a href="#" className="text-white"><i className="fab fa-facebook" /></a>
                            <a href="#" className="text-white"><i className="fab fa-twitter" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterMobile() {
    const t = TEXTS.RU;
    return (
        <MobileFooter />
    );
}