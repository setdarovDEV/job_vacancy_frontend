import React, { useState, useRef, useEffect } from "react";
import { UserRound, Sun, Settings, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "./AvatarUploadModal";
import { toast } from "react-toastify";
import api, { getAvatarURL } from "../utils/api";
import ProfileDropdownEmployerTablet from "./tablet/ProfileDropdownEmployerTablet.jsx";
import ProfileDropdownEmployerMobile from "./mobile/ProfileDropdownEmployerMobile.jsx";

export default function ProfileDropdownEmployer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null);

    const dropdownRef = useRef();
    const navigate = useNavigate();

    // ✅ User ma'lumotlarini olish
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);

                // ✅ Avatar URL ni to'g'ri olish
                const avatarUrl = getAvatarURL(res.data, "/user1.png");
                setProfileImage(avatarUrl);
                localStorage.setItem("profile_image", avatarUrl);

                console.log("✅ User yuklandi:", res.data);
                console.log("✅ Avatar URL:", avatarUrl);
            } catch (err) {
                console.error("❌ User olishda xatolik:", err);
            }
        };

        fetchUser();
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
            toast.info("Вы вышли из аккаунта ✅");
        } catch (err) {
            console.warn("Logoutda backend xato:", err?.response?.data || err.message);
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("profile_image");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");
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

    // ✅ Handle "Отклики" click - navigate to correct page
    const handleApplicationsClick = (e) => {
        e.preventDefault();
        setIsOpen(false);
        navigate("/employer/applications");
    };

    return (
        <>
            {/* Mobile version (< 640px) */}
            <div className="block sm:hidden">
                <ProfileDropdownEmployerMobile />
            </div>

            {/* Tablet version (640px - 1024px) */}
            <div className="hidden sm:block lg:hidden">
                <ProfileDropdownEmployerTablet />
            </div>

            {/* Desktop version (>= 1024px) - TUZATILGAN AVATAR */}
            <div className="hidden lg:block relative text-left" ref={dropdownRef}>
                {/* ✅ FIXED: Avatar button - Dumaloq va background yo'q */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-[56px] h-[56px] rounded-full overflow-hidden border-2 border-gray-300 hover:border-[#3066BE] transition-all duration-200 bg-transparent p-0"
                >
                    <img
                        src={profileImage || "/user1.png"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.error("❌ Avatar yuklanmadi:", profileImage);
                            e.target.src = "/user1.png";
                        }}
                    />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                        {/* Header */}
                        <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-200">
                            {/* ✅ FIXED: Dropdown avatar - Dumaloq */}
                            <div
                                className="relative w-[54px] h-[54px] rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-[#3066BE] transition-all duration-200 bg-transparent"
                                onClick={() => setIsAvatarModalOpen(true)}
                            >
                                <img
                                    src={profileImage || "/user1.png"}
                                    className="w-full h-full object-cover"
                                    alt="avatar"
                                    onError={(e) => {
                                        console.error("❌ Dropdown avatar yuklanmadi:", profileImage);
                                        e.target.src = "/user1.png";
                                    }}
                                />
                            </div>
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
                            {/* Profile Link */}
                            <a
                                href="/home-employer"
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <UserRound size={18} className="text-gray-600" />
                                Ваш профиль
                            </a>

                            {/* ✅ FIXED: Applications Link - To'g'ri routing */}
                            <a
                                href="#"
                                onClick={handleApplicationsClick}
                                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <Users size={18} className="text-gray-600" />
                                Отклики
                            </a>

                            {/* Settings Link */}
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
                            toast.success("Avatar yangilandi ✅");
                        }}
                        setProfileImage={setProfileImage}
                    />
                )}
            </div>
        </>
    );
}