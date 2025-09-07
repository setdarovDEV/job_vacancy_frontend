import React, {useState} from "react";
import { ChevronLeft, Bell } from "lucide-react";

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
                                <a href="/login" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                    {texts[langCode].community}
                                </a>
                                <a href="/login" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                    {texts[langCode].vacancies}
                                </a>
                                <a href="/login" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                    {texts[langCode].chat}
                                </a>
                                <a href="/login" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE]">
                                    {texts[langCode].companies}
                                </a>

                                <div className="h-px bg-gray-200 my-1" />

                                {/* Language item */}
                                <button
                                    onClick={() => setOpenLang(v => !v)}
                                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center justify-between bg-white border-none"
                                >
                                      <span className="flex items-center gap-2">
                                        <img src={selectedLang.flag} alt={selectedLang.code} className="w-5 h-3 rounded object-cover" />
                                        <span className="text-black">Язык</span>
                                      </span>
                                    <svg className={`w-4 h-4 transition-transform ${openLang ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {openLang && (
                                    <div className="px-2 pb-2">
                                        <button
                                            onClick={() => { setSelectedLang({ flag: "/ru.png", code: "RU" }); setOpenMenu(false); setOpenLang(false); }}
                                            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 text-sm bg-white border-none"
                                        >
                                            <img src="/ru.png" alt="RU" className="w-5 h-3 rounded object-cover" />
                                            <p className="text-black">Русский</p>
                                        </button>
                                        <button
                                            onClick={() => { setSelectedLang({ flag: "/uz.png", code: "UZ" }); setOpenMenu(false); setOpenLang(false); }}
                                            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 text-sm bg-white border-none"
                                        >
                                            <img src="/uz.png" alt="UZ" className="w-5 h-3 rounded object-cover" />
                                            <p className="text-black">O‘zbekcha</p>
                                        </button>
                                        <button
                                            onClick={() => { setSelectedLang({ flag: "/uk.png", code: "EN" }); setOpenMenu(false); setOpenLang(false); }}
                                            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 text-sm bg-white border-none"
                                        >
                                            <img src="/uk.png" alt="EN" className="w-5 h-3 rounded object-cover" />
                                            <p className="text-black">English</p>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 2) O‘rta: logo */}
                    <img src="/logo.png" alt="Logo" className="h-[40px] object-contain" />

                    {/* 3) O‘ng: login */}
                    <a href="/login">
                        <button className="px-4 h-9 rounded-md bg-[#3066BE] text-white text-[14px] font-medium active:scale-[0.98]">
                            {texts[langCode].login}
                        </button>
                    </a>
                </div>
            </div>
        </nav>

        <div className="h-[60px] md:h-[80px] lg:h-[90px]" aria-hidden />
        </>
    );
}
