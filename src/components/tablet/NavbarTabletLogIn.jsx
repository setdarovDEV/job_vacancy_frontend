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
        // Optional: multi-language systemga ulash joyi (i18n, localStorage, reload)
    };

    const languages = [
        { code: "RU", flag: "/ru.png" },
        { code: "UZ", flag: "/uz.png" },
        { code: "EN", flag: "/uk.png" },
    ];

    return (
        <div className="relative w-full bg-[#F4F6FA] h-[60px] flex items-center justify-between px-4 shadow-sm border-b border-[#e5e5e5]">

            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-3">
                <button onClick={() => setOpen(!open)} className="bg-[#F4F6FA] border-none">
                    {open ? (
                        <X className="w-6 h-6 text-black bg-[#F4F6FA]" />
                    ) : (
                        <Menu className="w-6 h-6 text-black bg-[#F4F6FA]" />
                    )}
                </button>
                <span className="text-[#3066BE] font-bold text-[22px]">Logo</span>
            </div>

            {/* Right: Language + Login */}
            <div className="flex items-center gap-4 relative">
                {/* Language Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="flex items-center gap-1 cursor-pointer bg-[#F4F6FA] border-none px-2 py-1 rounded-md shadow-sm border"
                    >
                        <img src={selectedLang.flag} alt={selectedLang.code} className="w-5 h-4 object-cover rounded-sm" />
                        <ChevronDown className="w-4 h-4 text-black" />
                    </button>

                    {langOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-[#F4F6FA] border rounded-md shadow-md z-20">
                            {languages.map((lang) => (
                                <div
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang)}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <img src={lang.flag} alt={lang.code} className="w-5 h-4 object-cover rounded-sm" />
                                    <span className="text-sm">{lang.code}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <ProfileDropdown />
            </div>

            {/* Left-side Main Menu */}
            {open && (
                <div className="absolute top-[60px] left-0 w-full bg-[#F4F6FA] shadow-md z-10 px-6 py-4 flex flex-col gap-4">
                    <Link to="/community" className="text-black hover:text-[#3066BE] text-base">
                        Сообщество
                    </Link>
                    <Link to="/vacancies" className="text-black hover:text-[#3066BE] text-base">
                        Вакансии
                    </Link>
                    <Link to="/chat" className="text-black hover:text-[#3066BE] text-base">
                        Чат
                    </Link>
                    <Link to="/companies" className="text-black hover:text-[#3066BE] text-base">
                        Компании
                    </Link>
                </div>
            )}
        </div>
    );
}