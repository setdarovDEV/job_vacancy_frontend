// components/mobile/ChatMobile.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatConversationMobile from "./ChatConversationMobile";

import {
    Menu,
    Bell,
    Search,
    X,
    ChevronRight,
} from "lucide-react";
import MobileNavbar from "./MobileNavbarLogin.jsx";

// i18n (asosiy label/placeholder’lar)
const TEXTS = {
    RU: {
        login: "Войти",
        search: "Поиск...",
        chats: "Чаты",
        community: "Сообщество",
        vacancies: "Вакансии",
        chat: "Чат",
        companies: "Компании",
        language: "Язык",
        unread: "непроч.",
    },
    UZ: {
        login: "Kirish",
        search: "Qidiruv...",
        chats: "Chatlar",
        community: "Jamiyat",
        vacancies: "Vakansiyalar",
        chat: "Chat",
        companies: "Kompaniyalar",
        language: "Til",
        unread: "o‘qilmagan",
    },
    EN: {
        login: "Login",
        search: "Search...",
        chats: "Chats",
        community: "Community",
        vacancies: "Vacancies",
        chat: "Chat",
        companies: "Companies",
        language: "Language",
        unread: "unread",
    },
};

export default function ChatMobile() {
    // Lang
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const langCode = selectedLang?.code === "GB" ? "EN" : (selectedLang?.code || "RU");
    const t = TEXTS[langCode];

    // Navbar menyular
    const [openMenu, setOpenMenu] = useState(false);
    const [openLang, setOpenLang] = useState(false);

    // Qidiruv
    const [searchText, setSearchText] = useState("");

    // Chat modal
    const [openedChat, setOpenedChat] = useState(null);
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [globalQuery, setGlobalQuery] = useState(""); // username qidiruvi (butun tizim)
    const [chatQuery, setChatQuery] = useState("");
    const [activePeer, setActivePeer] = useState(null);

    const navigate = useNavigate();


    const openDMByUsername = (uname) => {
        const u = uname.trim().replace(/^@/, "");
        if (!u) return;
        // agar sizda alohida handler bo'lsa, shu yerda chaqiring
        // startChatByUsername?.(u);
        navigate(`/chat?u=${encodeURIComponent(u)}`);
    };


    // Dummy chatlar (keyinchalik API bilan almashtirasiz)
    const [chats] = useState([
        {
            id: 1,
            name: "Otabek Sh.",
            avatar: "/user-white.jpg",
            lastMessage: "Assalomu alaykum! Rezyumeni ko‘rdim…",
            time: "14:20",
            unread: 2,
            online: true,
        },
        {
            id: 2,
            name: "Design Studio",
            avatar: "/profile.png",
            lastMessage: "Maketi jo‘natdim, feedback qoldirasizmi?",
            time: "13:47",
            unread: 0,
            online: false,
        },
        {
            id: 3,
            name: "HR — TechCorp",
            avatar: "/profile.png",
            lastMessage: "Ertaga soat 10:00 intervyu?",
            time: "12:03",
            unread: 1,
            online: true,
        },
        {
            id: 4,
            name: "Sardor R.",
            avatar: "/user-white.jpg",
            lastMessage: "OK, gap yo‘q 👍",
            time: "09:55",
            unread: 0,
            online: false,
        },
        {
            id: 5,
            name: "Nodira UX",
            avatar: "/user-white.jpg",
            lastMessage: "Wireframe’larni yuklab qo‘ydim.",
            time: "W 18:22",
            unread: 0,
            online: true,
        },
    ]);



    const texts = {
        RU: {
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            login: "Войти",
            loginWarn: "Пожалуйста, войдите в систему.",
            anonymous: "Разместить пост анонимно",
            asSchoolStudent: "как студент школы",
            asCollegeStudent: "как студент колледжа",
            asUniversityStudent: "как студент университета",
            createPost: "Создать публикацию",
            createPublication: "Создать публикацию",
            placeholder: "Поделитесь опытом или получите совет...",
            publish: "Опубликовать",
            publishing: "Публикую...",
            addImage: "Добавить изображение",
            needTextOrImage: "Нужен текст или изображение.",
            postError: "Ошибка при создании поста.",
            like: "Лайк",
            comment: "Комментарий",
            send: "Отправить",
            search: "Поиск...",
            you: "Вы",
            loadMore: "Показать ещё",
            loading: "Загрузка...",
            topAccounts: "Топ аккаунты",
            seeAll: "Посмотреть все →",
            communityDesc: "Сообщество профессионалов...",
            view: "Смотреть",
            logo: "Logo",
            links: ["Помощь","Наши вакансии","Реклама на сайте","Требования к ПО","Инвесторам","Каталог компаний","Работа по профессиям"],
            copyShort: "© 2025 «HeadHunter – Вакансии».",
            sitemap: "Карта сайта",
            rights: "Все права защищены.",
            createSite: "Создание сайтов",
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            login: "Kirish",
            loginWarn: "Tizimga kiring.",
            anonymous: "Postni anonim joylashtirish",
            asSchoolStudent: "maktab o‘quvchisi sifatida",
            asCollegeStudent: "kollej talabasi sifatida",
            asUniversityStudent: "universitet talabasi sifatida",
            createPost: "Post yaratish",
            createPublication: "Post yaratish",
            placeholder: "Tajriba ulashing yoki maslahat oling...",
            publish: "Yaratish",
            publishing: "Yuklanmoqda...",
            addImage: "Rasm qo‘shish",
            needTextOrImage: "Matn yoki rasm bo‘lishi kerak.",
            postError: "Post yaratishda xatolik.",
            like: "Layk",
            comment: "Izoh",
            send: "Yuborish",
            search: "Qidiruv...",
            you: "Siz",
            loadMore: "Yana ko‘rsatish",
            loading: "Yuklanmoqda...",
            topAccounts: "Top akkauntlar",
            seeAll: "Hammasini ko‘rish →",
            communityDesc: "Konsalting professionallari jamiyati...",
            view: "Ko‘rish",
            logo: "Logo",
            links: ["Yordam","Bizning vakantiyalar","Saytda reklama","Dasturiy ta'minot talablari","Investorlar uchun","Kompaniyalar katalogi","Kasblar bo‘yicha ishlar"],
            copyShort: "© 2025 «HeadHunter – Vakansiyalar».",
            sitemap: "Sayt xaritasi",
            rights: "Barcha huquqlar himoyalangan.",
            createSite: "Sayt yaratish",
        },
        EN: {
            community: "Community",
            vacancies: "Vacancies",
            chat: "Chat",
            companies: "Companies",
            login: "Login",
            loginWarn: "Please log in.",
            anonymous: "Post anonymously",
            asSchoolStudent: "as a school student",
            asCollegeStudent: "as a college student",
            asUniversityStudent: "as a university student",
            createPost: "Create post",
            createPublication: "Create publication",
            placeholder: "Share your experience or ask for advice...",
            publish: "Publish",
            publishing: "Publishing...",
            addImage: "Add image",
            needTextOrImage: "Text or image is required.",
            postError: "Failed to create post.",
            like: "Like",
            comment: "Comment",
            send: "Send",
            search: "Search...",
            you: "You",
            loadMore: "Load more",
            loading: "Loading...",
            topAccounts: "Top accounts",
            seeAll: "See all →",
            communityDesc: "Community of professionals...",
            view: "View",
            logo: "Logo",
            links: ["Help","Our Vacancies","Advertising on site","Software Requirements","For Investors","Company Catalog","Jobs by Profession"],
            copyShort: "© 2025 “HeadHunter – Vacancies”.",
            sitemap: "Sitemap",
            rights: "All rights reserved.",
            createSite: "Website creation",
        },
    };

    const filtered = useMemo(() => {
        const q = searchText.trim().toLowerCase();
        if (!q) return chats;
        return chats.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                (c.lastMessage || "").toLowerCase().includes(q)
        );
    }, [searchText, chats]);

    return (
        <div className="block md:hidden bg-white min-h-screen">
            <MobileNavbar />

            {/* TOP ROW: chapda lupa (global search), o‘ngda bell */}
            <div className="px-4 pt-3">
                {!showGlobalSearch ? (
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            aria-label="Open people search"
                            onClick={() => setShowGlobalSearch(true)}
                            className="p-2 rounded-full active:scale-95"
                        >
                            <Search className="w-6 h-6 text-[#3066BE]" />
                        </button>

                        <button
                            type="button"
                            aria-label="Notifications"
                            className="p-2 rounded-full border-none active:scale-95 relative"
                        >
                            <Bell className="w-6 h-6 text-[#3066BE]" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
          1
        </span>
                        </button>
                    </div>
                ) : (
                    // GLOBAL (butun tizim) USERNAME qidiruvi
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-10 rounded-2xl bg-[#F4F6FA] px-3 flex items-center">
                            <Search className="w-5 h-5 text-[#3066BE]" />
                            <input
                                value={globalQuery}
                                onChange={(e) => setGlobalQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && openDMByUsername(globalQuery)}
                                placeholder="@username"
                                className="ml-2 flex-1 bg-transparent border-none text-[14px] text-[#111] placeholder-black/60 outline-none"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => setShowGlobalSearch(false)}
                            className="p-2 rounded-xl active:scale-95 bg-white"
                            aria-label="Close global search"
                        >
                            <p className="text-black">✕</p>
                        </button>
                    </div>
                )}
            </div>

            {/* Title */}
            <h1 className="px-4 mt-4 text-[22px] font-bold text-black">Сообщения</h1>

            {/* LOCAL (chatlar ro'yxati) qidiruvi + filter */}
            <div className="px-4 w-[100px] ml-[55px] mt-3 flex items-center gap-3">
                <div className="flex-1 h-10 rounded-2xl bg-[#F4F6FA] px-3 flex items-center">
                    <Search className="w-5 h-5 text-black/70" />
                    <input
                        value={chatQuery}
                        onChange={(e) => setChatQuery(e.target.value)}
                        placeholder="поиск..."
                        className="ml-2 flex-1 bg-transparent border-none text-[14px] text-[#111] placeholder-black/60 outline-none"
                    />
                </div>
            </div>


            {/* TITLE / COUNTER */}
            <div className="px-4 py-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-[16px] font-semibold">{t.chats}</h2>
                    <span className="text-[12px] text-[#AEAEAE]">{filtered.length}</span>
                </div>
            </div>

            {/* CHAT LIST */}
            <section className="px-3 pb-24">
                <div className="space-y-2">
                    {filtered.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setActivePeer(c)}
                            className="w-full bg-[#F4F6FA] rounded-2xl p-3 flex items-center gap-3 active:scale-[0.99] text-left"
                        >
                            {/* Avatar + online dot */}
                            <div className="relative shrink-0">
                                <img
                                    src={c.avatar}
                                    alt={c.name}
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                {c.online && (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
                                )}
                            </div>

                            {/* Name + lastMessage */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-[14px] font-semibold text-black truncate">{c.name}</div>
                                    <div className="text-[11px] text-[#AEAEAE] shrink-0">{c.time}</div>
                                </div>
                                <div className="mt-0.5 flex items-center justify-between gap-2">
                                    <p className="text-[12px] text-gray-600 truncate">{c.lastMessage}</p>
                                    {c.unread > 0 && (
                                        <span className="ml-2 shrink-0 min-w-5 h-5 px-1 rounded-full bg-[#3066BE] text-white text-[11px] flex items-center justify-center">
                      {c.unread}
                    </span>
                                    )}
                                </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-[#AEAEAE] shrink-0" />
                        </button>
                    ))}
                </div>
            </section>

            <ChatConversationMobile
                open={!!activePeer}
                peer={activePeer || undefined}
                onClose={() => setActivePeer(null)}
            />

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
        </div>
    );
}
