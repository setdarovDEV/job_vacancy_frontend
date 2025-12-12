import React, { useEffect, useState, useRef, useMemo } from "react";
import api from "../../utils/api.js";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";

export default function ChatPageTablet() {
    const [leftQuery, setLeftQuery] = useState("");
    const [suggests, setSuggests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const [sending, setSending] = useState(false);
    const [peer, setPeer] = useState({});
    const fileRef = useRef(null);
    const inputRef = useRef(null);
    const endRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const meIdStr = String(user?.id || "");

    // === Helpers ===
    const scrollToBottom = () => {
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    const isMineMsg = (m) => String(m.sender?.id) === meIdStr;

    // === Load chats ===
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get("/api/chats/");
                setRooms(res.data || []);
            } catch (err) {
                console.error("❌ Chat list error:", err);
            }
        };
        fetchChats();
    }, []);

    // === Load messages when chat selected ===
    useEffect(() => {
        if (!activeRoom?.id) return;
        const loadMessages = async () => {
            try {
                const res = await api.get(`/api/chats/${activeRoom.id}/messages/`);
                setMessages(res.data);
                scrollToBottom();
            } catch (err) {
                console.error("❌ Xabarlarni yuklashda xato:", err);
            }
        };
        loadMessages();
    }, [activeRoom?.id]);

    // === Qidiruv ===
    useEffect(() => {
        const query = leftQuery.trim();
        if (!query) {
            setSuggests([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                const res = await api.get(`/api/auth/users/search/?q=${encodeURIComponent(query)}`);
                const filtered = (res.data.results || []).filter(
                    (u) => u.role !== "ADMIN" && String(u.id) !== meIdStr
                );
                setSuggests(filtered);
            } catch (err) {
                console.error("❌ Qidiruvda xato:", err);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [leftQuery]);

    // === Chat yaratish yoki tanlash ===
    const handleSelectUser = async (u) => {
        try {
            const res = await api.post("/api/chats/get_or_create/", { user_id: u.id });
            setActiveRoom(res.data);
            setPeer(res.data.other_user);
            setSuggests([]);
            setLeftQuery("");

            const msgs = await api.get(`/api/chats/${res.data.id}/messages/`);
            setMessages(msgs.data);
            scrollToBottom();
        } catch (err) {
            console.error("❌ Chat yaratishda xato:", err);
        }
    };

    // === Send message ===
    const onClickSend = async () => {
        if (!input.trim() && !file) return;
        try {
            setSending(true);
            const form = new FormData();
            form.append("text", input);
            if (file) form.append("file", file);

            await api.post(`/api/chats/${activeRoom.id}/messages/`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const res = await api.get(`/api/chats/${activeRoom.id}/messages/`);
            setMessages(res.data);
            setInput("");
            setFile(null);
            scrollToBottom();
        } catch (err) {
            console.error("❌ Xabar yuborishda xato:", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <NavbarTabletLogin />
            <div className="font-sans bg-white px-4 md:mt-[90px] mb-10">
                <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-4 min-h-[calc(100vh-0px)] pb-[84px]">

                    {/* LEFT - Chat list */}
                    <div className="w-full md:w-[40%] bg-white border rounded-2xl p-4 flex flex-col relative">
                        <h2 className="text-[28px] font-bold text-black mb-4">Сообщения</h2>

                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M15 15A7.5 7.5 0 104.5 4.5 7.5 7.5 0 0015 15z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Поиск..."
                                className="w-full pl-10 pr-3 py-2 border rounded-md text-black placeholder-[#AEAEAE] text-[16px]"
                                value={leftQuery}
                                onChange={(e) => setLeftQuery(e.target.value)}
                            />
                            {leftQuery && suggests.length > 0 && (
                                <div className="absolute z-50 bg-white shadow-md rounded-md mt-2 w-full max-h-64 overflow-y-auto border">
                                    {suggests.map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => handleSelectUser(u)}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <img
                                                src={u.avatar_url || "/user.jpg"}
                                                className="w-8 h-8 rounded-full"
                                                alt=""
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{u.full_name}</span>
                                                <span className="text-xs text-gray-500">@{u.username}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Chat list */}
                        <div className="flex-1 overflow-y-auto flex flex-col gap-3 mt-4">
                            {(rooms || []).map((r) => (
                                <div
                                    key={r.id}
                                    onClick={() => {
                                        setActiveRoom(r);
                                        setPeer(r.other_user);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${activeRoom?.id === r.id ? "bg-[#E8EEFF]" : "bg-[#F4F6FA] hover:shadow"}`}
                                >
                                    <img src={r.other_user?.avatar_url || "/profile.png"} className="w-[42px] h-[42px] rounded-full object-cover" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-black text-[15px]">{r.other_user?.full_name || "—"}</h3>
                                        <p className="text-gray-500 text-sm truncate">{r.last_message?.text || "—"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT - Messages */}
                    <div className="flex-1 bg-[#F7F7F7] border-none rounded-2xl flex flex-col">
                        <div className="flex items-center gap-3 p-4 border-b">
                            <img src={peer?.avatar_url || "/profile.png"} className="w-[42px] h-[42px] rounded-full object-cover" />
                            <div>
                                <h3 className="font-semibold text-[16px] text-black">{peer?.full_name || "—"}</h3>
                                <p className="text-sm text-gray-500">{peer?.is_online ? "Online" : "Offline"}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[#F8F8F8]" ref={endRef}>
                            {messages.length === 0 ? (
                                <div className="text-gray-400">Hozircha xabar yo‘q</div>
                            ) : (
                                messages.map((m) => {
                                    const mine = isMineMsg(m);
                                    return (
                                        <div
                                            key={m.id}
                                            className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap break-words shadow-sm border ${
                                                mine
                                                    ? "self-end bg-[#3066BE] text-white border-transparent rounded-br-sm"
                                                    : "self-start bg-white text-black border-[#E9EEF5] rounded-bl-sm"
                                            }`}
                                        >
                                            <div>{m.text}</div>
                                            <div
                                                className={`mt-1 text-[11px] flex items-center gap-1 ${
                                                    mine ? "justify-end text-white/80" : "justify-start text-gray-500"
                                                }`}
                                            >
                                                <span>
                                                  {new Date(m.created_at).toLocaleTimeString([], {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })}
                                                </span>
                                                {mine && <img src="/double-check.png" alt="✓✓" className="w-[14px] h-[7px]" />}
                                            </div>
                                        </div>

                                    );
                                })
                            )}
                        </div>

                        {/* Bottom input */}
                        <div className="p-4 flex flex-col gap-3 bg-[#F7F7F7]">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Напишите сообщение..."
                                className="w-full px-4 py-2 rounded-xl bg-[#F7F7F7] text-black border-none focus:outline-none"
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
                                </div>
                                <button
                                    onClick={onClickSend}
                                    disabled={!activeRoom || sending || (!input.trim() && !file)}
                                >
                                    <i className="fas fa-paper-plane text-[#3066BE] text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
