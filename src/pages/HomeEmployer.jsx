import React, {useEffect, useState} from "react";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import {Plus, Pencil, Trash2} from "lucide-react";
import VacancyModal from "../components/VacancyModal";
import EmployerVacancyModal from "../components/EmployerVacancyModal";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "../components/AvatarUploadModal.jsx";
import CreateCompanyModal from "../components/CreateCompanyModal.jsx";
import axios from "axios";
import api from "../utils/api";
import HomeEmployerTablet from "../components/tablet/HomeEmployer.jsx";
import HomeEmployerMobile from "../components/mobile/HomeEmployerMobile.jsx";

export default function HomeEmployer() {
    // ==========================
    // STATE
    // ==========================
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [selectedLang, setSelectedLang] = useState({flag: "/ru.png", code: "RU"});
    const [showLang, setShowLang] = useState(false);
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

    // ==========================
    // ROLE CHECK
    // ==========================
    useEffect(() => {
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
    }, [navigate]);

    // ==========================
    // FETCH USER & AVATAR
    // ==========================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                console.log("✅ User data:", res.data);
                setUser(res.data);

                if (res.data.profile_image) {
                    const baseURL = api.defaults.baseURL || "http://127.0.0.1:8000";
                    const fullURL = res.data.profile_image.startsWith("http")
                        ? res.data.profile_image
                        : `${baseURL}${res.data.profile_image}`;

                    console.log("✅ Avatar URL:", fullURL);
                    setProfileImage(fullURL);
                    localStorage.setItem("profile_image", fullURL);
                }
            } catch (err) {
                console.error("❌ Foydalanuvchi ma'lumotini olishda xatolik:", err);
            }
        };
        fetchUser();
    }, []);

    // ==========================
    // FETCH VACANCIES
    // ==========================
    const fetchVacancies = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/vacancies/jobposts/");
            console.log("✅ Vacancies API Response:", res.data);

            if (Array.isArray(res.data)) {
                setVacancies({ results: res.data });
            } else if (res.data.results) {
                setVacancies(res.data);
            } else {
                console.error("❌ Noto'g'ri response structure:", res.data);
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

    // ==========================
    // VACANCY HANDLERS
    // ==========================
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
                console.log("✅ Vacancy updated:", res.data);

                setVacancies((prev) => ({
                    ...prev,
                    results: prev.results.map((v) =>
                        v.id === selectedVacancy.id ? res.data : v
                    ),
                }));

                alert("Vakansiya yangilandi ✅");
            } else {
                const res = await api.post("/api/vacancies/jobposts/", payload);
                console.log("✅ Vacancy created:", res.data);

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
            console.error("❌ Error response:", err.response?.data);
            alert("Xatolik yuz berdi: " + (err.response?.data?.detail || err.message));
        }
    };

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

    const handleSaveChanges = () => {
        setIsEditable(false);
    };

    // ==========================
    // GEOLOCATION
    // ==========================
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

    // ==========================
    // HELPERS
    // ==========================
    const capitalizeName = (fullName) => {
        if (!fullName) return "";
        return fullName
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    const texts = {
        RU: {
            community: "Сообщество", vacancies: "Вакансии", chat: "Чат", companies: "Компании",
            login: "Войти", logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО",
                "Инвесторам", "Каталог компаний", "Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
        },
        UZ: {
            community: "Jamiyat", vacancies: "Vakansiyalar", chat: "Chat", companies: "Kompaniyalar",
            login: "Kirish", logo: "Logo",
            links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari",
                "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo'yicha ishlar"],
            copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
        },
        EN: {
            community: "Community", vacancies: "Vacancies", chat: "Chat", companies: "Companies",
            login: "Login", logo: "Logo",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements",
                "For Investors", "Company Catalog", "Jobs by Profession"],
            copyright: "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
        }
    };

    return (
        <>
        {/* MOBILE */}
        <div className="block md:hidden">
            <HomeEmployerMobile />
        </div>

        {/* TABLET */}
        <div className="hidden md:block lg:hidden">
            <HomeEmployerTablet />
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block font-sans relative">
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-10 h-[90px]">
                    <a href="/"><img src="/logo.png" alt="Logo" className="w-[109px] h-[72px] object-contain"/></a>

                    <div className="flex gap-8 font-semibold text-[16px] tracking-wide mx-auto">
                        <a href="/community" className="text-black hover:text-[#3066BE] transition">{texts[langCode].community}</a>
                        <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">{texts[langCode].vacancies}</a>
                        <a href="/chat" className="text-black hover:text-[#3066BE] transition">{texts[langCode].chat}</a>
                        <a href="/companies" className="text-black hover:text-[#3066BE] transition">{texts[langCode].companies}</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center gap-2 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                            <img src={selectedLang.flag} alt={selectedLang.code} className="w-8 h-5 object-cover" />
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                            </svg>
                            {showLang && (
                                <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                    <div onClick={() => { setSelectedLang({ flag: "/ru.png", code: "RU" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/ru.png" alt="RU" className="w-8 h-5" />
                                    </div>
                                    <div onClick={() => { setSelectedLang({ flag: "/uz.png", code: "UZ" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uz.png" alt="UZ" className="w-8 h-5" />
                                    </div>
                                    <div onClick={() => { setSelectedLang({ flag: "/uk.png", code: "EN" }); setShowLang(false); }}
                                         className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center">
                                        <img src="/uk.png" alt="EN" className="w-8 h-5" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>

            {/* BODY */}
            <div className="max-w-7xl w-[1276px] mx-auto px-4 py-8 mt-[100px]">
                {/* USER CARD */}
                <div className="w-full bg-white border border-[#AEAEAE] mt-[67px] min-h-[1006px] rounded-[25px] overflow-hidden">
                    {/* TOP PANEL */}
                    <div className="w-full h-[136px] px-6 py-4 flex items-center justify-between border-b border-[#AEAEAE]">
                        <div className="flex items-center gap-4">
                            <div className="relative w-[70px] h-[70px]">
                                <img
                                    key={profileImage}
                                    src={profileImage || "/user-white.jpg"}
                                    alt="avatar"
                                    className="w-full h-full object-cover rounded-full border"
                                    onError={(e) => {
                                        console.log("❌ Avatar load failed, using fallback");
                                        e.target.src = "/user-white.jpg";
                                    }}
                                />
                                <button
                                    className={`absolute bottom-0 right-0 rounded-full border p-[2px] transition ${
                                        isEditable ? "bg-white cursor-pointer" : "bg-gray-100 cursor-not-allowed opacity-50 border-gray-300"
                                    }`}
                                    onClick={() => { if (isEditable) setIsAvatarModalOpen(true); }}
                                >
                                    <div className="w-[18px] h-[18px] border-none rounded-full flex items-center justify-center cursor-pointer">
                                        <Pencil size={16} stroke="#3066BE" />
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
                                <h2 className="text-[24px] font-bold text-black mt-2">
                                    {user ? capitalizeName(user.full_name) : "Ism yuklanmoqda..."}
                                </h2>
                                <p className="text-[15px] text-[#AEAEAE] font-medium flex items-center gap-1">
                                    <img src="/location.png" alt="loc" className="w-[14px] h-[14px]" />
                                    {location} – {localTime} местное время
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                className={`w-[222px] h-[59px] font-semibold rounded-[10px] transition border ${
                                    isEditable
                                        ? "bg-[#3066BE] text-white hover:bg-[#2653a5]"
                                        : "bg-white text-[#3066BE] hover:bg-[#F0F7FF] border-[#3066BE]"
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

                            <button className="w-[222px] h-[59px] bg-[#3066BE] text-white font-semibold rounded-[10px] hover:bg-[#2452a6] transition">
                                Настройки профиля
                            </button>
                        </div>
                    </div>

                    {/* ANNOUNCEMENTS */}
                    <div className="flex max-w-[1176px] mt-[25px] mx-auto w-full h-auto">
                        <div className="flex items-center justify-between w-full px-6 py-6">
                            <h3 className="text-[24px] font-bold text-black leading-[36px]">
                                Ваше объявления
                            </h3>
                            <div>
                                <div
                                    onClick={() => { if (isEditable) setShowModal(true); }}
                                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition ${
                                        isEditable
                                            ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                            : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                    }`}
                                >
                                    <Plus size={20} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                </div>

                                {showModal && (
                                    <EmployerVacancyModal
                                        onClose={() => {
                                            setShowModal(false);
                                            setSelectedVacancy(null);
                                        }}
                                        vacancy={selectedVacancy}
                                        onSubmit={handleSubmit}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* VACANCY LIST */}
                    <div className="w-full max-h-[700px] overflow-y-auto overflow-x-hidden px-[45px] mt-[25px] flex flex-col mb-[137px]">
                        {loading ? (
                            <div className="w-full flex flex-col items-center justify-center py-32">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3066BE] border-t-transparent"></div>
                                <p className="text-gray-400 mt-6 text-lg font-medium">Загрузка вакансий...</p>
                            </div>
                        ) : vacancies.results.length === 0 ? (
                            <div className="w-full text-center py-20">
                                <p className="text-gray-400 text-xl font-medium">У вас пока нет объявлений</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Нажмите кнопку "+" чтобы создать первую вакансию
                                </p>
                            </div>
                        ) : (
                            vacancies.results.map((vacancy, index) => (
                                <div key={vacancy.id || index} className="w-full rounded-xl p-6 transition">
                                    <hr className="border-t border-[#D9D9D9] mb-6 w-full" />

                                    <div className="flex items-center text-gray-400 text-sm mb-3">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {new Date(vacancy.created_at).toLocaleDateString()}
                                    </div>

                                    <div className="flex items-start justify-between mb-4 gap-4">
                                        <button
                                            onClick={() => setActiveModalIndex(index)}
                                            className="text-2xl font-bold text-black bg-white border-none hover:text-[#3066BE] transition-colors duration-200 text-left break-words flex-1"
                                            style={{
                                                wordWrap: "break-word",
                                                overflowWrap: "break-word",
                                                lineHeight: "1.3"
                                            }}
                                        >
                                            {vacancy.title}
                                        </button>

                                        <div className="flex gap-2 flex-shrink-0">
                                            <div
                                                onClick={() => handleEdit(vacancy)}
                                                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition ${
                                                    isEditable
                                                        ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                }`}
                                            >
                                                <Pencil size={20} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                            </div>

                                            <div
                                                onClick={() => handleDelete(vacancy.id)}
                                                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition ${
                                                    isEditable
                                                        ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                }`}
                                            >
                                                <Trash2 size={20} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <p className="text-[#3066BE] font-bold text-xl">
                                            {vacancy.budget || "Не указано"}
                                        </p>
                                        <span className="text-gray-500 text-sm">
                                                ({vacancy.is_fixed_price ? "Фиксированная" : "Почасовая"})
                                            </span>
                                    </div>

                                    <p className="text-gray-500 mb-4 break-words whitespace-pre-wrap leading-relaxed">
                                        {vacancy.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {vacancy.skills?.map((tag, idx) => (
                                            <span key={idx} className="bg-[#D9D9D9] text-black px-3 py-1 rounded-full text-sm">
                                                    {tag}
                                                </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-10 text-gray-400 text-sm mt-4">
                                        <div className="flex items-center gap-2 relative">
                                            <img src="/badge-background.svg" alt="bg" className="w-6 h-6" />
                                            <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[6px] left-[6px]" />
                                            <span>{vacancy.is_fixed_price ? "Фиксированная" : "Почасовая"}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[...Array(4)].map((_, i) => (
                                                <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                                                    <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                                </svg>
                                            ))}
                                            <svg className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                            </svg>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <img src="/location.png" alt="location" className="w-5 h-5" />
                                            <span>{vacancy.is_remote ? "Удалённо" : (vacancy.location || "Локация не указана")}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* COMPANIES SECTION */}
                <div className="w-[1246px] bg-white border border-[#AEAEAE] mt-[67px] mb-[50px] rounded-[25px] overflow-visible">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[#AEAEAE] h-[94.5px]">
                        <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">
                            Компании
                        </h3>

                        {/* ✅ Faqat kompaniya yo'q bo'lsa tugma ko'rsatiladi */}
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

{/* MODALS */}
{activeModalIndex !== null && (
        <VacancyModal
            onClose={() => setActiveModalIndex(null)}
            vacancy={vacancies.results[activeModalIndex]}
        />
    )}

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

{/* FOOTER */}
    <footer className="w-full h-[393px] relative overflow-hidden">
        <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

        <div className="relative z-20">
            <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                <div className="flex gap-[190px]">
                    <div>
                        <h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">
                            {texts[langCode].logo}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-[184px]">
                        <div className="flex flex-col gap-[20px]">
                            {texts[langCode].links.slice(0,4).map((link, idx) => (
                                <a key={idx} href="#" className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                    <span>&gt;</span> {link}
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-[20px]">
                            {texts[langCode].links.slice(4).map((link, idx) => (
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
                    <p>{texts[langCode].copyright}</p>

                    <div className="flex gap-[20px] text-[24px] mr-[38px]">
                        <a href="#" className="text-white"><i className="fab fa-whatsapp hover:text-[#F2F4FD]"></i></a>
                        <a href="#" className="text-white"><i className="fab fa-instagram hover:text-[#F2F4FD]"></i></a>
                        <a href="#" className="text-white"><i className="fab fa-facebook hover:text-[#F2F4FD]"></i></a>
                        <a href="#" className="text-white"><i className="fab fa-twitter hover:text-[#F2F4FD]"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div>
</>
);
}