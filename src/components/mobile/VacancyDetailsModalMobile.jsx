// components/mobile/VacancyDetailsModal.jsx
import React, { useEffect } from "react";
import {X, ChevronLeft, ArrowLeft} from "lucide-react";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter.jsx";

export default function VacancyDetailsModal({
                                                open,
                                                onClose,
                                                vacancy,            // { title, description, budget_min, budget_max, created_at, location, skills, average_stars, ... }
                                                company = {},       // ixtiyoriy: { name, logo, total_jobs, hire_rate, open_jobs, rating_text, rating_count, city_time }
                                            }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    const safeStars = Math.max(0, Math.min(5, Math.round(vacancy?.average_stars || 0)));

    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col">
            <MobileNavbar />

            {/* BODY HEAD: back to list (VISIBLE) */}
            <main className="flex-1 min-h-0 overflow-y-auto">
                {/* Back circle */}
                <div className="mt-[60px] px-4 pt-3">
                    <div
                        onClick={onClose}
                        role="button"
                        aria-label="Back to vacancies"
                        className="w-10 h-10 rounded-full bg-white border border-black/20 shadow-sm
                       flex items-center justify-center cursor-pointer active:scale-95 relative z-30"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#3066BE]" />
                    </div>
                </div>

                {/* Title + meta */}
                <div className="px-5 pt-3 pb-4 border-b">
                    <h1 className="text-[20px] font-extrabold text-black">{vacancy?.title}</h1>
                    <div className="mt-2 flex items-center gap-4 text-[13px] text-black/45">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Опубликовано {vacancy?.created_at ? new Date(vacancy.created_at).toLocaleDateString() : "—"}
                        </span>
                                    <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10z" />
                            <circle cx="12" cy="11" r="2.5" />
                          </svg>
                                        {vacancy?.location || "Узбекистан"}
                        </span>
                    </div>
                </div>

                {/* BODY CONTENT */}
                <div className="flex flex-col divide-y divide-gray-300">

                    {/* Описание */}
                    <section className="p-4">
                        <h2 className="text-[15px] font-semibold mb-2 text-black">Описание</h2>
                        <p className="text-[14px] leading-relaxed text-black/80">
                            {vacancy?.description}
                        </p>
                    </section>

                    {/* Narx va muddat */}
                    <section className="p-4 space-y-3 text-black">
                        <p className="flex items-center gap-2 text-[15px] font-medium">
                            <span className="text-xl">$</span>
                            <span>{vacancy?.budget_min}$ – {vacancy?.budget_max}$</span>
                        </p>
                        <p className="text-[14px] text-black/80">
                            Крайний срок: {vacancy?.deadline || "1 авг – 10 авг"}
                        </p>
                    </section>

                    {/* Навыки и опыт */}
                    <section className="p-4">
                        <h2 className="text-[15px] font-semibold mb-3 text-black">Навыки и опыт</h2>
                        <div className="flex flex-wrap gap-2">
                            {vacancy?.skills?.map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-[#E5E5E5] text-black text-[13px] px-3 py-1 rounded-full"
                                >
                              {tag}
                            </span>
                            ))}
                        </div>
                    </section>

                    {/* О клиенте */}
                    <section className="p-4 space-y-2">
                        <h2 className="text-[15px] font-semibold">О клиенте</h2>

                        <div className="flex items-center gap-2 text-[13px] text-black/70">
                            <img src="/check.svg" alt="verified" className="w-4 h-4" />
                            Платеж подтвержден
                        </div>

                        <div className="flex items-center gap-1 text-[13px]">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < (vacancy?.average_stars || 0) ? "fill-yellow-400" : "fill-gray-300"
                                    }`}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                </svg>
                            ))}
                            <span className="ml-2 text-black/60">4 из 100 отзывов</span>
                        </div>

                        <p className="text-[13px] text-black/70">{vacancy?.location || "Узбекистан"}</p>

                        <div className="flex items-center gap-3 mt-3">
                            <img
                                src={vacancy?.company_logo || "/company-fallback.png"}
                                alt="company"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-medium text-[14px]">{vacancy?.company_name || "Компания"}</p>
                                <p className="text-[12px] text-black/60">
                                    {vacancy?.company_jobs_count || 0} вакансий размещено
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Другие вакансии клиента */}
                    <section className="p-4 border-t">
                        <h2 className="text-[15px] font-semibold mb-3 text-black">
                            Другие открытые вакансии этого клиента
                        </h2>
                        <div className="flex flex-col gap-2">
                            {(vacancy?.other_jobs || []).length > 0 ? (
                                vacancy.other_jobs.map((job, i) => (
                                    <a
                                        key={i}
                                        href={`/vacancies/${job.id}`}
                                        className="text-[14px] text-[#3066BE] hover:underline"
                                    >
                                        {job.title}
                                    </a>
                                ))
                            ) : (
                                <>
                                    <a href="#" className="text-[14px] text-[#3066BE] hover:underline">
                                        Нужен веб дизайнер
                                    </a>
                                    <a href="#" className="text-[14px] text-[#3066BE] hover:underline">
                                        Ищем смм менеджера
                                    </a>
                                </>
                            )}
                        </div>
                    </section>

                </div>
                <MobileFooter />
            </main>
        </div>
    );
}
