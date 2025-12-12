import React, { useState, useRef, useEffect } from "react";
import { UserRound, Sun, Settings, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "./AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdownEmployerTablet from "./tablet/ProfileDropdownEmployerTablet.jsx";

export default function ProfileDropdownEmployer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null);

    const dropdownRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/auth/profile/")
            .then((res) => {
                const imagePath = res.data.profile_image;
                if (imagePath) {
                    const imageUrl = `http://127.0.0.1:8000${imagePath}?t=${Date.now()}`;
                    setProfileImage(imageUrl);
                    localStorage.setItem("profile_image", imageUrl);
                }
            })
            .catch((err) => console.error("Avatarni olishda xatolik:", err));
    }, []);

    useEffect(() => {
        api.get("/api/auth/me/")
            .then((res) => setUser(res.data))
            .catch((err) => console.error("Foydalanuvchini olishda xatolik:", err));
    }, []);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            localStorage.removeItem("access_token");
            navigate("/login");
            return;
        }
        try {
            await api.post("/api/auth/logout/", { refresh: refreshToken });
        } catch (err) {
            console.warn("Logoutda backend xato:", err?.response?.data || err.message);
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatName = (fullName) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        if (parts.length < 2) return fullName;
        const firstInitial = parts[0][0].toUpperCase();
        const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        return `${firstInitial}. ${lastName}`;
    };

    return (
        <>
            {/* Tablet version */}
            <div className="block lg:hidden">
                <ProfileDropdownEmployerTablet />
            </div>

            {/* Desktop version */}
            <div className="hidden lg:block relative text-left" ref={dropdownRef}>
                {/* Avatar button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-[52px] h-[52px] rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300 hover:border-[#3066BE] transition"
                >
                    <img
                        src={profileImage || "/user1.png"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                        {/* Header */}
                        <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-200">
                            <img
                                src={profileImage || "/user1.png"}
                                className="w-[54px] h-[54px] rounded-full object-cover cursor-pointer border-2 border-gray-200"
                                alt="avatar"
                                onClick={() => setIsAvatarModalOpen(true)}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-semibold text-black truncate">
                                    {user ? formatName(user.full_name) : "Yuklanmoqda..."}
                                </p>
                                <p className="text-[13px] text-gray-600 mt-0.5 truncate">
                                    {user?.role === "EMPLOYER" ? "Работодатель" : (user?.title || "Профессия не указана")}
                                </p>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="px-3 py-2 space-y-1">
                            <a
                                href="/home-employer"
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <UserRound size={18} className="text-gray-600" />
                                Ваш профиль
                            </a>

                            <a
                                href="/employer/applications"
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <Users size={18} className="text-gray-600" />
                                Отклики
                            </a>

                            <a
                                href="/"
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <Sun size={18} className="text-gray-600" />
                                Тема: light
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
                            setProfileImage(url);
                            localStorage.setItem("profile_image", url);
                        }}
                        setProfileImage={setProfileImage}
                    />
                )}
            </div>
        </>
    );
}