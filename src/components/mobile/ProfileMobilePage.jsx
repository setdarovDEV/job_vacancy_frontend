import React, { useState, useEffect, useCallback } from "react";
import { Pencil, Plus, X, Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import api, { getAvatarURL } from "../../utils/api";

// Existing components
import LanguageSection from "../../components/LanguageSection";
import EducationSection from "../../components/EducationSection";
import PortfolioCarousel from "../../components/ProfileCarusel";
import SkillEditModal from "../../components/SkillEditModal";
import CertificateModal from "../../components/CertificateModal";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import ChangeProfileImageModal from "../../components/AvatarUploadModal";
import MobileFooter from "./MobileFooter.jsx";
import HeaderNotifications from "./HeaderNotifications.jsx";
import PortfolioFullModal from "./ProfilePortfolioModal.jsx";
import ExperienceFullModal from "./ExperienceFullModal.jsx";

export default function ProfilePageMobile() {
    // ===== STATE =====
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [location, setLocation] = useState("Joylashuv...");
    const [localTime, setLocalTime] = useState("");
    const [workHours, setWorkHours] = useState("");
    const [isEditingHours, setIsEditingHours] = useState(false);
    const [tempHours, setTempHours] = useState("");

    // Title, Price, Description editing
    const [editingField, setEditingField] = useState(null);
    const [tempTitle, setTempTitle] = useState("");
    const [tempPrice, setTempPrice] = useState("");
    const [tempDescription, setTempDescription] = useState("");

    const [skills, setSkills] = useState([]);
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [experiences, setExperiences] = useState([]);

    // Modals
    const [skillModalOpen, setSkillModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [certModalOpen, setCertModalOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
    const [isExpOpen, setIsExpOpen] = useState(false);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ===== HELPER FUNCTIONS =====
    const cap = (s) =>
        (s || "")
            .toLowerCase()
            .split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    // ===== FETCH USER DATA =====
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);

                // Set values for editing
                setTempTitle(res.data.title || "Backend Engineer");
                setTempPrice(res.data.salary_usd || "0.00");
                setTempDescription(res.data.about_me || "");
                setWorkHours(res.data.work_hours_per_week || "Более 30 часов в неделю");

                console.log("✅ User loaded:", res.data);
            } catch (err) {
                console.error("❌ User load error:", err);
            }
        };

        fetchUser();
    }, []);

    // ===== FETCH AVATAR =====
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const res = await api.get("/api/auth/profile/");
                const avatarUrl = getAvatarURL(res.data, "/user1.png");
                setProfileImage(avatarUrl);
                localStorage.setItem("profile_image", avatarUrl);
                console.log("✅ Avatar loaded:", avatarUrl);
            } catch (err) {
                console.error("❌ Avatar load error:", err);
                setProfileImage("/user1.png");
            }
        };

        fetchAvatar();
    }, []);

    // ===== LOCATION & TIME =====
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            try {
                await api.post("/api/auth/update-location/", {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                console.log("✅ Location updated");
            } catch (err) {
                console.error("❌ Location update error:", err);
            }

            try {
                const r = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                    params: { format: "json", lat: coords.latitude, lon: coords.longitude },
                });
                const a = r.data.address || {};
                const city = a.city || a.town || a.village || "Shahar";
                const country = a.country || "Davlat";
                setLocation(`${city}, ${country}`);
            } catch {
                setLocation("Joylashuv aniqlanmadi");
            }

            setLocalTime(
                new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
            );
        }, () => setLocation("Joylashuv bloklangan"));
    }, []);

    // ===== FETCH SKILLS =====
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data } = await api.get("/api/skills/");
                setSkills(Array.isArray(data) ? data : (data.results || []));
                console.log("✅ Skills loaded:", data);
            } catch (err) {
                console.error("❌ Skills load error:", err);
                setSkills([]);
            }
        };

        fetchSkills();
    }, []);

    // ===== FETCH PORTFOLIO =====
    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const p = await api.get("/api/projects/");
                const projects = p.data?.results || [];
                const mediaReqs = projects.map(pr =>
                    api.get(`/api/portfolio-media/?project=${pr.id}`)
                );
                const mediaRes = await Promise.all(mediaReqs);
                const all = mediaRes.flatMap(m => m.data.results || []);
                setPortfolioItems(all);
                console.log("✅ Portfolio loaded:", all.length, "items");
            } catch (err) {
                console.error("❌ Portfolio load error:", err);
            }
        };

        fetchPortfolio();
    }, []);

    // ===== FETCH CERTIFICATES =====
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const r = await api.get("/api/certificates/");
                setCertificates(r.data.results || r.data || []);
                console.log("✅ Certificates loaded");
            } catch (err) {
                console.error("❌ Certificates load error:", err);
            }
        };

        fetchCertificates();
    }, []);

    // ===== FETCH EXPERIENCES =====
    const reloadExperiences = useCallback(async () => {
        try {
            const { data } = await api.get("/api/experiences/");

            // ✅ DEBUG: Ma'lumotlarni console'ga chiqarish
            console.log("📋 Experiences raw data:", data);
            console.log("📋 Is array?", Array.isArray(data));
            console.log("📋 Length:", Array.isArray(data) ? data.length : (data.results?.length || 0));

            // Ma'lumotlarni to'g'ri formatga keltirish
            const expList = Array.isArray(data) ? data : (data.results || []);
            setExperiences(expList);

            console.log("✅ Experiences yuklandi:", expList.length, "ta");
        } catch (e) {
            console.error("❌ Experiences load error:", e);
            console.error("❌ Error details:", e.response?.data);
            setExperiences([]);
        }
    }, []);

    useEffect(() => {
        reloadExperiences();
    }, [reloadExperiences]);

    // ===== RELOAD PORTFOLIO =====
    const reloadPortfolio = async () => {
        try {
            const p = await api.get("/api/projects/");
            const projects = p.data?.results || [];
            const mediaReqs = projects.map(pr =>
                api.get(`/api/portfolio-media/?project=${pr.id}`)
            );
            const mediaRes = await Promise.all(mediaReqs);
            const all = mediaRes.flatMap(m => m.data.results || []);
            setPortfolioItems(all);
            console.log("✅ Portfolio reloaded");
        } catch (err) {
            console.error("❌ Portfolio reload error:", err);
        }
    };

    // ===== SAVE FUNCTIONS =====
    const saveTitle = async () => {
        if (!tempTitle.trim()) return;
        setSaving(true);
        try {
            await api.patch("/api/auth/update-title/", { title: tempTitle });
            setUser(prev => ({ ...prev, title: tempTitle }));
            setEditingField(null);
            console.log("✅ Title saved");
        } catch (err) {
            console.error("❌ Title save error:", err);
            alert("Saqlashda xatolik");
        } finally {
            setSaving(false);
        }
    };

    const savePrice = async () => {
        if (!tempPrice) return;
        setSaving(true);
        try {
            await api.patch("/api/auth/update-salary/", { salary_usd: tempPrice });
            setUser(prev => ({ ...prev, salary_usd: tempPrice }));
            setEditingField(null);
            console.log("✅ Salary saved");
        } catch (err) {
            console.error("❌ Salary save error:", err);
            alert("Saqlashda xatolik");
        } finally {
            setSaving(false);
        }
    };

    const saveDescription = async () => {
        setSaving(true);
        try {
            await api.patch("/api/auth/update-about/", { about_me: tempDescription });
            setUser(prev => ({ ...prev, about_me: tempDescription }));
            setEditingField(null);
            console.log("✅ Description saved");
        } catch (err) {
            console.error("❌ Description save error:", err);
            alert("Saqlashda xatolik");
        } finally {
            setSaving(false);
        }
    };

    const saveHours = async () => {
        if (!tempHours.trim()) return;
        setSaving(true);
        try {
            const { data } = await api.patch("/api/auth/update-work-hours/", {
                work_hours_per_week: tempHours,
            });
            setWorkHours(data.work_hours_per_week);
            setIsEditingHours(false);
            console.log("✅ Work hours saved");
        } catch (e) {
            console.error("❌ Work hours save error:", e);
            alert("Saqlashda xatolik");
        } finally {
            setSaving(false);
        }
    };

    // ===== CERTIFICATE FUNCTIONS =====
    const saveCertificate = async (formData) => {
        try {
            await api.post("/api/certificates/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const r = await api.get("/api/certificates/");
            setCertificates(r.data.results || r.data || []);
            setCertModalOpen(false);
            console.log("✅ Certificate saved");
        } catch (e) {
            console.error("❌ Certificate save error:", e);
            alert("Saqlashda xatolik");
        }
    };

    const deleteCertificate = async (id) => {
        if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
        try {
            await api.delete(`/api/certificates/${id}/`);
            setCertificates(prev => prev.filter(c => c.id !== id));
            setSelectedCertificate(null);
            console.log("✅ Certificate deleted");
        } catch (e) {
            console.error("❌ Certificate delete error:", e);
            alert("O'chirishda xatolik");
        }
    };

    // ===== EDUCATION & LANGUAGES =====
    const addingField = (field) => {
        // Placeholder for adding languages/education
        console.log("Adding", field);
    };

    const deleteEducation = () => {
        console.log("Delete education");
    };

    // ===== UI =====
    return (
        <div className="w-full max-w-[393px] mx-auto bg-white min-h-[100dvh]">
            <MobileNavbar />
            <HeaderNotifications />

            {/* HEADER CARD */}
            <div className="px-3 pt-3">
                <div className="border-y border-[#AEAEAE] bg-white px-3 py-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar + edit button */}
                        <div className="relative w-14 h-14 shrink-0">
                            <img
                                src={profileImage || "/user.jpg"}
                                alt="avatar"
                                className="w-14 h-14 rounded-full object-cover"
                                onError={(e) => { e.target.src = "/user.jpg"; }}
                            />
                            <div
                                onClick={() => setAvatarModalOpen(true)}
                                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white border border-[#3066BE] flex items-center justify-center text-[#3066BE] shadow-sm cursor-pointer"
                            >
                                <Pencil size={13} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Name + location */}
                        <div className="min-w-0">
                            <div className="text-[18px] font-bold text-black truncate">
                                {cap(user?.full_name) || "Yuklanmoqda..."}
                            </div>
                            <div className="mt-[1px] text-[12px] text-gray-500 flex items-center gap-1 min-w-0">
                                <img src="/location.png" alt="" className="w-3 h-3 shrink-0" />
                                <span className="truncate">{location}</span>
                                <span className="select-none">–</span>
                                <span>{localTime} местное время</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TITLE + PRICE + DESCRIPTION */}
            <section className="px-3 mt-3">
                <div className="border-b bg-white border-[#AEAEAE] p-3">
                    {/* Title + Price */}
                    <div className="flex items-start justify-between">
                        {/* Title */}
                        <div className="flex items-center gap-2 mb-[6px]">
                            {editingField === "title" ? (
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onBlur={saveTitle}
                                    autoFocus
                                    className="text-base font-bold text-black border-b border-[#3066BE] outline-none"
                                />
                            ) : (
                                <h3 className="text-base font-bold text-black">
                                    {user?.title || "Backend Engineer"}
                                </h3>
                            )}
                            <div
                                onClick={() => {
                                    if (editingField !== "title") {
                                        setTempTitle(user?.title || "");
                                        setEditingField("title");
                                    }
                                }}
                                className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center cursor-pointer"
                            >
                                <Pencil size={13} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-[6px]">
                            {editingField === "price" ? (
                                <input
                                    type="number"
                                    step="0.01"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(e.target.value)}
                                    onBlur={savePrice}
                                    autoFocus
                                    className="text-base font-bold text-black border-b border-[#3066BE] outline-none w-20 text-right"
                                />
                            ) : (
                                <span className="text-base font-bold text-black">
                                    {user?.salary_usd ? `${user.salary_usd}$` : "0.00$"}
                                </span>
                            )}
                            <div
                                onClick={() => {
                                    if (editingField !== "price") {
                                        setTempPrice(user?.salary_usd || "0.00");
                                        setEditingField("price");
                                    }
                                }}
                                className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center cursor-pointer"
                            >
                                <Pencil size={13} strokeWidth={2} />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-2 flex items-start gap-2 mb-[70px]">
                        {editingField === "description" ? (
                            <textarea
                                rows={4}
                                value={tempDescription}
                                onChange={(e) => setTempDescription(e.target.value)}
                                onBlur={saveDescription}
                                autoFocus
                                className="text-sm flex-1 text-black border border-[#3066BE] rounded p-2 outline-none"
                            />
                        ) : (
                            <p className="text-sm flex-1 text-[#AEAEAE]">
                                {user?.about_me || "Опишите свои сильные стороны и навыки"}
                            </p>
                        )}
                        <div
                            onClick={() => {
                                if (editingField !== "description") {
                                    setTempDescription(user?.about_me || "");
                                    setEditingField("description");
                                }
                            }}
                            className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center shrink-0 cursor-pointer"
                        >
                            <Pencil size={13} strokeWidth={2} />
                        </div>
                    </div>
                </div>
            </section>

            {/* PORTFOLIO */}
            <section className="px-3 mt-3">
                <div className="border-b border-[#AEAEAE] mt-[-12px] bg-white p-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-black ml-[-30px] text-[10px]">Портфолио</h3>
                        <div
                            onClick={(e) => { e.stopPropagation(); setIsPortfolioOpen(true); }}
                            className="w-6 h-6 rounded-full border border-[#3066BE] mr-[-28px] text-[#3066BE] flex items-center justify-center shrink-0 cursor-pointer"
                            aria-label="Portfolio qo'shish"
                        >
                            <Plus size={13} strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <PortfolioCarousel items={portfolioItems} />
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section className="px-3 mt-3">
                <div className="border-b border-[#AEAEAE] bg-white p-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-black">Навыки</h3>
                        <div
                            onClick={() => { setSelectedSkill(null); setSkillModalOpen(true); }}
                            className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center shrink-0 cursor-pointer"
                        >
                            <Plus size={13} strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {skills.map((s) => (
                            <span
                                key={s.id}
                                onClick={() => { setSelectedSkill(s); setSkillModalOpen(true); }}
                                className="px-3 py-1 rounded-full bg-[#D9D9D9] text-black border text-xs cursor-pointer"
                            >
                                {s.name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOURS + LANGUAGES + EDUCATION */}
            <section className="px-3 mt-3">
                <div className="bg-white p-4 space-y-6">
                    {/* Hours */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-black">Часов в неделю</h3>
                            <div
                                onClick={() => { setTempHours(workHours); setIsEditingHours(true); }}
                                className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center cursor-pointer"
                            >
                                <Pencil size={14} strokeWidth={2} />
                            </div>
                        </div>

                        <div className="mt-2 md:mt-3">
                            {isEditingHours ? (
                                <div className="flex flex-col items-start gap-2 md:gap-3">
                                    <input
                                        type="text"
                                        value={tempHours}
                                        onChange={(e) => setTempHours(e.target.value)}
                                        className="h-9 md:h-10 w-full md:w-48 border border-gray-300 rounded-[10px] px-3 text-[12px] md:text-[14px] font-medium text-black"
                                    />
                                    <div className="flex gap-2 md:gap-3">
                                        <button
                                            onClick={saveHours}
                                            disabled={saving}
                                            className="h-9 md:h-10 px-3 md:px-4 bg-[#3066BE] text-white text-[12px] md:text-[13px] rounded-[10px] disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingHours(false)}
                                            className="h-9 md:h-10 px-3 md:px-4 border border-[#3066BE] text-[#3066BE] text-[12px] md:text-[13px] rounded-[10px] bg-white"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-[12px] leading-[20px] md:leading-[22px] text-black font-medium">
                                        {workHours}
                                    </p>
                                    <p className="text-[10px] leading-[20px] text-[#AEAEAE] mt-1 font-medium">
                                        Открыт для заключения контракта на найм
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Languages - Use existing component */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-black">Языки</h3>
                            <div className="flex gap-2">
                                <div
                                    onClick={() => addingField("languages")}
                                    className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center cursor-pointer"
                                >
                                    <Plus size={16} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <LanguageSection isEditable={true} />
                        </div>
                    </div>

                    {/* Education - Use existing component */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-black">Образование</h3>
                            <div className="flex gap-2">
                                <div
                                    onClick={() => addingField("education")}
                                    className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center cursor-pointer"
                                >
                                    <Plus size={16} strokeWidth={2} />
                                </div>
                                <div
                                    onClick={deleteEducation}
                                    className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center cursor-pointer"
                                >
                                    <Trash2 size={14} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <EducationSection isEditable={true} />
                        </div>
                    </div>
                </div>
            </section>

            {/* CERTIFICATES */}
            <section className="px-3 mt-3">
                <div className="rounded-none border-y border-[#AEAEAE] bg-white">
                    <div className="flex items-center justify-between px-3 py-3 border-b border-[#AEAEAE]">
                        <h3 className="text-[16px] font-bold text-black">Сертификаты</h3>
                        <div
                            onClick={() => setCertModalOpen(true)}
                            className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center cursor-pointer"
                        >
                            <Plus size={16} strokeWidth={2} />
                        </div>
                    </div>

                    <div className="px-3 py-6">
                        {(!Array.isArray(certificates) || certificates.length === 0) ? (
                            <p className="text-center text-sm text-gray-400 max-w-[90%] mx-auto leading-relaxed">
                                Перечисление ваших сертификатов может помочь подтвердить <br />
                                ваши особые знания или способности. (+10%)
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {certificates.map((c, i) => (
                                    <div
                                        key={c.id || i}
                                        onClick={() => setSelectedCertificate(c)}
                                        className="border rounded-xl p-2 active:scale-[0.99] text-left cursor-pointer"
                                    >
                                        {c.file?.endsWith(".pdf") ? (
                                            <div className="h-24 flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded">
                                                PDF
                                            </div>
                                        ) : (
                                            <img
                                                src={
                                                    c.file?.startsWith("http")
                                                        ? c.file
                                                        : `https://jobvacancy-api.duckdns.org${c.file}`
                                                }
                                                alt={c.name}
                                                className="w-full h-24 object-cover rounded"
                                                onError={(e) => { e.target.src = "/placeholder.png"; }}
                                            />
                                        )}
                                        <p className="mt-2 font-medium text-sm truncate">{c.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{c.organization}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section className="px-3 mt-3 mb-[40px]">
                <div className="rounded-none border-y border-[#AEAEAE] bg-white">
                    <div className="flex items-center justify-between px-3 py-3 border-b border-[#AEAEAE]">
                        <h3 className="text-[16px] font-bold text-black">Опыт работы</h3>
                        <div
                            onClick={() => {
                                console.log("➕ Experience modal ochilmoqda");
                                setIsExpOpen(true);
                            }}
                            className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center active:scale-95 cursor-pointer"
                            aria-label="Добавить опыт"
                        >
                            <Plus size={16} strokeWidth={2} />
                        </div>
                    </div>

                    <div className="px-3 py-6">
                        {/* BO'SH HOLAT */}
                        {(!Array.isArray(experiences) || experiences.length === 0) ? (
                            <div className="text-center">
                                <p className="text-sm text-gray-400 max-w-[90%] mx-auto leading-relaxed">
                                    Перечисление вашего опыта работы может помочь подтвердить<br />
                                    ваши особые знания и способности.
                                </p>
                                {/* DEBUG info */}
                                <p className="text-xs text-gray-300 mt-2">
                                    {Array.isArray(experiences)
                                        ? `Array (${experiences.length} items)`
                                        : "Not array"}
                                </p>
                            </div>
                        ) : (
                            /* MA'LUMOTLAR BOR */
                            <div className="space-y-3">
                                {experiences.map((exp, idx) => (
                                    <div
                                        key={exp.id || `exp-${idx}`}
                                        className="border rounded-xl p-3 bg-white shadow-sm"
                                    >
                                        {/* Header - Position + Date */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-semibold truncate text-black">
                                                    {exp.position || "Должность не указана"}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate mt-1">
                                                    {exp.company_name || "Компания не указана"}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 shrink-0">
                                                {exp.start_date ? (
                                                    <>
                                                        {exp.start_date} —{" "}
                                                        {exp.is_current ? "настоящее время" : (exp.end_date || "...")}
                                                    </>
                                                ) : (
                                                    "Дата не указана"
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {exp.description && (
                                            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                                                {exp.description}
                                            </p>
                                        )}

                                        {/* Location (optional) */}
                                        {exp.location && (
                                            <p className="mt-1 text-xs text-gray-400">
                                                📍 {exp.location}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* MODALS */}
            <SkillEditModal
                isOpen={skillModalOpen}
                onClose={() => { setSkillModalOpen(false); setSelectedSkill(null); }}
                skill={selectedSkill}
                initialSkills={skills.map(s => s.name)}
                onSave={async () => {
                    const { data } = await api.get("/api/skills/");
                    setSkills(Array.isArray(data) ? data : (data.results || []));
                }}
            />

            <CertificateModal
                isOpen={certModalOpen}
                onClose={() => setCertModalOpen(false)}
                onSave={saveCertificate}
            />

            <PortfolioFullModal
                isOpen={isPortfolioOpen}
                onClose={() => setIsPortfolioOpen(false)}
                onSuccess={reloadPortfolio}
            />

            <ExperienceFullModal
                isOpen={isExpOpen}
                onClose={() => setIsExpOpen(false)}
                onSuccess={reloadExperiences}
            />

            {selectedCertificate && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-[500px] p-4 rounded-2xl relative">
                        <button
                            className="absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center"
                            onClick={() => setSelectedCertificate(null)}
                        >
                            <X size={18} />
                        </button>

                        {String(selectedCertificate.file || "").endsWith(".pdf") ? (
                            <div className="h-[200px] flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
                                PDF fayl
                            </div>
                        ) : (
                            <img
                                src={
                                    (selectedCertificate.file || "").startsWith("http")
                                        ? selectedCertificate.file
                                        : `https://jobvacancy-api.duckdns.org${selectedCertificate.file || ""}`
                                }
                                alt={selectedCertificate.name}
                                className="w-full max-h-[300px] object-contain rounded-lg"
                                onError={(e) => { e.target.src = "/placeholder.png"; }}
                            />
                        )}

                        <div className="mt-3">
                            <h4 className="font-bold">{selectedCertificate.name}</h4>
                            <p className="text-sm text-gray-500">{selectedCertificate.organization}</p>
                            {selectedCertificate.issue_date && (
                                <p className="text-xs text-gray-400">{selectedCertificate.issue_date}</p>
                            )}
                        </div>

                        <button
                            onClick={() => deleteCertificate(selectedCertificate.id)}
                            className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg"
                        >
                            O'chirish
                        </button>
                    </div>
                </div>
            )}

            {avatarModalOpen && (
                <ChangeProfileImageModal
                    isOpen={avatarModalOpen}
                    onClose={() => setAvatarModalOpen(false)}
                    setProfileImage={setProfileImage}
                />
            )}

            <MobileFooter />
        </div>
    );
}