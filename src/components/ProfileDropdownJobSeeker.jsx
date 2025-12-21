import React, { useState, useRef, useEffect } from "react";
import { UserRound, Sun, Settings, LogOut, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "./AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdownJobSeekerTablet from "./tablet/ProfileDropdownJObSeekerTablet.jsx";
import ProfileDropdownJobSeekerMobile from "./mobile/ProfileDropdownJobSeekerMobile.jsx";

const DEFAULT_AVATAR = "/user1.png";

export default function ProfileDropdownJobSeeker() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(
        sanitizeStored(localStorage.getItem("profile_image")) || DEFAULT_AVATAR
    );
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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
        if (/^https?:\/\//i.test(raw)) return raw;
        const origin = getOrigin();
        const cleaned = raw.replace(/^\/+/, "");
        return `${origin}/${cleaned}`.replace(/([^:]\/)\/+/g, "$1");
    };

    const useDefaultAvatar = () => {
        setProfileImage(DEFAULT_AVATAR);
        localStorage.setItem("profile_image", DEFAULT_AVATAR);
    };

    // ✅ Avatar va user ma'lumotlarini olish
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/api/auth/profile/");
                const data = res?.data || {};

                // Avatar
                const imagePath = data.profile_image || null;
                const full = makeMediaUrl(imagePath);
                if (full && full !== DEFAULT_AVATAR) {
                    const withTs = `${full}?t=${Date.now()}`;
                    setProfileImage(withTs);
                    localStorage.setItem("profile_image", full);
                } else {
                    useDefaultAvatar();
                }

                // User info
                setUser({
                    full_name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username || "Guest",
                    title: data.title || "Профессия не указана",
                    email: data.email || "",
                    username: data.username || ""
                });

            } catch (err) {
                console.error("Profile fetch error:", err);
                useDefaultAvatar();

                setUser({
                    full_name: localStorage.getItem("username") || "Guest",
                    title: "Профессия не указана"
                });
            }
        })();
    }, []);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refresh_token");

        try {
            if (refreshToken) {
                await api.post("/api/auth/logout/", { refresh: refreshToken });
                toast.info("Вы вышли из аккаунта ✅");
            }
        } catch (err) {
            console.debug("Logout error:", err);
        } finally {
            ["access_token", "refresh_token", "profile_image", "role", "username", "user_id"]
                .forEach((k) => localStorage.removeItem(k));

            delete api.defaults.headers.common["Authorization"];
            navigate("/login", { replace: true });
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            {/* Mobile version (< 640px) */}
            <div className="block sm:hidden">
                <ProfileDropdownJobSeekerMobile />
            </div>

            {/* Tablet version (640px - 1024px) */}
            <div className="hidden sm:block lg:hidden">
                <ProfileDropdownJobSeekerTablet />
            </div>

            {/* Desktop version (>= 1024px) - TUZATILGAN AVATAR */}
            <div className="hidden lg:block relative text-left" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-[56px] h-[56px] rounded-full overflow-hidden border-2 border-gray-300 hover:border-[#3066BE] transition-all duration-200 bg-transparent p-0"
                >
                    <SafeImg
                        src={profileImage}
                        className="w-full h-full object-cover"
                    />
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                        {/* Header */}
                        <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-200">
                            <div
                                className="relative w-[54px] h-[54px] rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-[#3066BE] transition-all duration-200 bg-transparent"
                                onClick={() => setIsAvatarModalOpen(true)}
                            >
                                <SafeImg
                                    src={profileImage}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-semibold text-black truncate">
                                    {user?.full_name ? formatName(user.full_name) : "Guest"}
                                </p>
                                <p className="text-[13px] text-gray-600 mt-0.5 truncate">
                                    {user?.title || "Профессия не указана"}
                                </p>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="px-3 py-2 space-y-1">
                            <a
                                href="/profile"
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <UserRound size={18} className="text-gray-600" />
                                Ваш профиль
                            </a>

                            <a
                                href="/activity"
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <LineChart size={18} className="text-gray-600" />
                                Активность
                            </a>

                            <a
                                href="/settings"
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <Settings size={18} className="text-gray-600" />
                                Настройки
                            </a>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-200 px-3 py-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-red-600 hover:bg-red-50 rounded-lg transition w-full text-left"
                            >
                                <LogOut size={18} />
                                Выйти
                            </button>
                        </div>
                    </div>
                )}

                {isAvatarModalOpen && (
                    <ChangeProfileImageModal
                        onClose={() => setIsAvatarModalOpen(false)}
                        onSuccess={(url) => {
                            const finalUrl = makeMediaUrl(url);
                            if (finalUrl && finalUrl !== DEFAULT_AVATAR) {
                                const withTs = `${finalUrl}?t=${Date.now()}`;
                                setProfileImage(withTs);
                                localStorage.setItem("profile_image", finalUrl);
                            } else {
                                useDefaultAvatar();
                            }
                        }}
                        setProfileImage={(u) => {
                            const finalUrl = makeMediaUrl(u);
                            if (finalUrl && finalUrl !== DEFAULT_AVATAR) {
                                const withTs = `${finalUrl}?t=${Date.now()}`;
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

function SafeImg({ src, alt = "avatar", className = "", ...imgProps }) {
    const [s, setS] = useState(src || DEFAULT_AVATAR);

    useEffect(() => {
        setS(src || DEFAULT_AVATAR);
    }, [src]);

    return (
        <img
            src={s}
            alt={alt}
            className={className}
            loading="lazy"
            onError={() => {
                if (s !== DEFAULT_AVATAR) {
                    setS(DEFAULT_AVATAR);
                }
            }}
            {...imgProps}
        />
    );
}