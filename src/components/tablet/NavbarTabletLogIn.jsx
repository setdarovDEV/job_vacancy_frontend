import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileDropdown from "../ProfileDropdown.jsx";

export default function NavbarTabletLogin() {
    const [open, setOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState({ code: "RU", flag: "/ru.png" });

    const handleLanguageChange = (lang) => {
        setSelectedLang(lang);
        setLangOpen(false);
    };

    const languages = [
        { code: "RU", flag: "/ru.png" },
        { code: "UZ", flag: "/uz.png" },
        { code: "EN", flag: "/uk.png" },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 w-full bg-white h-[70px] flex items-center justify-center shadow-sm border-b border-[#E3E6EA] z-50">
            {/* ✅ Markazlashtirilgan container */}
            <div className="w-full max-w-[750px] px-8 flex items-center justify-between">
                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(!open)}
                        className="bg-transparent border-none p-0 cursor-pointer hover:opacity-70 transition"
                    >
                        {open ? (
                            <X className="w-6 h-6 text-black" />
                        ) : (
                            <Menu className="w-6 h-6 text-black" />
                        )}
                    </button>
                    <span className="text-[#3066BE] font-bold text-[20px]">Logo</span>
                </div>

                {/* Right: Profile Dropdown */}
                <div className="relative flex items-center">
                    <ProfileDropdown />
                </div>
            </div>

            {/* Full-width Main Menu Dropdown */}
            {open && (
                <div className="absolute top-[70px] left-0 w-full bg-white shadow-md z-40 border-t border-[#E3E6EA]">
                    <div className="max-w-[750px] mx-auto px-8 py-4 flex flex-col gap-3">
                        <Link
                            to="/community"
                            className="text-black hover:text-[#3066BE] text-[15px] font-medium transition py-2"
                            onClick={() => setOpen(false)}
                        >
                            Сообщество
                        </Link>
                        <Link
                            to="/vacancies"
                            className="text-black hover:text-[#3066BE] text-[15px] font-medium transition py-2"
                            onClick={() => setOpen(false)}
                        >
                            Вакансии
                        </Link>
                        <Link
                            to="/chat"
                            className="text-black hover:text-[#3066BE] text-[15px] font-medium transition py-2"
                            onClick={() => setOpen(false)}
                        >
                            Чат
                        </Link>
                        <Link
                            to="/companies"
                            className="text-black hover:text-[#3066BE] text-[15px] font-medium transition py-2"
                            onClick={() => setOpen(false)}
                        >
                            Компании
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}