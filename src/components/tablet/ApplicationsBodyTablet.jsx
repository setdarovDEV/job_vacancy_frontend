// components/tablet/ApplicationsBodyTablet.jsx
import React from "react";
import { Star } from "lucide-react";

export default function ApplicationsBodyTablet({
                                                   items = [],
                                                   loading = false,
                                                   error = "",
                                                   page = 1,
                                                   totalPages = 1,
                                                   onPrev,
                                                   onNext,
                                                   onWrite,       // (applicationId) => void
                                                   onViewProfile, // (applicationId) => void
                                               }) {
    const AVATAR_FALLBACK = "/user.png";
    const fmtName = (name) =>
        !name
            ? "—"
            : name
                .split(" ")
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
                .join(" ");

    return (
        <div className="mx-auto max-w-[960px] px-4 py-4">
            <div className="bg-white border-none border-[#E3E6EA] rounded-[20px]">
                {/* Header */}
                <div className="px-4 py-4 border-none border-[#E3E6EA]">
                    <h2 className="text-[18px] font-bold text-[#0F172A]">Отклики</h2>
                </div>

                {/* List */}
                <div className="p-4">
                    {loading && items.length === 0 && (
                        <div className="text-[#6B7280]">Yuklanmoqda…</div>
                    )}
                    {error && <div className="text-red-600 mb-3">{error}</div>}

                    <div className="flex flex-col gap-5">
                        {items.map((a) => {
                            const about = a.bio || a.cover_letter || "";
                            const skills = Array.isArray(a.skills) ? a.skills : [];
                            return (
                                <div
                                    key={a.id}
                                    className="rounded-[16px] border border-[#E3E6EA] p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        {/* Left: avatar + name */}
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={a.avatar || AVATAR_FALLBACK}
                                                onError={(e) => (e.currentTarget.src = AVATAR_FALLBACK)}
                                                alt={a.name}
                                                className="w-[56px] h-[56px] rounded-full object-cover border"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-[16px] font-extrabold text-[#0B1320]">
                                                        {fmtName(a.name)}
                                                    </div>
                                                    {a.rating && (
                                                        <div className="flex items-center gap-1 text-[12px] text-[#0B1320]">
                                                            <Star size={14} className="fill-yellow-400 stroke-yellow-400" />
                                                            {a.rating.toFixed?.(1) ?? a.rating}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-[12px] text-[#6B7280]">
                                                    {a.position || "—"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => onWrite?.(a.id)}
                                                className="h-[40px] px-4 rounded-[10px] border border-[#3066BE] text-[#3066BE] text-[13px] font-semibold hover:bg-[#F0F7FF]"
                                            >
                                                Написать
                                            </button>
                                            <button
                                                onClick={() => onViewProfile?.(a.id)}
                                                className="h-[40px] px-4 rounded-[10px] bg-[#3066BE] text-white text-[13px] font-semibold hover:bg-[#2a58a6]"
                                            >
                                                Посмотреть профиль
                                            </button>
                                        </div>
                                    </div>

                                    {/* About */}
                                    {about && (
                                        <p className="mt-3 text-[13px] leading-relaxed text-[#0F172A]/80">
                                            {about}
                                        </p>
                                    )}

                                    {/* Skills */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {skills.slice(0, 12).map((s, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-[6px] rounded-full border bg-[#F3F4F6] text-[12px] text-[#0F172A]"
                                            >
                        {typeof s === "string" ? s : s?.name || "Skill"}
                      </span>
                                        ))}
                                        {skills.length === 0 && (
                                            <span className="text-[12px] text-[#9CA3AF]">—</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-5 flex items-center justify-center gap-3">
                            <button
                                className="h-[36px] px-3 rounded border disabled:opacity-50"
                                onClick={onPrev}
                                disabled={page === 1}
                            >
                                Prev
                            </button>
                            <span className="text-[12px] text-[#6B7280]">
                Page {page} / {totalPages}
              </span>
                            <button
                                className="h-[36px] px-3 rounded border disabled:opacity-50"
                                onClick={onNext}
                                disabled={page >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
