// components/UserSearch.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api";

export default function UserSearch({ onSelect }) {
    const [q, setQ] = useState("");
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const debounced = useMemo(() => {
        let t;
        return (value) => {
            clearTimeout(t);
            t = setTimeout(async () => {
                if (!value || value.trim().length < 2) {
                    setList([]); setOpen(false); return;
                }
                setLoading(true);
                try {
                    const res = await api.get("/api/auth/users/search/", { params: { q: value.trim() } });
                    const data = res.data?.results ?? res.data ?? [];
                    setList(Array.isArray(data) ? data : []);
                    setOpen(true);
                } finally {
                    setLoading(false);
                }
            }, 300);
        };
    }, []);

    useEffect(() => { debounced(q); }, [q]);

    const mediaUrl = (path, fallback = "/profile.png") => {
        // bo'sh bo'lsa darrov fallback
        if (!path || typeof path !== "string") return fallback;

        // allaqachon to‘liq yoki data/blob bo‘lsa o‘zgartirmaymiz
        if (/^(?:https?:)?\/\//i.test(path) || /^data:/i.test(path) || /^blob:/i.test(path)) {
            return path;
        }

        // BASE oxiridagi / larni kesib tashlaymiz
        const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        const BASE = String(RAW_BASE).replace(/\/+$/, "");

        // kerakli / ni qo‘shamiz
        const p = path.startsWith("/") ? path : `/${path}`;
        return `${BASE}${p}`;
    };

    return (
        <div className="relative">
            <input
                className="w-full border rounded-[10px] px-3 py-2 bg-[#F4F6FA] border-none text-black"
                placeholder="поиск..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => q && setOpen(true)}
            />
            {loading && <div className="absolute right-3 top-2.5 text-[#AEAEAE] text-sm">...</div>}

            {open && list.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow">
                    {list.map(u => (
                        <div
                            key={u.id}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => { setOpen(false); onSelect?.(u); }}
                        >
                            <img
                                src={mediaUrl(u.avatar_url ?? "", "/profile.png")}
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/profile.png"; }}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex flex-col leading-4">
                                <span className="text-black text-sm font-medium">@{u.username}</span>
                                <span className="text-[#777] text-xs">{u.full_name || ""}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
