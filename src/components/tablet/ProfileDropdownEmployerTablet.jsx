// src/components/ProfileDropdownEmployerTablet.jsx
import React, { useEffect, useRef, useState } from "react";
import { UserRound, Sun, Settings, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "../AvatarUploadModal";
import api from "../../utils/api";

export default function ProfileDropdownEmployerTablet() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null);

    const wrapRef = useRef(null);
    const navigate = useNavigate();

    const AVATAR_FALLBACK = "/user.png";
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
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setIsOpen(false);
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
        } catch {}
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    // “Lola Y.” ko‘rinishi: to‘liq ism + familiya bosh harfi + nuqta
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
            {/* trigger (avatar) */}
            <div
                role="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((v) => !v)}
                className="w-[52px] h-[52px] rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center cursor-pointer select-none"
            >
                <img
                    src={profileImage || localStorage.getItem("profile_image") || AVATAR_FALLBACK}
                    onError={(e) => (e.currentTarget.src = AVATAR_FALLBACK)}
                    alt="avatar"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* dropdown */}
            {isOpen && (
                <div
                    role="menu"
                    className="absolute right-0 mt-3 w-[250px] rounded-2xl bg-white text-black shadow-[0_12px_32px_rgba(0,0,0,0.10)] z-[70] overflow-hidden"
                >
                    {/* header */}
                    <div className="px-4 py-4 flex items-center gap-3">
                        <img
                            src={profileImage || localStorage.getItem("profile_image") || AVATAR_FALLBACK}
                            onError={(e) => (e.currentTarget.src = AVATAR_FALLBACK)}
                            className="w-[56px] h-[56px] rounded-full object-cover shrink-0"
                            alt="avatar"
                        />
                        <div className="min-w-0">
                            <a
                                href="/profile"
                                className="text-[18px] font-semibold text-black underline underline-offset-2 truncate"
                                title={user?.full_name || ""}
                            >
                                {user ? prettyName(user.full_name) : "…"}
                            </a>
                            <div className="text-[13px] mt-0.5">
                                {user?.role === "EMPLOYER" ? "Работодатель" : user?.title || "Пользователь"}
                            </div>
                        </div>
                    </div>

                    {/* thick divider */}
                    <div className="h-[2px] bg-black" />

                    {/* items */}
                    <nav className="py-2">
                        <MenuItem href="/profile" icon={<UserRound size={20} />}>
                            Ваш профиль
                        </MenuItem>

                        {user?.role === "EMPLOYER" && (
                            <MenuItem href="/employer/applications" icon={<Users size={20} />}>
                                Отклики
                            </MenuItem>
                        )}

                        <MenuItem href="#" icon={<Sun size={20} />}>
                            Тема: light
                        </MenuItem>

                        <MenuItem href="/settings" icon={<Settings size={20} />}>
                            Настройки
                        </MenuItem>
                    </nav>

                    {/* thick divider */}
                    <div className="h-[2px] bg-black" />

                    {/* logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full h-11 px-4 flex items-center text-black border-none gap-3 text-[15px] hover:text-red-700"
                    >
                        <LogOut size={20} />
                        Выйти
                    </button>
                </div>
            )}

            {isAvatarModalOpen && (
                <ChangeProfileImageModal
                    onClose={() => setIsAvatarModalOpen(false)}
                    onSuccess={(url) => {
                        setProfileImage(url);
                        localStorage.setItem("profile_image", url);
                    }}
                    setProfileImage={setProfileImage}
                />
            )}
        </div>
    );
}

/* --- helpers --- */
function MenuItem({ href, icon, children }) {
    return (
        <a
            href={href}
            className="w-full h-11 px-4 flex items-center text-black mt-[-15px] mb-[-5px] border-none gap-3 text-[15px] hover:text-[#3066BE]"
        >
            <span className="shrink-0">{icon}</span>
            <span className="truncate">{children}</span>
        </a>
    );
}
