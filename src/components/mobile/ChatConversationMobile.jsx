// src/components/mobile/ChatConversationMobile.jsx
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import api from "../../utils/api";

export default function ChatConversationMobile({ open, peer, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [file, setFile] = useState(null);
    const endRef = useRef(null);
    const fileRef = useRef(null);

    const meIdStr = String(localStorage.getItem("user_id") || "");

    useEffect(() => {
        if (!open || !peer?.id) return;

        const loadMessages = async () => {
            try {
                // Get or create chat
                const chatRes = await api.post("/api/chats/get_or_create/", { user_id: peer.id });
                const chatId = chatRes.data.id;

                // Load messages
                const msgRes = await api.get(`/api/chats/${chatId}/messages/`);
                setMessages(msgRes.data || []);

                setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            } catch (err) {
                console.error("Load messages error:", err);
            }
        };

        loadMessages();
    }, [open, peer?.id]);

    const handleSend = async () => {
        if (!input.trim() && !file) return;

        try {
            setSending(true);

            // Get chat ID
            const chatRes = await api.post("/api/chats/get_or_create/", { user_id: peer.id });
            const chatId = chatRes.data.id;

            // Send message
            const formData = new FormData();
            if (input.trim()) formData.append("text", input.trim());
            if (file) formData.append("file", file);

            await api.post(`/api/chats/${chatId}/messages/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Reload messages
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

    if (!open) return null;

    const isMineMsg = (m) => String(m.sender?.id) === meIdStr || m.is_me === true;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            {/* Header */}
            <div className="h-[60px] border-b flex items-center justify-between px-4">
                <button onClick={onClose} className="p-2 -ml-2 active:scale-95">
                    <ArrowLeft className="w-5 h-5 text-[#3066BE]" />
                </button>

                <div className="flex items-center gap-3">
                    <img src={peer?.avatar_url || "/user1.png"} alt={peer?.full_name || "User"} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <p className="text-[15px] font-semibold text-black">{peer?.full_name || peer?.username || "—"}</p>
                        <p className="text-[12px] text-gray-500">{peer?.is_online ? "Online" : "Offline"}</p>
                    </div>
                </div>

                <div className="w-5" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F8F8F8]">
                <div className="space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">Xabarlar yo'q</div>
                    ) : (
                        messages.map((m) => {
                            const mine = isMineMsg(m);
                            const timeStr = m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

                            return (
                                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                                            mine ? "bg-[#3066BE] text-white rounded-br-sm" : "bg-white text-black rounded-bl-sm border border-gray-200"
                                        }`}
                                    >
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

            {/* Input */}
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

                    <button onClick={handleSend} disabled={sending || (!input.trim() && !file)} className="p-2 bg-transparent hover:opacity-70 active:scale-95 disabled:opacity-50">
                        <Send className="w-5 h-5 text-[#3066BE]" />
                    </button>
                </div>

                <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
        </div>
    );
}