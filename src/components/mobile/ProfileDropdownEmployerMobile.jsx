// src/components/mobile/ProfileDropdownEmployerMobile.jsx
import React, { useEffect, useRef, useState } from "react";
import { UserRound, Sun, Settings, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "../AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function ProfileDropdownEmployerMobile() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null);

    const wrapRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    const AVATAR_FALLBACK = "/user1.png";
    const BASE_URL = (api?.defaults?.baseURL || "http://127.0.0.1:8000").replace(/\/$/, "");

    const buildImageUrl = (path) => {
        if (!path) return null;
        const src = path.startsWith("http") ? path : `${BASE_URL}${path}`;
        return `${src}?t=${Date.now()}`;
    };

    useEffect(() => {
        api.get("/api/auth/profile/")
            .then((res) => {
                const img = buildImageUrl(res.data?.profile_image);
                if (img) {
                    setProfileImage(img);
                    localStorage.setItem("profile_image", img);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        api.get("/api/auth/me/")
            .then((res) => setUser(res.data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const onDoc = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) {
                setIsOpen(false);
            }
        };
        const onEsc = (e) => e.key === "Escape" && setIsOpen(false);
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onEsc);
        };
    }, []);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        try {
            if (refreshToken) await api.post("/api/auth/logout/", { refresh: refreshToken });
            toast.info("Вы вышли из аккаунта ✅");
        } catch {}
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("profile_image");
        navigate("/login");
    };

    const prettyName = (full) => {
        if (!full) return "";
        const parts = full.trim().split(/\s+/);
        const first = parts[0] || "";
        const last = parts.length > 1 ? parts[parts.length - 1] : "";
        const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");
        return `${cap(first)}${last ? ` ${cap(last[0])}.` : ""}`;
    };

    return (
        <div className="relative" ref={wrapRef}>
            {/* Avatar button - mobile size */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen((v) => !v)}
                className="w-[36px] h-[36px] rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center hover:border-[#3066BE] transition"
            >
                <img
                    src={profileImage || localStorage.getItem("profile_image") || AVATAR_FALLBACK}
                    onError={(e) => (e.currentTarget.src = AVATAR_FALLBACK)}
                    alt="avatar"
                    className="w-full h-full object-cover"
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[260px] rounded-xl bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.15)] z-50 border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="px-3 py-3 flex items-center gap-2.5 border-b border-gray-200">
                        <img
                            src={profileImage || localStorage.getItem("profile_image") || AVATAR_FALLBACK}
                            onError={(e) => (e.currentTarget.src = AVATAR_FALLBACK)}
                            className="w-[46px] h-[46px] rounded-full object-cover shrink-0 cursor-pointer border-2 border-gray-200"
                            alt="avatar"
                            onClick={() => setIsAvatarModalOpen(true)}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-semibold text-black truncate">
                                {user ? prettyName(user.full_name) : "Yuklanmoqda..."}
                            </p>
                            <p className="text-[12px] text-gray-600 mt-0.5 truncate">
                                {user?.role === "EMPLOYER" ? "Работодатель" : user?.title || "Пользователь"}
                            </p>
                        </div>
                    </div>

                    {/* Menu items */}
                    <nav className="px-2 py-2 space-y-0.5">
                        <MenuItem href="/home-employer" icon={<UserRound size={16} />}>
                            Ваш профиль
                        </MenuItem>

                        {user?.role === "EMPLOYER" && (
                            <MenuItem href="/employer/applications" icon={<Users size={16} />}>
                                Отклики
                            </MenuItem>
                        )}


                        <MenuItem href="/settings" icon={<Settings size={16} />}>
                            Настройки
                        </MenuItem>
                    </nav>

                    {/* Logout */}
                    <div className="border-t border-gray-200 px-2 py-2">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut size={16} />
                            Выйти
                        </button>
                    </div>
                </div>
            )}

            {isAvatarModalOpen && (
                <ChangeProfileImageModal
                    onClose={() => setIsAvatarModalOpen(false)}
                    onSuccess={(url) => {
                        setProfileImage(url);
                        localStorage.setItem("profile_image", url);
                        toast.success("Avatar yangilandi ✅");
                    }}
                    setProfileImage={setProfileImage}
                />
            )}
        </div>
    );
}

/* --- Helper component --- */
function MenuItem({ href, icon, children }) {
    return (
        <a
            href={href}
            className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
            <span className="shrink-0 text-gray-600">{icon}</span>
            <span className="truncate">{children}</span>
        </a>
    );
}