// src/pages/tablet/HomeEmployerApplicationsTablet.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarTabletLogin from "../tablet/NavbarTabletLogIn.jsx";
import api from "../../utils/api";
import { chatApi } from "../../utils/chat.js";
import {
    fetchJobApplicants,
    fetchEmployerApplications,
    normalizeApplicants,
} from "../../utils/applicationsApi";
import {Pencil, Plus, Trash2} from "lucide-react";
import ChangeProfileImageModal from "../AvatarUploadModal.jsx";
import ApplicationsBodyTablet from "./ApplicationsBodyTablet.jsx";
import axios from "axios";
import UserSearch from "./UserSearchTablet.jsx";

export default function HomeEmployerApplicationsTablet() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profileImage, setProfileImage] = useState(localStorage.getItem("profile_image") || null);
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

    // const navigate = useNavigate();

    const totalPages = Math.max(1, Math.ceil((count || 0) / 10));
    // const AVATAR_FALLBACK = "/user.png";

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError("");
            try {
                const data = jobId
                    ? await fetchJobApplicants(jobId, page)
                    : await fetchEmployerApplications({ page });
                if (!cancelled) {
                    setItems(normalizeApplicants(data));
                    setCount(data?.count || 0);
                }
            } catch (e) {
                if (!cancelled) setError(e?.response?.data?.detail || e?.message || "Xatolik yuz berdi");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [jobId, page]);

    async function onWrite(appId) {
        try {
            const room = await chatApi.getOrCreateByApplication(appId);
            navigate(`/chat?room=${room.id}`, { state: { peer: room.peer, ts: Date.now() } });
        } catch (e) {
            console.error(e);
            alert("Chat xonasini ochishda xatolik.");
        }
    }

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await api.get("/api/auth/profile/");
                const userRole = response.data?.role;

                if (userRole === "JOB_SEEKER") navigate("/profile");
                else if (userRole === "EMPLOYER") navigate("/home-employer");
            } catch (err) {
                console.error("Profil olishda xatolik:", err);
            }
        };
        getProfile();
    }, [navigate]);

    // Vacancies
    const fetchVacancies = async () => {
        try {
            const res = await api.get("/api/vacancies/jobposts/");
            setVacancies(res.data);
        } catch (err) {
            console.error("Vakansiyalarni olishda xatolik:", err);
        }
    };
    useEffect(() => { fetchVacancies(); }, []);

    const handleEdit = (vacancy) => {
        if (!isEditable) return;
        setSelectedVacancy(vacancy);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!isEditable) return;
        const ok = window.confirm("Rostdan ham ushbu vakansiyani o‘chirmoqchimisiz?");
        if (!ok) return;
        try {
            await api.delete(`/api/vacancies/jobposts/${id}/`);
            setVacancies((prev) => ({
                ...prev,
                results: prev.results.filter((v) => v.id !== id),
            }));
            alert("Vakansiya muvaffaqiyatli o‘chirildi!");
        } catch (err) {
            console.error("Vakansiyani o‘chirishda xatolik:", err);
            alert("O‘chirishda xatolik yuz berdi!");
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
                await api.patch(`/api/vacancies/jobposts/${selectedVacancy.id}/`, payload);
                alert("Vakansiya yangilandi!");
            } else {
                await api.post("/api/vacancies/jobposts/", payload);
                alert("Vakansiya yaratildi!");
            }
            setShowModal(false);
            setSelectedVacancy(null);
            await fetchVacancies();
        } catch (err) {
            console.error("Vakansiyani saqlashda xatolik:", err);
        }
    };

    // Companies
    const fetchCompanies = async () => {
        try {
            const response = await api.get("/api/companies/");
            const data = Array.isArray(response.data) ? response.data : response.data.results;
            setCompanies(data || []);
        } catch (err) {
            console.error("Kompaniyalarni olishda xatolik:", err);
        }
    };
    useEffect(() => { fetchCompanies(); }, []);

    const handleEditCompanies = (company) => {
        if (!isEditable) return;
        setSelectedCompany(company);
        setShowCompanyModal(true);
    };
    const handleDeleteCompanies = async (companyId) => {
        if (!isEditable) return;
        const ok = window.confirm("Kompaniyani o‘chirmoqchimisiz?");
        if (!ok) return;
        try {
            await api.delete(`/api/companies/${companyId}/`);
            alert("Kompaniya o‘chirildi!");
            fetchCompanies();
        } catch (err) {
            console.error("❌ O‘chirishda xatolik:", err.response?.data || err.message);
            alert("Xatolik: " + JSON.stringify(err.response?.data));
        }
    };

    // User
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);
            } catch (err) {
                console.error("Foydalanuvchi ma'lumotini olishda xatolik:", err);
            }
        };
        fetchUser();
    }, []);

    const capitalizeName = (fullName) =>
        (!fullName ? "" : fullName.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));

    // Geolocation (1 ta, ixcham)
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const { latitude, longitude } = coords;
            try {
                await api.post("/api/auth/update-location/", { latitude, longitude });
            } catch (e) {
                console.error("Joylashuv yuborishda xatolik:", e);
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
            const time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            setLocalTime(time);
        }, (error) => {
            console.error("Geolokatsiya rad etildi:", error);
            setLocation("Joylashuv bloklangan");
        });
    }, []);

    // ===== Fallbacklar + helperlar
    const AVATAR_FALLBACK = "/user.png";
    const COMPANY_FALLBACK = "/company-fallback.svg";

    const cleanImg = (val) => {
        if (!val) return null;
        const s = String(val).trim();
        if (!s || s === "null" || s === "None" || s === "undefined") return null;
        if (s.endsWith("/None") || s.endsWith("/null")) return null;
        return s;
    };

    const onImgError = (e, fallback) => {
        e.currentTarget.onerror = null; // loop bo‘lmasin
        e.currentTarget.src = fallback;
    };


    const fmtName = (name) =>
        !name ? "—" : name.split(" ").map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(" ");

    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    const texts = {
        RU: { community: "Сообщество", vacancies: "Вакансии", chat: "Чат", companies: "Компании", login: "Войти",
            logo: "Logo", links: ["Помощь","Наши вакансии","Реклама на сайте","Требования к ПО","Инвесторам","Каталог компаний","Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            viewMore: "Посмотреть все →",
        },
        UZ: { community: "Jamiyat", vacancies: "Vakansiyalar", chat: "Chat", companies: "Kompaniyalar", login: "Kirish",
            logo: "Logo", links: ["Yordam","Bizning vakantiyalar","Saytda reklama","Dasturiy ta'minot talablari","Investorlar uchun","Kompaniyalar katalogi","Kasblar bo‘yicha ishlar"],
            copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            viewMore: "Hammasini ko‘rish →",
        },
        EN: { community: "Community", vacancies: "Vacancies", chat: "Chat", companies: "Companies", login: "Login",
            logo: "Logo", links: ["Help","Our Vacancies","Advertising on site","Software Requirements","For Investors","Company Catalog","Jobs by Profession"],
            copyright: "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            viewMore: "View all →",
        },
    };

    return (
        <div className="hidden md:block lg:hidden bg-white min-h-screen font-sans">
            <NavbarTabletLogin />

            {/* HEADER SPACE */}
            <div className="h-[84px]" />

            {/* ========================== */}
            {/*        NOTIFICATION        */}
            {/* ========================== */}
            <div className="bg-white py-3 md:py-2 mt-[-60px]">
                <div className="mx-auto w-full max-w-[960px] px-3 md:px-4 flex items-center justify-end">
                    <div className="flex items-center gap-4 md:gap-3">
                        {/* Bell */}
                        <div className="relative cursor-pointer mr-[15px]">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">1</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="mx-auto max-w-[960px] px-4 py-4">
                {/* USER CARD */}
                <div className="w-full bg-white border border-[#E3E6EA] rounded-[20px] overflow-hidden">
                    {/* Top bar */}
                    <div className="w-full px-4 py-4 flex items-center justify-between border-b border-[#E3E6EA]">
                        {/* Left: Avatar + name + location */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-[64px] h-[64px]">
                                <img
                                    key={profileImage}
                                    src={cleanImg(profileImage) || AVATAR_FALLBACK}
                                    onError={(e) => onImgError(e, AVATAR_FALLBACK)}
                                    alt="avatar"
                                    className="w-full h-full object-cover rounded-full border"
                                />
                            </div>


                            {isAvatarModalOpen && (
                                <ChangeProfileImageModal
                                    isOpen={isAvatarModalOpen}
                                    onClose={() => setIsAvatarModalOpen(false)}
                                    setProfileImage={setProfileImage}
                                />
                            )}

                            <div>
                                <h2 className="text-[18px] font-bold text-black">
                                    {user ? capitalizeName(user.full_name) : "Ism yuklanmoqda..."}
                                </h2>
                                <p className="text-[12px] text-[#6B7280] font-medium flex items-center gap-1">
                                    <img src="/location.png" alt="loc" className="w-[12px] h-[12px]" />
                                    {location} — {localTime} местное время
                                </p>
                            </div>
                        </div>

                        {/* Right: buttons */}
                        <div className="flex gap-2">
                            <button className="px-3 h-[42px] text-[13px] bg-[#3066BE] text-white font-semibold rounded-[10px] hover:bg-[#2452a6]">
                                Настройки профиля
                            </button>
                        </div>
                    </div>

                    <ApplicationsBodyTablet
                        items={items}
                        loading={loading}
                        error={error}
                        page={page}
                        totalPages={totalPages}
                        onPrev={() => setPage(p => Math.max(1, p - 1))}
                        onNext={() => setPage(p => p + 1)}
                        onWrite={(id) => onClickWrite(id)}
                        onViewProfile={(id) => navigate(`/applicants/by-application/${id}`)}
                    />

                </div>

                {/* COMPANIES */}
                <div className="w-full bg-white border border-[#E3E6EA] rounded-[20px] mt-6 overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-4 border-b border-[#E3E6EA]">
                        <h3 className="text-[18px] font-bold text-[#000]">Компании</h3>
                        <div
                            onClick={() => { if (isEditable) setShowCompanyModal(true); }}
                            className={`w-[26px] h-[26px] border rounded-full flex items-center justify-center transition ${
                                isEditable ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                            }`}
                        >
                            <Plus size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                        </div>
                    </div>

                    {companies.length > 0 ? (
                        <div className="px-2 pb-2">
                            <div className="max-h-[520px] overflow-y-auto pr-1">
                                {companies.map((company) => (
                                    <div key={company.id} className="rounded-[10px] p-4">
                                        <hr className="border-t border-[#D9D9D9] mb-4" />
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0">
                                                <h4 className="text-[15px] font-semibold text-[#000] truncate">{company.name}</h4>
                                                <p className="text-[12px] text-gray-500">{company.industry}</p>
                                                <p className="text-[12px] text-gray-500 break-words">{company.website}</p>
                                                <p className="text-[12px] text-gray-500">{company.location}</p>
                                                <img src={company.logo} alt="Logo" className="w-10 h-10 object-cover rounded-full mt-2" />
                                            </div>

                                            <div className="flex gap-2 shrink-0">
                                                <div
                                                    onClick={() => handleEditCompanies(company)}
                                                    className={`w-[28px] h-[28px] border rounded-full flex items-center justify-center transition ${
                                                        isEditable ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Pencil size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>

                                                <div
                                                    onClick={() => handleDeleteCompanies(company.id)}
                                                    className={`w-[28px] h-[28px] border rounded-full flex items-center justify-center transition ${
                                                        isEditable ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Trash2 size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 text-sm my-6">Kompaniyalar mavjud emas.</div>
                    )}
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
        </div>
    );
}
