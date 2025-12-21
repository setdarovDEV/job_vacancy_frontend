// src/components/mobile/ProfileDropdownJobSeekerMobile.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { UserRound, Sun, Settings, LogOut, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "../AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../../utils/api";

// ---------- Helpers ----------
const appendTs = (url) => `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
const resolveMediaUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return appendTs(path);

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

export default function ProfileDropdownJobSeekerMobile() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    const AVATAR_FALLBACK = "/user1.png";

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
                    const path = profRes.value?.data?.profile_image;
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
            toast.info("Вы вышли из аккаунта ✅");
        } catch (err) {
            console.warn("Logout backend error:", err?.response?.data || err.message);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("profile_image");
            navigate("/login");
        }
    };

    return (
        <div className="relative text-left" ref={dropdownRef}>
            {/* Avatar button - mobile size */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-[36px] h-[36px] rounded-full border border-gray-300 bg-gray-200 overflow-hidden hover:border-[#3066BE] transition"
            >
                <img
                    src={profileImage || AVATAR_FALLBACK}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        localStorage.removeItem("profile_image");
                        e.currentTarget.src = AVATAR_FALLBACK;
                    }}
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[260px] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] z-50 border border-gray-100">
                    {/* Header - Profile info */}
                    <div className="px-3 py-3 flex items-center gap-2.5 border-b border-gray-200">
                        <img
                            src={profileImage || AVATAR_FALLBACK}
                            className="w-[46px] h-[46px] rounded-full object-cover cursor-pointer border-2 border-gray-200"
                            alt="avatar"
                            onClick={() => setIsAvatarModalOpen(true)}
                            onError={(e) => (e.currentTarget.src = AVATAR_FALLBACK)}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-black truncate">
                                {loading ? "Yuklanmoqda..." : formatName(user?.full_name) || "Guest"}
                            </p>
                            <p className="text-[12px] text-gray-600 mt-0.5 truncate">
                                {user?.title || "Профессия не указана"}
                            </p>
                        </div>
                    </div>

                    {/* Menu items */}
                    <div className="px-2 py-2 space-y-0.5">
                        <a
                            href="/profile"
                            className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            <UserRound size={16} className="text-gray-600" />
                            Ваш профиль
                        </a>

                        <a
                            href="/activity"
                            className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            <LineChart size={16} className="text-gray-600" />
                            Активность
                        </a>

                        <a
                            href="/settings"
                            className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            <Settings size={16} className="text-gray-600" />
                            Настройки
                        </a>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 px-2 py-2">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg transition w-full text-left"
                        >
                            <LogOut size={16} />
                            Выйти
                        </button>
                    </div>
                </div>
            )}

            {/* Avatar upload modal */}
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