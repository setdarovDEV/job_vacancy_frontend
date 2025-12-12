import React, { useState, useEffect, useCallback } from "react";
import { Pencil, Plus, X, Trash2} from "lucide-react";
import axios from "axios";
import api, { getMediaURL, getAvatarURL, getLogoURL } from "../../utils/api";

// Bo'lim komponentlari
import MobileNavbar from "./MobileNavbarLogin.jsx";
import ChangeProfileImageModal from "../../components/AvatarUploadModal";
import MobileFooter from "./MobileFooter.jsx";
import HeaderNotifications from "./HeaderNotifications.jsx";
import PortfolioFullModal from "./ProfilePortfolioModal.jsx";
import ExperienceFullModal from "./ExperienceFullModal.jsx";
import PostVacancyWizardMobile from "./PostVacancyWizardMobile.jsx";
import CertificateModal from "../../components/CertificateModal";
import CompanyModalMobile from "./CompanyCreateModal.jsx";


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

    // ✅ VAKANSIYALAR STATE
    const [vacancies, setVacancies] = useState([]);
    const [loadingVacancies, setLoadingVacancies] = useState(true);
    const [selectedVacancy, setSelectedVacancy] = useState(null);

    // ✅ KOMPANIYALAR STATE
    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [showCompanyModal, setShowCompanyModal] = useState(false);


    // ===== EFFECTS =====
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/api/auth/me/");
                setUser(data);
                setWorkHours(data.work_hours_per_week || "Не указано");

                // ✅ Avatar rasmini to'g'ri yuklash
                if (data?.profile_image) {
                    const imageUrl = getMediaURL(data.profile_image);
                    console.log("✅ Avatar URL:", imageUrl);
                    setProfileImage(imageUrl);
                    localStorage.setItem("profile_image", imageUrl);
                }
            } catch (e) {
                console.error("❌ User ma'lumotini olishda xatolik:", e);
            }
        })();
    }, []);

    // ✅ VAKANSIYALARNI YUKLASH
    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                setLoadingVacancies(true);
                const { data } = await api.get("/api/vacancies/jobposts/");
                // Backend pagination qaytarishi mumkin
                const results = Array.isArray(data) ? data : (data.results || []);
                setVacancies(results);
                console.log("✅ Vakansiyalar yuklandi:", results);
            } catch (e) {
                console.error("❌ Vakansiyalarni yuklashda xatolik:", e);
            } finally {
                setLoadingVacancies(false);
            }
        };

        fetchVacancies();
    }, []);

    // ✅ KOMPANIYALARNI YUKLASH
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoadingCompanies(true);
                const { data } = await api.get("/api/companies/");
                // Backend pagination qaytarishi mumkin
                const results = Array.isArray(data) ? data : (data.results || []);

                // Faqat foydalanuvchining kompaniyalarini ko'rsatish
                const userCompanies = results.filter(company =>
                    company.owner === user?.id || company.owner?.id === user?.id
                );

                setCompanies(userCompanies);
                console.log("✅ Kompaniyalar yuklandi:", userCompanies);
            } catch (e) {
                console.error("❌ Kompaniyalarni yuklashda xatolik:", e);
            } finally {
                setLoadingCompanies(false);
            }
        };

        // Faqat user yuklangandan keyin kompaniyalarni yuklash
        if (user?.id) {
            fetchCompanies();
        }
    }, [user]);

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
        try {
            const p = await api.get("portfolio/projects/");
            const projects = p.data?.results || [];
            const mediaReqs = projects.map(pr => api.get(`portfolio/portfolio-media/?project=${pr.id}`));
            const mediaRes = await Promise.all(mediaReqs);
            const all = mediaRes.flatMap(m => m.data.results || []);
            setPortfolioItems(all);
        } catch (_) {}
    };

    const reloadExperiences = useCallback(async () => {
        try {
            const { data } = await api.get("experience/experiences/");
            setExperiences(data);
        } catch (e) {
            console.error("Reload experiences error:", e);
        }
    }, []);

    useEffect(() => {
        reloadExperiences();
    }, [reloadExperiences]);

    // ✅ VAKANSIYA EDIT
    const handleEditVacancy = (vacancy) => {
        setSelectedVacancy(vacancy);
        setOpen(true);
    };

    // ✅ VAKANSIYA DELETE
    const handleDeleteVacancy = async (id) => {
        if (!window.confirm("Rostdan ham bu vakansiyani o'chirmoqchimisiz?")) return;

        try {
            await api.delete(`/api/vacancies/jobposts/${id}/`);
            setVacancies(prev => prev.filter(v => v.id !== id));
            alert("✅ Vakansiya o'chirildi!");
        } catch (e) {
            console.error("❌ O'chirishda xatolik:", e);
            alert("Xatolik yuz berdi!");
        }
    };

    // ✅ VAKANSIYA YARATISH/YANGILASH
    const handleSubmitVacancy = async (payload) => {
        try {
            if (selectedVacancy) {
                // PATCH - yangilash
                await api.patch(`/api/vacancies/jobposts/${selectedVacancy.id}/`, payload);
                alert("✅ Vakansiya yangilandi!");
            } else {
                // POST - yangi yaratish
                await api.post("/api/vacancies/jobposts/", payload);
                alert("✅ Vakansiya yaratildi!");
            }

            // Ro'yxatni qayta yuklash
            const { data } = await api.get("/api/vacancies/jobposts/");
            const results = Array.isArray(data) ? data : (data.results || []);
            setVacancies(results);

            setOpen(false);
            setSelectedVacancy(null);
        } catch (e) {
            console.error("❌ Saqlashda xatolik:", e);
            alert("Xatolik yuz berdi!");
        }
    };

    // ✅ KOMPANIYALARNI QAYTA YUKLASH
    const reloadCompanies = async () => {
        try {
            setLoadingCompanies(true);
            const { data } = await api.get("/api/companies/");
            const results = Array.isArray(data) ? data : (data.results || []);

            // Faqat foydalanuvchining kompaniyalarini
            const userCompanies = results.filter(company =>
                company.owner === user?.id || company.owner?.id === user?.id
            );

            setCompanies(userCompanies);
            console.log("✅ Kompaniyalar qayta yuklandi:", userCompanies);
        } catch (e) {
            console.error("❌ Kompaniyalarni yuklashda xatolik:", e);
        } finally {
            setLoadingCompanies(false);
        }
    };

    // ✅ KOMPANIYA DELETE
    const handleDeleteCompany = async (companyId) => {
        if (!window.confirm("Rostdan ham bu kompaniyani o'chirmoqchimisiz?")) return;

        try {
            await api.delete(`/api/companies/${companyId}/`);
            setCompanies(prev => prev.filter(c => c.id !== companyId));
            alert("✅ Kompaniya o'chirildi!");
        } catch (e) {
            console.error("❌ O'chirishda xatolik:", e);
            alert("Xatolik yuz berdi!");
        }
    };

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

    // ✅ FORMAT TIME AGO
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHrs < 1) return "Менее часа назад";
        if (diffHrs < 24) return `${diffHrs} час${diffHrs > 1 ? 'а' : ''} назад`;
        if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'день' : 'дня'} назад`;
        return date.toLocaleDateString('ru-RU');
    };

    // 📄 Bitta vakansiya kartasi
    const VacancyCard = ({ vacancy }) => (
        <div className="relative px-3 py-4 border-b border-[#AEAEAE] bg-white">
            {/* vaqt */}
            <div className="flex items-center text-gray-400 text-[10px] mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTimeAgo(vacancy.created_at)}
            </div>

            {/* title + actions */}
            <div className="flex items-start justify-between gap-3">
                <h4 className="text-[15px] font-extrabold text-black leading-snug">
                    {vacancy.title || "Без названия"}
                </h4>

                <div className="flex items-center gap-2 shrink-0">
                    <div
                        onClick={() => handleEditVacancy(vacancy)}
                        className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center active:scale-95"
                        aria-label="edit"
                    >
                        <Pencil size={16} />
                    </div>
                    <div
                        onClick={() => handleDeleteVacancy(vacancy.id)}
                        className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center active:scale-95"
                        aria-label="delete"
                    >
                        <Trash2 size={16} />
                    </div>
                </div>
            </div>

            {/* budget */}
            <p className="text-gray-400 font-semibold mt-1 text-[12px]">
                {vacancy.budget_min && vacancy.budget_max
                    ? `Бюджет: ${vacancy.budget_min}$–${vacancy.budget_max}$`
                    : "Бюджет не указан"}
            </p>

            {/* description (2 qator clamp) */}
            <p
                className="text-gray-400 mt-4 text-[12px] leading-7"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {vacancy.description || "Описание отсутствует"}
            </p>

            {/* tags */}
            {vacancy.skills && vacancy.skills.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                    {vacancy.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-[#D9D9D9] text-black rounded-full text-[13px]">
                            {skill}
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
                    {vacancy.plan === "Pro" || vacancy.plan === "Premium"
                        ? "Платеж подтвержден"
                        : "Базовый план"}
                </div>

                <Stars value={vacancy.average_stars || 0} />

                <div className="flex items-center gap-2 text-[12px]">
                    <img src="/location.png" alt="loc" className="w-5 h-5" />
                    {vacancy.is_remote ? "Удалённо" : (vacancy.location || "Локация не указана")}
                </div>
            </div>
        </div>
    );


    // ===== UI =====
    return (
        <div className="w-full max-w-[393px] mx-auto bg-white min-h-[100dvh]">
            <MobileNavbar />
            {/* HEADER CARD */}
            <div className="px-3 pt-3">
                <div className="border-y border-[#AEAEAE] bg-white mt-[20px] px-3 py-3">
                    <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 shrink-0">
                            <img
                                src={profileImage || "/user.jpg"}
                                alt="avatar"
                                className="w-14 h-14 rounded-full object-cover"
                            />
                            <div
                                onClick={() => setAvatarModalOpen(true)}
                                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white border border-[#3066BE] flex items-center justify-center text-[#3066BE] shadow-sm"
                            >
                                <Pencil size={13} strokeWidth={2} />
                            </div>
                        </div>

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

            {/* YOUR ANNOUNCEMENTS HEADER */}
            <section className="px-3 mt-3">
                <div className="rounded-none border-b border-[#AEAEAE] bg-white">
                    <div className="flex items-center justify-between px-3 py-3">
                        <h3 className="text-[16px] font-bold text-black">Ваше объявления</h3>
                        <div
                            onClick={() => {
                                setSelectedVacancy(null);
                                setOpen(true);
                            }}
                            className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                        >
                            <Plus size={16} strokeWidth={2} />
                        </div>
                    </div>
                </div>
            </section>

            {/* VACANCIES LIST */}
            <section className="px-3">
                <div className="bg-white">
                    {loadingVacancies ? (
                        <div className="text-center py-8 text-gray-400">
                            Yuklanmoqda...
                        </div>
                    ) : vacancies.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            Hozircha vakansiyalar yo'q
                        </div>
                    ) : (
                        vacancies.map((vacancy) => (
                            <VacancyCard key={vacancy.id} vacancy={vacancy} />
                        ))
                    )}
                </div>
            </section>

            {/* CERTIFICATES / COMPANIES */}
            <section className="px-3 mt-3">
                <div className="rounded-none border-b border-[#AEAEAE] bg-white">
                    <div className="flex items-center justify-between px-3 py-3 border-b border-[#AEAEAE]">
                        <h3 className="text-[16px] font-bold text-black">Компании</h3>
                        <div
                            onClick={() => setShowCompanyModal(true)}
                            className="w-7 h-7 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center"
                        >
                            <Plus size={16} strokeWidth={2} />
                        </div>
                    </div>

                    <div className="px-3 py-6">
                        {loadingCompanies ? (
                            <div className="text-center text-sm text-gray-400">
                                Загрузка...
                            </div>
                        ) : companies.length === 0 ? (
                            <p className="text-center text-sm text-gray-400 h-[103px] max-w-[90%] mt-[30px] mx-auto leading-relaxed">
                                Указав название вашей компании,
                                вы можете повысить доверие сотрудников.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {companies.map((company) => (
                                    <div
                                        key={company.id}
                                        className="border border-[#E5E7EB] rounded-xl p-3 bg-white"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            {/* Company Info */}
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                {/* Logo */}
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                                                    <img
                                                        src={getLogoURL(company) || '/company-default.png'}
                                                        alt={company.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/company-default.png';
                                                        }}
                                                    />
                                                </div>

                                                {/* Details */}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-[14px] font-semibold text-black truncate">
                                                        {company.name}
                                                    </h4>
                                                    {company.industry && (
                                                        <p className="text-[12px] text-gray-500 truncate">
                                                            {company.industry}
                                                        </p>
                                                    )}
                                                    {company.location && (
                                                        <p className="text-[12px] text-gray-400 truncate flex items-center gap-1">
                                                            <img src="/location.png" alt="loc" className="w-3 h-3" />
                                                            {company.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div
                                                    onClick={() => {
                                                        // TODO: Edit modal
                                                        console.log("Edit company:", company.id);
                                                    }}
                                                    className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center active:scale-95"
                                                >
                                                    <Pencil size={14} />
                                                </div>
                                                <div
                                                    onClick={() => handleDeleteCompany(company.id)}
                                                    className="w-6 h-6 rounded-full border border-[#3066BE] text-[#3066BE] flex items-center justify-center active:scale-95"
                                                >
                                                    <Trash2 size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        {company.website && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[12px] text-[#3066BE] hover:underline truncate block"
                                                >
                                                    {company.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="border-t mt-[45px]"></div>

            {/* MODALS */}
            {avatarModalOpen && (
                <ChangeProfileImageModal
                    isOpen={avatarModalOpen}
                    onClose={() => setAvatarModalOpen(false)}
                    setProfileImage={setProfileImage}
                />
            )}

            {certModalOpen && (
                <CertificateModal
                    isOpen={certModalOpen}
                    onClose={() => setCertModalOpen(false)}
                    onSave={saveCertificate}
                />
            )}

            <CompanyModalMobile
                isOpen={showCompanyModal}
                onClose={() => setShowCompanyModal(false)}
                onSuccess={reloadCompanies}
                company={null}
            />

            <PostVacancyWizardMobile
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    setSelectedVacancy(null);
                }}
                vacancy={selectedVacancy}
                onSubmit={handleSubmitVacancy}
            />

            <MobileFooter />
        </div>
    );
}