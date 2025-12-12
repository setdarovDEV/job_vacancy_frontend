import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, PlusCircle, ArrowUpDown, X } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

import ProfilePortfolioModal from "./ProfilePortfolioModalTablet.jsx";
import ChangeProfileImageModal from "../../components/AvatarUploadModal";
import ProfileLeftPane from "./ProfileLeftPanel.jsx";
import ProfileRightPane from "./ProfileRightPanel.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SkillEditModal from "../../components/SkillEditModal";
import CertificateModal from "./CertificateModalTablet.jsx";
import ExperienceSectionModal from "./ExperienceSectionTablet.jsx";
import api from "../../utils/api";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";



// ==========================
// COMPONENT START
// ==========================
export default function ProfileTabletPage() {
    // ==========================
    // STATE
    // ==========================
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu] = useState(false);
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(localStorage.getItem("profile_image") || null);
    const [user, setUser] = useState(null);
    const [location, setLocation] = useState("Joylashuv aniqlanmoqda...");
    const [localTime, setLocalTime] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [workHours, setWorkHours] = useState("");
    const [tempValue, setTempValue] = useState("");
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [skills, setSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    const { id } = useParams(); // /profiles/:id dan keladi (boshqa user)
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [certificates, setCertificates] = useState([]);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);


    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await api.get("/api/auth/profile/");
                const data = res.data;

                if (data.profile_image) {
                    const fullImage = `http://127.0.0.1:8000${data.profile_image}?t=${Date.now()}`;
                    setProfileImage(fullImage);
                    localStorage.setItem("profile_image", fullImage);
                }
            } catch (err) {
                console.error("User ma'lumotini olishda xatolik:", err);
            }
        };

        getProfile();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                console.log(res.data);
            } catch (err) {
                console.error("Foydalanuvchi ma'lumotini olishda xatolik:", err);
            }
        };

        fetchUser();
    }, []);

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // ==========================
    // FOYDALANUVCHI MA’LUMOTLARI — YANGI
    // ==========================
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

    const capitalizeName = (fullName) => {
        if (!fullName) return "";
        return fullName
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    await api.post("/api/auth/update-location/", {
                        latitude,
                        longitude,
                    });
                    console.log("Joylashuv yuborildi ✅");
                } catch (err) {
                    console.error("Joylashuv yuborishda xatolik:", err);
                }
            },
            (error) => {
                console.error("Geolokatsiya xatolik:", error);
            }
        );
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    await api.post("/api/auth/update-location/", {
                        latitude,
                        longitude,
                    });
                    console.log("📍 Joylashuv yuborildi");
                } catch (err) {
                    console.error("Joylashuv yuborishda xatolik:", err);
                }
            },
            (error) => {
                console.error("Geolokatsiya xatolik:", error);
            }
        );
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // 📍 1. JOYLASHUVNI BACKENDGA YUBORISH
                try {
                    await api.post("/api/auth/update-location/", {
                        latitude,
                        longitude,
                    });
                    console.log("📍 Joylashuv backendga yuborildi");
                } catch (err) {
                    console.error("Joylashuv yuborishda xatolik:", err);
                }

                // 🌍 2. JOYLASHUVNI MANZILGA O‘GIRISH (REVERSE GEOCODING)
                try {
                    const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                        params: {
                            format: "json",
                            lat: latitude,
                            lon: longitude,
                        },
                    });

                    const address = res.data.address;
                    const city = address.city || address.town || address.village || "Noma'lum shahar";
                    const country = address.country || "Noma'lum davlat";

                    setLocation(`${city}, ${country}`);
                } catch (err) {
                    console.error("Manzilni aniqlashda xatolik:", err);
                    setLocation("Noma'lum joylashuv");
                }

                // 🕒 3. MAHALLIY VAQT
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

    useEffect(() => {
        const fetchWorkHours = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setWorkHours(res.data.work_hours_per_week || "Не указано");
            } catch (err) {
                console.error("Error getting work hours:", err);
            }
        };

        fetchWorkHours();
    }, []);

    const handleSave = async () => {
        try {
            const res = await api.patch("/api/auth/update-work-hours/", {
                work_hours_per_week: tempValue,
            });
            setWorkHours(res.data.work_hours_per_week);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating work hours:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);
            } catch (error) {
                console.error("Xatolik:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchAllMedia = async () => {
            try {
                setLoading(true);

                // ✅ To‘g‘ri endpointlar
                const projectRes = await api.get("/api/projects/");
                const projects = projectRes.data.results || projectRes.data;

                if (!Array.isArray(projects) || projects.length === 0) {
                    setPortfolioItems([]);
                    return;
                }

                const mediaResponses = await Promise.all(
                    projects.map((project) =>
                        api.get(`/api/portfolio-media/?project=${project.id}`)
                    )
                );

                const allMedia = mediaResponses.flatMap(
                    (res) => res.data.results || res.data
                );

                setPortfolioItems(allMedia);
            } catch (err) {
                console.error("Portfolio yuklashda xatolik:", err);
                // ❗ bu yerda endi setError chaqirmaymiz
            } finally {
                setLoading(false);
            }
        };


        fetchAllMedia();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await api.get("/api/skills/");
            setSkills(res.data);
        } catch (err) {
            console.error("Skill olishda xatolik:", err);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleSaveSkills = () => {
        fetchSkills(); // har qanday yangilanishdan keyin backenddan to‘g‘ri ID’lar bilan olish
    };

// Yuklab olish
    useEffect(() => { fetchCertificates(); }, []);

    const fetchCertificates = async () => {
        try {
            const res = await api.get("/api/certificates/");
            const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setCertificates(list);
        } catch (e) {
            console.error("Sertifikatlarni olishda xatolik:", e);
        }
    };

// Yaratish (modal “Saqlash” bosilganda)
    const handleSaveCertificate = async (formData) => {
        try {
            await api.post("/api/certificates/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            await fetchCertificates();
            setIsCertModalOpen(false);
        } catch (e) {
            console.error("Sertifikat saqlashda xatolik:", e);
        }
    };

// Tahrirlash
    const handleUpdateCertificate = async (formData) => {
        try {
            if (!editingCert) return;
            await api.patch(`/certificate/certificates/${editingCert.id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            await fetchCertificates();
            setEditModalOpen(false);
            setSelectedCertificate(null);
        } catch (e) {
            console.error("Sertifikat tahrirlashda xatolik:", e);
        }
    };

// O‘chirish
    const handleDeleteCertificate = async (id) => {
        try {
            await api.delete(`/certificate/certificates/${id}/`);
            setCertificates((prev) => prev.filter((c) => c.id !== id));
            setSelectedCertificate(null);
        } catch (e) {
            console.error("Sertifikat o‘chirishda xatolik:", e);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await api.get("/api/experiences/");
            setExperiences(res.data);
        } catch (err) {
            console.error("Tajriba olishda xatolik:", err);
        }
    };

    const handleSaveChanges = () => {
        // Bu yerda backendga PATCH yoki PUT yuboriladi (agar kerak bo‘lsa)
        // Keyin isEditable false bo‘ladi
        setIsEditable(false);
        // To‘liqroq qilishni istasang, localStorage yoki boshqa ma’lumotlarni ham saqlash mumkin
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true); setErr("");
            try {
                // :id bo‘lsa — boshqa user profili; bo‘lmasa — o‘zing (me)
                const url = id ? `/api/accounts/${id}/` : `/api/auth/me/`;
                const { data } = await api.get(url);
                if (mounted) setUser(data);
            } catch (e) {
                if (mounted) setErr(e?.response?.data?.detail || "Profilni yuklab bo‘lmadi");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);


    // ==========================
    // LANG CODE HANDLING
    // ==========================
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

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

    return (
        <>
            <div className="font-sans relative">
                {/* ==========================
                        NAVBAR
                ========================== */}
                <NavbarTabletLogin />

                {/* ========================== */}
                {/*        NOTIFICATION        */}
                {/* ========================== */}
                <div className="bg-white py-3 md:py-2 mb-[-60px] mt-[10px]">
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

                {/* ========================== */}
                {/*            BODY            */}
                {/* ========================== */}
                <div className="w-full mx-auto max-w-[960px] px-3 md:px-4 py-4 md:py-5">
                    {/* USER CARD */}
                    <div className="w-full bg-white border border-[#AEAEAE] mt-[32px] md:mt-[48px] rounded-[20px] md:rounded-[22px] overflow-hidden relative">
                        {/* === TOP PANEL === */}
                        <div className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between border-b border-[#AEAEAE]">
                            {/* LEFT - Avatar + Name + Location */}
                            <div className="flex items-center gap-4">
                                {/* Avatar ko‘rinishi */}
                                <div className="relative w-[56px] h-[56px] md:w-[64px] md:h-[64px]">
                                    <img
                                        key={profileImage}
                                        src={profileImage || "/user.jpg"}
                                        alt="avatar"
                                        className="w-full h-full object-cover rounded-full border"
                                    />
                                    <button
                                        className={`absolute bottom-0 right-0 rounded-full border p-[2px] transition 
                                          ${isEditable ? "bg-white cursor-pointer" : "bg-gray-100 cursor-not-allowed opacity-50 border-gray-300"}`}
                                        onClick={() => {
                                            if (isEditable) setIsAvatarModalOpen(true);
                                        }}
                                    >
                                        <div className="w-[18px] h-[18px] flex items-center justify-center">
                                            <img
                                                src="/edit.png"
                                                className="w-4 h-4"
                                                alt="edit"
                                                style={{ filter: isEditable ? "none" : "grayscale(100%)" }}
                                            />
                                        </div>
                                    </button>
                                </div>

                                {/* Avatar Modal */}
                                {isAvatarModalOpen && (
                                    <ChangeProfileImageModal
                                        isOpen={isAvatarModalOpen}
                                        onClose={() => setIsAvatarModalOpen(false)}
                                        setProfileImage={setProfileImage}
                                    />
                                )}
                                <div>
                                    <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-bold text-black mt-1 md:mt-2">
                                        {user ? capitalizeName(user.full_name) : "Ism yuklanmoqda..."}
                                    </h2>
                                    <p className="text-[12px] md:text-[13px] text-[#AEAEAE] font-medium flex items-center gap-1">
                                        <img src="/location.png" alt="loc" className="w-[12px] h-[12px]" />
                                        {location} – {localTime} местное время
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT - Buttons */}
                            <div className="flex gap-2 md:gap-3">
                                <button
                                    className={`h-10 md:h-11 px-4 md:px-5 font-semibold rounded-[10px] transition border
    ${isEditable ? "bg-[#3066BE] text-white hover:bg-[#2653a5]" : "bg-white text-[#3066BE] hover:bg-[#F0F7FF] border-[#3066BE]"}`}
                                    onClick={() => { if (isEditable) { handleSaveChanges(); window.location.reload(); } else { setIsEditable(true); } }}
                                >
                                    {isEditable ? "Сохранить" : "Предпросмотр"}
                                </button>

                                <button className="h-10 md:h-11 px-4 md:px-5 bg-[#3066BE] text-white font-semibold rounded-[10px] hover:bg-[#2452a6] transition">
                                    Настройки профиля
                                </button>
                            </div>
                        </div>

                        {/* === MAIN WRAPPER === */}
                        <div className="w-full min-h-full overflow-visible bg-white">
                            {/* === MAIN BODY === */}
                            {/* ====== REPLACEMENT: MAIN TWO-COLUMN LAYOUT (stable, tablet-ready) ====== */}
                            <div className="mx-auto w-full max-w-[960px] px-3 md:px-4">
                                <div className="w-full lg:flex lg:items-start lg:gap-6">
                                    <div className="mx-auto w-full max-w-[960px] px-3 md:px-4">
                                        <div className="md:flex md:items-start md:gap-0">
                                            <ProfileLeftPane
                                                isEditable={isEditable}
                                                workHours={workHours}
                                                isEditing={isEditing}
                                                setIsEditing={setIsEditing}
                                                tempValue={tempValue}
                                                setTempValue={setTempValue}
                                                handleSave={handleSave}
                                            />

                                            <div
                                                aria-hidden="true"
                                                className="hidden md:block self-stretch w-px bg-[#AEAEAE]"
                                            />

                                            <ProfileRightPane
                                                isEditable={isEditable}
                                                portfolioItems={portfolioItems}
                                                skills={skills}
                                                selectedSkill={selectedSkill}
                                                setSelectedSkill={setSelectedSkill}
                                                isModalOpen={isModalOpen}
                                                setIsModalOpen={setIsModalOpen}
                                                handleSaveSkills={handleSaveSkills}
                                                setIsPortfolioOpen={setIsPortfolioOpen}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ====== /REPLACEMENT ====== */}

                        </div>
                    </div>

                    {/* ========================== */}
                    {/*         SERTIFIKAT         */}
                    {/* ========================== */}
                    <div className="w-full bg-white border border-[#AEAEAE] mt-8 rounded-[20px] md:rounded-[22px] overflow-hidden min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 md:px-6 py-4">
                            <h3 className="text-[18px] md:text-[20px] lg:text-[24px] leading-[26px] md:leading-[30px] font-bold text-black">
                                Сертификаты
                            </h3>

                            <button
                                type="button"
                                onClick={() => { if (isEditable) setIsCertModalOpen(true); }}
                                className={`${!isEditable ? "pointer-events-none" : ""}`}
                                aria-label="Добавить сертификат"
                            >
                                <div className={`border w-[22px] h-[22px] md:w-[23px] md:h-[23px] rounded-full flex items-center justify-center transition
    ${isEditable ? "border-[#3066BE] cursor-pointer hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 opacity-50"}`}>
                                    <Plus size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                </div>
                            </button>

                        </div>

                        {/* Full-bleed divider (chetlargacha) */}
                        <div className="-mx-4 md:-mx-6 h-px bg-[#AEAEAE]" />

                        {/* Content */}
                        {Array.isArray(certificates) && certificates.length > 0 ? (
                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {certificates.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="cursor-pointer border border-[#D9D9D9] rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition"
                                        onClick={() => setSelectedCertificate(cert)}
                                    >
                                        {cert.file?.endsWith(".pdf") ? (
                                            <div className="flex items-center justify-center h-[160px] md:h-[180px] bg-gray-100 text-gray-500">
                                                PDF
                                            </div>
                                        ) : (
                                            <img
                                                src={cert.file?.startsWith("http") ? cert.file : `http://localhost:8000${cert.file}`}
                                                alt={cert.name}
                                                className="w-full h-[160px] md:h-[180px] object-cover"
                                            />
                                        )}
                                        <div className="p-3 md:p-4">
                                            <h4 className="text-[14px] md:text-[16px] font-semibold text-black truncate">
                                                {cert.name}
                                            </h4>
                                            <p className="text-[12px] md:text-[13px] text-gray-500 truncate">
                                                {cert.organization}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Empty state (rasmga o‘xshash)
                            <div className="px-4 md:px-6 py-10 md:py-14">
                                <p className="mx-auto max-w-[640px] text-center text-[#AEAEAE] text-[14px] md:text-[16px] leading-[22px] md:leading-[24px]">
                                    Перечисление ваших сертификатов может помочь подтвердить<br className="hidden md:block" />
                                    ваши особые знания или способности. (+10%)
                                </p>
                            </div>
                        )}

                        <CertificateModal
                            isOpen={isCertModalOpen}
                            onClose={() => setIsCertModalOpen(false)}
                            onSave={handleSaveCertificate}
                        />
                    </div>



                    {/* ========================== */}
                    {/*         Experience         */}
                    {/* ========================== */}
                    <ExperienceSectionModal isEditable={isEditable} />


                </div>

                {/* Portfolio Modal */}
                <ProfilePortfolioModal
                    isOpen={isPortfolioOpen}
                    onClose={() => setIsPortfolioOpen(false)}
                    title="Портфолио"
                >
                </ProfilePortfolioModal>



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
        </>
    );
}