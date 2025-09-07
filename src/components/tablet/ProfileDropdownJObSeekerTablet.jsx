// src/components/ProfileDropdownJobSeekerTablet.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { UserRound, Sun, Settings, LogOut, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "../AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../../utils/api";

// ---------- Helpers (xato sababini shu yer to‘g‘rilaydi) ----------
const appendTs = (url) => `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
const resolveMediaUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return appendTs(path);

    // base domen: .env dan yoki axios baseURL dan yoki joriy origin
    const base =
        (import.meta?.env?.VITE_MEDIA_BASE ||
            import.meta?.env?.VITE_API_BASE ||
            api?.defaults?.baseURL ||
            window.location.origin ||
            "").replace(/\/+$/, "");

    const p = path.startsWith("/") ? path : `/${path}`;
    return appendTs(`${base}${p}`);
};
// -------------------------------------------------------------------

export default function ProfileDropdownJobSeekerTablet() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let alive = true;
        setLoading(true);

        const loadAll = async () => {
            try {
                const [meRes, profRes] = await Promise.allSettled([
                    api.get("/api/auth/me/"),
                    api.get("/api/auth/profile/"),
                ]);

                if (!alive) return;

                if (meRes.status === "fulfilled") setUser(meRes.value.data);

                if (profRes.status === "fulfilled") {
                    const path = profRes.value?.data?.profile_image; // <= 'imagePath' EMAS
                    if (path) {
                        const url = resolveMediaUrl(path);
                        setProfileImage(url);
                        localStorage.setItem("profile_image", url);
                    } else {
                        const cached = localStorage.getItem("profile_image");
                        if (cached) setProfileImage(cached);
                    }
                }
            } catch (e) {
                console.warn("Profile dropdown load error:", e);
            } finally {
                if (alive) setLoading(false);
            }
        };

        loadAll();
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) {
                setIsOpen(false);
            }
        };
        const handleEsc = (e) => e.key === "Escape" && setIsOpen(false);
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const formatName = useCallback((fullName) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) return parts[0];
        const firstInitial = parts[0][0]?.toUpperCase() || "";
        const lastName = parts[1] ? parts[1][0]?.toUpperCase() + parts[1].slice(1) : "";
        return `${firstInitial}. ${lastName}`.trim();
    }, []);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        try {
            if (refreshToken) await api.post("/api/auth/logout/", { refresh: refreshToken });
        } catch (err) {
            console.warn("Logout backend error:", err?.response?.data || err.message);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
        }
    };

    const handleThemeToggle = () => toast.info("Tizim: Light/Dark almashtirish sozlanmoqda ⚙️");

    return (
        <div className="relative text-left" ref={dropdownRef}>
            {/* Avatar tugma */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full border border-black/10 bg-gray-200 p-0"
            >
                <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                        src={profileImage || "/user-white.jpg"}
                        alt="avatar"
                        className="block !w-full !h-full object-cover rounded-none"
                        onError={(e) => {
                            localStorage.removeItem("profile_image");
                            e.currentTarget.src = "/user-white.jpg";
                        }}
                    />
                </div>
            </button>


            {/* Dropdown menyu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[280px] md:w-[300px] text-black bg-[#F4F6FA] rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.15)] z-40">
                    {/* Profil ma’lumotlari */}
                    <div className="px-4 py-3 flex items-center gap-3 border-b border-black/20">
                        <img
                            src={profileImage || "/user.jpg"}
                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full object-cover cursor-pointer"
                            alt="avatar"
                            onClick={() => setIsAvatarModalOpen(true)}
                            onError={(e) => (e.currentTarget.src = "/user.jpg")}
                        />
                        <div className="min-w-0">
                            <p className="text-[15px] md:text-[16px] font-semibold underline truncate">
                                {loading ? "Yuklanmoqda..." : formatName(user?.full_name)}
                            </p>
                            <p className="text-[13px] md:text-[14px] text-black mt-[2px] truncate">
                                {user?.title || "Профессия не указана"}
                            </p>
                        </div>
                    </div>

                    {/* Menyu itemlar */}
                    <div className="px-3 py-2 space-y-2 md:space-y-3">
                        <a href="/profile" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                            <UserRound size={18} /> Ваш профиль
                        </a>
                        <a href="#" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                            <Sun size={18} /> Тема: light
                        </a>
                        <a href="/settings" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                            <Settings size={18} /> Настройки
                        </a>
                        <a href="/activity" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                            <LineChart size={18} /> Активность
                        </a>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-black/20 mt-2 pt-2 px-3 md:px-4 bg-[#F4F6FA]">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-2 py-1.5 text-xs md:text-sm
                                     text-black bg-[#F4F6FA] border-none hover:text-red-600
                                       rounded-md ml-[-9px] mb-[5px]"
                        >
                            <LogOut size={18} /> {/* ikon ham kichraytirildi */}
                            Выйти
                        </button>

                    </div>
                </div>
            )}

            {/* ✅ MODAL */}
            {isAvatarModalOpen && (
                <ChangeProfileImageModal
                    onClose={() => setIsAvatarModalOpen(false)}
                    onSuccess={(urlOrPath) => {
                        const final = resolveMediaUrl(urlOrPath);
                        setProfileImage(final);
                        localStorage.setItem("profile_image", final);
                        toast.success("Avatar yangilandi ✅");
                    }}
                    setProfileImage={(urlOrPath) => {
                        const final = resolveMediaUrl(urlOrPath);
                        setProfileImage(final);
                        localStorage.setItem("profile_image", final);
                    }}
                />
            )}
        </div>
    );
}
