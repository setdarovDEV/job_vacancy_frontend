import React, { useState, useRef, useEffect } from "react";
import { UserRound, Sun, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "./AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdownJobSeekerTablet from "./tablet/ProfileDropdownJObSeekerTablet.jsx";

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
            <div className="block lg:hidden">
                <ProfileDropdownJobSeekerTablet />
            </div>

            <div className="hidden lg:block relative text-left" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-[56px] h-[56px] rounded-full bg-gray-200 overflow-hidden"
                >
                    <SafeImg src={profileImage} className="w-full h-full object-cover rounded-full" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-[300px] h-[240px] text-black bg-[#F4F6FA] rounded-xl shadow-[-4px_-2px_20px_0px_rgba(0,0,0,0.15)] z-40">
                        <div className="px-4 h-[79px] flex items-center gap-3 border-b border-black">
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

                        <div className="border-t border-black mt-2 pt-2 px-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm ml-[-15px] bg-transparent border-none text-black hover:text-red-600"
                            >
                                <LogOut size={18} /> Выйти
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