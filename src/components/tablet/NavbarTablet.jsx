import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NavbarTablet() {
    const [open, setOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState({ code: "RU", flag: "/ru.png" });

    const navigate = useNavigate();

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

                {/* Right: Language + Login */}
                <div className="flex items-center gap-3 relative">
                    {/* Language Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-1.5 cursor-pointer bg-white border border-gray-300 px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition"
                        >
                            <img
                                src={selectedLang.flag}
                                alt={selectedLang.code}
                                className="w-5 h-4 object-cover rounded-sm"
                            />
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>

                        {langOpen && (
                            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                {languages.map((lang) => (
                                    <div
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-100 cursor-pointer transition"
                                    >
                                        <img
                                            src={lang.flag}
                                            alt={lang.code}
                                            className="w-5 h-4 object-cover rounded-sm"
                                        />
                                        <span className="text-[13px] font-medium text-gray-700">{lang.code}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-[#3066BE] text-white rounded-lg text-[13px] font-semibold hover:bg-[#2556a3] transition shadow-sm"
                    >
                        Войти
                    </button>
                </div>
            </div>

            {/* Full-width Main Menu Dropdown */}
            {open && (
                <div className="absolute top-[70px] left-0 w-full bg-white shadow-md z-40 border-t border-[#E3E6EA]">
                    <div className="max-w-[750px] mx-auto px-8 py-4 flex flex-col gap-3">
                        <Link
                            to="#"
                            className="text-black hover:text-[#3066BE] text-[15px] font-medium transition py-2"
                            onClick={() => setOpen(false)}
                        >
                            Сообщество
                        </Link>
                        <Link
                            to="#"
                            className="text-black hover:text-[#3066BE] text-[15px] font-medium transition py-2"
                            onClick={() => setOpen(false)}
                        >
                            Вакансии
                        </Link>
                        <Link
                            to="#"
                            className="text-black hover:text-[#3066BE] text-[15px] font-medium transition py-2"
                            onClick={() => setOpen(false)}
                        >
                            Чат
                        </Link>
                        <Link
                            to="#"
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