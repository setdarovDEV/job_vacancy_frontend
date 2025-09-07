// src/components/mobile/ExperienceFullModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import api from "../../utils/api";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter.jsx";

// === Helpers ===
const MONTHS = [
    "Январь","Февраль","Март","Апрель","Май","Июнь",
    "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
];
const YEARS = (() => {
    const y = new Date().getFullYear();
    const arr = [];
    for (let i = y; i >= 1970; i--) arr.push(i);
    return arr;
})();

export default function ExperienceFullModal({ isOpen, onClose, onSuccess }) {
    const [company, setCompany] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [position, setPosition] = useState("");       // "Заголовок"
    const [fromMonth, setFromMonth] = useState("");
    const [fromYear, setFromYear] = useState("");
    const [isCurrent, setIsCurrent] = useState(false);  // "Сейчас я работаю здесь"
    const [desc, setDesc] = useState("");

    const [loading, setLoading] = useState(false);

    // fon scrollini bloklash + ESC
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e)=> e.key==="Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }, [isOpen, onClose]);

    const canPublish = useMemo(() => {
        return company.trim().length > 1 &&
            position.trim().length > 1 &&
            fromMonth && fromYear &&
            !loading;
    }, [company, position, fromMonth, fromYear, loading]);

    const reset = () => {
        setCompany(""); setCity(""); setCountry(""); setPosition("");
        setFromMonth(""); setFromYear(""); setIsCurrent(false); setDesc("");
    };

    const handlePublish = async () => {
        if (!canPublish) return;
        try {
            setLoading(true);
            // Backend endpoint (sening loyihangdagi nomlashga mos)
            const payload = {
                company: company.trim(),
                city: city.trim() || null,
                country: country.trim() || null,
                title: position.trim(),
                start_month: fromMonth,          // misol: "Январь"
                start_year: Number(fromYear),    // misol: 2024
                is_current: isCurrent,
                description: desc.trim() || null,
            };
            await api.post("experience/experiences/", payload);
            reset();
            onSuccess?.();
            onClose?.();
        } catch (e) {
            console.error("Experience publish error:", e);
            alert("Saqlashda xatolik.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[120]">
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            {/* full page */}
            <div className="absolute inset-0 flex justify-center">
                <div className="w-full max-w-[393px] bg-white min-h-[100dvh] flex flex-col">
                    {/* NAVBAR */}
                    <MobileNavbar />

                    {/* MODAL HEADER (title + X) */}
                    <div className="px-4 py-3 border-y border-black/10 flex items-center justify-between">
                        <h2 className="text-[12px] ml-[100px] font-semibold text-black">Добавить опыт работы</h2>
                        <button
                            onClick={onClose}
                            className="absolute right-3 p-2 bg-white border-none rounded-md active:scale-95"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-[#3066BE]" />
                        </button>
                    </div>

                    {/* BODY (scroll) */}
                    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-0 space-y-4" style={{ overscrollBehavior: "contain" }}>
                        {/* Компания */}
                        <Field label="Компания:">
                            <input
                                value={company}
                                onChange={(e)=>setCompany(e.target.value)}
                                placeholder="Напр. Google, Microsoft"
                                className="w-full h-11 rounded-[10px] text-black border border-[#AEAEAE] px-3 outline-none"
                            />
                        </Field>

                        {/* Город */}
                        <Field label="Город:">
                            <input
                                value={city}
                                onChange={(e)=>setCity(e.target.value)}
                                placeholder="Введите город"
                                className="w-full h-11 rounded-[10px] text-black border border-[#AEAEAE] px-3 outline-none"
                            />
                        </Field>

                        {/* Страна */}
                        <Field label="Страна:">
                            <input
                                value={country}
                                onChange={(e)=>setCountry(e.target.value)}
                                placeholder="Введите страну"
                                className="w-full h-11 rounded-[10px] text-black border border-[#AEAEAE] px-3 outline-none"
                            />
                        </Field>

                        {/* Заголовок (должность) */}
                        <Field label="Заголовок:">
                            <input
                                value={position}
                                onChange={(e)=>setPosition(e.target.value)}
                                placeholder="Напр. графический дизайнер, веб дизайнер"
                                className="w-full h-11 rounded-[10px] text-black border border-[#AEAEAE] px-3 outline-none"
                            />
                        </Field>

                        {/* Месяц / Год (FROM) */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Месяц:">
                                <select
                                    value={fromMonth}
                                    onChange={(e)=>setFromMonth(e.target.value)}
                                    className="w-full h-11 rounded-[10px] text-black border border-[#AEAEAE] px-3 outline-none bg-white"
                                >
                                    <option value="">От, месяц</option>
                                    {MONTHS.map((m)=>(
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Год:">
                                <select
                                    value={fromYear}
                                    onChange={(e)=>setFromYear(e.target.value)}
                                    className="w-full h-11 rounded-[10px] text-black border border-[#AEAEAE] px-3 outline-none bg-white"
                                >
                                    <option value="">От, год</option>
                                    {YEARS.map((y)=>(
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        {/* Сейчас я работаю здесь */}
                        <div className="flex items-center gap-2">
                            <input
                                id="curr"
                                type="checkbox"
                                checked={isCurrent}
                                onChange={(e)=>setIsCurrent(e.target.checked)}
                                className="w-[18px] h-[18px] accent-[#3066BE]"
                            />
                            <label htmlFor="curr" className="text-[14px]">Сейчас я работаю здесь</label>
                        </div>

                        {/* Описание */}
                        <Field label="Описание (не обязательно):">
                          <textarea
                              value={desc}
                              onChange={(e)=>setDesc(e.target.value)}
                              placeholder="Напишите…"
                              rows={5}
                              className="w-full rounded-[10px] text-black border border-[#AEAEAE] px-3 py-2 outline-none resize-none"
                          />
                        </Field>

                        {/* ACTION BUTTONS (scroll ichida, sticky emas) */}
                        <div className="pt-2 pb-2">
                            <div className="flex items-center justify-between gap-2">
                                <button
                                    className="h-11 px-4 rounded-[10px] bg-white text-[#3066BE] border border-[#3066BE] text-sm active:scale-95"
                                    onClick={()=>alert("Preview rejimi")}
                                >
                                    Предпросмотр
                                </button>
                                <button
                                    onClick={handlePublish}
                                    disabled={!canPublish}
                                    className={`h-11 px-4 rounded-[10px] text-sm font-medium flex items-center gap-2 active:scale-95 ${
                                        canPublish ? "bg-[#3066BE] text-white" : "bg-black/20 text-white/80"
                                    }`}
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Опубликовать
                                </button>
                            </div>
                        </div>

                        {/* FOOTER (full-bleed) */}
                        <div className="-mx-4 mt-6">
                            <MobileFooter fixed={false} />
                        </div>
                        <div className="h-[env(safe-area-inset-bottom)]" />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* --- Small Field wrapper --- */
function Field({ label, children }) {
    return (
        <div>
            <label className="block text-[12px] text-black/70 mb-1">{label}</label>
            {children}
        </div>
    );
}
