import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfilePortfolioModal from "../components/ProfilePortfolioModal.jsx";
import ProfileExperienceModal from "../components/ProfileExperienceModal";
import ProfileDropdown from "../components/ProfileDropdown";
import ChangeProfileImageModal from "../components/AvatarUploadModal";
import LanguageSection from "../components/LanguageSection";
import EducationSection from "../components/EducationSection";
import DetailBlock from "../components/DetailBlockProfile";
import PortfolioCarousel from "../components/ProfileCarusel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SkillEditModal from "../components/SkillEditModal";
import CertificateModal from "../components/CertificateModal";
import ExperienceSection from "../components/ExperienceSection";
import api from "../utils/api";

export default function ProfilePageDesktop({ viewOnly = false, targetUserId = null }) {
    const [showMobileMenu] = useState(false);
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState("/user.jpg");
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
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);

    const canEdit = !viewOnly;

    // ✅ YANGI: targetUserId o'zgarganda profil ma'lumotlarini qayta yuklash
    useEffect(() => {
        console.log("🔄 ProfilePageDesktop useEffect triggered");
        console.log("📍 viewOnly:", viewOnly);
        console.log("👤 targetUserId:", targetUserId);

        if (viewOnly && targetUserId) {
            console.log("🔄 Loading profile for user:", targetUserId);

            // State'larni reset qilish
            setUser(null);
            setProfileImage("/user.jpg");
            setSkills([]);
            setCertificates([]);
            setPortfolioItems([]);
            setExperiences([]);
            setWorkHours("");
            setLocation("Joylashuv aniqlanmoqda...");
            setLoading(true);

            // Yangi user ma'lumotlarini yuklash
            const loadUserProfile = async () => {
                try {
                    console.log(`📡 Fetching /api/auth/profile/${targetUserId}/`);
                    const res = await api.get(`/api/auth/profile/${targetUserId}/`);

                    console.log("✅ Profile data:", res.data);
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilePageDesktop.jsx:76',message:'Profile data received',data:{targetUserId,hasSkills:!!res.data.skills,skillsCount:res.data.skills?.length||0,hasPortfolio:!!res.data.portfolio,portfolioCount:res.data.portfolio?.length||0,hasEducation:!!res.data.education,educationCount:res.data.education?.length||0,allKeys:Object.keys(res.data)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                    // #endregion

                    setUser(res.data);
                    setWorkHours(res.data.work_hours_per_week || "Не указано");

                    // Avatar
                    if (res.data.avatar) {
                        const fullUrl = res.data.avatar.startsWith("http")
                            ? res.data.avatar
                            : `${api.defaults.baseURL}${res.data.avatar}`;
                        setProfileImage(fullUrl);
                    }

                    // Skills - string array yoki object array bo'lishi mumkin
                    const skillsRaw = res.data.skills || res.data.skill || [];
                    const skillsData = Array.isArray(skillsRaw) && skillsRaw.length > 0 && typeof skillsRaw[0] === 'string'
                        ? skillsRaw.map((name, idx) => ({ id: idx + 1, name }))
                        : skillsRaw;
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilePageDesktop.jsx:90',message:'Setting skills',data:{skillsData,count:skillsData.length,firstSkill:skillsData[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                    // #endregion
                    setSkills(skillsData);

                    // Certificates
                    const certs = res.data.certificates || res.data.certificate || [];
                    setCertificates(certs.map(cert => ({
                        ...cert,
                        file: cert.file?.startsWith("http")
                            ? cert.file
                            : `${api.defaults.baseURL}${cert.file}`
                    })));

                    // Portfolio - media_files array ichida file'lar bor
                    const portfolio = res.data.portfolio || res.data.portfolios || [];
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilePageDesktop.jsx:102',message:'Setting portfolio',data:{portfolio,count:portfolio.length,firstItem:portfolio[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                    // #endregion
                    setPortfolioItems(portfolio.map(item => {
                        // media_files array ichidan birinchi file'ni olamiz
                        const mediaFile = item.media_files && item.media_files.length > 0 
                            ? item.media_files[0] 
                            : null;
                        const fileUrl = mediaFile?.file_url || mediaFile?.file || item.file;
                        const fullFileUrl = fileUrl?.startsWith("http")
                            ? fileUrl
                            : fileUrl ? `${api.defaults.baseURL}${fileUrl}` : null;
                        
                        return {
                            ...item,
                            file: fullFileUrl,
                            title: item.title || 'Portfolio Item'
                        };
                    }));

                    // Experiences
                    setExperiences(res.data.experiences || []);

                    console.log("✅ Profile loaded successfully");

                } catch (err) {
                    console.error("❌ Profile yuklashda xatolik:", err);
                    setErr(err.response?.data?.detail || "Profile topilmadi");
                } finally {
                    setLoading(false);
                }
            };

            loadUserProfile();
        }
    }, [targetUserId]); // ✅ MUHIM: faqat targetUserId o'zgarganda

    useEffect(() => {
        const saveToLocalStorage = () => {
            if (!viewOnly) {
                const profileData = {
                    user,
                    workHours,
                    skills,
                    certificates,
                    portfolioItems,
                    experiences,
                    profileImage,
                    location,
                };

                localStorage.setItem("profile_data", JSON.stringify(profileData));
                localStorage.setItem("profile_timestamp", Date.now().toString());
            }
        };

        const interval = setInterval(saveToLocalStorage, 5000);
        return () => clearInterval(interval);
    }, [user, workHours, skills, certificates, portfolioItems, experiences, profileImage, location, viewOnly]);

    useEffect(() => {
        const loadFromLocalStorage = () => {
            try {
                const savedData = localStorage.getItem("profile_data");
                const timestamp = localStorage.getItem("profile_timestamp");

                if (timestamp && (Date.now() - parseInt(timestamp)) > 7 * 24 * 60 * 60 * 1000) {
                    localStorage.removeItem("profile_data");
                    localStorage.removeItem("profile_timestamp");
                    return;
                }

                if (savedData) {
                    const data = JSON.parse(savedData);

                    if (!user) setUser(data.user);
                    if (!workHours) setWorkHours(data.workHours);
                    if (skills.length === 0) setSkills(data.skills || []);
                    if (certificates.length === 0) setCertificates(data.certificates || []);
                    if (portfolioItems.length === 0) setPortfolioItems(data.portfolioItems || []);
                    if (experiences.length === 0) setExperiences(data.experiences || []);
                    if (profileImage === "/user.jpg") setProfileImage(data.profileImage);
                    if (!location) setLocation(data.location);
                }
            } catch (err) {
                console.error("LocalStorage'dan yuklashda xatolik:", err);
            }
        };

        if (!viewOnly) {
            loadFromLocalStorage();
        }
    }, [viewOnly]);

    useEffect(() => {
        const loadAllProfileData = async () => {
            try {
                setLoading(true);

                const userRes = await api.get("/api/auth/me/");
                setUser(userRes.data);
                setWorkHours(userRes.data.work_hours_per_week || "Не указано");

                if (userRes.data.profile_image) {
                    const fullUrl = userRes.data.profile_image.startsWith("http")
                        ? userRes.data.profile_image
                        : `${api.defaults.baseURL}${userRes.data.profile_image}`;
                    setProfileImage(fullUrl);
                    localStorage.setItem("profile_image", fullUrl);
                }

                const skillsRes = await api.get("/api/skills/");
                setSkills(skillsRes.data.results || skillsRes.data || []);

                const certsRes = await api.get("/api/certificates/");
                const certs = certsRes.data.results || certsRes.data || [];
                setCertificates(certs.map(c => ({
                    ...c,
                    file: c.file?.startsWith("http") ? c.file : `${api.defaults.baseURL}${c.file}`
                })));

                const projectsRes = await api.get("/api/projects/");
                const projects = projectsRes.data.results || projectsRes.data || [];

                if (projects.length > 0) {
                    const mediaRes = await Promise.all(
                        projects.map(p => api.get(`/api/portfolio-media/?project=${p.id}`))
                    );

                    const allMedia = mediaRes.flatMap(r => {
                        const items = r.data.results || r.data || [];
                        return items.map(item => ({
                            ...item,
                            file: item.file?.startsWith("http")
                                ? item.file
                                : `${api.defaults.baseURL}${item.file}`
                        }));
                    });

                    setPortfolioItems(allMedia);
                }

                const expRes = await api.get("/api/experiences/");
                setExperiences(expRes.data.results || expRes.data || []);

            } catch (err) {
                console.error("Profile ma'lumotlarini yuklashda xatolik:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!viewOnly) {
            loadAllProfileData();
        }
    }, [viewOnly]);

    useEffect(() => {
        const getProfile = async () => {
            if (viewOnly && targetUserId) {
                return;
            }

            try {
                const res = await api.get("/api/auth/me/");
                const data = res.data;

                setUser(data);

                if (data.profile_image) {
                    let fullImageUrl;
                    if (data.profile_image.startsWith('http')) {
                        fullImageUrl = data.profile_image;
                    } else {
                        const baseURL = api.defaults.baseURL || "https://jobvacancy-api.duckdns.org";
                        fullImageUrl = `${baseURL}${data.profile_image}`;
                    }
                    setProfileImage(fullImageUrl);
                    localStorage.setItem("profile_image", fullImageUrl);
                } else {
                    setProfileImage("/user.jpg");
                }
            } catch (err) {
                console.error("❌ Avatar yuklashda xatolik:", err);
                setProfileImage("/user.jpg");
            }
        };

        if (!viewOnly) {
            getProfile();
        }
    }, [viewOnly, targetUserId]);

    const capitalizeName = (fullName) => {
        if (!fullName) return "";
        return fullName.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    if (!viewOnly) {
                        await api.post("/api/auth/update-location/", { latitude, longitude });
                    }
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
                const time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                setLocalTime(time);
            },
            (error) => {
                console.error("Geolokatsiya rad etildi:", error);
                setLocation("Joylashuv bloklangan");
            }
        );
    }, [viewOnly]);

    const handleSave = async () => {
        if (viewOnly) return;
        try {
            const res = await api.patch("/api/auth/update-work-hours/", { work_hours_per_week: tempValue });
            setWorkHours(res.data.work_hours_per_week);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating work hours:", err);
        }
    };

    const handleSaveSkills = () => {
        if (viewOnly) return;
    };

    const handleSaveCertificate = async (formData) => {
        if (viewOnly) return;
        try {
            await api.post("/api/certificates/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const res = await api.get("/api/certificates/");
            setCertificates(res.data.results || res.data);
            setIsCertModalOpen(false);
        } catch (err) {
            console.error("Saqlashda xatolik:", err);
        }
    };

    const handleDelete = async (id) => {
        if (viewOnly) return;
        try {
            await api.delete(`/api/certificates/${id}/`);
            setCertificates((prev) => prev.filter((c) => c.id !== id));
            setSelectedCertificate(null);
        } catch (err) {
            console.error("O'chirishda xatolik:", err);
        }
    };

    const handleUpdate = async (formData) => {
        if (viewOnly) return;
        try {
            await api.patch(`/api/certificates/${editingCert.id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const res = await api.get("/api/certificates/");
            setCertificates(res.data.results || res.data);
            setEditModalOpen(false);
            setSelectedCertificate(null);
        } catch (err) {
            console.error("Tahrirlashda xatolik:", err);
        }
    };

    const fetchExperiences = async () => {
    };

    const handleSaveChanges = () => {
        if (viewOnly) return;
        setIsEditable(false);
    };

    const texts = {
        community: "Сообщество", 
        vacancies: "Вакансии", 
        chat: "Чат", 
        companies: "Компании",
        login: "Войти", 
        logo: "Logo",
        links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
        copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
    };

    if (loading && viewOnly) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3066BE] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Profil yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans relative" key={targetUserId || 'my-profile'}>
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                    <a href="/"><img src="/logo.png" alt="Logo" className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain" /></a>
                    <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                        <a href="/community" className="text-black hover:text-[#3066BE] transition">{texts.community}</a>
                        <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">{texts.vacancies}</a>
                        <a href="/chat" className="text-black hover:text-[#3066BE] transition">{texts.chat}</a>
                        <a href="/companies" className="text-black hover:text-[#3066BE] transition">{texts.companies}</a>
                    </div>
                    <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>

            <div className="bg-white py-4 mt-[90px] mb-[67px]"></div>

            <div className="max-w-7xl w-[1176px] mx-auto px-4 py-8 mt-[-70px]">
                <div className="w-full bg-white border border-[#AEAEAE] mt-[67px] min-h-[1006px] rounded-[25px] overflow-visible">
                    <div className="w-full h-[136px] px-6 py-4 flex items-center justify-between border-b border-[#AEAEAE]">
                        <div className="flex items-center gap-4">
                            <div className="relative w-[70px] h-[70px]">
                                <div className="w-full h-full rounded-full border bg-cover bg-center" style={{ backgroundImage: `url('${profileImage}')` }} />
                                {canEdit && (
                                    <button
                                        className={`absolute bottom-0 right-0 rounded-full border p-[2px] transition ${isEditable ? "bg-white cursor-pointer" : "bg-gray-100 cursor-not-allowed opacity-50 border-gray-300"}`}
                                        onClick={() => { if (isEditable) setIsAvatarModalOpen(true); }}
                                    >
                                        <div className="w-[18px] h-[18px] flex items-center justify-center">
                                            <img src="/edit.png" className="w-4 h-4" alt="edit" style={{ filter: isEditable ? "none" : "grayscale(100%)" }} />
                                        </div>
                                    </button>
                                )}
                            </div>

                            {canEdit && isAvatarModalOpen && (
                                <ChangeProfileImageModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} setProfileImage={setProfileImage} />
                            )}

                            <div>
                                <h2 className="text-[24px] font-bold text-black mt-2">{user ? capitalizeName(user.full_name) : "Ism yuklanmoqda..."}</h2>
                                <p className="text-[15px] text-[#AEAEAE] font-medium flex items-center gap-1">
                                    <img src="/location.png" alt="loc" className="w-[14px] h-[14px]" />
                                    {location} – {localTime} местное время
                                </p>
                            </div>
                        </div>

                        {canEdit && (
                            <div className="flex gap-3">
                                <button
                                    className={`w-[222px] h-[59px] font-semibold rounded-[10px] transition border ${isEditable ? "bg-[#3066BE] text-white hover:bg-[#2653a5]" : "bg-white text-[#3066BE] hover:bg-[#F0F7FF] border-[#3066BE]"}`}
                                    onClick={() => { if (isEditable) { handleSaveChanges(); window.location.reload(); } else { setIsEditable(true); } }}
                                >
                                    {isEditable ? "Сохранить" : "Предпросмотр"}
                                </button>
                                <button className="w-[222px] h-[59px] bg-[#3066BE] text-white font-semibold rounded-[10px] hover:bg-[#2452a6] transition">Настройки профиля</button>
                            </div>
                        )}
                    </div>

                    <div className="w-full min-h-full overflow-visible bg-white">
                        <div className="flex max-w-[1176px] mx-auto w-full h-auto">
                            <div className="w-[60%] px-6 py-6 border-r border-[#AEAEAE]">
                                <div className="pb-4 px-4 py-3 mb-[30px]">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[24px] leading-[36px] font-bold text-black">Часов в неделю</h3>
                                        {canEdit && (
                                            <div className="flex gap-2">
                                                <div
                                                    className={`w-[23px] h-[23px] border rounded-full flex items-center justify-center transition ${isEditable ? "border-[#3066BE] cursor-pointer" : "border-gray-300 cursor-not-allowed opacity-50"}`}
                                                    onClick={() => { if (isEditable) { setTempValue(workHours); setIsEditing(true); } }}
                                                >
                                                    <Pencil size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {canEdit && isEditing ? (
                                        <>
                                            <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="mt-2 border border-gray-300 rounded-[10px] px-2 py-1 text-[15px] font-medium text-black" />
                                            <button onClick={handleSave} className="px-3 py-1 mt-[5px] bg-[#3066BE] text-white text-sm rounded-[10px]">Сохранить</button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[15px] leading-[22px] text-black mt-1 font-medium">{workHours}</p>
                                            <p className="text-[15px] leading-[22px] text-[#AEAEAE] mt-1 font-medium">Открыт для заключения контракта на найм</p>
                                        </>
                                    )}
                                </div>

                                <LanguageSection
                                    isEditable={canEdit && isEditable}
                                    viewOnly={viewOnly}
                                    targetUserId={targetUserId}
                                />

                                <EducationSection
                                    isEditable={canEdit && isEditable}
                                    viewOnly={viewOnly}
                                    targetUserId={targetUserId}
                                />
                            </div>

                            <div className="flex justify-center px-6 py-6 w-full">
                                <div className="w-[762px]">
                                    <DetailBlock
                                        isEditable={canEdit && isEditable}
                                        viewOnly={viewOnly}
                                        targetUserId={targetUserId}
                                    />
                                    <div className="w-full h-[1px] bg-[#AEAEAE] my-[px]"></div>

                                    <div className="w-full bg-white border-none rounded-xl p-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[24px] leading-[36px] font-bold text-[#000000] mb-[10px]">Портфолио</h3>
                                            {canEdit && (
                                                <button onClick={() => { if (isEditable) setIsPortfolioOpen(true); }} className="bg-white border-none mt-[-10px] w-[50px]">
                                                    <div className={`w-[23px] h-[23px] ml-[17px] rounded-full flex items-center justify-center transition ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"}`}>
                                                        <Plus size={25} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-6">
                                            <PortfolioCarousel items={portfolioItems} />
                                        </div>
                                    </div>

                                    <div className="w-full h-[1px] bg-[#AEAEAE] my-[36px]"></div>

                                    <div className="w-full bg-white border-none rounded-xl p-4 mt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">Навыки</h3>
                                            {canEdit && (
                                                <div
                                                    className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 cursor-not-allowed bg-gray-100 opacity-50"}`}
                                                    onClick={() => { if (isEditable) { setSelectedSkill(null); setIsSkillModalOpen(true); } }}
                                                >
                                                    <Plus size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-start mt-[21px]">
                                            {skills.length === 0 ? (
                                                <p className="text-[#AEAEAE] text-sm">Навыки не добавлены</p>
                                            ) : (
                                                skills.map((skill) => (
                                                    <div key={skill.id} className="flex items-center gap-1 bg-[#D9D9D9] text-sm px-4 py-1 rounded-full border border-gray-300 text-black">
                                                        {skill.name}
                                                        {canEdit && (
                                                            <Pencil
                                                                size={14}
                                                                className={`ml-2 transition ${isEditable ? "cursor-pointer text-[#3066BE]" : "cursor-not-allowed text-gray-400"}`}
                                                                onClick={() => { if (isEditable) { setSelectedSkill(skill); setIsSkillModalOpen(true); } }}
                                                            />
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {canEdit && (
                                        <SkillEditModal isOpen={isSkillModalOpen} onClose={() => { setIsSkillModalOpen(false); setSelectedSkill(null); }} skill={selectedSkill} initialSkills={skills.map((s) => s.name)} onSave={handleSaveSkills} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white border border-[#AEAEAE] mt-[67px] rounded-[25px] overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[#AEAEAE] h-[94.5px]">
                        <h3 className="text-[24px] leading-[36px] font-bold text-[#000000]">Сертификаты</h3>
                        {canEdit && (
                            <div onClick={() => { if (isEditable) setIsCertModalOpen(true); }} className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 cursor-not-allowed bg-gray-100 opacity-50"}`}>
                                <Plus size={25} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>
                        )}
                    </div>
                    {certificates.length === 0 ? (
                        <div className="flex items-center justify-center text-center px-4 py-10">
                            <p className="text-[#AEAEAE] text-[20px] leading-[30px] max-w-[604px] font-[400]">
                                Перечисление ваших сертификатов может помочь подтвердить <br />
                                ваши особые знания или способности. (+10%)
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6 p-6">
                            {certificates.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="cursor-pointer border border-[#D9D9D9] rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition"
                                    onClick={() => setSelectedCertificate(cert)}
                                >
                                    {cert.file?.endsWith(".pdf") ? (
                                        <div className="flex flex-col items-center justify-center h-[200px] bg-gradient-to-br from-blue-50 to-blue-100">
                                            <svg className="w-16 h-16 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-blue-600 font-medium">PDF Certificate</p>
                                        </div>
                                    ) : (
                                        <div className="relative h-[200px] bg-gray-100">
                                            <img
                                                src={cert.file}
                                                alt={cert.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error("❌ Certificate rasm yuklanmadi:", cert.file);
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="hidden absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-gray-500 font-medium">Сертификат</p>
                                                <p className="text-gray-400 text-xs mt-1">Изображение недоступно</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <h4 className="text-lg font-semibold truncate">{cert.name}</h4>
                                        <p className="text-sm text-gray-500 truncate">{cert.organization}</p>
                                        {cert.issue_date && (
                                            <p className="text-xs text-gray-400 mt-1">{cert.issue_date}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {canEdit && <CertificateModal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} onSave={handleSaveCertificate} />}

                {selectedCertificate && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white w-[500px] p-6 rounded-[15px] relative">
                            <button onClick={() => setSelectedCertificate(null)} className="absolute top-4 right-4 text-[#3066BE] bg-white border-none"><X /></button>
                            {selectedCertificate.file.endsWith(".pdf") ? (
                                <div className="h-[200px] flex items-center justify-center bg-gray-100 text-gray-500">PDF fayl mavjud</div>
                            ) : (
                                <img src={selectedCertificate.file.startsWith("http") ? selectedCertificate.file : `https://jobvacancy-api.duckdns.org${selectedCertificate.file}`} alt={selectedCertificate.name} className="w-full h-max object-cover rounded" />
                            )}
                            <h3 className="text-xl font-bold mt-4">{selectedCertificate.name}</h3>
                            <p className="text-gray-600">{selectedCertificate.organization}</p>
                            <p className="text-sm text-gray-400">{selectedCertificate.issue_date}</p>
                            {canEdit && (
                                <div className="flex justify-end mt-6 gap-3">
                                    <button onClick={() => { setEditingCert(selectedCertificate); setEditModalOpen(true); }} className="px-4 py-2 bg-yellow-500 text-white rounded-[10px] border-none">Tahrirlash</button>
                                    <button onClick={() => handleDelete(selectedCertificate.id)} className="px-4 py-2 bg-red-600 text-white rounded-[10px] border-none">O'chirish</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <ExperienceSection
                    isEditable={canEdit && isEditable}
                    viewOnly={viewOnly}
                    targetUserId={targetUserId}
                />
            </div>

            {canEdit && (
                <>
                    <ProfilePortfolioModal isOpen={isPortfolioOpen} onClose={() => setIsPortfolioOpen(false)} title="Портфолио" />
                    <ProfileExperienceModal isOpen={isExperienceOpen} onClose={() => setIsExperienceOpen(false)} onSuccess={fetchExperiences} />
                </>
            )}

            <footer className="w-full h-[393px] relative overflow-hidden mt-[96px]">
                <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>
                <div className="relative z-20">
                    <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                        <div className="flex gap-[190px]">
                            <div><h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">{texts.logo}</h2></div>
                            <div className="grid grid-cols-2 gap-[184px]">
                                <div className="flex flex-col gap-[20px]">
                                    {texts.links.slice(0, 4).map((link, idx) => (
                                        <a key={idx} href="#" className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                            <span>&gt;</span> {link}
                                        </a>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-[20px]">
                                    {texts.links.slice(4).map((link, idx) => (
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
                            <p>{texts.copyright}</p>
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
    );
}