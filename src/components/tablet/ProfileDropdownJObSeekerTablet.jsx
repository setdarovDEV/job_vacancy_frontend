// src/components/tablet/ProfileDropdownJobSeekerTablet.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { UserRound, Sun, Settings, LogOut, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "../AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../../utils/api";

const appendTs = (url) => `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
const resolveMediaUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return appendTs(path);
    const base = (import.meta?.env?.VITE_MEDIA_BASE || import.meta?.env?.VITE_API_BASE || api?.defaults?.baseURL || window.location.origin || "").replace(/\/+$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return appendTs(`${base}${p}`);
};

export default function ProfileDropdownJobSeekerTablet() {
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
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) setIsOpen(false);
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
        const first = parts[0] || "";
        const last = parts.length > 1 ? parts[parts.length - 1] : "";
        const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");
        return `${cap(first)}${last ? ` ${cap(last[0])}.` : ""}`;
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
        <div className="relative" ref={dropdownRef}>
            <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="w-[48px] h-[48px] rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center hover:border-[#3066BE] transition">
                <img src={profileImage || AVATAR_FALLBACK} onError={(e) => { localStorage.removeItem("profile_image"); e.currentTarget.src = AVATAR_FALLBACK; }} alt="avatar" className="w-full h-full object-cover" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[270px] rounded-xl bg-white text-black shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-50 border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-200">
                        <img src={profileImage || AVATAR_FALLBACK} onError={(e) => (e.currentTarget.src = AVATAR_FALLBACK)} className="w-[52px] h-[52px] rounded-full object-cover shrink-0 cursor-pointer border-2 border-gray-200" alt="avatar" onClick={() => setIsAvatarModalOpen(true)} />
                        <div className="min-w-0 flex-1">
                            <p className="text-[16px] font-semibold text-black truncate">{loading ? "Yuklanmoqda..." : formatName(user?.full_name) || "Guest"}</p>
                            <p className="text-[13px] text-gray-600 mt-0.5 truncate">{user?.title || "Профессия не указана"}</p>
                        </div>
                    </div>
                    <nav className="px-3 py-2 space-y-1">
                        <MenuItem href="/profile" icon={<UserRound size={18} />}>Ваш профиль</MenuItem>
                        <MenuItem href="/activity" icon={<LineChart size={18} />}>Активность</MenuItem>
                        <MenuItem href="/settings" icon={<Settings size={18} />}>Настройки</MenuItem>
                    </nav>
                    <div className="border-t border-gray-200 px-3 py-2">
                        <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-red-600 hover:bg-red-50 rounded-lg transition">
                            <LogOut size={18} />Выйти
                        </button>
                    </div>
                </div>
            )}
            {isAvatarModalOpen && (
                <ChangeProfileImageModal onClose={() => setIsAvatarModalOpen(false)} onSuccess={(urlOrPath) => { const final = resolveMediaUrl(urlOrPath); setProfileImage(final); localStorage.setItem("profile_image", final); toast.success("Avatar yangilandi ✅"); }} setProfileImage={(urlOrPath) => { const final = resolveMediaUrl(urlOrPath); setProfileImage(final); localStorage.setItem("profile_image", final); }} />
            )}
        </div>
    );
}

function MenuItem({ href, icon, children }) {
    return (
        <a href={href} className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <span className="shrink-0 text-gray-600">{icon}</span>
            <span className="truncate">{children}</span>
        </a>
    );
}