// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Send, ArrowLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown";
import MobileNavbar from "../components/mobile/MobileNavbar";
import MobileNavbarLogin from "../components/mobile/MobileNavbarLogin";
import MobileFooter from "../components/mobile/MobileFooter";

// ============================================
// HELPERS
// ============================================
const makeAbsUrl = (path) => {
    if (!path) return "";
    const s = String(path).trim();
    if (/^https?:\/\//i.test(s)) return s;
    const base = (api?.defaults?.baseURL || "").replace(/\/+$/, "");
    const clean = s.replace(/^\/+/, "");
    return `${base}/${clean}`;
};

const formatTime = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ============================================
// TEXTS
// ============================================
const TEXTS = {
    RU: {
        community: "Сообщество",
        vacancies: "Вакансии",
        chat: "Чат",
        companies: "Компании",
        login: "Войти",
        messages: "Сообщения",
        search: "Поиск...",
        writeMessage: "Напишите сообщение...",
        noMessages: "Хозирча хабар йўқ",
        logo: "Logo",
        links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
        copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
    },
    UZ: {
        community: "Jamiyat",
        vacancies: "Vakansiyalar",
        chat: "Chat",
        companies: "Kompaniyalar",
        login: "Kirish",
        messages: "Xabarlar",
        search: "Qidiruv...",
        writeMessage: "Xabar yozing...",
        noMessages: "Xabarlar yo'q",
        logo: "Logo",
        links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari", "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo'yicha ishlar"],
        copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
    },
};

// ============================================
// MOBILE CONVERSATION MODAL
// ============================================
function MobileConversation({ open, peer, onClose }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [file, setFile] = useState(null);
    const [chatId, setChatId] = useState(null);
    const endRef = useRef(null);
    const fileRef = useRef(null);

    const meIdStr = String(localStorage.getItem("user_id") || "");

    useEffect(() => {
        if (!open || !peer?.id) return;

        const init = async () => {
            try {
                const chatRes = await api.post("/api/chats/get_or_create/", { user_id: peer.id });
                setChatId(chatRes.data.id);

                const msgRes = await api.get(`/api/chats/${chatRes.data.id}/messages/`);
                setMessages(msgRes.data || []);

                setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            } catch (err) {
                console.error("Load messages error:", err);
            }
        };

        init();
    }, [open, peer?.id]);

    const handleSend = async () => {
        if (!input.trim() && !file) return;

        try {
            setSending(true);

            const formData = new FormData();
            if (input.trim()) formData.append("text", input.trim());
            if (file) formData.append("file", file);

            await api.post(`/api/chats/${chatId}/messages/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const msgRes = await api.get(`/api/chats/${chatId}/messages/`);
            setMessages(msgRes.data || []);

            setInput("");
            setFile(null);
            if (fileRef.current) fileRef.current.value = "";

            setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        } catch (err) {
            console.error("Send message error:", err);
        } finally {
            setSending(false);
        }
    };

    // ✅ YANGI: Profile sahifasiga o'tish
    const handleAvatarClick = () => {
        if (peer?.id) {
            navigate(`/profile/${peer.id}`);
        }
    };

    if (!open) return null;

    const isMineMsg = (m) => String(m.sender?.id) === meIdStr || m.is_me === true;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            <div className="h-[60px] border-b flex items-center justify-between px-4">
                <button onClick={onClose} className="p-2 -ml-2 active:scale-95">
                    <ArrowLeft className="w-5 h-5 text-[#3066BE]" />
                </button>

                {/* ✅ Avatar va ism bosiladigan */}
                <button
                    onClick={handleAvatarClick}
                    className="flex items-center gap-3 active:scale-95 transition"
                >
                    <img
                        src={makeAbsUrl(peer?.avatar_url) || "/user1.png"}
                        alt={peer?.full_name || "User"}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                    <div className="text-left">
                        <p className="text-[15px] font-semibold text-black cursor-pointer hover:text-[#3066BE]">
                            {peer?.full_name || peer?.username || "—"}
                        </p>
                        <p className="text-[12px] text-gray-500">Online</p>
                    </div>
                </button>

                <div className="w-5" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F8F8F8]">
                <div className="space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">Xabarlar yo'q</div>
                    ) : (
                        messages.map((m) => {
                            const mine = isMineMsg(m);
                            const timeStr = formatTime(m.created_at);

                            return (
                                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${mine ? "bg-[#3066BE] text-white rounded-br-sm" : "bg-white text-black rounded-bl-sm border border-gray-200"}`}>
                                        <p className="text-[14px] break-words">{m.text}</p>
                                        {timeStr && <p className={`mt-1 text-[11px] ${mine ? "text-white/80" : "text-gray-500"}`}>{timeStr}</p>}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={endRef} />
                </div>
            </div>

            <div className="border-t px-4 py-3 bg-white">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Xabar yozing..."
                        className="flex-1 h-10 px-4 rounded-2xl bg-[#F4F6FA] border-none outline-none text-[14px] text-black placeholder-gray-500"
                    />

                    <button onClick={handleSend} disabled={sending || (!input.trim() && !file)} className="p-2 bg-transparent active:scale-95 disabled:opacity-50">
                        <Send className="w-5 h-5 text-[#3066BE]" />
                    </button>
                </div>

                <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ChatPage() {
    const navigate = useNavigate();

    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [file, setFile] = useState(null);

    const [leftQuery, setLeftQuery] = useState("");
    const [suggests, setSuggests] = useState([]);

    const [activePeer, setActivePeer] = useState(null);

    const fileRef = useRef(null);
    const endRef = useRef(null);

    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";
    const t = TEXTS[langCode] || TEXTS.RU;

    const meIdStr = String(localStorage.getItem("user_id") || "");

    useEffect(() => {
        api.get("/api/auth/me/")
            .then((res) => setUser(res.data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        api.get("/api/auth/profile/")
            .then((res) => {
                const imagePath = res.data.profile_image;
                if (imagePath) {
                    const imageUrl = `http://127.0.0.1:8000${imagePath}?t=${Date.now()}`;
                    setProfileImage(imageUrl);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get("/api/chats/");
                setChats(res.data || []);
            } catch (err) {
                console.error("Fetch chats error:", err);
            }
        };
        fetchChats();
    }, []);

    useEffect(() => {
        if (!activeChat?.id) return;

        const loadMessages = async () => {
            try {
                const res = await api.get(`/api/chats/${activeChat.id}/messages/`);
                setMessages(res.data || []);
                setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            } catch (err) {
                console.error("Load messages error:", err);
            }
        };

        loadMessages();
    }, [activeChat?.id]);

    useEffect(() => {
        const query = leftQuery.trim();
        if (!query) {
            setSuggests([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                const res = await api.get(`/api/auth/users/search/?q=${encodeURIComponent(query)}`);
                const filtered = (res.data.results || []).filter((u) => u.role !== "ADMIN" && String(u.id) !== meIdStr);
                setSuggests(filtered);
            } catch (err) {
                console.error("Search error:", err);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [leftQuery, meIdStr]);

    const handleSelectUser = async (u) => {
        try {
            const chatRes = await api.post("/api/chats/get_or_create/", { user_id: u.id });
            setActiveChat(chatRes.data);
            setSuggests([]);
            setLeftQuery("");

            const msgRes = await api.get(`/api/chats/${chatRes.data.id}/messages/`);
            setMessages(msgRes.data || []);
        } catch (err) {
            console.error("Create chat error:", err);
        }
    };

    const handleSend = async () => {
        if (!input.trim() && !file) return;

        try {
            setSending(true);

            const formData = new FormData();
            if (input.trim()) formData.append("text", input.trim());
            if (file) formData.append("file", file);

            await api.post(`/api/chats/${activeChat.id}/messages/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const res = await api.get(`/api/chats/${activeChat.id}/messages/`);
            setMessages(res.data || []);

            setInput("");
            setFile(null);
            if (fileRef.current) fileRef.current.value = "";

            setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        } catch (err) {
            console.error("Send message error:", err);
            toast.error("Xatolik yuz berdi");
        } finally {
            setSending(false);
        }
    };

    // ✅ YANGI: Profile sahifasiga o'tish
    const handleUserClick = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const isMineMsg = (m) => String(m.sender?.id) === meIdStr || m.is_me === true;

    return (
        <>
            {/* ============================================ */}
            {/* DESKTOP VERSION (lg:) */}
            {/* ============================================ */}
            <div className="hidden lg:block font-sans relative bg-white">
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        <a href="/">
                            <img src="/logo.png" alt="Logo" className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain" />
                        </a>

                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">
                                {t.community}
                            </a>
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">
                                {t.vacancies}
                            </a>
                            <a href="/chat" className="text-[#3066BE]">
                                {t.chat}
                            </a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">
                                {t.companies}
                            </a>
                        </div>

                        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
                            <ProfileDropdown />
                        </div>
                    </div>
                </nav>

                <div className="bg-white py-4 mt-[90px]"></div>

                <div className="w-full max-w-[1440px] mx-auto px-4 pt-10 pb-6 flex gap-6 min-h-[calc(100vh-160px)]">
                    <div className="w-[360px] bg-white border border-black rounded-2xl p-4 flex flex-col">
                        <h2 className="text-[40px] font-bold text-black mb-6">{t.messages}</h2>

                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                            <input
                                type="text"
                                placeholder={t.search}
                                className="w-full pl-[38px] pr-3 py-2 border border-black rounded-md text-black placeholder-[#AEAEAE] text-[20px] focus:outline-none focus:border-black"
                                value={leftQuery}
                                onChange={(e) => setLeftQuery(e.target.value)}
                            />

                            {leftQuery.trim() && suggests.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-50 max-h-64 overflow-y-auto">
                                    {suggests.map((u) => (
                                        <div key={u.id} className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectUser(u)}>
                                            <img src={makeAbsUrl(u.avatar_url) || "/user1.png"} alt={u.full_name} className="w-10 h-10 rounded-full object-cover border" />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-black">{u.full_name || u.username}</span>
                                                <span className="text-sm text-gray-500">{u.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                            {chats.map((chat) => (
                                <div key={chat.id} className="flex items-center gap-3 p-3 bg-[#F4F6FA] rounded-xl hover:shadow transition cursor-pointer" onClick={() => setActiveChat(chat)}>
                                    {/* ✅ Avatar bosiladigan */}
                                    <img
                                        src={makeAbsUrl(chat.other_user?.avatar_url) || "/user1.png"}
                                        className="w-[46px] h-[46px] rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#3066BE]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserClick(chat.other_user?.id);
                                        }}
                                        onError={(e) => (e.currentTarget.src = "/user1.png")}
                                    />
                                    <div className="flex-1">
                                        {/* ✅ Ism bosiladigan */}
                                        <h3
                                            className="font-semibold text-black cursor-pointer hover:text-[#3066BE]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUserClick(chat.other_user?.id);
                                            }}
                                        >
                                            {chat.other_user?.full_name || chat.other_user?.username || "—"}
                                        </h3>
                                        <p className="text-gray-500 text-sm truncate">{chat.last_message?.text || "—"}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{formatTime(chat.last_message?.created_at)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-[#F4F6FA] rounded-2xl flex flex-col">
                        <div className="flex items-center gap-4 p-4 border-b">
                            {/* ✅ Avatar bosiladigan */}
                            <img
                                src={makeAbsUrl(activeChat?.other_user?.avatar_url) || "/user1.png"}
                                className="w-[50px] h-[50px] rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#3066BE]"
                                alt=""
                                onClick={() => handleUserClick(activeChat?.other_user?.id)}
                                onError={(e) => (e.currentTarget.src = "/user1.png")}
                            />
                            <div>
                                {/* ✅ Ism bosiladigan */}
                                <h3
                                    className="font-semibold text-lg text-black cursor-pointer hover:text-[#3066BE]"
                                    onClick={() => handleUserClick(activeChat?.other_user?.id)}
                                >
                                    {activeChat?.other_user?.full_name || activeChat?.other_user?.username || "—"}
                                </h3>
                                <p className="text-sm text-gray-500">Online</p>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[#F8F8F8CC]">
                            {messages.length === 0 ? (
                                <div className="text-gray-400">{t.noMessages}</div>
                            ) : (
                                messages.map((m) => {
                                    const mine = isMineMsg(m);
                                    const timeStr = formatTime(m.created_at);

                                    return (
                                        <div key={m.id} className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap break-words shadow-sm border ${mine ? "self-end bg-[#3066BE] text-white border-transparent rounded-br-sm" : "self-start bg-white text-black border-[#E9EEF5] rounded-bl-sm"}`}>
                                            <div>{m.text}</div>
                                            {timeStr && (
                                                <div className={`mt-1 text-[11px] flex items-center gap-1 ${mine ? "justify-end text-white/80" : "justify-start text-gray-500"}`}>
                                                    <span>{timeStr}</span>
                                                    {mine && <img src="/double-check.png" alt="✓✓" className="w-[14px] h-[7px]" />}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                            <div ref={endRef} />
                        </div>

                        <div className="p-4 border-t bg-[#F4F6FA]">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder={t.writeMessage}
                                    className="flex-1 px-4 py-2 rounded-xl bg-[#F4F6FA] text-black border-none focus:outline-none"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                                    disabled={!activeChat}
                                />

                                <button className="text-[#3066BE] text-xl bg-[#F4F6FA] border-none hover:text-[#274f94]" onClick={handleSend} disabled={!activeChat || sending || (!input.trim() && !file)}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>

                            <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                </div>

                <footer className="w-full h-[393px] relative overflow-hidden">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                    <div className="relative z-20">
                        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                            <div className="flex gap-[190px]">
                                <div>
                                    <h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">{t.logo}</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-[184px]">
                                    <div className="flex flex-col gap-[20px]">
                                        {t.links.slice(0, 4).map((link, idx) => (
                                            <a key={idx} href="#" className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-[20px]">
                                        {t.links.slice(4).map((link, idx) => (
                                            <a key={idx} href="#" className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300">
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                            <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                                <p>{t.copyright}</p>
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

            {/* ============================================ */}
            {/* TABLET VERSION (md:lg) */}
            {/* ============================================ */}
            <div className="hidden md:block lg:hidden">
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[960px] mx-auto flex items-center justify-between px-4 h-[90px]">
                        <a href="/">
                            <img src="/logo.png" alt="Logo" className="w-[90px] h-[60px] object-contain" />
                        </a>

                        <div className="flex gap-6 font-semibold text-[14px] tracking-wide">
                            <a href="/community" className="text-black hover:text-[#3066BE] transition">
                                {t.community}
                            </a>
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">
                                {t.vacancies}
                            </a>
                            <a href="/chat" className="text-[#3066BE]">
                                {t.chat}
                            </a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">
                                {t.companies}
                            </a>
                        </div>

                        <ProfileDropdown />
                    </div>
                </nav>

                <div className="font-sans bg-white px-4 mt-[140px]">
                    <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-4 min-h-[calc(100vh-0px)] pb-[84px]">
                        <div className="w-full md:w-[40%] bg-white border rounded-2xl p-4 flex flex-col relative">
                            <h2 className="text-[28px] font-bold text-black mb-4">{t.messages}</h2>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input type="text" placeholder={t.search} className="w-full pl-10 pr-3 py-2 border rounded-md text-black placeholder-[#AEAEAE] text-[16px]" value={leftQuery} onChange={(e) => setLeftQuery(e.target.value)} />
                                {leftQuery && suggests.length > 0 && (
                                    <div className="absolute z-50 bg-white shadow-md rounded-md mt-2 w-full max-h-64 overflow-y-auto border">
                                        {suggests.map((u) => (
                                            <div key={u.id} onClick={() => handleSelectUser(u)} className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer">
                                                <img src={makeAbsUrl(u.avatar_url) || "/user.jpg"} className="w-8 h-8 rounded-full" alt="" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{u.full_name}</span>
                                                    <span className="text-xs text-gray-500">@{u.username}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto flex flex-col gap-3 mt-4">
                                {chats.map((chat) => (
                                    <div key={chat.id} onClick={() => setActiveChat(chat)} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${activeChat?.id === chat.id ? "bg-[#E8EEFF]" : "bg-[#F4F6FA] hover:shadow"}`}>
                                        {/* ✅ Avatar bosiladigan */}
                                        <img
                                            src={makeAbsUrl(chat.other_user?.avatar_url) || "/profile.png"}
                                            className="w-[42px] h-[42px] rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#3066BE]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUserClick(chat.other_user?.id);
                                            }}
                                        />
                                        <div className="flex-1">
                                            {/* ✅ Ism bosiladigan */}
                                            <h3
                                                className="font-semibold text-black text-[15px] cursor-pointer hover:text-[#3066BE]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUserClick(chat.other_user?.id);
                                                }}
                                            >
                                                {chat.other_user?.full_name || "—"}
                                            </h3>
                                            <p className="text-gray-500 text-sm truncate">{chat.last_message?.text || "—"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 bg-[#F7F7F7] rounded-2xl flex flex-col">
                            <div className="flex items-center gap-3 p-4 border-b">
                                {/* ✅ Avatar bosiladigan */}
                                <img
                                    src={makeAbsUrl(activeChat?.other_user?.avatar_url) || "/profile.png"}
                                    className="w-[42px] h-[42px] rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#3066BE]"
                                    onClick={() => handleUserClick(activeChat?.other_user?.id)}
                                />
                                <div>
                                    {/* ✅ Ism bosiladigan */}
                                    <h3
                                        className="font-semibold text-[16px] text-black cursor-pointer hover:text-[#3066BE]"
                                        onClick={() => handleUserClick(activeChat?.other_user?.id)}
                                    >
                                        {activeChat?.other_user?.full_name || "—"}
                                    </h3>
                                    <p className="text-sm text-gray-500">Online</p>
                                </div>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[#F8F8F8]" ref={endRef}>
                                {messages.length === 0 ? (
                                    <div className="text-gray-400">{t.noMessages}</div>
                                ) : (
                                    messages.map((m) => {
                                        const mine = isMineMsg(m);
                                        return (
                                            <div key={m.id} className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap break-words shadow-sm border ${mine ? "self-end bg-[#3066BE] text-white border-transparent rounded-br-sm" : "self-start bg-white text-black border-[#E9EEF5] rounded-bl-sm"}`}>
                                                <div>{m.text}</div>
                                                <div className={`mt-1 text-[11px] flex items-center gap-1 ${mine ? "justify-end text-white/80" : "justify-start text-gray-500"}`}>
                                                    <span>{formatTime(m.created_at)}</span>
                                                    {mine && <img src="/double-check.png" alt="✓✓" className="w-[14px] h-[7px]" />}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="p-4 bg-[#F7F7F7]">
                                <div className="flex items-center gap-3">
                                    <input type="text" placeholder={t.writeMessage} className="flex-1 px-4 py-2 rounded-xl bg-[#F7F7F7] text-black border-none focus:outline-none" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} disabled={!activeChat} />

                                    <button onClick={handleSend} disabled={!activeChat || sending || (!input.trim() && !file)} className="p-2 bg-transparent hover:opacity-70 transition disabled:opacity-30">
                                        <i className="fas fa-paper-plane text-[#3066BE] text-xl"></i>
                                    </button>
                                </div>
                                <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="relative overflow-hidden mt-[50px] w-full">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                    <div className="relative z-20 w-full px-6 py-8 text-white">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-[36px] font-black">{t.logo}</h2>

                            <div className="grid grid-cols-2 text-white gap-x-10 gap-y-3">
                                {t.links.slice(0, 4).map((link, i) => (
                                    <a key={`l-${i}`} href="#" className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors">
                                        <span>›</span> {link}
                                    </a>
                                ))}
                                {t.links.slice(4).map((link, i) => (
                                    <a key={`r-${i}`} href="#" className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors">
                                        <span>›</span> {link}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4 w-full">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <p className="text-[13px] leading-snug">{t.copyright}</p>

                                <div className="flex items-center gap-4 text-[20px]">
                                    <a href="#" className="text-white hover:opacity-90">
                                        <i className="fab fa-whatsapp" />
                                    </a>
                                    <a href="#" className="text-white hover:opacity-90">
                                        <i className="fab fa-instagram" />
                                    </a>
                                    <a href="#" className="text-white hover:opacity-90">
                                        <i className="fab fa-facebook" />
                                    </a>
                                    <a href="#" className="text-white hover:opacity-90">
                                        <i className="fab fa-twitter" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ============================================ */}
            {/* MOBILE VERSION (default) */}
            {/* ============================================ */}
            <div className="block md:hidden bg-white min-h-screen">
                {user ? <MobileNavbarLogin /> : <MobileNavbar />}

                <h1 className="px-4 mt-20 text-[22px] font-bold text-black">{t.messages}</h1>

                <div className="px-4 mt-3 flex items-center gap-3">
                    <div className="flex-1 h-10 rounded-2xl bg-[#F4F6FA] px-3 flex items-center">
                        <Search className="w-5 h-5 text-black/70" />
                        <input value={leftQuery} onChange={(e) => setLeftQuery(e.target.value)} placeholder={t.search} className="ml-2 flex-1 bg-transparent border-none text-[14px] text-[#111] placeholder-black/60 outline-none" />
                    </div>
                </div>

                <section className="px-3 pb-24 mt-4">
                    <div className="space-y-2">
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setActivePeer(chat.other_user)}
                                className="w-full bg-[#F4F6FA] rounded-2xl p-3 flex items-center gap-3 active:scale-[0.99] text-left"
                            >
                                <div className="relative shrink-0">
                                    {/* ✅ Avatar bosiladigan */}
                                    <img
                                        src={makeAbsUrl(chat.other_user?.avatar_url) || "/user1.png"}
                                        alt={chat.other_user?.full_name}
                                        className="w-12 h-12 rounded-full object-cover border cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserClick(chat.other_user?.id);
                                        }}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        {/* ✅ Ism bosiladigan */}
                                        <div
                                            className="text-[14px] font-semibold text-black truncate cursor-pointer hover:text-[#3066BE]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUserClick(chat.other_user?.id);
                                            }}
                                        >
                                            {chat.other_user?.full_name || chat.other_user?.username}
                                        </div>
                                        <div className="text-[11px] text-[#AEAEAE] shrink-0">{formatTime(chat.last_message?.created_at)}</div>
                                    </div>
                                    <div className="mt-0.5 flex items-center justify-between gap-2">
                                        <p className="text-[12px] text-gray-600 truncate">{chat.last_message?.text || "—"}</p>
                                    </div>
                                </div>

                                <ChevronRight className="w-4 h-4 text-[#AEAEAE] shrink-0" />
                            </button>
                        ))}
                    </div>
                </section>

                <MobileConversation open={!!activePeer} peer={activePeer || undefined} onClose={() => setActivePeer(null)} />

                <MobileFooter />
            </div>
        </>
    );
}