// src/components/mobile/LandingMobile.jsx
import React, { useState } from "react";
import Select from "react-select";

export default function LandingMobile({
                                          selectedLang,
                                          setSelectedLang,
                                          texts,
                                          categoriesTexts,
                                          optionsRegion,
                                          optionsSalary,
                                          optionsPlan,
                                      }) {
    const [showLang, setShowLang] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openLang, setOpenLang] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";
    const [savedJobs, setSavedJobs] = useState({});
    const toggleSave = (i) => setSavedJobs(s => ({ ...s, [i]: !s[i] }));

    const selectStyles = {
        control: (p, s) => ({
            ...p,
            border: "none",
            borderRadius: "0.75rem",
            backgroundColor: "rgba(255,255,255,0.9)",
            height: 44,
            paddingLeft: 8,
            fontSize: 14,
            boxShadow: "none",
            outline: "none"
        }),
        input: (p) => ({ ...p, fontSize: 14 }),
        placeholder: (p) => ({ ...p, fontSize: 14, color: "#AEAEAE" }),
        singleValue: (p) => ({ ...p, fontSize: 14, color: "#000" }),
        indicatorSeparator: () => ({ display: "none" }),
        menu: (p) => ({ ...p, borderRadius: "0.75rem" }),
    };

    return (
        <div className="min-h-screen font-sans bg-white text-black overflow-x-hidden">
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

            {/* HERO */}
            <section
                className="relative bg-cover bg-center min-h-[76vh] flex items-center justify-center"
                style={{ backgroundImage: `url('/hero.png')` }}
            >
                {/* dark overlay */}
                <div className="absolute inset-0 bg-blue-900/50 z-0" />

                {/* TOP-LEFT: search icon (transparent) */}
                {!showSearch && (
                    <button
                        aria-label="Search"
                        onClick={() => setShowSearch(true)}
                        className="absolute top-3 left-3 z-20 w-10 h-10 grid place-items-center
                                   text-white bg-transparent hover:bg-transparent active:bg-transparent
                                   focus:bg-transparent border-0 outline-none ring-0"
                        style={{ backgroundColor: "transparent", WebkitTapHighlightColor: "transparent" }}
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"   /* uses text color */
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z" />
                        </svg>
                    </button>
                )}


                {/* TOP-RIGHT: ? va bell */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-5 text-white">
                    <div className="relative">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border border-white text-[10px] leading-[10px] flex items-center justify-center">1</span>
                    </div>
                </div>

                {/* CENTER: text */}
                <div className="relative z-10 px-4 text-center">
                    <p className="text-white text-[15px] font-semibold mb-3">
                        {texts[langCode].applicants}
                    </p>
                    <h1 className="text-white uppercase font-extrabold text-[30px] leading-[36px]">
                        {texts[langCode].resume}
                    </h1>
                </div>

                {/* SEARCH BAR (opens on icon click) */}
                {showSearch && (
                    <>
                        {/* overlay to close on outside click */}
                        <div
                            className="absolute inset-0 z-10"
                            onClick={() => setShowSearch(false)}
                        />
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-[84%] max-w-[320px] transition-all">
                            <div className="flex items-center h-10 rounded-lg bg-white/95 px-2 shadow">
                                <svg
                                    className="w-4 h-4 text-[#3066BE]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z"
                                    />
                                </svg>
                                <input
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    type="text"
                                    placeholder={texts[langCode].search}
                                    className="ml-2 flex-1 bg-transparent text-[13px] placeholder:text-[12px] text-[#111] outline-none"
                                    autoFocus
                                />
                                {searchText && (
                                    <button
                                        onClick={() => setSearchText("")}
                                        className="mb-[13px] mr-[2px] border-none text-gray-500 text-base leading-none w-6 h-6 grid place-items-center bg-transparent"
                                        aria-label="Clear"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}


                {/* bottom white curve */}
                <div className="pointer-events-none absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-10">
                    <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="block w-full h-[40px]">
                        <path d="M0,0 C150,40 350,40 500,0 L500,40 L0,40 Z" fill="#fff"></path>
                    </svg>
                </div>
            </section>


            {/* CATEGORIES */}
            <section className="px-4 py-8">
                <h2 className="text-center text-[20px] font-bold mb-6">{texts[langCode].categories}</h2>
                <div className="grid grid-cols-2 gap-3">
                    {categoriesTexts[langCode].map((cat, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-[10px] bg-[#F4F6FA] text-center shadow"
                        >
                            <cat.icon className="text-[#3066BE] text-2xl mx-auto mb-2" />
                            <p className="text-[13px] font-semibold">{cat.title}</p>
                            <p className="text-[11px] text-gray-500">{cat.vacancies}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* RECOMMENDED VACANCY */}
            <section className="px-4 pb-4">
                <h3 className="text-center text-[22px] font-extrabold mb-4">
                    {texts[langCode].recommendedVacancies}
                </h3>

                {/* top link + divider */}
                <div className="mb-2">
                    <a href="/login" className="text-[14px] font-semibold text-black">
                        {texts[langCode].publishVacancy}
                    </a>
                    <div className="h-px bg-[#D9D9D9] mt-2" />
                </div>

                {[0, 1, 2].map((k) => (
                    <div key={k} className="py-5">
                        {/* top row: published + bookmark */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center text-gray-400 text-[12px]">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {texts[langCode].published}
                            </div>

                            {/* bookmark toggle */}
                            <button
                                onClick={() => toggleSave(k)}
                                aria-label="save"
                                className="p-1 -mr-1 active:scale-95 bg-white border-none"
                            >
                                <svg className="w-6 h-6 bg-white" viewBox="0 0 24 24" stroke="#111" strokeWidth="1.8" fill={savedJobs[k] ? "#3066BE" : "none"}>
                                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-3-7 3V4a1 1 0 0 1 1-1z" />
                                </svg>
                            </button>
                        </div>

                        {/* title + (optional) premium diamond on 2nd card */}
                        <div className="flex items-center gap-2">
                            <h4 className="text-[20px] font-extrabold text-[#111]">
                                {texts[langCode].needed}
                            </h4>
                            {k === 1 && (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FFD54F">
                                    <path d="M12 3l7 7-7 7-7-7 7-7z" />
                                </svg>
                            )}
                        </div>

                        <p className="text-gray-500 text-[13px] mt-1">{texts[langCode].budget}</p>

                        <p className="text-gray-600 text-[13px] mt-3">
                            {texts[langCode].description}
                        </p>

                        {/* tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {texts[langCode].tags.map((t, idx) => (
                                <span key={idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-[12px]">
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* bottom-row */}
                        <div className="mt-4 flex items-center justify-between text-gray-500 text-[13px]">
                            <div className="flex items-center gap-2">
                                <div className="relative w-5 h-5">
                                    <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                    <img src="/check.svg" alt="check" className="absolute inset-0 w-3 h-3 m-auto" />
                                </div>
                                {texts[langCode].payment}
                            </div>

                            <div className="flex items-center gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                    </svg>
                                ))}
                                <svg className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                </svg>
                            </div>

                            <div className="flex items-center gap-1">
                                <img src="/location.png" alt="location" className="w-5 h-4" />
                                {texts[langCode].location_vacancy}
                            </div>
                        </div>

                        {/* divider between cards */}
                        <div className="border-t border-[#AEAEAE] mt-5" />
                    </div>
                ))}
            </section>

            {/* CTA */}
            <section className="relative w-full bg-[#3066BE] text-white mt-6 px-5 py-10 overflow-hidden">
                {/* Left-top dots */}
                <svg className="absolute left-2 top-2 w-28 h-28 opacity-80 pointer-events-none" viewBox="0 0 120 120">
                    <defs>
                        <pattern id="dotp" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="6" cy="6" r="5" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="120" height="120" fill="url(#dotp)" />
                </svg>

                {/* Right-side dots (bottom) */}
                <svg className="absolute right-2 bottom-3 w-28 h-28 opacity-80 pointer-events-none" viewBox="0 0 120 120">
                    <rect width="120" height="120" fill="url(#dotp)" />
                </svg>

                {/* Content */}
                <div className="max-w-[720px] mx-auto text-center relative z-10">
                    <h2 className="text-[28px] leading-[36px] mt-[50px] font-extrabold md:text-[36px] md:leading-[44px] mb-8">
                        Найдите работу своей мечты сегодня.
                    </h2>

                    {/* Buttons row */}
                    <div className="grid grid-cols-2 gap-3 max-w-[520px] mx-auto">
                        {/* Outline */}
                        <button
                            className="w-full h-12 rounded-2xl border-2 border-white text-white
               bg-transparent hover:bg-transparent active:scale-95
               inline-flex items-center justify-center text-[14px] font-semibold"
                        >
                            Заполнить резюме
                        </button>

                        {/* Solid */}
                        <button
                            className="w-full h-12 rounded-2xl bg-white text-black
               inline-flex items-center justify-center text-[14px] font-semibold
               active:scale-95"
                        >
                            Зарегистрироваться
                        </button>
                    </div>

                </div>
            </section>

            {/* RECOMMENDED VACANCY */}
            <section className="px-4 pb-4">
                {[0, 1].map((k) => (
                    <div key={k} className="py-5">
                        {/* top row: published + bookmark */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center text-gray-400 text-[12px]">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {texts[langCode].published}
                            </div>

                            {/* bookmark toggle */}
                            <button
                                onClick={() => toggleSave(k)}
                                aria-label="save"
                                className="p-1 -mr-1 active:scale-95 bg-white border-none"
                            >
                                <svg className="w-6 h-6 bg-white" viewBox="0 0 24 24" stroke="#111" strokeWidth="1.8" fill={savedJobs[k] ? "#3066BE" : "none"}>
                                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-3-7 3V4a1 1 0 0 1 1-1z" />
                                </svg>
                            </button>
                        </div>

                        {/* title + (optional) premium diamond on 2nd card */}
                        <div className="flex items-center gap-2">
                            <h4 className="text-[20px] font-extrabold text-[#111]">
                                {texts[langCode].needed}
                            </h4>
                            {k === 1 && (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FFD54F">
                                    <path d="M12 3l7 7-7 7-7-7 7-7z" />
                                </svg>
                            )}
                        </div>

                        <p className="text-gray-500 text-[13px] mt-1">{texts[langCode].budget}</p>

                        <p className="text-gray-600 text-[13px] mt-3">
                            {texts[langCode].description}
                        </p>

                        {/* tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {texts[langCode].tags.map((t, idx) => (
                                <span key={idx} className="bg-gray-100 text-black px-3 py-1 rounded-full text-[12px]">
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* bottom-row */}
                        <div className="mt-4 flex items-center justify-between text-gray-500 text-[13px]">
                            <div className="flex items-center gap-2">
                                <div className="relative w-5 h-5">
                                    <img src="/badge-background.svg" alt="bg" className="w-5 h-5" />
                                    <img src="/check.svg" alt="check" className="absolute inset-0 w-3 h-3 m-auto" />
                                </div>
                                {texts[langCode].payment}
                            </div>

                            <div className="flex items-center gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                    </svg>
                                ))}
                                <svg className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z"/>
                                </svg>
                            </div>

                            <div className="flex items-center gap-1">
                                <img src="/location.png" alt="location" className="w-5 h-4" />
                                {texts[langCode].location_vacancy}
                            </div>
                        </div>

                        {/* divider between cards */}
                        <div className="border-t border-[#AEAEAE] mt-5" />
                    </div>
                ))}
            </section>

            <div className="px-4 mt-4 flex justify-end">
                <button
                    className="bg-[#3066BE] text-white rounded-2xl h-12 px-4 shadow
               flex items-center gap-2 active:scale-95"
                >
                    <span className="text-[14px] font-semibold">{texts[langCode].viewMore}</span>
                </button>
            </div>

            {/* FOOTER (mobile) */}
            <footer className="mt-8">
                <div className="relative">
                    {/* background image + overlay */}
                    <img src="/footer-bg.png" alt="Footer" className="w-full h-[520px] object-cover" />
                    <div className="absolute inset-0 bg-[#3066BE]/60" />

                    {/* content */}
                    <div className="absolute inset-0 text-white px-6 pt-8 pb-28">
                        {/* Logo */}
                        <h3 className="text-[40px] font-black mb-6">{texts[langCode].logo}</h3>

                        {/* Links */}
                        <ul className="space-y-6">
                            {texts[langCode].links.map((label, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    {/* chevron bullet */}
                                    <svg className="w-3 h-3 shrink-0 mb-[-10px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M8 5l8 7-8 7" />
                                    </svg>
                                    <a href="/login" className="text-[16px] text-white mb-[-10px]">{label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* bottom glass panel */}
                    <div className="absolute left-3 right-3 bottom-3 bg-white/10 backdrop-blur-md rounded-2xl text-white px-4 py-4">
                        <div className="flex items-start justify-between gap-4 text-[13px] leading-tight">
                            {/* left column */}
                            <div>
                                {/* copy line (short i18n) */}
                                <p className="opacity-90">
                                    {langCode === 'RU' && '© 2025 «HeadHunter – Вакансии».'}
                                    {langCode === 'UZ' && '© 2025 «HeadHunter – Vakansiyalar».'}
                                    {langCode === 'EN' && '© 2025 “HeadHunter – Vacancies”.'}
                                </p>
                                <a href="#" className="underline">{langCode === 'RU' ? 'Карта сайта' : langCode === 'UZ' ? 'Sayt xaritasi' : 'Sitemap'}</a>
                            </div>
                        </div>

                        {/* socials */}
                        <div className="mt-3 flex items-center gap-4">
                            {/* WhatsApp */}
                            <a href="#" aria-label="WhatsApp" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                    <path d="M20 12.4A8.4 8.4 0 1 1 6.9 4.6l-1 3.6 3.6-1A8.4 8.4 0 0 1 20 12.4Z"/>
                                    <path d="M8.5 9.5c.5 1.6 2.4 3.6 4 4l1.4-.7c.3-.2.7 0 .8.3l.7 1.2c.2.4 0 .9-.5 1.1-1.2.6-2.6.8-4.8-.5-2.1-1.3-3.1-3-3.5-4.2-.2-.5 0-1 .5-1.2l1.2-.6c.4-.2.8 0 1 .3l.2.3Z" fill="white" stroke="none"/>
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" aria-label="Instagram" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                    <rect x="3.5" y="3.5" width="17" height="17" rx="4"/>
                                    <circle cx="12" cy="12" r="3.5" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a href="#" aria-label="Facebook" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                    <path d="M13 22v-8h3l.5-3H13V9.2c0-1 .3-1.7 1.9-1.7H17V4.1C16.6 4 15.5 4 14.3 4 11.7 4 10 5.6 10 8.6V11H7v3h3v8h3Z"/>
                                </svg>
                            </a>
                            {/* X (Twitter) */}
                            <a href="#" aria-label="X" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                    <path d="M3 4l7.7 9.3L3.6 20H6l6-5.6L17.8 20H21l-8-9.3L20.4 4H18L12.4 9.2 8.2 4H3z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
