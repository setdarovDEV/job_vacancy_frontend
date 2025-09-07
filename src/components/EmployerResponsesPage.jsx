import  React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import {Plus, Pencil, Trash2, PlusCircle, ArrowUpDown, } from "lucide-react";
import VacancyModal from "../components/VacancyModal";
import EmployerVacancyModal from "../components/EmployerVacancyModal";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "../components/AvatarUploadModal.jsx";
import CreateCompanyModal from "../components/CreateCompanyModal.jsx";
import axios from "axios";
import api from "../utils/api";
import { fetchJobApplicants, fetchEmployerApplications, normalizeApplicants, fetchApplicantOfApplication } from "../utils/applicationsApi";
import {chatApi} from "../utils/chat.js";
import HomeEmployerApplicationsTablet from "./tablet/HomeEmployerApplicationsTablet.jsx";
import EmployerApplicationsMobile from "./mobile/EmployerApplicationsMobile.jsx";


export default function HomeEmployer() {
    const { jobId } = useParams();
    // ==========================
    // STATE
    // ==========================
    const [activeModalIndex, setActiveModalIndex] = useState(null);
    const [selectedLang, setSelectedLang] = useState({flag: "/ru.png", code: "RU"});
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // default

    const totalPages = Math.max(1, Math.ceil((count || 0) / (pageSize || 10)));

    const ApplicationsList = ({ items }) => {
        const navigate = useNavigate();

        const handleViewProfile = (applicationId) => {
            navigate(`/api/applicants/by-application/${applicationId}`);
        };
    }

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await api.get("/api/auth/profile/");
                const userRole = response.data?.role;

                if (userRole === "JOB_SEEKER") {
                      navigate("/profile");
                    }
                else if (userRole === "EMPLOYER") {
                    // shu sahifada qoladi
                }
                // EMPLOYER bo‘lsa aynan shu sahifada qoladi else {
                console.error("Nomaʼlum rol:", userRole);
            } catch (err) {
                console.error("Profil olishda xatolik:", err);
            }
        };

        getProfile();
    }, [navigate]);

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const response = await api.get("/api/vacancies/jobposts/");
                setVacancies(response.data);
            } catch (err) {
                console.error("Vakansiyalarni olishda xatolik:", err);
            }
        };

        fetchVacancies();
    }, []);

    const handleEdit = (vacancy) => {
        setSelectedVacancy(vacancy);       // Modalga yuboramiz
        setShowModal(true);                // Modalni ochamiz
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Rostdan ham ushbu vakansiyani o‘chirmoqchimisiz?");
        if (!confirm) return;

        try {
            await api.delete(`/api/vacancies/jobposts/${id}/`);

            // Frontenddagi ro‘yxatdan o‘chirish
            setVacancies((prev) => ({
                ...prev,
                results: prev.results.filter((vacancy) => vacancy.id !== id),
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
                // PATCH
                await api.patch(`/api/vacancies/jobposts/${selectedVacancy.id}/`, payload);
                alert("Vakansiya yangilandi!");
            } else {
                // POST
                await api.post("/api/vacancies/jobposts/", payload);
                alert("Vakansiya yaratildi!");
            }

            setShowModal(false);
            setSelectedVacancy(null);
            await fetchVacancies(); // Ro‘yxatni qayta chaqirish

        } catch (err) {
            console.error("Vakansiyani saqlashda xatolik:", err);
        }
    };

    const fetchVacancies = async () => {
        try {
            const res = await api.get("/api/vacancies/jobposts/");
            setVacancies(res.data);
        } catch (err) {
            console.error("Vakansiyalarni olishda xatolik:", err);
        }
    };


    const fetchCompanies = async () => {
        try {
            const response = await api.get("/api/companies/");

            // Massivmi yoki pagination bilan kelganmi tekshiramiz
            const data = Array.isArray(response.data) ? response.data : response.data.results;

            console.log("Kompaniyalar:", data);

            setCompanies(data);
        } catch (err) {
            console.error("Kompaniyalarni olishda xatolik:", err);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleEditCompanies = (company) => {
        setSelectedCompany(company);
        setShowCompanyModal(true);
    };

    const handleDeleteCompanies = async (companyId) => {
        const confirm = window.confirm("Kompaniyani o‘chirmoqchimisiz?");
        if (!confirm) return;

        try {
            await api.delete(`/api/companies/${companyId}/`);
            alert("Kompaniya o‘chirildi!");
            fetchCompanies(); // Ro‘yxatni qayta chaqiramiz
        } catch (err) {
            console.error("❌ O‘chirishda xatolik:", err.response?.data || err.message);
            alert("Xatolik: " + JSON.stringify(err.response?.data));
        }
    };

    const handleSaveChanges = () => {
        // Bu yerda backendga PATCH yoki PUT yuboriladi (agar kerak bo‘lsa)
        // Keyin isEditable false bo‘ladi
        setIsEditable(false);
        // To‘liqroq qilishni istasang, localStorage yoki boshqa ma’lumotlarni ham saqlash mumkin
    };

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
        return () => { cancelled = true; };
    }, [jobId, page]);

    if (loading && items.length === 0) return <div className="text-gray-500">Yuklanmoqda…</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    // if (items.length === 0) return <div className="text-gray-500">Hali ariza yo‘q.</div>;

    function formatName(name) {
        if (!name) return "—";
        return name
            .split(" ")
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(" ");
    }


    async function handleWrite(applicationId) {
        try {
            const room = await chatApi.getOrCreateByApplication(applicationId);
            // xonani yaratdik/topdik — endi aynan shu xonaga o'tamiz
            navigate(`/chat?room=${room.id}`, { state: { peer: room.peer } });
        } catch (e) {
            console.error("getOrCreateByApplication failed:", e);
            alert("Chat xonasini ochishda xatolik.");
        }
    }

    async function onClickWrite(appId) {
        try {
            const room = await chatApi.getOrCreateByApplication(appId);
            // chatga o'tamiz va o‘ng panelni ochish uchun roomId + peer’ni state orqali ham beramiz
            navigate(`/chat?room=${room.id}`, { state: { peer: room.peer, ts: Date.now() } });
        } catch (e) {
            console.error("getOrCreateByApplication failed", e);
            alert("Chat xonasini ochishda xatolik.");
        }
    }

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
            <div className="hidden md:block lg:hidden ">
                <HomeEmployerApplicationsTablet />
            </div>
            <div className="block md:hidden">
                <EmployerApplicationsMobile />
            </div>

            <div className="hidden lg-block font-sans relative">
                {/* ==========================
                            NAVBAR
                ========================== */}
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        {/* Logo */}
                        <a href="/"><img src="/logo.png" alt="Logo"
                                         className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain"/></a>
                        {/* Center links */}
                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">{texts[langCode].community}</a>
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">{texts[langCode].vacancies}</a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">{texts[langCode].chat}</a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">{texts[langCode].companies}</a>
                        </div>

                        {/* Right side: flag + login (md va katta) */}
                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            {/* Lang selector */}
                            <div className="relative flex items-center gap-2 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                                <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 sm:w-7 sm:h-4 md:w-8 md:h-5 object-cover" />
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
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

                        {/* mobile flag + burger */}
                        <div className="md:hidden flex items-center gap-3 pr-4 sm:pr-6 pt-2">
                            <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                                <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 object-cover" />
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
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
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="bg-white p-2 rounded-md focus:outline-none">
                                <svg className="w-8 h-8" fill="none" stroke="#3066BE" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                        </div>
                    </div>

                    {/* mobile dropdown menu */}
                    {showMobileMenu && (
                        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 z-50">
                            <a href="/community"
                               className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].community}
                            </a>
                            <a href="/vacancies"
                               className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].vacancies}
                            </a>
                            <a href="/chat"
                               className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].chat}
                            </a>
                            <a href="/companies"
                               className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].companies}
                            </a>
                            <button className="mt-3 bg-[#3066BE] text-white px-6 py-2 rounded-md hover:bg-[#274f94] transition text-[15px]">
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
                <div className="max-w-7xl w-[1276px] mx-auto px-4 py-8">
                    {/* USER CARD */}
                    <div className="w-full bg-white border border-[#AEAEAE] mt-[67px] h-[1006px] rounded-[25px] overflow-hidden">

                        {/* === TOP PANEL === */}
                        <div className="w-full h-[136px] px-6 py-4 flex items-center justify-between border-b border-[#AEAEAE]">
                            {/* LEFT - Avatar + Name + Location */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-[70px] h-[70px]">
                                    <img
                                        key={profileImage}
                                        src={profileImage || "/user-white.jpg"}
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
                                    </button>
                                </div>

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
                                <button className="w-[222px] h-[59px] bg-[#3066BE] text-white font-semibold rounded-[10px] hover:bg-[#2452a6] transition">
                                    Настройки профиля
                                </button>
                            </div>
                        </div>

                        {/* === MAIN BODY === */}
                        <div className="flex max-w-[1176px] mt-[25px] mx-auto w-full h-auto">
                            {/* === ANNOUNCEMENTS TITLE === */}
                            <div className="flex items-center justify-between w-full px-6 py-6">
                                <h3 className="text-[24px] font-bold text-black leading-[36px]">
                                    Отклики
                                </h3>
                                <div>
                                    <div
                                        onClick={() => {
                                            if (isEditable) setShowModal(true);
                                        }}
                                        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition 
                                            ${isEditable
                                            ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                            : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                        }`}
                                    >
                                    </div>


                                    {/* Modal */}
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

                        <div className="flex flex-col gap-6">
                            {items.map((a) => {
                                const aboutText = a.bio || a.cover_letter || "";
                                const skills = a.skills && a.skills.length ? a.skills : [];

                                return (
                                    <div
                                        key={a.id}
                                        className="bg-white border border-[#AEAEAE] rounded-[25px] ml-[56px] p-6 w-full max-w-[1130px] flex flex-col gap-4 shadow-sm"
                                    >
                                        {/* Top: Avatar + Name + Rating */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                {/* Avatar */}
                                                <img
                                                    src={a.avatar || "/user-white.jpg"}
                                                    alt={a.name}
                                                    className="w-[64px] h-[64px] object-cover rounded-full"
                                                    onError={(e) => (e.currentTarget.src = "/user-white.jpg")}
                                                />
                                                {/* Name & Title */}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-bold text-[24px] text-black">{formatName(a.name)}</h3>
                                                    </div>

                                                    {/* Soha turi */}
                                                    <p className="text-[15px] text-[#AEAEAE] mt-[4px]">
                                                        {a.position || "—"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex gap-3 mt-1">
                                                <button
                                                    className="px-5 py-1.5 w-[229px] h-[59px] border border-[#3066BE] bg-white text-[#3066BE] rounded-[10px] text-[18px] hover:bg-blue-50"
                                                    onClick={() => onClickWrite(a.id)}
                                                    title="Написать"
                                                >
                                                    Написать
                                                </button>
                                                <button
                                                    className="px-5 py-1.5 bg-[#3066BE] text-white rounded-lg text-[18px] hover:bg-[#3066BE]"
                                                    onClick={() => navigate(`/applicants/by-application/${a.id}`)}
                                                    title="Посмотреть профиль"
                                                >
                                                    Посмотреть профиль
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-[#AEAEAE] text-[20px] leading-relaxed">
                                            {aboutText || "—"}
                                        </p>


                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-2">
                                            {skills.length === 0 ? (
                                                <span className="bg-[#D9D9D9] text-sm text-[#AEAEAE] px-4 py-1 rounded-full">Skill qo‘shilmagan</span>
                                            ) : (
                                                skills.slice(0, 10).map((skill, idx) => (
                                                    <span key={`${a.id}-sk-${idx}`} className="bg-[#D9D9D9] text-[15px] text-black px-4 py-1 rounded-full">
                                                        {typeof skill === "string" ? skill : skill.name || "Skill"}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center gap-3">
                                    <button
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Prev
                                    </button>
                                    <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
                                    <button
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page >= totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ========================== */}
                    {/*         Kompaniya          */}
                    {/* ========================== */}
                    <div className="w-[1246px] bg-white border border-[#AEAEAE] mt-[67px] mb-[50px] rounded-[25px] overflow-visible">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-[#AEAEAE] h-[94.5px]">
                            <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">
                                Компании
                            </h3>
                            <div
                                onClick={() => {
                                    if (isEditable) setShowCompanyModal(true);
                                }}
                                className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition 
                                    ${isEditable
                                    ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#F0F7FF]"
                                    : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                }`}
                            >
                                <Plus size={25} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>

                        </div>

                        {companies.length > 0 ? (
                            <div className="lg:w-2/3 w-[1094px] max-h-[700px] overflow-y-auto overflow-x-hidden ml-[45px] mt-[25px] flex flex-col mb-[137px] pr-2">
                                {companies.map((company) => (
                                    <div key={company.id} className="border-none border-[#D9D9D9] rounded-[10px] p-4 mb-4">
                                        <hr className="border-t border-[#D9D9D9] mb-6 w-[1115px]" />

                                        {/* Sarlavha va action tugmalar */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-semibold text-[#000]">{company.name}</h4>
                                                <p className="text-sm text-gray-500">{company.industry}</p>
                                                <p className="text-sm text-gray-500">{company.website}</p>
                                                <p className="text-sm text-gray-500">{company.location}</p>
                                                <img
                                                    src={company.logo}
                                                    alt="Logo"
                                                    className="w-12 h-12 object-cover rounded-full mt-2"
                                                />
                                            </div>

                                            {/* Edit va Delete tugmalar */}
                                            <div className="flex gap-2">
                                                <div
                                                    onClick={() => {
                                                        if (isEditable) handleEditCompanies(company);
                                                    }}
                                                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition 
                                                        ${isEditable
                                                        ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Pencil size={20} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>

                                                <div
                                                    onClick={() => {
                                                        if (isEditable) handleDeleteCompanies(company.id);
                                                    }}
                                                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition 
                                                        ${isEditable
                                                        ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10"
                                                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                                    }`}
                                                >
                                                    <Trash2 size={20} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <div className="text-center text-gray-400 text-sm mt-6">
                                Kompaniyalar mavjud emas.
                            </div>
                        )}
                    </div>
                </div>

                {activeModalIndex !== null && (
                    <VacancyModal
                        onClose={() => setActiveModalIndex(null)}
                        vacancy={vacancies[activeModalIndex]}
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

                {/* ==========================
                    FOOTER SECTION
                ========================== */}
                <footer className="w-full h-[393px] relative overflow-hidden">
                    {/* Background image */}
                    <img
                        src="/footer-bg.png"
                        alt="Footer background"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    {/* Overlay */}ff
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

                        {/* Bottom */}
                        <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                            <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                                <p>
                                    {texts[langCode].copyright}
                                </p>

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
