// src/components/mobile/ActivityMobile.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import MobileNavbar from "../mobile/MobileNavbarLogin.jsx";
import MobileFooter from "../mobile/MobileFooter.jsx";
import {
    fetchSavedVacancies,
    removeSavedVacancy,
    fetchApplications,
} from "../../utils/activity";
import HeaderNotifications from "./HeaderNotifications.jsx";

export default function ActivityMobile() {
    const [tab, setTab] = useState("saved"); // 'saved' | 'applied'
    const [saved, setSaved] = useState({ items: [], loading: false, error: "" });
    const [applied, setApplied] = useState({ items: [], loading: false, error: "" });

    // initial load
    useEffect(() => {
        if (tab === "saved" && saved.items.length === 0) loadSaved();
        if (tab === "applied" && applied.items.length === 0) loadApplied();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const loadSaved = useCallback(async () => {
        setSaved((s) => ({ ...s, loading: true, error: "" }));
        try {
            const data = await fetchSavedVacancies();
            setSaved({ items: data.results || [], loading: false, error: "" });
        } catch {
            setSaved((s) => ({ ...s, loading: false, error: "Не удалось загрузить сохранённые вакансии" }));
        }
    }, []);

    const loadApplied = useCallback(async () => {
        setApplied((s) => ({ ...s, loading: true, error: "" }));
        try {
            const data = await fetchApplications();
            setApplied({ items: data.results || [], loading: false, error: "" });
        } catch {
            setApplied((s) => ({ ...s, loading: false, error: "Не удалось загрузить отклики" }));
        }
    }, []);

    const onUnsave = async (id) => {
        try {
            await removeSavedVacancy(id);
            setSaved((s) => ({ ...s, items: s.items.filter((v) => v.id !== id) }));
        } catch {
            alert("Не удалось удалить из сохранённых");
        }
    };

    const isSaved = tab === "saved";
    const dataset = isSaved ? saved : applied;

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col">
            {/* NAVBAR */}
            <MobileNavbar />

            <HeaderNotifications />

            {/* Header title */}
            <div className="w-full max-w-[393px] mx-auto px-4 pt-4 pb-2">
                <h1 className="text-[18px] font-bold text-center text-black mb-[20px]">Ваша активность</h1>
            </div>

            {/* Tabs — compact, clean underline */}
            <div className="w-full max-w-[393px] mx-auto px-0">
                <div className="relative bg-white">
                    <div className="flex items-end gap-8 px-4 h-[52px]">
                        {/* Saved */}
                        <button
                            onClick={() => setTab("saved")}
                            className="relative pb-2 bg-transparent border-0 outline-none"
                        >
                            <span className="text-[8px] font-semibold text-black">Сохраненные вакансии</span>
                            <span
                                className={`pointer-events-none absolute left-0 right-0 -bottom-[2px] h-[3px] transition-colors ${
                                    tab === "saved" ? "bg-black" : "bg-transparent"
                                }`}
                            />
                        </button>

                        {/* Applied */}
                        <button
                            onClick={() => setTab("applied")}
                            className="relative pb-2 bg-transparent border-0 outline-none"
                        >
                            <span className="text-[8px] font-semibold text-black">Отклики на вакансий</span>
                            <span
                                className={`pointer-events-none absolute left-0 right-0 -bottom-[2px] h-[3px] transition-colors ${
                                    tab === "applied" ? "bg-black" : "bg-transparent"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Baseline (single, full-width) */}
                    <div className="absolute left-0 right-0 bottom-0 h-px bg-[#CFCFCF]" />
                </div>
            </div>

            {/* Content — border-y, burchaksiz, keng bo‘sh zona */}
            <div className="w-full max-w-[393px] mx-auto flex-1 overflow-y-auto px-0">
                <div className="border-y border-[#BFBFBF] min-h-[320px]">
                    <div className="px-4 py-4">
                        {dataset.loading ? (
                            <SkeletonList />
                        ) : dataset.error ? (
                            <Empty text={dataset.error} />
                        ) : (dataset.items || []).length === 0 ? (
                            <Empty text={isSaved ? "Пока нет сохраненных вакансий." : "Пока нет откликов."} />
                        ) : isSaved ? (
                            <SavedList items={saved.items} onUnsave={onUnsave} />
                        ) : (
                            <AppliedList items={applied.items} />
                        )}
                    </div>
                </div>

                {/* FOOTER — full bleed */}
                <div className="mt-6">
                    <MobileFooter fixed={false} />
                </div>
                <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
        </div>
    );
}

/* ---------- Subcomponents (mobile sized) ---------- */

function SavedList({ items, onUnsave }) {
    return (
        <ul className="flex flex-col gap-3">
            {items.map((v) => (
                <li key={v.id} className="border border-[#E5EAF2] rounded-xl p-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-[15px] font-semibold truncate">
                                {v.title || v.name || "Vacancy"}
                            </div>
                            <div className="text-[12px] text-gray-500 mt-1 line-clamp-2">
                                {(v.company?.name || v.company_name || "—") +
                                    " • " +
                                    (v.location || v.city || "Локация не указана")}
                            </div>
                            {v.salary && (
                                <div className="text-[12px] mt-1">{`З/п: ${formatSalary(v.salary)}`}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <Link
                            to={`/vacancies/${v.slug || v.id}`}
                            className="h-9 px-3 rounded-lg border text-sm flex items-center justify-center"
                        >
                            Перейти
                        </Link>
                        <button
                            onClick={() => onUnsave(v.id)}
                            className="h-9 px-3 rounded-lg border text-sm"
                            title="Удалить из сохранённых"
                        >
                            Удалить
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function AppliedList({ items }) {
    return (
        <ul className="flex flex-col gap-3">
            {items.map((a) => {
                const vacancy = a.job_post || a.vacancy || a.post || {};
                const status = a.status || "отправлено";
                const created = a.created_at || a.created || a.date;
                return (
                    <li key={a.id} className="border border-[#E5EAF2] rounded-xl p-3">
                        <div className="text-[15px] font-semibold truncate">
                            {vacancy.title || vacancy.name || "Vacancy"}
                        </div>
                        <div className="text-[12px] text-gray-500 mt-1 line-clamp-2">
                            {(vacancy.company?.name || vacancy.company_name || "—") +
                                " • " +
                                (vacancy.location || vacancy.city || "Локация не указана")}
                        </div>
                        <div className="text-[12px] mt-1">
                            Статус: <span className="font-medium">{status}</span>
                            {created ? (
                                <>
                                    {" · "}Дата:{" "}
                                    {new Date(created).toLocaleDateString([], {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <Link
                                to={`/vacancies/${vacancy.slug || vacancy.id || a.job_post}`}
                                className="h-9 px-3 rounded-lg border text-sm flex items-center justify-center"
                            >
                                Перейти
                            </Link>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function Empty({ text }) {
    return (
        <div className="text-center text-gray-500 py-12 select-none text-sm">{text}</div>
    );
}

function SkeletonList() {
    return (
        <ul className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="border border-[#E5EAF2] rounded-xl p-3 animate-pulse">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-1/3 bg-gray-200 rounded" />
                </li>
            ))}
        </ul>
    );
}

function formatSalary(s) {
    if (typeof s === "string") return s;
    if (!s) return "";
    const { from, to, currency } = s;
    if (from && to) return `${from.toLocaleString()}–${to.toLocaleString()} ${currency || ""}`.trim();
    if (from) return `от ${from.toLocaleString()} ${currency || ""}`.trim();
    if (to) return `до ${to.toLocaleString()} ${currency || ""}`.trim();
    if (typeof s === "number") return s.toLocaleString();
    return "";
}
