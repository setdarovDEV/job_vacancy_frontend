import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { chatApi } from "../../services/chatApi";
import { ChatWS } from "../../services/chatWS";
import api from "../../utils/api.js";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";

export default function ChatPageTablet() {
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [leftQuery, setLeftQuery] = useState("");
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const [peer, setPeer] = useState({ full_name: "", avatar: "/profile.png" });
    const [statusText, setStatusText] = useState("");
    const [typing, setTyping] = useState(false);
    const [sending, setSending] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const meIdStr = String(user?.id || user?.pk || user?.uuid || "");

    const wsRef = useRef(null);
    const inputRef = useRef(null);
    const fileRef = useRef(null);
    const endRef = useRef(null);
    const msgBoxRef = useRef(null);

    const formatName = (s) => String(s).split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    const displayName = useMemo(() => formatName(peer?.full_name || peer?.username || peer?.email || ""), [peer]);
    const isMineMsg = (m) => String(m.user_id) === meIdStr;

    const texts = {
        RU: {
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            login: "Войти",
            logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО",
                "Инвесторам", "Каталог компаний", "Работа по профессиям"],
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
            postText: "Я сказал, что мой ожидаемый ctc составляет 10 lpa, но я чувствую, что у них есть лучший диапазон зарплат от 12 lpa до 16 lpa... Если честно, я думаю что ожидания могут совпасть с предложениями на рынке. Посмотрим что будет дальше.",
            hour: "2 ч",
            topAccounts: "Топ аккаунты",
            seeAll: "Посмотреть все →",
            communityDesc: "Сообщество профессионалов в области...",
            view: "Смотреть",
            subscribe: "Подписаться"
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            login: "Kirish",
            logo: "Logo",
            links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari",
                "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo‘yicha ishlar"],
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
            postText: "Men aytdimki, mening kutilayotgan ish haqi (ctc) 10 lpa, lekin ular 12 lpa dan 16 lpa gacha yaxshiroq diapazonga ega deb o‘ylayman... Ochig‘i, o‘ylaymanki, kutgan narsalarim bozor takliflari bilan mos kelishi mumkin. Ko‘ramiz, nima bo‘ladi.",
            hour: "2 s",
            topAccounts: "Top akkauntlar",
            seeAll: "Hammasini ko‘rish →",
            communityDesc: "Konsalting sohasidagi professionallar jamiyati...",
            view: "Ko‘rish",
            subscribe: "Obuna bo‘lish"
        },
        EN: {
            community: "Community", vacancies: "Vacancies", chat: "Chat", companies: "Companies",
            login: "Login",
            logo: "Logo",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements",
                "For Investors", "Company Catalog", "Jobs by Profession"],
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
            postText: "I said my expected ctc is 10 lpa, but I feel they have a better salary range from 12 lpa to 16 lpa... Honestly, I think my expectations might match the market offers. Let’s see what happens next.",
            hour: "2 h",
            topAccounts: "Top accounts",
            seeAll: "See all →",
            communityDesc: "Community of professionals in consulting...",
            view: "View",
            subscribe: "Subscribe"
        }
    };
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    return (
        <div className="font-sans relative bg-white px-4">
            <NavbarTabletLogin />
            <div className="w-full max-w-[1440px] mx-auto py-6 flex flex-col md:flex-row gap-4 min-h-[calc(100vh-160px)] pb-[84px]">
                {/* LEFT - Chat list */}
                <div className="w-full md:w-[40%] bg-white border rounded-2xl p-4 flex flex-col">
                    <h2 className="text-[28px] md:text-[34px] font-bold text-black mb-4">Сообщения</h2>
                    <input
                        type="text"
                        placeholder="Поиск..."
                        className="w-full pl-10 pr-3 py-2 border rounded-md text-black placeholder-[#AEAEAE] text-[16px] md:text-[18px]"
                        value={leftQuery}
                        onChange={(e) => setLeftQuery(e.target.value)}
                    />
                    <div className="flex-1 overflow-y-auto flex flex-col gap-3 mt-4">
                        {(Array.isArray(rooms) ? rooms : []).map((r) => (
                            <div
                                key={r.id}
                                className="flex items-center gap-3 p-3 bg-[#F4F6FA] rounded-xl hover:shadow cursor-pointer"
                            >
                                <img src={r.peer?.avatar || "/profile.png"} className="w-[42px] h-[42px] rounded-full object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-black text-[14px] md:text-[16px]">
                                        {r.peer?.full_name || r.peer?.username || "—"}
                                    </h3>
                                    <p className="text-gray-500 text-sm truncate">{r.last_message_text || "—"}</p>
                                </div>
                                <span className="text-xs text-gray-400">{r.last_message_time || ""}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT - Messages */}
                <div className="flex-1 bg-[#F4F6FA] border rounded-2xl flex flex-col">
                    <div className="flex items-center gap-3 p-4 border-b">
                        <img src={peer?.avatar || "/profile.png"} className="w-[42px] h-[42px] rounded-full object-cover" />
                        <div>
                            <h3 className="font-semibold text-[16px] md:text-[18px] text-black">{displayName}</h3>
                            <p className="text-sm text-gray-500">{typing ? "печатает..." : (statusText || "—")}</p>
                        </div>
                    </div>

                    <div
                        ref={msgBoxRef}
                        className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[#F8F8F8CC]"
                    >
                        {messages.length === 0 ? (
                            <div className="text-gray-400">Hozircha xabar yo‘q</div>
                        ) : (
                            messages.map((m, idx) => {
                                const key = m.id ?? `tmp-${idx}`;
                                const timeStr = m.created_at
                                    ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                    : "";

                                const mine = isMineMsg(m);
                                const bubbleBase = "max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap break-words shadow-sm border";
                                const mineCls = "self-end bg-[#3066BE] text-white border-transparent rounded-br-sm";
                                const otherCls = "self-start bg-white text-black border-[#E9EEF5] rounded-bl-sm";

                                return (
                                    <div key={key} className={`${bubbleBase} ${mine ? mineCls : otherCls}`}>
                                        <div>{m.message}</div>
                                        {timeStr && (
                                            <div className={`mt-1 text-[11px] flex items-center gap-1 ${mine ? "justify-end text-white/80" : "justify-start text-gray-500"}`}>
                                                <span>{timeStr}</span>
                                                {mine && m.status === "read" && (
                                                    <img src="/double-check.png" alt="✓✓" className="w-[14px] h-[7px]" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                        <div ref={endRef} />
                    </div>

                    <div className="p-4 border-t flex flex-col gap-3 bg-[#F4F6FA]">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Напишите сообщение..."
                            className="w-full px-4 py-2 rounded-xl bg-white text-black border border-gray-300"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={!activeRoom}
                        />
                        <input
                            ref={fileRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={() => fileRef.current?.click()} disabled={!activeRoom}>
                                    <i className="fas fa-paperclip text-[#3066BE] text-xl"></i>
                                </button>
                                <button disabled={!activeRoom}>
                                    <i className="far fa-smile text-[#3066BE] text-xl"></i>
                                </button>
                            </div>
                            <button
                                disabled={!activeRoom || sending || (!input.trim() && !file)}
                                title={!activeRoom ? "Avval chatni oching" : "Yuborish"}
                            >
                                <i className="fas fa-paper-plane text-[#3066BE] text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="relative overflow-hidden md:block lg:hidden mt-[50px]">
                {/* Background */}
                <img
                    src="/footer-bg.png"
                    alt="Footer background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                {/* Content */}
                <div className="relative z-20 max-w-[960px] mx-auto px-4 py-8 text-white">
                    {/* Top area */}
                    <div className="flex flex-col gap-6">
                        {/* Logo */}
                        <h2 className="text-[36px] font-black">
                            {texts?.[langCode]?.logo || "Community"}
                        </h2>

                        {/* Links (2 columns) */}
                        <div className="grid grid-cols-2 text-white gap-x-10 gap-y-3">
                            {texts?.[langCode]?.links?.slice(0, 4).map((link, i) => (
                                <a
                                    key={`l-${i}`}
                                    href="#"
                                    className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors"
                                >
                                    <span>›</span> {link}
                                </a>
                            ))}
                            {texts?.[langCode]?.links?.slice(4).map((link, i) => (
                                <a
                                    key={`r-${i}`}
                                    href="#"
                                    className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors"
                                >
                                    <span>›</span> {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[13px] leading-snug">
                                {texts?.[langCode]?.copyright}
                            </p>

                            <div className="flex items-center gap-4 text-[20px]">
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-whatsapp" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-instagram" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-facebook" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-twitter" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
