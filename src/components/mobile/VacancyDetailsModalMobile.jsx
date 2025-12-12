// src/components/mobile/VacancyMobileModal.jsx
import React, { useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";

export default function VacancyMobileModal({ vacancy, onClose }) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    if (!vacancy) return null;

    // API bo‘yicha rating = number
    const safeStars = Math.max(0, Math.min(5, Math.round(vacancy.rating || 0)));

    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
                <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                >
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>

                <h2 className="text-[15px] font-bold text-black">Детали вакансии</h2>

                <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                >
                    <X size={20} className="text-gray-700" />
                </button>
            </div>

            {/* BODY */}
            <main className="flex-1 min-h-0 overflow-y-auto">

                {/* Title + Created date + Location */}
                <div className="px-4 pt-4 pb-3 border-b border-gray-200">
                    <h1 className="text-[18px] font-extrabold text-black mb-2">
                        {vacancy.title || "Без названия"}
                    </h1>

                    <div className="flex items-center gap-3 text-[11px] text-gray-500">

                        {/* Date */}
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {vacancy.created_at ? new Date(vacancy.created_at).toLocaleDateString() : "—"}
                        </span>

                        {/* Location */}
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10z" />
                                <circle cx="12" cy="11" r="2.5" />
                            </svg>
                            {vacancy.is_remote ? "Удалённо" : (vacancy.location || "Не указано")}
                        </span>
                    </div>
                </div>

                {/* SECTIONS */}
                <div className="divide-y divide-gray-200">

                    {/* Описание */}
                    <section className="p-4">
                        <h2 className="text-[14px] font-semibold mb-2 text-black">Описание</h2>
                        <p className="text-[13px] leading-relaxed text-gray-700">
                            {vacancy.description || "Описание не указано"}
                        </p>
                    </section>

                    {/* Бюджет */}
                    <section className="p-4 space-y-2">
                        <h2 className="text-[14px] font-semibold text-black">Бюджет</h2>

                        <p className="text-[14px] font-medium text-[#3066BE]">
                            {vacancy.budget || "Не указано"}
                        </p>

                        <p className="text-[12px] text-gray-600">
                            {vacancy.is_fixed_price ? "Фиксированная цена" : "Почасовая оплата"}
                        </p>
                    </section>

                    {/* Навыки */}
                    {vacancy.skills?.length > 0 && (
                        <section className="p-4">
                            <h2 className="text-[14px] font-semibold mb-3 text-black">Навыки и опыт</h2>

                            <div className="flex flex-wrap gap-2">
                                {vacancy.skills.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="bg-[#E5E5E5] text-black text-[12px] px-3 py-1 rounded-full font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* О клиенте */}
                    <section className="p-4 space-y-3">
                        <h2 className="text-[14px] font-semibold text-black">О клиенте</h2>

                        {/* Payment verified */}
                        {vacancy.payment_verified && (
                            <div className="flex items-center gap-2 text-[12px] text-gray-700">
                                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Платеж подтвержден
                            </div>
                        )}

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < safeStars ? "fill-yellow-400" : "fill-gray-300"}`}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                </svg>
                            ))}
                            <span className="ml-2 text-[12px] text-gray-600">
                                {safeStars} из 5 отзывов
                            </span>
                        </div>

                        {/* Company info */}
                        {vacancy.company && (
                            <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {vacancy.company.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-[13px] text-black">
                                        {vacancy.company.name}
                                    </p>
                                    <p className="text-[11px] text-gray-600">
                                        Сфера: {vacancy.company.industry}
                                    </p>
                                    <p className="text-[11px] text-gray-600">
                                        {vacancy.company.location}
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Bottom spacing */}
                <div className="h-20" />
            </main>

            {/* FOOTER */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 h-[44px] bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition text-[14px]"
                    >
                        Закрыть
                    </button>
                    <button
                        className="flex-1 h-[44px] bg-[#3066BE] text-white rounded-lg font-semibold hover:bg-[#2452a6] transition text-[14px]"
                    >
                        Откликнуться
                    </button>
                </div>
            </div>
        </div>
    );
}
