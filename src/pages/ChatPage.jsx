// src/pages/ChatPage.jsx
import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { chatApi } from "../services/chatApi";
import { ChatWS } from "../services/chatWS";
import api from "../utils/api.js";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import ChatPageTablet from "../components/tablet/ChatPageTablet.jsx";
import ChatMobile from "../components/mobile/ChatMobile.jsx";

export default function CommunityPage() {
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [topQuery, setTopQuery] = useState("");
    const [leftQuery, setLeftQuery] = useState("");
    const [allRooms, setAllRooms] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [suggests, setSuggests] = useState([]);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null); // <— qayta yoqildi
    const [peer, setPeer] = useState({ full_name: "", avatar: "/profile.png" });
    const [statusText, setStatusText] = useState("");
    const [typing, setTyping] = useState(false);
    const [sending, setSending] = useState(false);

    const token = useMemo(() => localStorage.getItem("access") || localStorage.getItem("access_token") || "", []);
    const user = JSON.parse(localStorage.getItem("user"));
    const meId = user?.id || user?.pk || user?.uuid || "";
    const meIdStr = String(meId);
    const roomKey = useMemo(() => (activeRoom ? `chat:${activeRoom}` : null), [activeRoom]);

    // --- helper: relative URL -> absolute (api.baseURL ga tayangan)
    const makeAbsUrl = (path) => {
        if (!path) return "";
        const s = String(path).trim();
        if (/^https?:\/\//i.test(s)) return s;
        const base = (api?.defaults?.baseURL || "").replace(/\/+$/, ""); // .../api
        const clean = s.replace(/^\/+/, "");
        return `${base}/${clean}`;
    };

    const setMessagesAndCache = useCallback(
        (updater) => {
            setMessages((prev) => {
                const next = typeof updater === "function" ? updater(prev) : updater;
                try {
                    if (roomKey) localStorage.setItem(roomKey, JSON.stringify(next));
                } catch {}
                return next;
            });
        },
        [roomKey]
    );

    const wsRef = useRef(null);
    const inputRef = useRef(null);
    const fileRef = useRef(null);
    const endRef = useRef(null);
    const msgBoxRef = useRef(null);
    const typingTimer = useRef(null);
    const topBoxRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                await api.get("/api/auth/me");
            } catch (e) {
                console.warn("auth/me error:", e);
            }
        })();
    }, []);

    const formatName = (s) =>
        String(s)
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
    const displayName = useMemo(() => formatName(peer?.full_name || peer?.username || peer?.email || ""), [peer]);
    const isMineMsg = (m) => String(m.user_id) === meIdStr;
    const toCompact = (m) => ({
        id: m.id ?? null,
        created_at: m.created_at ?? null,
        user_id: String(m.user_id ?? m.sender_id ?? m.sender ?? ""),
        message: m.message ?? m.text ?? "",
        status: m.status ?? "sent",
    });
    const ago = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        const diff = Math.max(0, Date.now() - d.getTime());
        const m = Math.floor(diff / 60000);
        if (m < 1) return "в сети";
        if (m < 60) return `был(а) ${m} мин назад`;
        const h = Math.floor(m / 60);
        if (h < 24) return `был(а) ${h} часа назад`;
        const day = Math.floor(h / 24);
        return `был(а) ${day} дн назад`;
    };

    // TEXTS
    const texts = {
        RU: {
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            login: "Войти",
            logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            anonymous: "Разместить пост анонимно",
            asSchoolStudent: "как студент школы",
            asCollegeStudent: "как студент колледжа",
            asUniversityStudent: "как студент университета",
            createPost: "Создать публикацию",
            createPublication: "Создать публикацию",
            placeholder: "Поделитесь своим опытом или получите совет от других профессионалов...",
            publish: "Опубликовать",
            like: "Лайк",
            comment: "Комментарий",
            send: "Отправить",
            search: "Поиск...",
            postText:
                "Я сказал, что мой ожидаемый ctc составляет 10 lpa, но я чувствую, что у них есть лучший диапазон зарплат от 12 lpa до 16 lpa... Если честно, я думаю что ожидания могут совпасть с предложениями на рынке. Посмотрим что будет дальше.",
            hour: "2 ч",
            topAccounts: "Топ аккаунты",
            seeAll: "Посмотреть все →",
            communityDesc: "Сообщество профессионалов в области...",
            view: "Смотреть",
            subscribe: "Подписаться",
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            login: "Kirish",
            logo: "Logo",
            links: [
                "Yordam",
                "Bizning vakantiyalar",
                "Saytda reklama",
                "Dasturiy ta'minot talablari",
                "Investorlar uchun",
                "Kompaniyalar katalogi",
                "Kasblar bo‘yicha ishlar",
            ],
            copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            anonymous: "Postni anonim joylashtirish",
            asSchoolStudent: "maktab o‘quvchisi sifatida",
            asCollegeStudent: "kollej talabasi sifatida",
            asUniversityStudent: "universitet talabasi sifatida",
            createPost: "Post yaratish",
            createPublication: "Post yaratish",
            placeholder: "O‘z tajribangiz bilan o‘rtoqlashing yoki boshqa professionallardan maslahat oling...",
            publish: "Yaratish",
            like: "Layk",
            comment: "Izoh",
            send: "Yuborish",
            search: "Qidiruv...",
            postText:
                "Men aytdimki, mening kutilayotgan ish haqi (ctc) 10 lpa, lekin ular 12 lpa dan 16 lpa gacha yaxshiroq diapazonga ega deb o‘ylayman... Ochig‘i, o‘ylaymanki, kutgan narsalarim bozor takliflari bilan mos kelishi mumkin. Ko‘ramiz, nima bo‘ladi.",
            hour: "2 s",
            topAccounts: "Top akkauntlar",
            seeAll: "Hammasini ko‘rish →",
            communityDesc: "Konsalting sohasidagi professionallar jamiyati...",
            view: "Ko‘rish",
            subscribe: "Obuna bo‘lish",
        },
        EN: {
            community: "Community",
            vacancies: "Vacancies",
            chat: "Chat",
            companies: "Companies",
            login: "Login",
            logo: "Logo",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements", "For Investors", "Company Catalog", "Jobs by Profession"],
            copyright: "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            anonymous: "Post anonymously",
            asSchoolStudent: "as a school student",
            asCollegeStudent: "as a college student",
            asUniversityStudent: "as a university student",
            createPost: "Create post",
            createPublication: "Create publication",
            placeholder: "Share your experience or get advice from other professionals...",
            publish: "Publish",
            like: "Like",
            comment: "Comment",
            send: "Send",
            search: "Search...",
            postText:
                "I said my expected ctc is 10 lpa, but I feel they have a better salary range from 12 lpa to 16 lpa... Honestly, I think my expectations might match the market offers. Let’s see what happens next.",
            hour: "2 h",
            topAccounts: "Top accounts",
            seeAll: "See all →",
            communityDesc: "Community of professionals in consulting...",
            view: "View",
            subscribe: "Subscribe",
        },
    };
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    return (
        <>
            <div className="hidden md:block lg:hidden">
                <ChatPageTablet />
            </div>

            {/* Mobile */}
            <div className="block md:hidden">
                <ChatMobile />
            </div>

            <div className="hidden lg:block font-sans relative bg-white">
                {/* NAVBAR */}
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        <a href="/">
                            <img src="/logo.png" alt="Logo" className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain" />
                        </a>

                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].community}
                            </a>
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].vacancies}
                            </a>
                            <a href="/chat" className="text-[#3066BE] hover:text-[#3066BE] transition">
                                {texts[langCode].chat}
                            </a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].companies}
                            </a>
                        </div>

                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="relative flex items-center gap-2 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                                <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 sm:w-7 sm:h-4 md:w-8 md:h-5 object-cover" />
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                </svg>
                                {showLang && (
                                    <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-12 z-50">
                                        <div
                                            onClick={() => {
                                                setSelectedLang({ flag: "/ru.png", code: "RU" });
                                                setShowLang(false);
                                            }}
                                            className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                        >
                                            <img src="/ru.png" alt="RU" className="w-8 h-5" />
                                        </div>
                                        <div
                                            onClick={() => {
                                                setSelectedLang({ flag: "/uz.png", code: "UZ" });
                                                setShowLang(false);
                                            }}
                                            className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                        >
                                            <img src="/uz.png" alt="UZ" className="w-8 h-5" />
                                        </div>
                                        <div
                                            onClick={() => {
                                                setSelectedLang({ flag: "/uk.png", code: "EN" });
                                                setShowLang(false);
                                            }}
                                            className="hover:bg-gray-100 px-1 py-2 cursor-pointer flex justify-center"
                                        >
                                            <img src="/uk.png" alt="EN" className="w-8 h-5" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <ProfileDropdown />
                        </div>

                        {/* Mobile header RHS */}
                        <div className="md:hidden flex items-center gap-3 pr-4 sm:pr-6 pt-2">
                            <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                                <img src={selectedLang.flag} alt={selectedLang.code} className="w-6 h-4 object-cover" />
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                </svg>
                            </div>
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="bg-white p-2 rounded-md focus:outline-none">
                                <svg className="w-8 h-8" fill="none" stroke="#3066BE" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* mobile dropdown menu */}
                    {showMobileMenu && (
                        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 z-50">
                            <a href="" className="w-full px-4 py-3 text-center text-[#3066BE] hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].community}
                            </a>
                            <a href="/vacancies" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].vacancies}
                            </a>
                            <a href="/chat" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].chat}
                            </a>
                            <a href="/companies" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].companies}
                            </a>
                            <button className="mt-3 bg-[#3066BE] text-white px-6 py-2 rounded-md hover:bg-[#274f94] transition text-[15px]">
                                {texts[langCode].login}
                            </button>
                        </div>
                    )}
                </nav>

                {/* SEARCH BELOW NAVBAR */}
                <div className="bg-white py-4 mt-[90px]">
                    <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                        <div className="flex justify-center w-full">
                            <div ref={topBoxRef} className="relative w-[396px]">
                                <div className="flex items-center bg-[#F4F6FA] rounded-[10px] px-4 py-2 w-[396px] h-[47px] border-none">
                                    <svg className="w-5 h-5 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z" />
                                    </svg>
                                    <input
                                        value={topQuery}
                                        onChange={(e) => setTopQuery(e.target.value)}
                                        placeholder="Поиск..."
                                        className="bg-transparent outline-none border-none w-full text-sm text-black placeholder:text-black"
                                    />
                                </div>

                                {/* Autosuggest */}
                                {suggests.length > 0 && (
                                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-[10px] shadow-md border overflow-hidden">
                                        {suggests.map((u, idx) => (
                                            <button
                                                key={u.id}
                                                className={`w-full flex items-center bg-white border-none gap-3 px-3 py-2 text-left hover:bg-gray-50 ${idx === activeIdx ? "bg-gray-50" : ""}`}
                                            >
                                                <img
                                                    src={makeAbsUrl(u.avatar) || "/profile.png"}
                                                    alt=""
                                                    className="w-[34px] h-[34px] rounded-full object-cover"
                                                    onError={(e) => (e.currentTarget.src = "/profile.png")}
                                                />
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-semibold text-black">@{u.username}</span>
                                                    <span className="text-xs text-gray-500">{(u.full_name || u.username || "").toLowerCase()}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* right icons */}
                        <div className="flex items-center gap-6 ml-6 absolute top-[32px] right-[40px] z-20">
                            <div className="cursor-pointer">
                                <span className="text-2xl text-black">?</span>
                            </div>
                            <div className="relative cursor-pointer">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">1</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[1440px] mx-auto px-4 py-6 flex gap-6 min-h-[calc(100vh-160px)] pb-[84px]">
                    {/* LEFT - Chat list */}
                    <div className="w-[360px] bg-white border border-black rounded-2xl p-4 flex flex-col">
                        <div className="flex flex-col gap-4 mb-6">
                            <h2 className="text-[40px] font-bold text-black">Сообщения</h2>

                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z" />
                                </svg>

                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    className="w-full pl-[38px] pr-3 py-2 border border-black rounded-md text-black placeholder-[#AEAEAE] text-[20px] focus:outline-none focus:border-black"
                                    value={leftQuery}
                                    onChange={(e) => setLeftQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                            {(Array.isArray(rooms) ? rooms : []).map((r) => (
                                <div key={r.id} className="flex items-center gap-3 p-3 bg-[#F4F6FA] rounded-xl hover:shadow transition cursor-pointer">
                                    <img
                                        src={makeAbsUrl(r.peer?.avatar) || "/profile.png"}
                                        className="w-[46px] h-[46px] rounded-full object-cover"
                                        onError={(e) => (e.currentTarget.src = "/profile.png")}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-black">{r.peer?.full_name || r.peer?.username || "—"}</h3>
                                        <p className="text-gray-500 text-sm truncate">{r.last_message_text || "—"}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{r.last_message_time || ""}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT - Chat content */}
                    <div className="flex-1 bg-[#F4F6FA] border border-none rounded-2xl flex flex-col">
                        {/* Top: Recipient Info */}
                        <div className="flex items-center gap-4 p-4 border-b border-none">
                            <img
                                src={makeAbsUrl(peer?.avatar) || "/profile.png"}
                                className="w-[50px] h-[50px] rounded-full object-cover"
                                alt=""
                                onError={(e) => (e.currentTarget.src = "/profile.png")}
                            />
                            <div>
                                <h3 className="font-semibold text-lg text-black">{displayName}</h3>
                                <p className="text-sm text-gray-500">{typing ? "печатает..." : statusText || "—"}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={msgBoxRef}
                            className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[#F8F8F8CC]"
                            onScroll={() => {
                                if (!activeRoom || !messages.length) return;
                                const el = msgBoxRef.current;
                                if (!el) return;
                                const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
                                if (!nearBottom) return;
                                const lastId = messages[messages.length - 1]?.id;
                                if (!lastId) return;
                                chatApi.markRead(activeRoom, lastId).catch(() => {});
                            }}
                        >
                            {messages.length === 0 ? (
                                <div className="text-gray-400">Hozircha xabar yo‘q</div>
                            ) : (
                                messages.map((m, idx) => {
                                    const key = m.id ?? `tmp-${idx}-${m.created_at ?? Date.now()}`;
                                    const timeStr = m.created_at
                                        ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                        : "";

                                    const mine = isMineMsg(m);

                                    const bubbleBase = "max-w-[65%] px-4 py-2 rounded-2xl whitespace-pre-wrap break-words shadow-sm border";
                                    const mineCls = "self-end bg-[#3066BE] text-white border-transparent rounded-br-sm";
                                    const otherCls = "self-start bg-white text-black border-[#E9EEF5] rounded-bl-sm";

                                    return (
                                        <div key={key} className={`${bubbleBase} ${mine ? mineCls : otherCls}`}>
                                            <div>{m.message}</div>
                                            {timeStr && (
                                                <div className={`mt-1 text-[11px] flex items-center gap-1 ${mine ? "justify-end text-white/80" : "justify-start text-gray-500"}`}>
                                                    <span>{timeStr}</span>
                                                    {mine && m.status === "read" && <img src="/double-check.png" alt="double check" className="w-[14px] h-[7px]" />}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            <div ref={endRef} />
                        </div>

                        {/* Bottom: input */}
                        <div className="p-4 border-t border-none flex flex-col gap-3 bg-[#F4F6FA]">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Напишите сообщение..."
                                className="w-full px-4 py-2 rounded-xl bg-[#F4F6FA] text-black border-none focus:outline-none"
                                value={input}
                                // onChange={handleTyping}
                                // onKeyDown={onMsgKeyDown}
                                disabled={!activeRoom}
                            />

                            {/* Hidden file input */}
                            <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        className="text-[#3066BE] bg-[#F4F6FA] border-none hover:text-[#274f94] text-xl"
                                        onClick={() => fileRef.current?.click()}
                                        disabled={!activeRoom}
                                        title={file ? `Файл: ${file.name}` : "Прикрепить"}
                                    >
                                        <i className="fas fa-paperclip"></i>
                                    </button>
                                    <button className="text-[#3066BE] bg-[#F4F6FA] border-none hover:text-[#274f94] text-xl" onClick={() => {}} disabled={!activeRoom}>
                                        <i className="far fa-smile"></i>
                                    </button>
                                </div>
                                <button
                                    className="text-[#3066BE] text-xl bg-[#F4F6FA] border-none hover:text-[#274f94]"
                                    // onClick={onClickSend}
                                    disabled={!activeRoom || sending || (!input.trim() && !file)}
                                    title={!activeRoom ? "Avval chatni oching" : "Yuborish"}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <footer className="w-full h-[393px] relative overflow-hidden">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                    <div className="relative z-20">
                        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                            <div className="flex gap-[190px]">
                                <div>
                                    <h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">{texts[langCode].logo}</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-[184px]">
                                    <div className="flex flex-col gap-[20px]">
                                        {texts[langCode].links.slice(0, 4).map((link, idx) => (
                                            <a
                                                key={idx}
                                                href="#"
                                                className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300"
                                            >
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-[20px]">
                                        {texts[langCode].links.slice(4).map((link, idx) => (
                                            <a
                                                key={idx}
                                                href="#"
                                                className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300"
                                            >
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                            <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                                <p>{texts[langCode].copyright}</p>

                                <div className="flex gap-[20px] text-[24px] mr-[38px]">
                                    <a href="#" className="text-white">
                                        <i className="fab fa-whatsapp hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-instagram hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-facebook hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-twitter hover:text-[#F2F4FD]"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
