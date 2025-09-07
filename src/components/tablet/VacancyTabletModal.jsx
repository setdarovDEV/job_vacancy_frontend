// src/components/VacancyModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    X,
    ArrowLeft,
    Bookmark,
    BookmarkCheck,
    Clock,
    MapPin,
    DollarSign,
    CalendarRange,
    Star,
} from "lucide-react";

function timeAgoRU(dateLike) {
    const d = dateLike ? new Date(dateLike) : new Date();
    const diffMs = Date.now() - d.getTime();
    const m = Math.max(0, Math.floor(diffMs / 60000));
    if (m < 1) return "только что";
    if (m < 60) return `${m} мин назад`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} ч назад`;
    const day = Math.floor(h / 24);
    return `${day} дн назад`;
}
function formatMoneyRange(min, max) {
    const a = (min ?? 0).toString();
    const b = (max ?? 0).toString();
    return `${a}$–${b}$`;
}
function formatDateRangeRu(start, end) {
    const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (!s && !e) return "—";
    const part = (dt) => `${dt.getDate()} ${months[dt.getMonth()]}`;
    if (s && e) return `${part(s)} – ${part(e)}`;
    return part(s || e);
}

export default function VacancyModal({
                                         vacancy,
                                         onClose,
                                         onBookmarkToggle,   // optional(vacancyId, nextState)
                                         onApply,            // optional
                                     }) {
    const [bookmarked, setBookmarked] = useState(!!vacancy?.is_bookmarked);
    const closeBtnRef = useRef(null);

    // Body scroll lock & ESC
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        closeBtnRef.current?.focus();
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    const createdAgo = useMemo(() => timeAgoRU(vacancy?.created_at), [vacancy?.created_at]);
    const money = useMemo(() => formatMoneyRange(vacancy?.budget_min, vacancy?.budget_max), [vacancy]);
    const deadline = useMemo(() => formatDateRangeRu(vacancy?.deadline_start, vacancy?.deadline_end), [vacancy]);

    const skills = Array.isArray(vacancy?.skills)
        ? vacancy.skills.map((s) => (typeof s === "string" ? s : s?.name ?? ""))
        : [];

    const client = vacancy?.client || {};
    const rating = Number(client?.rating ?? vacancy?.average_stars ?? 0);
    const reviews = client?.review_count ?? 0;

    const handleOverlay = (e) => {
        if (e.target.dataset?.overlay === "1") onClose?.();
    };
    const toggleBookmark = () => {
        const next = !bookmarked;
        setBookmarked(next);
        onBookmarkToggle?.(vacancy?.id, next);
    };

    return (
        <div
            data-overlay="1"
            onClick={handleOverlay}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[1px] flex items-start justify-center p-3 md:p-6"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-[920px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_.18s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b">
                    <button
                        onClick={onClose}
                        ref={closeBtnRef}
                        className="inline-flex items-center gap-2 text-sm  text-[#3066BE] bg-white hover:text-black"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleBookmark}
                            className="p-2 rounded-full bg-white text-[#3066BE] hover:bg-gray-100"
                            aria-label="Bookmark"
                            title="Сохранить"
                        >
                            {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white text-[#3066BE] hover:bg-gray-100"
                            aria-label="Close"
                            title="Закрыть"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="h-[85vh] overflow-y-auto px-4 md:px-8 py-6">
                    {/* Title & meta */}
                    <h1 className="text-[22px] md:text-[26px] font-extrabold text-black leading-tight">
                        {vacancy?.title || "Вакансия"}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Опубликовано {createdAgo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{vacancy?.location || "Уточняется"}</span>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Description */}
                    <section>
                        <h2 className="text-[16px] font-semibold text-gray-900 mb-3">Описание</h2>
                        <p className="text-gray-700 leading-7 whitespace-pre-line">
                            {vacancy?.description || "—"}
                        </p>
                    </section>

                    {/* Money & Deadline */}
                    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between md:justify-start md:gap-3 bg-gray-50 rounded-xl border px-4 py-3">
                            <div className="flex items-center gap-2 text-gray-500">
                                <DollarSign className="w-5 h-5" />
                                <span className="text-sm">Бюджет</span>
                            </div>
                            <div className="font-medium text-gray-900">{money}</div>
                        </div>

                        <div className="flex items-center justify-between md:justify-start md:gap-3 bg-gray-50 rounded-xl border px-4 py-3">
                            <div className="flex items-center gap-2 text-gray-500">
                                <CalendarRange className="w-5 h-5" />
                                <span className="text-sm">Крайний срок</span>
                            </div>
                            <div className="font-medium text-gray-900">{deadline}</div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Skills */}
                    <section>
                        <h3 className="text-[16px] font-semibold text-gray-900 mb-3">Навыки и опыт</h3>
                        {skills.length ? (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((tag, i) => (
                                    <span
                                        key={`${tag}-${i}`}
                                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 border"
                                    >
                    {tag}
                  </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">—</div>
                        )}
                    </section>

                    <hr className="my-6 border-gray-200" />

                    {/* Client */}
                    <section>
                        <h3 className="text-[16px] font-semibold text-gray-900 mb-4">О клиенте</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left: details */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="flex items-center gap-2">
                    <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${client?.is_payment_verified ? "bg-emerald-500" : "bg-gray-300"}`}
                    />
                                        <span>{client?.is_payment_verified ? "Платеж подтвержден" : "Платеж не подтвержден"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.round(rating) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600">{rating.toFixed(1)} из {reviews} отзывов</span>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <span>{vacancy?.location || "Уточняется"}</span>
                                </div>

                                <div className="text-sm text-gray-600">
                                    Компания: <span className="font-medium">{client?.company_name || "—"}</span>
                                </div>

                                <div className="text-sm text-gray-600">
                                    {(client?.posted_count || client?.total_jobs) ? (
                                        <>
                                            {(client?.posted_count ?? client?.total_jobs)} вакансий размещено · Уровень найма{" "}
                                            {(client?.hire_rate_percent ?? 0)}% · {client?.open_jobs_count ?? 0} открытые вакансии
                                        </>
                                    ) : (
                                        "Статистика недоступна"
                                    )}
                                </div>
                            </div>

                            {/* Right: other jobs */}
                            <div>
                                <div className="text-sm font-semibold mb-2">
                                    Другие открытые вакансии этого клиента
                                </div>
                                <div className="flex flex-col gap-2">
                                    {(client?.other_open_vacancies || []).slice(0, 5).map((j, idx) => (
                                        <a
                                            key={idx}
                                            href={j?.url || "#"}
                                            className="text-sm text-[#3066BE] hover:underline"
                                        >
                                            {j?.title || j}
                                        </a>
                                    ))}
                                    {!(client?.other_open_vacancies || []).length && (
                                        <div className="text-sm text-gray-500">—</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="mt-8 flex flex-col md:flex-row gap-3 md:gap-4">
                        <button
                            onClick={() => onApply?.(vacancy)}
                            className="w-full md:w-auto inline-flex justify-center items-center rounded-xl px-5 py-3 bg-[#3066BE] text-white font-semibold hover:brightness-110 active:translate-y-[1px]"
                        >
                            Откликнуться
                        </button>
                        <button
                            onClick={toggleBookmark}
                            className="w-full md:w-auto inline-flex justify-center items-center rounded-xl px-5 py-3 border-[#3066BE] bg-white text-[#3066BE] font-semibold hover:bg-gray-50"
                        >
                            {bookmarked ? "В избранном" : "Сохранить"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
