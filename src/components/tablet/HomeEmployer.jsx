import React, { useEffect, useState } from "react";
import ProfileDropdown from "../../components/ProfileDropdown.jsx";
import { Plus, Pencil, Trash2 } from "lucide-react";
import EmployerVacancyModal from "../../components/EmployerVacancyModal";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "../../components/AvatarUploadModal.jsx";
import CreateCompanyModal from "../../components/CreateCompanyModal.jsx";
import axios from "axios";
import api from "../../utils/api";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";
import VacancyTabletModal from "../../components/tablet/VacancyTabletModal.jsx";

export default function HomeEmployerTablet({ viewOnly = false, targetUserId = null }) {
    // STATE (kod o'zgarmaydi)
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [vacancies, setVacancies] = useState({ results: [] });
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [user, setUser] = useState(null);
    const [location, setLocation] = useState("Joylashuv aniqlanmoqda...");
    const [localTime, setLocalTime] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const canEdit = !viewOnly;

    // ✅ YANGI: targetUserId o'zgarganda employer ma'lumotlarini qayta yuklash
    useEffect(() => {
        if (viewOnly && targetUserId) {
            console.log("🔄 HomeEmployerTablet: Loading employer profile for:", targetUserId);
            
            setUser(null);
            setProfileImage(null);
            setVacancies({ results: [] });
            setCompanies([]);
            setLocation("Joylashuv aniqlanmoqda...");
            setLoading(true);

            const loadEmployerData = async () => {
                try {
                    const res = await api.get(`/api/auth/profile/${targetUserId}/`);
                    setUser(res.data);

                    if (res.data.avatar || res.data.profile_image) {
                        const avatarUrl = res.data.avatar || res.data.profile_image;
                        const fullUrl = avatarUrl.startsWith("http")
                            ? avatarUrl
                            : `${api.defaults.baseURL}${avatarUrl}`;
                        setProfileImage(fullUrl);
                    }

                    // Employer vakansiyalari
                    try {
                        const vacanciesRes = await api.get("/api/vacancies/jobposts/", {
                            params: { employer: targetUserId }
                        });
                        
                        if (Array.isArray(vacanciesRes.data)) {
                            setVacancies({ results: vacanciesRes.data });
                        } else if (vacanciesRes.data.results) {
                            setVacancies(vacanciesRes.data);
                        } else {
                            setVacancies({ results: [] });
                        }
                    } catch (vacErr) {
                        console.error("❌ Vakansiyalarni yuklashda xatolik:", vacErr);
                        try {
                            const allVacanciesRes = await api.get("/api/vacancies/jobposts/");
                            const allVacancies = Array.isArray(allVacanciesRes.data) 
                                ? allVacanciesRes.data 
                                : (allVacanciesRes.data.results || []);
                            
                            const employerVacancies = allVacancies.filter(
                                v => String(v.employer?.id) === String(targetUserId) || 
                                     String(v.created_by) === String(targetUserId) ||
                                     String(v.user?.id) === String(targetUserId)
                            );
                            setVacancies({ results: employerVacancies });
                        } catch (filterErr) {
                            setVacancies({ results: [] });
                        }
                    }

                    // Employer kompaniyalari
                    try {
                        const companiesRes = await api.get("/api/companies/", {
                            params: { owner: targetUserId }
                        });
                        
                        const companiesData = Array.isArray(companiesRes.data) 
                            ? companiesRes.data 
                            : (companiesRes.data.results || []);
                        setCompanies(companiesData);
                    } catch (compErr) {
                        try {
                            const allCompaniesRes = await api.get("/api/companies/");
                            const allCompanies = Array.isArray(allCompaniesRes.data) 
                                ? allCompaniesRes.data 
                                : (allCompaniesRes.data.results || []);
                            
                            const employerCompanies = allCompanies.filter(
                                c => String(c.owner?.id) === String(targetUserId) || 
                                     String(c.created_by) === String(targetUserId) ||
                                     String(c.user?.id) === String(targetUserId)
                            );
                            setCompanies(employerCompanies);
                        } catch (filterErr) {
                            setCompanies([]);
                        }
                    }

                    setLoading(false);
                } catch (err) {
                    console.error("❌ Employer profil yuklashda xatolik:", err);
                    setLoading(false);
                }
            };

            loadEmployerData();
        }
    }, [targetUserId, viewOnly]);

    // ✅ ROLE CHECK - viewOnly mode'da role check qilmaslik
    useEffect(() => {
        // viewOnly mode'da role check qilmaslik
        if (viewOnly && targetUserId) {
            return;
        }

        const getProfile = async () => {
            try {
                const response = await api.get("/api/auth/profile/");
                const userRole = response.data?.role;
                if (userRole === "JOB_SEEKER") {
                    navigate("/profile");
                } else if (userRole !== "EMPLOYER") {
                    console.error("Nomaʼlum rol:", userRole);
                }
            } catch (err) {
                console.error("Profil olishda xatolik:", err);
            }
        };
        getProfile();
    }, [navigate, viewOnly, targetUserId]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);
                if (res.data.profile_image) {
                    const baseURL = api.defaults.baseURL || "http://127.0.0.1:8000";
                    const fullURL = res.data.profile_image.startsWith("http")
                        ? res.data.profile_image
                        : `${baseURL}${res.data.profile_image}`;
                    setProfileImage(fullURL);
                    localStorage.setItem("profile_image", fullURL);
                }
            } catch (err) {
                console.error("❌ Foydalanuvchi ma'lumotini olishda xatolik:", err);
            }
        };
        fetchUser();
    }, []);

    const fetchVacancies = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/vacancies/jobposts/");
            if (Array.isArray(res.data)) {
                setVacancies({ results: res.data });
            } else if (res.data.results) {
                setVacancies(res.data);
            } else {
                setVacancies({ results: [] });
            }
        } catch (err) {
            console.error("❌ Vakansiyalarni olishda xatolik:", err);
            setVacancies({ results: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacancies();
    }, []);

    const handleEdit = (vacancy) => {
        if (!isEditable) return;
        setSelectedVacancy(vacancy);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!isEditable) return;
        const confirm = window.confirm("Rostdan ham ushbu vakansiyani o'chirmoqchimisiz?");
        if (!confirm) return;
        try {
            await api.delete(`/api/vacancies/jobposts/${id}/`);
            setVacancies((prev) => ({
                ...prev,
                results: prev.results.filter((vacancy) => vacancy.id !== id),
            }));
            alert("Vakansiya muvaffaqiyatli o'chirildi ✅");
        } catch (err) {
            console.error("❌ Vakansiyani o'chirishda xatolik:", err);
            alert("O'chirishda xatolik yuz berdi!");
        }
    };

    const handleSubmit = async (formData) => {
        const payload = {
            title: formData.title,
            description: formData.description,
            budget_min: formData.budget_min,
            budget_max: formData.budget_max,
            is_fixed_price: formData.is_fixed_price,
            skills: formData.skills,
            location: formData.location,
            is_remote: formData.is_remote,
            duration: formData.duration,
        };

        try {
            if (selectedVacancy) {
                const res = await api.patch(`/api/vacancies/jobposts/${selectedVacancy.id}/`, payload);
                setVacancies((prev) => ({
                    ...prev,
                    results: prev.results.map((v) => v.id === selectedVacancy.id ? res.data : v),
                }));
                alert("Vakansiya yangilandi ✅");
            } else {
                const res = await api.post("/api/vacancies/jobposts/", payload);
                setVacancies((prev) => ({
                    ...prev,
                    results: [res.data, ...prev.results],
                }));
                alert("Vakansiya yaratildi ✅");
            }
            setShowModal(false);
            setSelectedVacancy(null);
        } catch (err) {
            console.error("❌ Vakansiyani saqlashda xatolik:", err);
            alert("Xatolik yuz berdi: " + (err.response?.data?.detail || err.message));
        }
    };

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
            console.error("❌ O'chirishda xatolik:", err);
            alert("Xatolik: " + JSON.stringify(err.response?.data));
        }
    };

    const handleSaveChanges = () => {
        setIsEditable(false);
    };

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    await api.post("/api/auth/update-location/", { latitude, longitude });
                } catch (err) {
                    console.error("Joylashuv yuborishda xatolik:", err);
                }
                try {
                    const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                        params: { format: "json", lat: latitude, lon: longitude },
                    });
                    const address = res.data.address;
                    const city = address.city || address.town || address.village || "Noma'lum shahar";
                    const country = address.country || "Noma'lum davlat";
                    setLocation(`${city}, ${country}`);
                } catch (err) {
                    console.error("Manzilni aniqlashda xatolik:", err);
                    setLocation("Noma'lum joylashuv");
                }
                const time = new Date().toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                setLocalTime(time);
            },
            (error) => {
                console.error("Geolokatsiya rad etildi:", error);
                setLocation("Joylashuv bloklangan");
            }
        );
    }, []);

    const capitalizeName = (fullName) => {
        if (!fullName) return "";
        return fullName
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const texts = {
        community: "Сообщество", 
        vacancies: "Вакансии", 
        chat: "Чат", 
        companies: "Компании",
        login: "Войти", 
        logo: "Logo",
        links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО",
            "Инвесторам", "Каталог компаний", "Работа по профессиям"],
        copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
    };

    return (
        <div className="hidden md:block lg:hidden bg-[#F4F6FA] min-h-screen font-sans">
            <NavbarTabletLogin />

            {/* HEADER SPACE */}
            <div className="h-[90px]" />

            {/* ✅ BODY - Perfectly centered with equal margins */}
            <div className="mx-auto max-w-[750px] px-8 py-5">
                {/* USER CARD */}
                <div className="w-full bg-white border border-[#E3E6EA] rounded-[20px] overflow-hidden shadow-sm">
                    {/* Top bar */}
                    <div className="w-full px-6 py-5 flex items-center justify-between border-b border-[#E3E6EA]">
                        <div className="flex items-center gap-4">
                            <div className="relative w-[70px] h-[70px]">
                                <img
                                    key={profileImage}
                                    src={profileImage || "/user-white.jpg"}
                                    alt="avatar"
                                    className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                                    onError={(e) => {
                                        e.target.src = "/user-white.jpg";
                                    }}
                                />
                                <button
                                    className={`absolute bottom-0 right-0 rounded-full border-2 p-[2px] transition ${
                                        isEditable ? "bg-white cursor-pointer border-[#3066BE]" : "bg-gray-100 cursor-not-allowed opacity-50 border-gray-300"
                                    }`}
                                    onClick={() => { if (isEditable) setIsAvatarModalOpen(true); }}
                                >
                                    <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        <Pencil size={14} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                    </div>
                                </button>
                            </div>

                            {isAvatarModalOpen && (
                                <ChangeProfileImageModal
                                    isOpen={isAvatarModalOpen}
                                    onClose={() => setIsAvatarModalOpen(false)}
                                    setProfileImage={setProfileImage}
                                />
                            )}

                            <div>
                                <h2 className="text-[18px] font-bold text-black mb-0.5">
                                    {user ? capitalizeName(user.full_name) : "Ism yuklanmoqda..."}
                                </h2>
                                <p className="text-[12px] text-[#6B7280] font-medium flex items-center gap-1.5">
                                    <img src="/location.png" alt="loc" className="w-[13px] h-[13px]" />
                                    {location} — {localTime} местное время
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <button
                                className={`px-4 h-[44px] text-[13px] font-semibold rounded-[10px] transition border-2 ${
                                    isEditable
                                        ? "bg-[#3066BE] text-white border-[#3066BE] hover:bg-[#2653a5]"
                                        : "bg-white text-[#3066BE] border-[#3066BE] hover:bg-[#F0F7FF]"
                                }`}
                                onClick={() => {
                                    if (isEditable) {
                                        handleSaveChanges();
                                        window.location.reload();
                                    } else {
                                        setIsEditable(true);
                                    }
                                }}
                            >
                                {isEditable ? "Сохранить" : "Предпросмотр"}
                            </button>

                            <button className="px-4 h-[44px] text-[13px] bg-[#3066BE] text-white font-semibold rounded-[10px] hover:bg-[#2452a6] transition">
                                Настройки профиля
                            </button>
                        </div>
                    </div>

                    {/* Announcements header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E6EA]/50">
                        <h3 className="text-[17px] font-bold text-black">Ваше объявления</h3>

                        <div
                            onClick={() => { if (isEditable) setShowModal(true); }}
                            className={`w-[28px] h-[28px] rounded-full border-2 flex items-center justify-center transition ${
                                isEditable
                                    ? "cursor-pointer hover:bg-[#3066BE]/10 border-[#3066BE]"
                                    : "cursor-not-allowed opacity-50 border-gray-300"
                            }`}
                        >
                            <Plus size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} strokeWidth={2.5} />
                        </div>

                        {showModal && (
                            <EmployerVacancyModal
                                onClose={() => { setShowModal(false); setSelectedVacancy(null); }}
                                vacancy={selectedVacancy}
                                onSubmit={handleSubmit}
                            />
                        )}
                    </div>

                    {/* Vacancies list */}
                    <div className="px-5 py-3">
                        <div className="max-h-[520px] overflow-y-auto pr-1">
                            {loading ? (
                                <div className="w-full flex flex-col items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3066BE] border-t-transparent"></div>
                                    <p className="text-gray-400 mt-4 text-sm font-medium">Загрузка вакансий...</p>
                                </div>
                            ) : vacancies.results.length === 0 ? (
                                <div className="w-full text-center py-16">
                                    <p className="text-gray-400 text-base font-medium">У вас пока нет объявлений</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Нажмите кнопку "+" чтобы создать первую вакансию
                                    </p>
                                </div>
                            ) : (
                                vacancies.results.map((vacancy, index) => (
                                    <div key={vacancy.id ?? index} className="rounded-xl p-4 mb-2 hover:bg-gray-50/50 transition">
                                        {index > 0 && <hr className="border-t border-[#E3E6EA] mb-4 -mt-2" />}

                                        <div className="flex items-center text-gray-400 text-[11px] mb-2">
                                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {new Date(vacancy.created_at).toLocaleDateString()}
                                        </div>

                                        <div className="flex items-start justify-between mb-2 gap-3">
                                            <button
                                                onClick={() => setActiveModalIndex(index)}
                                                className="text-[15px] font-bold text-black bg-transparent border-none hover:text-[#3066BE] text-left transition flex-1 leading-snug"
                                            >
                                                {vacancy.title}
                                            </button>

                                            <div className="flex gap-2 shrink-0">
                                                <div
                                                    onClick={() => handleEdit(vacancy)}
                                                    className={`w-[28px] h-[28px] border-2 rounded-full flex items-center justify-center transition ${
                                                        isEditable ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Pencil size={14} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>

                                                <div
                                                    onClick={() => handleDelete(vacancy.id)}
                                                    className={`w-[28px] h-[28px] border-2 rounded-full flex items-center justify-center transition ${
                                                        isEditable ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Trash2 size={14} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-[#3066BE] font-semibold text-[13px] mb-2">
                                            {vacancy.budget || "Не указано"} <span className="text-gray-500 font-normal text-[12px]">({vacancy.is_fixed_price ? "Фиксированная" : "Почасовая"})</span>
                                        </p>

                                        <p className="text-gray-700 text-[12px] mb-3 leading-relaxed line-clamp-2">
                                            {vacancy.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {vacancy.skills?.map((tag, i) => (
                                                <span key={i} className="bg-[#F3F4F6] border border-gray-200 text-black px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                                                {tag}
                                            </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-gray-500 text-[11px]">
                                            <div className="flex items-center gap-1.5">
                                                <img src="/badge-background.svg" alt="bg" className="w-4 h-4" />
                                                <span>{vacancy.is_fixed_price ? "Фиксированная" : "Почасовая"}</span>
                                            </div>

                                            <div className="flex items-center gap-0.5">
                                                {[...Array(4)].map((_, i) => (
                                                    <svg key={i} className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
                                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                                    </svg>
                                                ))}
                                                <svg className="w-3 h-3 fill-gray-300" viewBox="0 0 20 20">
                                                    <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                                </svg>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <img src="/location.png" alt="location" className="w-3 h-3" />
                                                <span className="truncate max-w-[120px]">{vacancy.is_remote ? "Удалённо" : (vacancy.location || "Локация не указана")}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* COMPANIES */}
                <div className="w-full bg-white border border-[#E3E6EA] rounded-[20px] mt-5 overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[#E3E6EA]">
                        <h3 className="text-[17px] font-bold text-[#000]">Компании</h3>

                        {companies.length === 0 && (
                            <div
                                onClick={() => { if (isEditable) setShowCompanyModal(true); }}
                                className={`w-[28px] h-[28px] border-2 rounded-full flex items-center justify-center transition ${
                                    isEditable ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                }`}
                            >
                                <Plus size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} strokeWidth={2.5} />
                            </div>
                        )}
                    </div>

                    {companies.length > 0 ? (
                        <div className="px-5 py-3">
                            <div className="max-h-[420px] overflow-y-auto pr-1">
                                {companies.map((company, idx) => (
                                    <div key={company.id} className="rounded-xl p-4 mb-2 hover:bg-gray-50/50 transition">
                                        {idx > 0 && <hr className="border-t border-[#E3E6EA] mb-4 -mt-2" />}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                                {/* Logo */}
                                                <div className="flex-shrink-0">
                                                    {company.logo ? (
                                                        <img
                                                            src={company.logo}
                                                            alt={company.name}
                                                            className="w-12 h-12 object-cover rounded-xl border-2 border-gray-200"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextElementSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}

                                                    <div
                                                        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                                        style={{ display: company.logo ? 'none' : 'flex' }}
                                                    >
                                                        {company.name?.charAt(0)?.toUpperCase() || 'C'}
                                                    </div>
                                                </div>

                                                {/* Company details */}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-[14px] font-semibold text-[#000] mb-1 truncate">{company.name}</h4>
                                                    <p className="text-[11px] text-gray-600 mb-0.5">
                                                        <span className="font-semibold">Industry:</span> {company.industry || 'Not specified'}
                                                    </p>

                                                    {company.website && (

                                                        <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] text-[#3066BE] hover:underline block mb-0.5 truncate"
                                                        >
                                                        🌐 {company.website}
                                                        </a>
                                                        )}

                                                    <p className="text-[11px] text-gray-600 flex items-center gap-1">
                                                        <img src="/location.png" alt="location" className="w-3 h-3" />
                                                        <span className="truncate">{company.location || 'Location not specified'}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2 shrink-0 ml-2">
                                                <div
                                                    onClick={() => handleEditCompanies(company)}
                                                    className={`w-[28px] h-[28px] border-2 rounded-full flex items-center justify-center transition ${
                                                        isEditable ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Pencil size={14} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>

                                                <div
                                                    onClick={() => handleDeleteCompanies(company.id)}
                                                    className={`w-[28px] h-[28px] border-2 rounded-full flex items-center justify-center transition ${
                                                        isEditable ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Trash2 size={14} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                            </div>
                        </div>
                        ) : (
                        <div className="text-center text-gray-400 py-14">
                        <p className="font-medium text-sm">Компанияlar мавжуд эмас</p>
                        <p className="text-xs mt-1.5">
                    {isEditable
                        ? 'Янги компания қўшиш учун "+" тугмасини босинг'
                        : 'Компания яратиш учун "Предпросмотр" режимини ёқинг'}
                </p>
            </div>
            )}
        </div>
</div>

    {/* FOOTER */}
    <footer className="relative overflow-hidden md:block lg:hidden mt-[60px] w-full">
        <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

        <div className="relative z-20 w-full px-8 py-10 text-white max-w-[1024px] mx-auto">
            <div className="flex flex-col gap-8">
                <h2 className="text-[40px] font-black">{texts.logo}</h2>

                <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                    {texts.links.slice(0, 4).map((link, i) => (
                        <a key={`l-${i}`} href="#" className="text-white flex items-center gap-2 text-[16px] hover:text-[#E7ECFF] transition-colors">
                            <span>›</span> {link}
                        </a>
                    ))}
                    {texts.links.slice(4).map((link, i) => (
                        <a key={`r-${i}`} href="#" className="text-white flex items-center gap-2 text-[16px] hover:text-[#E7ECFF] transition-colors">
                            <span>›</span> {link}
                        </a>
                    ))}
                </div>
            </div>

            <div className="mt-8 bg-[#3066BE]/70 rounded-[12px] px-6 py-5 w-full">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-[14px] leading-snug">{texts.copyright}</p>
                    <div className="flex items-center gap-5 text-[22px]">
                        <a href="#" className="text-white hover:opacity-90"><i className="fab fa-whatsapp" /></a>
                        <a href="#" className="text-white hover:opacity-90"><i className="fab fa-instagram" /></a>
                        <a href="#" className="text-white hover:opacity-90"><i className="fab fa-facebook" /></a>
                        <a href="#" className="text-white hover:opacity-90"><i className="fab fa-twitter" /></a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    {/* MODALS */}
    {activeModalIndex !== null && (
        <VacancyTabletModal
            onClose={() => setActiveModalIndex(null)}
            vacancy={vacancies.results[activeModalIndex]}
        />
    )}

    {showCompanyModal && (
        <CreateCompanyModal
            onClose={() => { setShowCompanyModal(false); setSelectedCompany(null); }}
            onSuccess={fetchCompanies}
            company={selectedCompany}
        />
    )}
</div>
);
}