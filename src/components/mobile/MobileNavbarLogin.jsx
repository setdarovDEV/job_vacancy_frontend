import React, {useState} from "react";
import { ChevronLeft, Bell } from "lucide-react";
import ProfileDropdown from "../ProfileDropdown.jsx";

export default function MobileNavbar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [openLang, setOpenLang] = useState(false);

    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const langCode = selectedLang?.code === "GB" ? "EN" : (selectedLang?.code || "RU");

    const texts = {
        RU: {
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            login: "Войти",
            loginWarn: "Пожалуйста, войдите в систему.",
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            login: "Kirish",
            loginWarn: "Tizimga kiring.",
        },
        EN: {
            community: "Community",
            vacancies: "Vacancies",
            chat: "Chat",
            companies: "Companies",
            login: "Login",
            loginWarn: "Please log in.",
        },
    };

    return (
        <>
            <nav className="fixed top-0 inset-x-0 z-[120] bg-[#F4F6FA]/95 backdrop-blur shadow-md">
                {/* iOS safe-area uchun biroz tepaga pad */}
                <div className="pt-[env(safe-area-inset-top)]">
                    <div className="h-[60px] px-3 flex items-center justify-between relative">
                        {/* 1) Chap: dropdown (links) */}
                        <div className="relative">
                            <button
                                onClick={() => setOpenMenu(v => !v)}
                                className="w-10 h-10 rounded-md bg-[#F4F6FA] border-none flex flex-col items-center justify-center active:scale-[0.98]"
                                aria-label="Open menu"
                            >
                                <span className="block w-6 h-0.5 bg-black rounded"></span>
                                <span className="block w-6 h-0.5 bg-black rounded my-1"></span>
                                <span className="block w-6 h-0.5 bg-black rounded"></span>
                            </button>

                            {/* Main dropdown */}
                            {openMenu && (
                                <div className="absolute left-0 top-[calc(100%+8px)] w-48 rounded-lg bg-white shadow-lg border z-50 overflow-hidden">
                                    <a href="/community" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                        {texts[langCode].community}
                                    </a>
                                    <a href="/vacancies" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                        {texts[langCode].vacancies}
                                    </a>
                                    <a href="/chat" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                        {texts[langCode].chat}
                                    </a>
                                    <a href="/companies" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE]">
                                        {texts[langCode].companies}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 2) O‘rta: logo */}
                        <img src="/logo.png" alt="Logo" className="h-[40px] object-contain" />

                        {/* 3) O‘ng: login */}
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>

            <div className="h-[60px] md:h-[80px] lg:h-[90px]" aria-hidden />
        </>
    );
}
