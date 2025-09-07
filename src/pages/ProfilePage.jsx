import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, PlusCircle, ArrowUpDown, X } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

import ProfilePortfolioModal from "../components/ProfilePortfolioModal.jsx";
import ProfileExperienceModal from "../components/ProfileExperienceModal.jsx";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import ChangeProfileImageModal from "../components/AvatarUploadModal";
import LanguageSection from "../components/LanguageSection";
import EducationSection from "../components/EducationSection";
import DetailBlock from "../components/DetailBlockProfile";
import PortfolioCarousel from "../components/ProfileCarusel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SkillEditModal from "../components/SkillEditModal";
import CertificateModal from "../components/CertificateModal.jsx";
import CertificateModalEdit from "../components/CertificateModalEdit";
import ExperienceSection from "../components/ExperienceSection";
import api from "../utils/api";
import CopmanyPage from "../components/tablet/CompaniesTabletPage.jsx";
import ProfilePageTablet from "../components/tablet/ProfileTabletPage.jsx";
import ProfilePageMobile from "../components/mobile/ProfileMobilePage.jsx";
import ScaledToMobile from "../components/mobile/ScaledToMobile.jsx";

// ==========================
// COMPONENT START
// ==========================
export default function ProfilePage() {
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
    const [certificates, setCertificates] = useState([]);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    const { id } = useParams(); // /profiles/:id dan keladi (boshqa user)
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

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
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
                const projectRes = await api.get("portfolio/projects/");
                const projects = projectRes.data.results;

                if (projects.length === 0) {
                    console.warn("Hech qanday portfolio project topilmadi");
                    setLoading(false);
                    return;
                }

                const mediaResponses = await Promise.all(
                    projects.map((project) => api.get(`portfolio/portfolio-media/?project=${project.id}`))
                );

                const allMedia = mediaResponses.flatMap((res) => res.data.results);
                setPortfolioItems(allMedia);
            } catch (err) {
                console.error("Portfolio yuklashda xatolik:", err);
                setError("Xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };

        fetchAllMedia();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await api.get("skills/skills/");
            setSkills(res.data);
        } catch (err) {
            console.error("Skill olishda xatolik:", err);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleSaveSkills = () => {
        fetchSkills();
    };

    // Get all certificates
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await api.get("certificate/certificates/");
                setCertificates(res.data);
            } catch (err) {
                console.error("Xatolik:", err);
            }
        };

        fetchCertificates();
    }, []);

    // Save new certificate
    const handleSaveCertificate = async (formData) => {
        try {
            await api.post("certificate/certificates/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const res = await api.get("certificate/certificates/");
            setCertificates(res.data.results);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Saqlashda xatolik:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`certificate/certificates/${id}/`);
            setCertificates((prev) => prev.filter((c) => c.id !== id));
            setSelectedCertificate(null);
        } catch (err) {
            console.error("O‘chirishda xatolik:", err);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.patch(`certificate/certificates/${editingCert.id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const res = await api.get("certificate/certificates/");
            setCertificates(res.data.results);
            setEditModalOpen(false);
            setSelectedCertificate(null);
        } catch (err) {
            console.error("Tahrirlashda xatolik:", err);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await api.get("experience/");
            setExperiences(res.data);
        } catch (err) {
            console.error("Tajriba olishda xatolik:", err);
        }
    };

    const handleSaveChanges = () => {
        setIsEditable(false);
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setErr("");
            try {
                const url = id ? `/api/accounts/${id}/` : `/api/auth/me/`;
                const { data } = await api.get(url);
                if (mounted) setUser(data);
            } catch (e) {
                if (mounted) setErr(e?.response?.data?.detail || "Profilni yuklab bo‘lmadi");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
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
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            keyword: "Ключевое слово:",
            position: "Должность",
            location: "Местоположение:",
            selectRegion: "Выберите регион",
            salary: "Зарплата:",
            selectSalary: "Выберите зарплату",
            plan: "План:",
            premium: "Выберите план",
            applicants: "2000 + соискателей, 200 + компаний, 100 + работодателей",
            resume: "ОСТАВЬТЕ РЕЗЮМЕ & ПОЛУЧИТЕ ЖЕЛАЕМУЮ РАБОТУ!",
            login: "Войти",
            categories: "Выбрать по категории",
            search: "Поиск...",
            published: "Опубликовано 2 часа назад",
            needed: "Нужен графический дизайнер",
            budget: "Бюджет: 100$-200$",
            description:
                "Мы ищем художников, которые помогут нам исправить визуализации упаковки, созданные с помощью ИИ. В частности, мы хотим исправить логотипы на каждом рендере. У нас есть большой набор данных логотипов + изображений, созданных с помощью ИИ.",
            tags: ["Лого дизайн", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Платеж подтвержден",
            location_vacancy: "Узбекистан",
            recommendedVacancies: "Рекомендуемые вакансии",
            publishVacancy: "Опубликовать вакансию",
            logo: "Logo",
            links: [
                "Помощь",
                "Наши вакансии",
                "Реклама на сайте",
                "Требования к ПО",
                "Инвесторам",
                "Каталог компаний",
                "Работа по профессиям",
            ],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            createSite: "Создание сайтов",
            viewMore: "Посмотреть все →",
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            keyword: "Kalit so'z:",
            position: "Lavozim",
            location: "Joylashuv:",
            selectRegion: "Hududni tanlang",
            salary: "Maosh:",
            selectSalary: "Maoshni tanlang",
            plan: "Reja:",
            premium: "Rejani tanlang",
            applicants: "2000 + nomzodlar, 200 + kompaniyalar, 100 + ish beruvchilar",
            resume: "REZYUMENI QOLDIRING & ISTALGAN ISHNI OLING!",
            login: "Kirish",
            categories: "Kategoriyani tanlang",
            search: "Qidiruv...",
            published: "2 soat oldin e'lon qilindi",
            needed: "Grafik dizayner kerak",
            budget: "Byudjet: 100$-200$",
            description:
                "Sun'iy intellekt yordamida yaratilgan qadoqlash vizualizatsiyasini tuzatishga yordam beradigan rassomlarni izlayapmiz. Xususan, biz har bir renderdagi logotiplarni to‘g‘rilamoqchimiz. Bizda sun'iy intellekt bilan yaratilgan katta logotiplar + tasvirlar bazasi bor.",
            tags: ["Logo dizayn", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "To‘lov tasdiqlangan",
            location_vacancy: "O‘zbekiston",
            recommendedVacancies: "Tavsiya etilgan vakansiyalar",
            publishVacancy: "Vakansiya e’lon qilish",
            logo: "Logo",
            links: [
                "Yordam",
                "Bizning vakantiyalar",
                "Saytda reklama",
                "Dasturiy ta'minot talablari",
                "Investorlar uchun",
                "Kompaniyalar katalogi",
                "Kasblar bo‘yicha ishlar",
            ],
            copyright:
                "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            createSite: "Sayt yaratish",
            viewMore: "Hammasini ko‘rish →",
        },
        EN: {
            community: "Community",
            vacancies: "Vacancies",
            chat: "Chat",
            companies: "Companies",
            keyword: "Keyword:",
            position: "Position",
            location: "Location:",
            selectRegion: "Select region",
            salary: "Salary:",
            selectSalary: "Select salary",
            plan: "Plan:",
            premium: "Select plan",
            applicants: "2000+ applicants, 200+ companies, 100+ employers",
            resume: "LEAVE A RESUME & GET THE JOB YOU WANT!",
            login: "Login",
            categories: "Choose by category",
            search: "Search...",
            published: "Published 2 hours ago",
            needed: "Graphic designer needed",
            budget: "Budget: $100-$200",
            description:
                "We are looking for artists to help fix packaging visualizations created with AI. Specifically, we want to fix the logos on each render. We have a large dataset of logos + images created with AI.",
            tags: ["Logo design", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Payment verified",
            location_vacancy: "Uzbekistan",
            recommendedVacancies: "Recommended vacancies",
            publishVacancy: "Publish a vacancy",
            logo: "Logo",
            links: [
                "Help",
                "Our Vacancies",
                "Advertising on site",
                "Software Requirements",
                "For Investors",
                "Company Catalog",
                "Jobs by Profession",
            ],
            copyright:
                "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            createSite: "Website creation",
            viewMore: "View all →",
        },
    };

    // ==========================
    // DESKTOP BODYNI KOMPONENTGA AJRATDIK
    // ==========================
    const DesktopBody = () => (
        <div className="font-sans relative">
            {/* ==========================
                  NAVBAR
      ========================== */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                    {/* Logo */}
                    <a href="/">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain"
                        />
                    </a>

                    {/* Center links */}
                    <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto text-medium">
                        <a href="/community" className="text-black  hover:text-[#3066BE] transition">
                            {texts[langCode].community}
                        </a>
                        <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">
                            {texts[langCode].vacancies}
                        </a>
                        <a href="/chat" className="text-black hover:text-[#3066BE] transition">
                            {texts[langCode].chat}
                        </a>
                        <a href="/companies" className="text-black hover:text-[#3066BE] transition">
                            {texts[langCode].companies}
                        </a>
                    </div>

                    {/* Right side: flag + login (md va katta) */}
                    <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                        {/* Lang selector */}
                        <div
                            className="relative flex items-center gap-2 cursor-pointer"
                            onClick={() => setShowLang(!showLang)}
                        >
                            <img
                                src={selectedLang.flag}
                                alt={selectedLang.code}
                                className="w-6 h-4 sm:w-7 sm:h-4 md:w-8 md:h-5 object-cover"
                            />
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                />
                            </svg>
                            {showLang && (
                                <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                    <div
                                        onClick={() => {
                                            setSelectedLang({ flag: "/ru.png", code: "RU" });
                                            setShowLang(false);
                                        }}
                                        className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                    >
                                        <img src="/ru.png" alt="RU" className="w-8 h-5" />
                                    </div>
                                    <div
                                        onClick={() => {
                                            setSelectedLang({ flag: "/uz.png", code: "UZ" });
                                            setShowLang(false);
                                        }}
                                        className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                    >
                                        <img src="/uz.png" alt="UZ" className="w-8 h-5" />
                                    </div>
                                    <div
                                        onClick={() => {
                                            setSelectedLang({ flag: "/uk.png", code: "EN" });
                                            setShowLang(false);
                                        }}
                                        className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                    >
                                        <img src="/uk.png" alt="EN" className="w-8 h-5" />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Login/Avatar */}
                        <ProfileDropdown />
                    </div>

                    {/* mobile flag + burger */}
                    <div className="md:hidden flex items-center gap-3 pr-4 sm:pr-6 pt-2">
                        <div
                            className="relative flex items-center gap-1 cursor-pointer"
                            onClick={() => setShowLang(!showLang)}
                        >
                            <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 object-cover" />
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                />
                            </svg>
                            {showLang && (
                                <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                    <div
                                        onClick={() => {
                                            setSelectedLang({ flag: "/ru.png", code: "RU" });
                                            setShowLang(false);
                                        }}
                                        className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                    >
                                        <img src="/ru.png" alt="RU" className="w-8 h-5" />
                                    </div>
                                    <div
                                        onClick={() => {
                                            setSelectedLang({ flag: "/uz.png", code: "UZ" });
                                            setShowLang(false);
                                        }}
                                        className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                    >
                                        <img src="/uz.png" alt="UZ" className="w-8 h-5" />
                                    </div>
                                    <div
                                        onClick={() => {
                                            setSelectedLang({ flag: "/uk.png", code: "EN" });
                                            setShowLang(false);
                                        }}
                                        className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                    >
                                        <img src="/uk.png" alt="EN" className="w-8 h-5" />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Login/Avatar */}
                        <div className="w-[56px] h-[56px] rounded-full overflow-hidden">
                            <img src="/review-user.png" alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* mobile dropdown menu */}
                {showMobileMenu && (
                    <div className="absolute top[70px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 z-50">
                        <a
                            href=""
                            className="w-full px-4 py-3 text-center text-[#3066BE] hover:bg-gray-100 hover:text-[#3066BE] transition"
                        >
                            {texts[langCode].community}
                        </a>
                        <a
                            href="/vacancies"
                            className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition"
                        >
                            {texts[langCode].vacancies}
                        </a>
                        <a
                            href="/chat"
                            className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition"
                        >
                            {texts[langCode].chat}
                        </a>
                        <a
                            href="/companies"
                            className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition"
                        >
                            {texts[langCode].companies}
                        </a>
                        <button className="mt-3 bg[#3066BE] text-white px-6 py-2 rounded-md hover:bg[#274f94] transition text-[15px]">
                            {texts[langCode].login}
                        </button>
                    </div>
                )}
            </nav>

            {/* ========================== */}
            {/*        NOTIFICATION        */}
            {/* ========================== */}
            <div className="bg-white py-4 mt-[90px] mb-[67px]">
                <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                    {/* O‘ngdagi iconlar */}
                    <div className="flex items-center gap-6 ml-6 absolute top-[32px] right-[40px] z-20">
                        {/* ? icon */}
                        <div className="cursor-pointer">
                            <span className="text-2xl text-black">?</span>
                        </div>

                        {/* Bell */}
                        <div className="relative cursor-pointer">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                1
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================== */}
            {/*            BODY            */}
            {/* ========================== */}
            <div className="max-w-7xl w-[1176px] mx-auto px-4 py-8 mt-[-70px]">
                {/* USER CARD */}
                <div className="w-full bg-white border border-[#AEAEAE] mt-[67px] min-h-[1006px] rounded-[25px] overflow-visible">
                    {/* === TOP PANEL === */}
                    <div className="w-full h-[136px] px-6 py-4 flex items-center justify-between border-b border-[#AEAEAE]">
                        {/* LEFT - Avatar + Name + Location */}
                        <div className="flex items-center gap-4">
                            {/* Avatar ko‘rinishi */}
                            <div className="relative w-[70px] h-[70px]">
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
                                <h2 className="text-[24px] font-bold text-black mt-2">
                                    {user ? capitalizeName(user.full_name) : "Ism yuklanmoqda..."}
                                </h2>
                                <p className="text-[15px] text-[#AEAEAE] font-medium flex items-center gap-1">
                                    <img src="/location.png" alt="loc" className="w-[14px] h-[14px]" />
                                    {location} – {localTime} местное время
                                </p>
                            </div>
                        </div>

                        {/* RIGHT - Buttons */}
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

                    {/* === MAIN WRAPPER === */}
                    <div className="w-full min-h-full overflow-visible bg-white">
                        {/* === MAIN BODY === */}
                        <div className="flex max-w-[1176px] mx-auto w-full h-auto">
                            {/* LEFT PANEL */}
                            <div className="w-[60%] px-6 py-6 border-r border-[#AEAEAE]">
                                {/* Часов в неделю */}
                                <div className="pb-4 px-4 py-3 mb-[30px]">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[24px] leading-[36px] font-bold text-black">Часов в неделю</h3>
                                        <div className="flex gap-2">
                                            <div
                                                className={`w-[23px] h-[23px] border rounded-full flex items-center justify-center transition 
                              ${isEditable ? "border-[#3066BE] cursor-pointer" : "border-gray-300 cursor-not-allowed opacity-50"}`}
                                                onClick={() => {
                                                    if (isEditable) {
                                                        setTempValue(workHours);
                                                        setIsEditing(true);
                                                    }
                                                }}
                                            >
                                                <Pencil size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={tempValue}
                                                onChange={(e) => setTempValue(e.target.value)}
                                                className="mt-2 border border-gray-300 rounded-[10px] px-2 py-1 text-[15px] font-medium text-black"
                                            />
                                            <button
                                                onClick={handleSave}
                                                className="px-3 py-1 mt-[5px] bg-[#3066BE] text-white text-sm rounded-[10px]"
                                            >
                                                Сохранить
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[15px] leading-[22px] text-black mt-1 font-medium">{workHours}</p>
                                            <p className="text-[15px] leading-[22px] text-[#AEAEAE] mt-1 font-medium">
                                                Открыт для заключения контракта на найм
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Языки */}
                                <LanguageSection isEditable={isEditable} />

                                {/* Образование */}
                                <EducationSection isEditable={isEditable} />
                            </div>

                            {/* RIGHT PANEL */}
                            <div className="flex justify-center px-6 py-6 w-full">
                                <div className="w-[762px]">
                                    {/* Detail Block */}
                                    <DetailBlock isEditable={isEditable} />

                                    {/* Divider */}
                                    <div className="w-full h-[1px] bg-[#AEAEAE] my-[px]"></div>

                                    {/* Portfolio */}
                                    <div className="w-full bg-white border-none rounded-xl p-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[24px] leading-[36px] font-bold text-[#000000] mb-[10px]">Портфолио</h3>
                                            <button
                                                onClick={() => {
                                                    if (isEditable) setIsPortfolioOpen(true);
                                                }}
                                                className="bg-white border-none mt-[-10px] w-[50px]"
                                            >
                                                <div
                                                    className={`w-[23px] h-[23px] ml-[17px] rounded-full flex items-center justify-center transition
                          ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"}`}
                                                >
                                                    <Plus size={25} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            </button>
                                        </div>

                                        {/* Karusel */}
                                        <div className="mt-6">
                                            <PortfolioCarousel items={portfolioItems} />
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-[1px] bg-[#AEAEAE] my-[36px]"></div>

                                    {/* Skills */}
                                    <div className="w-full bg-white border-none rounded-xl p-4 mt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">Навыки</h3>
                                            <div
                                                className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition 
                              ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 cursor-not-allowed bg-gray-100 opacity-50"}`}
                                                onClick={() => {
                                                    if (isEditable) {
                                                        setSelectedSkill(null);
                                                        setIsModalOpen(true);
                                                    }
                                                }}
                                            >
                                                <Plus size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 justify-start mt-[21px]">
                                            {skills.map((skill) => (
                                                <div
                                                    key={skill.id}
                                                    className="flex items-center gap-1 bg-[#D9D9D9] text-sm px-4 py-1 rounded-full border border-gray-300 text-black"
                                                >
                                                    {skill.name}
                                                    <Pencil
                                                        size={14}
                                                        className={`ml-2 transition ${
                                                            isEditable ? "cursor-pointer text-[#3066BE]" : "cursor-not-allowed text-gray-400"
                                                        }`}
                                                        onClick={() => {
                                                            if (isEditable) {
                                                                setSelectedSkill(skill);
                                                                setIsModalOpen(true);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MODAL */}
                                    <SkillEditModal
                                        isOpen={isModalOpen}
                                        onClose={() => {
                                            setIsModalOpen(false);
                                            setSelectedSkill(null);
                                        }}
                                        skill={selectedSkill}
                                        initialSkills={skills.map((s) => s.name)}
                                        onSave={handleSaveSkills}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================== */}
                {/*         SERTIFIKAT         */}
                {/* ========================== */}
                <div className="w-full bg-white border border-[#AEAEAE] mt-[67px] rounded-[25px] overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[#AEAEAE] h-[94.5px]">
                        <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">Сертификаты</h3>
                        <div
                            onClick={() => {
                                if (isEditable) setIsModalOpen(true);
                            }}
                            className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition 
                    ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 cursor-not-allowed bg-gray-100 opacity-50"}`}
                        >
                            <Plus size={25} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                        </div>
                    </div>

                    {Array.isArray(certificates) && certificates.length === 0 ? (
                        <div className="flex items-center justify-center text-center px-4 py-10">
                            <p className="text-[#AEAEAE] text-[20px] leading-[30px] max-w-[604px] font-[400]">
                                Перечисление ваших сертификатов может помочь подтвердить <br />
                                ваши особые знания или способности. (+10%)
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6 p-6">
                            {Array.isArray(certificates) &&
                                certificates.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="cursor-pointer border border-[#D9D9D9] rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition"
                                        onClick={() => setSelectedCertificate(cert)}
                                    >
                                        {cert.file.endsWith(".pdf") ? (
                                            <div className="flex items-center justify-center h-[200px] bg-gray-100 text-gray-500">
                                                PDF fayl
                                            </div>
                                        ) : (
                                            <img
                                                src={
                                                    cert.file.startsWith("http")
                                                        ? cert.file
                                                        : `http://localhost:8000${cert.file}`
                                                }
                                                alt={cert.name}
                                                className="w-full h-max object-cover"
                                            />
                                        )}

                                        <div className="p-4">
                                            <h4 className="text-lg font-semibold">{cert.name}</h4>
                                            <p className="text-sm text-gray-500">{cert.organization}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Create Modal */}
                <CertificateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveCertificate} />

                {/* Detail Modal */}
                {selectedCertificate && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white w-[500px] p-6 rounded-[15px] relative">
                            <button
                                onClick={() => setSelectedCertificate(null)}
                                className="absolute top-4 right-4 text-[#3066BE] bg-white border-none"
                            >
                                <X />
                            </button>

                            {/* Rasm yoki PDF ko‘rsatish */}
                            {selectedCertificate.file.endsWith(".pdf") ? (
                                <div className="h-[200px] flex items-center justify-center bg-gray-100 text-gray-500">
                                    PDF fayl mavjud
                                </div>
                            ) : (
                                <img
                                    src={
                                        selectedCertificate.file.startsWith("http")
                                            ? selectedCertificate.file
                                            : `http://localhost:8000${selectedCertificate.file}`
                                    }
                                    alt={selectedCertificate.name}
                                    className="w-full h-max object-cover rounded"
                                />
                            )}

                            <h3 className="text-xl font-bold mt-4">{selectedCertificate.name}</h3>
                            <p className="text-gray-600">{selectedCertificate.organization}</p>
                            <p className="text-sm text-gray-400">{selectedCertificate.issue_date}</p>

                            <div className="flex justify-end mt-6 gap-3">
                                <button
                                    onClick={() => {
                                        setEditingCert(selectedCertificate);
                                        setEditModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-[10px] border-none"
                                >
                                    Tahrirlash
                                </button>
                                <CertificateModal
                                    isOpen={editModalOpen}
                                    onClose={() => setEditModalOpen(false)}
                                    onSave={handleUpdate}
                                    editMode={true}
                                    initialData={editingCert}
                                />

                                <button
                                    onClick={() => handleDelete(selectedCertificate.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-[10px] border-none"
                                >
                                    O‘chirish
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================== */}
                {/*         Experience         */}
                {/* ========================== */}
                <ExperienceSection isEditable={isEditable} />
            </div>

            {/* Portfolio Modal */}
            <ProfilePortfolioModal isOpen={isPortfolioOpen} onClose={() => setIsPortfolioOpen(false)} title="Портфолио">
                {/* content */}
            </ProfilePortfolioModal>

            {/* Experience Modal */}
            <ProfileExperienceModal isOpen={isExperienceOpen} onClose={() => setIsExperienceOpen(false)} onSuccess={fetchExperiences} />

            {/* ==========================
          FOOTER SECTION
      ========================== */}
            <footer className="w-full h-[393px] relative overflow-hidden mt-[96px]">
                {/* Background image */}
                <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                {/* Content */}
                <div className="relative z-20">
                    <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
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
                                    {texts[langCode].links.slice(4).map((link, idx) => (
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

                    {/* Bottom */}
                    <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                        <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                            <p>{texts[langCode].copyright}</p>

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
    );

    // ==========================
    // RENDER
    // ==========================
    return (
        <>
            {/* Mobil (≤ md) */}
            <div className="block md:hidden">
                <ProfilePageMobile />
            </div>

            {/* Tablet/desktop */}
            <div className="hidden md:block">
                <ProfilePageTablet />
            </div>
        </>
    );
}
