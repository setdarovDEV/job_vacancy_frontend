import React, { useState, useEffect, useCallback } from "react";
import { Pencil, Plus, X, Trash2} from "lucide-react";
import axios from "axios";
import api from "../../utils/api";

// Bo'lim komponentlari (senda allaqachon bor)
import LanguageSection from "../../components/LanguageSection";
import EducationSection from "../../components/EducationSection";
import DetailBlock from "../../components/DetailBlockProfile";
import PortfolioCarousel from "../../components/ProfileCarusel";
import ExperienceSection from "../../components/ExperienceSection";
import SkillEditModal from "../../components/SkillEditModal";
import CertificateModal from "../../components/CertificateModal";
import MobileNavbar from "./MobileNavbarLogin.jsx";
// OPTIONAL: avatar o'zgartirish modali bo'lsa
import ChangeProfileImageModal from "../../components/AvatarUploadModal";
import MobileFooter from "./MobileFooter.jsx";
import HeaderNotifications from "./HeaderNotifications.jsx";
import PortfolioFullModal from "./ProfilePortfolioModal.jsx";
import ExperienceFullModal from "./ExperienceFullModal.jsx";


export default function ProfilePageMobile() {
    // ===== STATE =====
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(localStorage.getItem("profile_image") || null);
    const [location, setLocation] = useState("Joylashuv...");
    const [localTime, setLocalTime] = useState("");
    const [workHours, setWorkHours] = useState("");
    const [isEditingHours, setIsEditingHours] = useState(false);
    const [tempHours, setTempHours] = useState("");
    const [skills, setSkills] = useState([]);
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [skillModalOpen, setSkillModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [certModalOpen, setCertModalOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [isExpOpen, setIsExpOpen] = useState(false);
    const [experiences, setExperiences] = useState([]);

    // ===== EFFECTS =====
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/api/auth/me/");
                setUser(data);
                setWorkHours(data.work_hours_per_week || "Не указано");
            } catch (e) { console.error(e); }
        })();

        (async () => {
            try {
                const res = await api.get("/api/auth/profile/");
                if (res.data?.profile_image) {
                    const full = `http://127.0.0.1:8000${res.data.profile_image}?t=${Date.now()}`;
                    setProfileImage(full);
                    localStorage.setItem("profile_image", full);
                }
            } catch (e) { /* ignore */ }
        })();
    }, []);

    useEffect(() => {
        // joylashuv va vaqt
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            try {
                await api.post("/api/auth/update-location/", {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
            } catch (_) {}

            try {
                const r = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                    params: { format: "json", lat: coords.latitude, lon: coords.longitude },
                });
                const a = r.data.address || {};
                const city = a.city || a.town || a.village || "Shahar";
                const country = a.country || "Davlat";
                setLocation(`${city}, ${country}`);
            } catch (_) {
                setLocation("Joylashuv aniqlanmadi");
            }

            setLocalTime(
                new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
            );
        }, () => setLocation("Joylashuv bloklangan"));
    }, []);

    useEffect(() => {
        // skills
        api.get("skills/skills/").then(r => setSkills(r.data)).catch(() => {});
        // portfolio
        (async () => {
            try {
                const p = await api.get("portfolio/projects/");
                const projects = p.data?.results || [];
                const mediaReqs = projects.map(pr => api.get(`portfolio/portfolio-media/?project=${pr.id}`));
                const mediaRes = await Promise.all(mediaReqs);
                const all = mediaRes.flatMap(m => m.data.results || []);
                setPortfolioItems(all);
            } catch (_) {}
        })();
        // certificates
        api.get("certificate/certificates/").then(r => {
            // ba'zan API list yoki results qaytaradi
            setCertificates(r.data.results || r.data || []);
        }).catch(() => {});
    }, []);

    // ===== HELPERS =====
    const cap = (s) =>
        (s || "")
            .toLowerCase()
            .split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    const saveHours = async () => {
        try {
            const { data } = await api.patch("/api/auth/update-work-hours/", {
                work_hours_per_week: tempHours,
            });
            setWorkHours(data.work_hours_per_week);
            setIsEditingHours(false);
        } catch (e) { console.error(e); }
    };

    const saveCertificate = async (formData) => {
        try {
            await api.post("certificate/certificates/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const r = await api.get("certificate/certificates/");
            setCertificates(r.data.results || r.data || []);
            setCertModalOpen(false);
        } catch (e) { console.error(e); }
    };

    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
    const reloadPortfolio = async () => {
        // seni mavjud fetch’ing bilan uyg‘un
        try {
            const p = await api.get("portfolio/projects/");
            const projects = p.data?.results || [];
            const mediaReqs = projects.map(pr => api.get(`portfolio/portfolio-media/?project=${pr.id}`));
            const mediaRes = await Promise.all(mediaReqs);
            const all = mediaRes.flatMap(m => m.data.results || []);
            setPortfolioItems(all);
        } catch (_) {}
    };

    // Listni qayta yuklash
    const reloadExperiences = useCallback(async () => {
        try {
            const { data } = await api.get("experience/experiences/");
            setExperiences(data); // UI’ingda qayerda ko‘rsatsang, shu state’dan foydalan
        } catch (e) {
            console.error("Reload experiences error:", e);
        }
    }, []);

    // Sahifa ochilganda bir marta yuklab qo‘yish
    useEffect(() => {
        reloadExperiences();
    }, [reloadExperiences]);


    // ===== UI =====
    return (
        <div className="w-full max-w-[393px] mx-auto bg-white min-h-[100dvh]">
            <MobileNavbar />

            <HeaderNotifications />

            {/* HEADER CARD (button avatar pastki-o‘ngida) */}
            <div className="px-3 pt-3">
                <div className="border-y border-[#AEAEAE] bg-white px-3 py-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar + edit button */}
                        <div className="relative w-14 h-14 shrink-0">
                            <img
                                src={profileImage || "/user.jpg"}
                                alt="avatar"
                                className="w-14 h-14 rounded-full object-cover"
                            />
                            {/* Tugma avatar ichida pastki-o‘ngda */}
                            <div
                                onClick={() => setAvatarModalOpen(true)}
                                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white border border-[#3066BE] flex items-center justify-center text-[#3066BE] shadow-sm"
                            >
                                <Pencil size={13} strokeWidth={2} />
                            </div >
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
                            <h3 className="text-base font-bold text-black">
                                {user?.title || "Введите название"}
                            </h3>
                            <div
                                onClick={() => setEditingField("title")}
                                className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                            >
                                <Pencil size={13} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-[6px]">
                            <span className="text-base font-bold text-black">
                              {user?.salary_usd ? `${user.salary_usd}$` : "0.00$"}
                            </span>
                            <div
                                onClick={() => setEditingField("price")}
                                className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                            >
                                <Pencil size={13} strokeWidth={2} />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-2 flex items-start gap-2 mb-[70px]">
                        <p className="text-sm flex-1 text-[#AEAEAE]">
                            {user?.description || "Опишите свои сильные стороны и навыки"}
                        </p>
                        <div
                            onClick={() => setEditingField("description")}
                            className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center shrink-0"
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
                            className="w-6 h-6 rounded-full border border-[#3066BE] mr-[-28px] text-[#3066BE] flex items-center justify-center shrink-0"
                            aria-label="Portfolio qo‘shish"
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
                            className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center shrink-0"
                        >
                            <Plus size={13} strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {skills.map((s) => (
                            <span
                                key={s.id}
                                className="px-3 py-1 rounded-full bg-[#D9D9D9] text-black border text-xs"
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
                                onClick={() => setEditingField("hours")}
                                className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                            >
                                <Pencil size={14} strokeWidth={2} />
                            </div>
                        </div>
                        <p className="mt-1 text-sm font-medium text-black">
                            {workHours || "Более 30 часов в неделю"}
                        </p>
                        <p className="text-xs text-[#AEAEAE] mt-1">
                            Открыт для заключения контракта на найм
                        </p>
                    </div>

                    {/* Languages */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-black">Языки</h3>
                            <div className="flex gap-2">
                                <div
                                    onClick={() => setEditingField("languages")}
                                    className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                                >
                                    <Pencil size={14} strokeWidth={2} />
                                </div>
                                <div
                                    onClick={() => setAddingField("languages")}
                                    className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                                >
                                    <Plus size={16} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                        <ul className="mt-1 space-y-1 text-sm text-black">
                            <li>
                                Английский: <span className="text-gray-500">B2</span>
                            </li>
                            <li>
                                Русский: <span className="text-gray-500">B1</span>
                            </li>
                            <li>
                                Узбекский: <span className="text-gray-500">родной язык</span>
                            </li>
                        </ul>
                    </div>

                    {/* Education */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-black">Образование</h3>
                            <div className="flex gap-2">
                                <div
                                    onClick={() => setAddingField("education")}
                                    className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                                >
                                    <Plus size={16} strokeWidth={2} />
                                </div>
                                <div
                                    onClick={() => setEditingField("education")}
                                    className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                                >
                                    <Pencil size={14} strokeWidth={2} />
                                </div>
                                <div
                                    onClick={() => deleteEducation()}
                                    className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                                >
                                    <Trash2 size={14} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 text-sm text-black">
                            <p className="font-medium">Monday academy</p>
                            <p className="text-[#AEAEAE]">Graphic design</p>
                            <p className="text-[#AEAEAE]">2023–2023</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CERTIFICATES */}
            <section className="px-3 mt-3">
                <div className="rounded-none border-y border-[#AEAEAE] bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-3 border-b border-[#AEAEAE]">
                        <h3 className="text-[16px] font-bold text-black">Сертификаты</h3>
                        <div
                            onClick={() => setCertModalOpen(true)}
                            className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                        >
                            <Plus size={16} strokeWidth={2} />
                        </div>
                    </div>

                    {/* Body */}
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
                                        className="border rounded-xl p-2 active:scale-[0.99] text-left"
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
                                                        : `http://localhost:8000${c.file}`
                                                }
                                                alt={c.name}
                                                className="w-full h-24 object-cover rounded"
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

            {/* EXPERIENCE (Figma style) */}
            <section className="px-3 mt-3 mb-[40px]">
                <div className="rounded-none border-y border-[#AEAEAE] bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-3 border-b border-[#AEAEAE]">
                        <h3 className="text-[16px] font-bold text-black">Опыт работы</h3>
                        <div
                            onClick={() => setIsExpOpen(true)}
                            className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center active:scale-95"
                            aria-label="Добавить опыт"
                        >
                            <Plus size={16} strokeWidth={2} />
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-3 py-6">
                        {(!Array.isArray(experiences) || experiences.length === 0) ? (
                            <p className="text-center text-sm text-gray-400 max-w-[90%] mx-auto leading-relaxed">
                                Перечисление вашего опыта работы может помочь подтвердить
                                ваши особые знания и способности.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="border rounded-xl p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold truncate">
                                                    {exp.title || exp.position || "Должность"}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {exp.company || "Компания"}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 shrink-0">
                                                {exp.start_month && exp.start_year
                                                    ? `${exp.start_month} ${exp.start_year} — ${
                                                        exp.is_current ? "по наст. время" : exp.end_month + " " + exp.end_year
                                                    }`
                                                    : ""}
                                            </div>
                                        </div>
                                        {exp.description && (
                                            <p className="mt-2 text-sm text-gray-600">{exp.description}</p>
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
                onSave={() => api.get("skills/skills/").then(r => setSkills(r.data))}
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
                onClose={()=>setIsExpOpen(false)}
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
                                        : `http://localhost:8000${selectedCertificate.file || ""}`
                                }
                                alt={selectedCertificate.name}
                                className="w-full max-h-[300px] object-contain rounded-lg"
                            />
                        )}

                        <div className="mt-3">
                            <h4 className="font-bold">{selectedCertificate.name}</h4>
                            <p className="text-sm text-gray-500">{selectedCertificate.organization}</p>
                            {selectedCertificate.issue_date && (
                                <p className="text-xs text-gray-400">{selectedCertificate.issue_date}</p>
                            )}
                        </div>
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
