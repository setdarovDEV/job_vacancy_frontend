import React, { useState, useRef, useEffect } from "react";
import { UserRound, Sun, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "./AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdownJobSeekerTablet from "./tablet/ProfileDropdownJObSeekerTablet.jsx";

const DEFAULT_AVATAR = "/user.jpg";

export default function ProfileDropdownJobSeeker() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // Darhol ko'rinadigan avatar (localStorage -> default)
    const [profileImage, setProfileImage] = useState(
        sanitizeStored(localStorage.getItem("profile_image")) || DEFAULT_AVATAR
    );
    const [user, setUser] = useState(null);

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // --- Helpers ---
    function sanitizeStored(val) {
        if (!val) return null;
        const s = String(val).trim().toLowerCase();
        if (s === "null" || s === "undefined" || s === "") return null;
        return val;
    }

    const getOrigin = () => {
        try {
            const raw = api?.defaults?.baseURL || "";
            const u = new URL(raw, window.location.origin);
            return `${u.protocol}//${u.host}`;
        } catch {
            return window.location.origin;
        }
    };

    const normalizePath = (p) => String(p || "").trim().replace(/\s+/g, "");
    const makeMediaUrl = (path) => {
        const raw = normalizePath(path);
        if (!raw || raw === "null" || raw === "undefined") return null;
        if (/^https?:\/\//i.test(raw)) return raw; // to‘liq URL
        const origin = getOrigin();
        const cleaned = raw.replace(/^\/+/, "");
        return `${origin}/${cleaned}`.replace(/([^:]\/)\/+/g, "$1");
    };

    const useDefaultAvatar = () => {
        setProfileImage(DEFAULT_AVATAR);
        localStorage.setItem("profile_image", DEFAULT_AVATAR);
    };

    // Avatar URL ni olib kelish (UI bloklanmaydi)
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/api/auth/profile/");
                const imagePath = res?.data?.profile_image || null;
                const full = makeMediaUrl(imagePath);
                if (full && full !== DEFAULT_AVATAR) {
                    // img src’da cache-bust; localStorage’da sof URL
                    const withTs = `${full}${full.includes("?") ? "&" : "?"}t=${Date.now()}`;
                    setProfileImage(withTs);
                    localStorage.setItem("profile_image", full);
                } else {
                    useDefaultAvatar();
                }
            } catch (err) {
                useDefaultAvatar();
                console.debug("Avatar fetch skipped:", err?.response?.status || err?.message);
            }
        })();
    }, []);

    // User ma'lumotlari
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);
            } catch {
                setUser(null);
            }
        })();
    }, []);

    // Logout
    const handleLogout = async () => {
        const refreshToken =
            localStorage.getItem("refresh_token") || localStorage.getItem("refresh");
        try {
            if (refreshToken) {
                await api.post("/api/auth/logout/", { refresh: refreshToken });
            }
        } catch (err) {
            console.debug("Logout info:", err?.response?.data || err?.message);
        } finally {
            ["access", "access_token", "refresh", "refresh_token", "profile_image"].forEach((k) =>
                localStorage.removeItem(k)
            );
            navigate("/login");
        }
    };

    // Tashqariga bosilganda yopish
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Ism formatlash
    const formatName = (fullName) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ").filter(Boolean);
        if (parts.length < 2) return fullName;
        const firstInitial = parts[0][0].toUpperCase();
        const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        return `${firstInitial}. ${lastName}`;
    };

    return (
        <>
            {/* Tablet/Mobile */}
            <div className="block lg:hidden">
                <ProfileDropdownJobSeekerTablet />
            </div>

            {/* Desktop */}
            <div className="hidden lg:block relative text-left" ref={dropdownRef}>
                {/* Avatar tugma */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-[56px] h-[56px] rounded-full bg-gray-200 overflow-hidden"
                    aria-label="Open profile menu"
                >
                    <div className="absolute inset-0">
                        <SafeImg
                            src={profileImage}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-[300px] h-[240px] text-black bg-[#F4F6FA] rounded-xl shadow-[ -4px_-2px_20px_0px_rgba(0,0,0,0.15)] z-40">
                        {/* Header */}
                        <div className="px-4 h-[79px] flex items-center gap-3 border-b border-black relative">
                            <SafeImg
                                src={profileImage}
                                className="w-[60px] h-[60px] rounded-full object-cover cursor-pointer"
                                onClick={() => setIsAvatarModalOpen(true)}
                            />
                            <div>
                                <p className="text-[16px] font-semibold underline text-black">
                                    {user?.full_name ? formatName(user.full_name) : "Guest"}
                                </p>
                                <p className="text-[14px] text-black mt-[4px]">
                                    {user?.title || "Профессия не указана"}
                                </p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="px-4 py-2 space-y-3">
                            <a href="/profile" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                                <UserRound size={18} /> Ваш профиль
                            </a>
                            <a href="/" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                                <Sun size={18} /> Тема: light
                            </a>
                            <a href="/" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                                <Settings size={18} /> Настройки
                            </a>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-black mt-2 pt-2 px-4 bg-[#F4F6FA]">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm ml-[-15px] bg-[#F4F6FA] border-none text-black hover:text-red-600"
                            >
                                <LogOut size={18} /> Выйти
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal */}
                {isAvatarModalOpen && (
                    <ChangeProfileImageModal
                        onClose={() => setIsAvatarModalOpen(false)}
                        onSuccess={(url) => {
                            const finalUrl = makeMediaUrl(url);
                            if (finalUrl && finalUrl !== DEFAULT_AVATAR) {
                                const withTs = `${finalUrl}${finalUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
                                setProfileImage(withTs);
                                localStorage.setItem("profile_image", finalUrl);
                            } else {
                                useDefaultAvatar();
                            }
                        }}
                        setProfileImage={(u) => {
                            const finalUrl = makeMediaUrl(u);
                            if (finalUrl && finalUrl !== DEFAULT_AVATAR) {
                                const withTs = `${finalUrl}${finalUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
                                setProfileImage(withTs);
                                localStorage.setItem("profile_image", finalUrl);
                            } else {
                                useDefaultAvatar();
                            }
                        }}
                    />
                )}
            </div>
        </>
    );
}

// Ixtiyoriy
function SaveChangesButton() {
    const handleSave = () => {
        toast.success("Ma'lumotlar saqlandi ✅");
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };
    return (
        <div className="mt-6 flex justify-end">
            <button
                onClick={handleSave}
                className="px-6 py-3 bg-[#3066BE] text-white rounded-lg font-semibold hover:bg-[#2452a6] transition"
            >
                Saqlash
            </button>
        </div>
    );
}

function SafeImg({ src, alt = "avatar", className = "", ...imgProps }) {
    const normalizeSrc = (v) => {
        const s = (v || "").toString().trim();
        return s ? s : DEFAULT_AVATAR;
    };
    const [s, setS] = useState(normalizeSrc(src));
    useEffect(() => {
        setS(normalizeSrc(src));
    }, [src]);

    return (
        <img
            src={s}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => {
                if (s !== DEFAULT_AVATAR) {
                    setS(DEFAULT_AVATAR);
                    localStorage.setItem("profile_image", DEFAULT_AVATAR);
                }
            }}
            {...imgProps}
        />
    );
}
