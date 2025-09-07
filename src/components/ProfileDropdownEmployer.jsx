import React, { useState, useRef, useEffect } from "react";
import { UserRound, Sun, Settings, LogOut, Users } from "lucide-react"; // User2 -> Отклики
import { useNavigate } from "react-router-dom";
import ChangeProfileImageModal from "./AvatarUploadModal";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdownJobSeekerTablet from "./tablet/ProfileDropdownJObSeekerTablet.jsx";
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
            <div className="block lg:hidden">
                <ProfileDropdownEmployerTablet />
            </div>
            <div className="hidden lg:block relative text-left" ref={dropdownRef}>
                {/* Avatar btn */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-[56px] h-[56px] rounded-full bg-gray-200 overflow-hidden border-2 border-none"
                >
                    <div className="absolute inset-0">
                        <img
                            src={profileImage || "/user.jpg"}
                            alt="avatar"
                            className="w-full h-full object-cover border-none rounded-full"
                        />
                    </div>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-[300px] text-black bg-[#F4F6FA] rounded-xl shadow-[ -4px_-2px_20px_0px_rgba(0,0,0,0.15)] z-40">
                        {/* Header */}
                        <div className="px-4 h-[79px] flex items-center gap-3 border-b border-black relative">
                            <img
                                src={profileImage || "/user.jpg"}
                                className="w-[60px] h-[60px] rounded-full object-cover cursor-pointer"
                                alt="avatar"
                                onClick={() => setIsAvatarModalOpen(true)}
                            />
                            <div>
                                <p className="text-[16px] font-semibold underline text-black">
                                    {user ? formatName(user.full_name) : "Yuklanmoqda..."}
                                </p>
                                {/* 🔥 EMPLOYER uchun rasmdagi kabi “Работодатель” ko‘rsatamiz */}
                                <p className="text-[14px] text-black mt-[4px]">
                                    {user?.role === "EMPLOYER" ? "Работодатель" : (user?.title || "Профессия не указана")}
                                </p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="px-4 py-2 space-y-3">
                            <a href="/profile" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                                <UserRound size={18} /> Ваш профиль
                            </a>

                            {/* ✅ Qo‘shildi: EMPLOYER uchun “Отклики” */}
                            <a href="/employer/applications" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                                <Users size={18} /> Отклики
                            </a>

                            <a href="/" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
                                <Sun size={18} /> Тема: light
                            </a>
                            <a href="/settings" className="flex items-center gap-2 text-sm text-black hover:text-blue-600">
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

                {isAvatarModalOpen && (
                    <ChangeProfileImageModal
                        onClose={() => setIsAvatarModalOpen(false)}
                        onSuccess={(url) => { setProfileImage(url); localStorage.setItem("profile_image", url); }}
                        setProfileImage={setProfileImage}
                    />
                )}
            </div>
        </>
    );
}

function SaveChangesButton() {
    const handleSave = () => {
        toast.success("Ma'lumotlar saqlandi ✅");
        setTimeout(() => window.location.reload(), 1000);
    };
    return (
        <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="px-6 py-3 bg-[#3066BE] text-white rounded-lg font-semibold hover:bg-[#2452a6] transition">
                Saqlash
            </button>
        </div>
    );
}
