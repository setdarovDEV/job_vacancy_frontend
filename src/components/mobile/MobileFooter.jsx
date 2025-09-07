import React, {useState} from "react";

export default function MobileFooter() {
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const langCode = selectedLang?.code === "GB" ? "EN" : (selectedLang?.code || "RU");

    const texts = {
        RU: {
            logo: "Logo",
            links: ["Помощь","Наши вакансии","Реклама на сайте","Требования к ПО","Инвесторам","Каталог компаний","Работа по профессиям"],
            copyShort: "© 2025 «HeadHunter – Вакансии».",
            sitemap: "Карта сайта",
            rights: "Все права защищены.",
            createSite: "Создание сайтов",
        },
        UZ: {
            logo: "Logo",
            links: ["Yordam","Bizning vakantiyalar","Saytda reklama","Dasturiy ta'minot talablari","Investorlar uchun","Kompaniyalar katalogi","Kasblar bo‘yicha ishlar"],
            copyShort: "© 2025 «HeadHunter – Vakansiyalar».",
            sitemap: "Sayt xaritasi",
            rights: "Barcha huquqlar himoyalangan.",
            createSite: "Sayt yaratish",
        },
        EN: {
            logo: "Logo",
            links: ["Help","Our Vacancies","Advertising on site","Software Requirements","For Investors","Company Catalog","Jobs by Profession"],
            copyShort: "© 2025 “HeadHunter – Vacancies”.",
            sitemap: "Sitemap",
            rights: "All rights reserved.",
            createSite: "Website creation",
        },
    };


    return (
        <>
        {/* FOOTER (mobile) */}
        <footer>
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
    </>
    );
}
