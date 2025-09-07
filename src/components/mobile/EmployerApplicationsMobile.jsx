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
import PostVacancyWizardMobile from "./PostVacancyWizardMobile.jsx";
import ApplicantPreviewCardMobile from "./ApplicantPreviewCardMobile";


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
    const [open, setOpen] = useState(false);
    const [applications, setApplications] = useState([]);


    // helper (raw -> UI)
    const normalizeApplication = (raw = {}) => {
        const a = raw.applicant || raw.user || {};
        return {
            id: raw.id || raw.application_id || a.id || Math.random().toString(36).slice(2),
            avatar: a.profile_image || raw.avatar || "/user.png",
            full_name: a.full_name || raw.full_name || "Кандидат",
            title: a.title || raw.title || "Графический дизайнер, веб дизайнер",
            rating: a.rating ?? raw.rating ?? 4.5,
            summary: raw.summary || a.bio || "",
            skills: Array.isArray(a.skills || raw.skills) ? (a.skills || raw.skills) : [],
        };
    };

// useEffect ichida (masalan sahifa yuklanganda):
    useEffect(() => {
        let alive = true;
        api.get("/api/employer/applications/")
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
                if (alive) setApplications(list.map(normalizeApplication));
            })
            .catch(() => {
                // fallback demo, xohlasangiz olib tashlang
                setApplications([normalizeApplication({
                    applicant: {
                        full_name: "Lola Yuldasheva",
                        profile_image: "/user.png",
                        title: "Графический дизайнер, веб дизайнер",
                        rating: 4.5,
                        skills: ["Лого дизайн","Adobe Illustrator","Adobe Photoshop"],
                        bio: "Здравствуйте! Я — увлечённый и внимательный…",
                    }
                })]);
            });
        return () => { alive = false; };
    }, []);

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

    // ⭐ Yulduzlar
    const Stars = ({ value = 0 }) => (
        <div className="flex items-center gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className={`w-5 h-5 ${i < value ? "fill-yellow-400" : "fill-gray-300"}`}
                    viewBox="0 0 20 20"
                >
                    <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                </svg>
            ))}
        </div>
    );

// 📄 Bitta e’lon kartasi
    const AnnCard = ({
                         timeText,
                         title,
                         budget,
                         description,
                         tags = [],
                         paymentText,
                         rating = 0,
                         location,
                         onEdit = () => {},
                         onDelete = () => {},
                     }) => (
        <div className="relative px-3 py-4 border-b border-[#AEAEAE] bg-white">
            {/* vaqt */}
            <div className="flex items-center text-gray-400 text-[10px] mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeText}
            </div>

            {/* title + actions */}
            <div className="flex items-start justify-between gap-3">
                <h4 className="text-[15px] font-extrabold text-black leading-snug">{title}</h4>

                <div className="flex items-center gap-2 shrink-0">
                    <div
                        onClick={onEdit}
                        className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center active:scale-95"
                        aria-label="edit"
                    >
                        <Pencil size={16} />
                    </div>
                    <div
                        onClick={onDelete}
                        className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center active:scale-95"
                        aria-label="delete"
                    >
                        <Trash2 size={16} />
                    </div>
                </div>
            </div>

            {/* budget */}
            <p className="text-gray-400 font-semibold mt-1 text-[12px]">{budget}</p>

            {/* description (2 qator clamp, plugin kerak emas) */}
            <p
                className="text-gray-400 mt-4 text-[12px] leading-7"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {description}
            </p>

            {/* tags */}
            {!!tags.length && (
                <div className="flex flex-wrap gap-3 mt-4">
                    {tags.map((t, i) => (
                        <span key={i} className="px-2 py-1 bg-[#D9D9D9] text-black rounded-full text-[13px]">
                            {t}
                        </span>
                    ))}
                </div>
            )}

            {/* pastki qator: to'lov, yulduz, lokatsiya */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-[12px] mt-6">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M9 12l2 2 4-4" />
                    </svg>
                    {paymentText}
                </div>

                <Stars value={rating} />

                <div className="flex items-center gap-2 text-[12px]">
                    <img src="/location.png" alt="loc" className="w-5 h-5" />
                    {location}
                </div>
            </div>
        </div>
    );


    // ===== UI =====
    return (
        <div className="w-full max-w-[393px] mx-auto bg-white min-h-[100dvh]">
            <MobileNavbar />

            <HeaderNotifications />

            {/* HEADER CARD (button avatar pastki-o‘ngida) */}
            <div className="px-3 pt-3">
                <div className="border-y border-[#AEAEAE] bg-white mt-[20px] px-3 py-3">
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

            {/* YOUR ANNOUNCEMENTS */}
            <section className="px-3 mt-3">
                <div className="rounded-none border-b border-[#AEAEAE] bg-white">
                    <div className="flex items-center justify-between px-3 py-3">
                        <h3 className="text-[16px] font-bold text-black">Отклики</h3>
                        <div
                            onClick={() => setOpen(true)}
                            className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                        >
                            <Plus size={16} strokeWidth={2} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-3">
                <div className="bg-white">
                    {applications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-400">
                            Пока нет откликов
                        </div>
                    ) : (
                        applications.map(a => (
                            <ApplicantPreviewCardMobile
                                key={a.id}
                                avatar={a.avatar}
                                fullName={a.full_name}
                                title={a.title}
                                rating={a.rating}
                                summary={a.summary}
                                skills={a.skills}
                            />
                        ))
                    )}
                </div>
            </section>

            <section className="px-3 mt-3">
                <div className="rounded-none border-b border-[#AEAEAE] bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-3 border-b border-[#AEAEAE]">
                        <h3 className="text-[16px] font-bold text-black">Компании</h3>
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
                            <p className="text-center text-sm text-gray-400 h-[103px] max-w-[90%] mt-[30px] mx-auto leading-relaxed">
                                Указав название вашей компании,
                                вы можете повысить доверие сотрудников.
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

            <div className="border-t mt-[45px]"></div>


            {avatarModalOpen && (
                <ChangeProfileImageModal
                    isOpen={avatarModalOpen}
                    onClose={() => setAvatarModalOpen(false)}
                    setProfileImage={setProfileImage}
                />
            )}

            <PostVacancyWizardMobile
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={async (payload) => {
                    // await api.post("/api/vacancies/jobposts/", payload);
                }}
            />

            <MobileFooter />
        </div>
    );
}