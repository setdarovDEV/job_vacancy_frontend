import React, { useMemo, useState, useRef, useEffect } from "react";
import {X, ChevronLeft, ChevronRight, ArrowLeft} from "lucide-react";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter.jsx";
import { Search, Paperclip  } from "lucide-react"; // lupa iconi

export default function PostVacancyWizardMobile({
                                                    isOpen = false,
                                                    onClose = () => {},
                                                    onSubmit = async () => {},
                                                    initialData = {},
                                                }) {
    const backdropRef = useRef(null);

    const [form, setForm] = useState({
        title: "",
        skills: [],
        budget_min: "",
        budget_max: "",
        description: "",
        location: "",
        is_remote: false,
        // yangi fieldlar
        project_size: "",
        duration: "",
        experience_level: "",
        contract_opportunity: "",
        currency: "USD",

        ...initialData,
    });

    const setF = (patch) => setForm((p) => ({ ...p, ...patch }));
    const navWrapRef = useRef(null);
    const footWrapRef = useRef(null);
    const [pad, setPad] = useState({ top: 0, bottom: 0 });

    const steps = useMemo(
        () => [
            { key: "title",    label: "Напишите название вашей вакансии" }, // 1
            { key: "budget",   label: "Выберите тип оплаты и бюджет" },     // 2
            { key: "desc",     label: "Опишите вакансию" },                 // 3
            { key: "skills",   label: "Добавьте навыки" },                  // 4
            { key: "location", label: "Укажите местоположение" },           // 5
            { key: "review",   label: "Проверьте данные" },                 // 6
        ],
        []
    );
    const [idx, setIdx] = useState(0);

    // close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const h = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [isOpen, onClose]);

    const goPrev = () => setIdx((i) => Math.max(0, i - 1));
    const goNext = () => setIdx((i) => Math.min(steps.length - 1, i + 1));

    useEffect(() => {
        // header/footer balandligini o'lchab, body paddingini dinamik qo'yamiz
        const measure = () => {
            const t = navWrapRef.current?.offsetHeight || 0;
            const b = footWrapRef.current?.offsetHeight || 0;
            setPad({ top: t, bottom: b });
        };
        measure();
        // resize va font load hollarida ham qayta o‘lcha
        window.addEventListener("resize", measure);
        const id = setInterval(measure, 100); // komponentlar ichida rasmlar/ikonlar kech yuklansa
        return () => {
            window.removeEventListener("resize", measure);
            clearInterval(id);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    const canNext = useMemo(() => {
        if (idx === 0) {
            // 1) Title
            return form.title.trim().length > 0;
        }
        if (idx === 1) {
            // 2) Skills — kamida bitta
            return Array.isArray(form.skills) && form.skills.length > 0;
        }
        if (idx === 2) {
            // 3) Evaluation — 4ta savoldan bittadan tanlangan bo‘lsin
            return Boolean(form.project_size && form.duration && form.experience_level && form.contract_opportunity);
        }
        if (idx === 3) {
            const min = Number(form.budget_min);
            const max = Number(form.budget_max);
            if (
                String(form.budget_min).trim() === "" ||
                String(form.budget_max).trim() === "" ||
                isNaN(min) || isNaN(max)
            ) return false;
            return min > 0 && max > 0 && min <= max;
        }

        // 5) Description va 6) Location — hozircha erkin
        return true;
    }, [
        idx,
        form.title,
        form.skills,
        form.project_size,
        form.duration,
        form.experience_level,
        form.contract_opportunity,
        form.is_fixed_price,
        form.budget_min,
        form.budget_max,
    ]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white">
            <div className="h-full w-full flex flex-col">
                {/* HEADER */}
                <div className="shrink-0 border-b bg-white">
                    <div className="h-14 px-4 flex items-center justify-between">
                        <button
                            onClick={() => (idx === 0 ? onClose() : setIdx((i) => Math.max(0, i - 1)))}
                            className="text-sm px-3 py-1 rounded-lg border border-gray-300"
                        >
                            {idx === 0 ? "Отмена" : "Назад"}
                        </button>
                        <img src="/logo.png" alt="Logo" className="h-6 object-contain" />
                        <button
                            onClick={onClose}
                            className="text-sm px-3 py-1 rounded-lg border border-gray-300"
                        >
                            Закрыть
                        </button>
                    </div>
                    <div className="text-center text-[12px] font-semibold pb-2 text-black mt-[20px] mb-[7px]">Разместить вакансию</div>
                    <div
                        onClick={onClose}
                        className="absolute right-3 p-2 mt-[-40px] bg-white border-none rounded-md active:scale-95"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-[#3066BE]" />
                    </div>
                </div>

                {/* BODY (scrollable) */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="px-4 pt-4 pb-24">
                        {idx === 0 && (
                            <StepTitle value={form.title} onChange={(v) => setF({ title: v })} />
                        )}

                        {idx === 1 && (
                            // 2-step: SKILLS
                            <StepSkills skills={form.skills} setF={setF} />
                        )}

                        {idx === 2 && (
                            // 3-step: EVALUATION
                            <StepEvaluation form={form} setF={setF} />
                        )}

                        {idx === 3 && (
                            // 4-step: BUDGET
                            <StepBudget
                                budget_min={form.budget_min}
                                budget_max={form.budget_max}
                                setF={setF}
                            />
                        )}

                        {idx === 4 && (
                            // 5-step: LOCATION  ✅ ko‘chirildi
                            <StepLocation
                                is_remote={form.is_remote}
                                location={form.location}
                                setF={setF}
                            />
                        )}

                        {idx === 5 && (
                            <StepDesc
                                value={form.description}
                                onChange={(v) => setF({ description: v })}
                                file={form.attachment}
                                onFileChange={(f) => setF({ attachment: f })}
                                onPreview={() => {
                                    // xohlasang modal och, yoki oddiy console:
                                    // console.log("preview", form.description, form.attachment)
                                }}
                            />
                        )}

                    </div>

                    {/* 🔥 ACTION BUTTONS: sticky inside body */}
                    <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t">
                        <div className="px-4 py-3 flex items-center justify-between">
                            <button
                                onClick={idx === 0 ? onClose : () => setIdx((i) => Math.max(0, i - 1))}
                                className="h-10 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-[.98]"
                            >
                                {idx === 0 ? "Отмена" : "Назад"}
                            </button>

                            {idx < 5 ? (
                                <button
                                    disabled={!canNext}
                                    onClick={() => setIdx((i) => Math.min(5, i + 1))}
                                    className={
                                        "h-10 px-4 rounded-xl " +
                                        (canNext
                                            ? "bg-[#3066BE] text-white hover:bg-[#2852a2]"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed")
                                    }
                                >
                                    Следующий
                                </button>
                            ) : (
                                <button
                                    onClick={async () => { await onSubmit(form); onClose(); }}
                                    className="h-10 px-4 rounded-xl bg-[#3066BE] text-white hover:bg-[#2852a2]"
                                >
                                    Опубликовать
                                </button>
                            )}

                        </div>
                    </div>
                    {/* SITE FOOTER — endi haqiqiy footer shu yerda */}
                    <div className="shrink-0">
                        <MobileFooter />
                    </div>
                </div>
            </div>
        </div>
    );

}

/* ====== STEPS ====== */

function StepTitle({ value, onChange }) {
    return (
        <div>
            <label className="block text-[14px] font-semibold mb-2">
                1. Напишите название вашей вакансии:
            </label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Нап., Нужен графический дизайнер"
                className="w-full h-10 rounded-[10px] border border-[#AEAEAE] text-black px-3 outline-none focus:border-[#3066BE]"
            />
        </div>
    );
}

function StepBudget({ budget_min, budget_max, setF, currency = "USD" }) {
    // faqat raqam va 2 kasr: 12345.67
    const money = (v) => {
        let s = v.replace(/[^\d.,]/g, "").replace(",", ".");
        // bir nechta nuqtani bitta qilish
        const parts = s.split(".");
        if (parts.length > 2) s = parts[0] + "." + parts.slice(1).join("");
        // 2 ta kasrga cheklash
        return s.replace(/^(\d+)(?:\.(\d{0,2}))?.*$/, (m, a, b) => (b !== undefined ? `${a}.${b}` : a));
    };

    const CURS = [
        { v: "USD", t: "$" },
        { v: "UZS", t: "so'm" },
        { v: "EUR", t: "€" },
    ];

    return (
        <div className="text-black">
            <label className="block text-[14px] font-semibold mb-3">
                4. Расскажите нам о своем бюджете:
            </label>

            <div className="grid grid-cols-2 gap-4 max-w-[520px]">
                {/* OT */}
                <div>
                    <div className="text-[12px] mb-1">ОТ</div>
                    <div className="relative">
                        <input
                            value={budget_min}
                            inputMode="decimal"
                            onChange={(e) => setF({ budget_min: money(e.target.value) })}
                            placeholder="0.00"
                            className="w-full h-11 rounded-xl border border-[#C9C9C9] pl-3 pr-16 outline-none focus:border-[#3066BE]"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="text-black/70 text-sm">
                            {CURS.find(c => c.v === currency)?.t || "$"}
                          </span>
                        </div>
                    </div>
                </div>

                {/* DO */}
                <div>
                    <div className="text-[12px] mb-1">ДО</div>
                    <div className="relative">
                        <input
                            value={budget_max}
                            inputMode="decimal"
                            onChange={(e) => setF({ budget_max: money(e.target.value) })}
                            placeholder="0.00"
                            className="w-full h-11 rounded-xl border border-[#C9C9C9] pl-3 pr-16 outline-none focus:border-[#3066BE]"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="text-black/70 text-sm">
                            {CURS.find(c => c.v === currency)?.t || "$"}
                          </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* xatolik (min > max) ko‘rsatish */}
            {(() => {
                const min = Number(budget_min);
                const max = Number(budget_max);
                const show = budget_min !== "" && budget_max !== "" && (!isFinite(min) || !isFinite(max) || min > max);
                return show ? (
                    <div className="text-[12px] text-red-600 mt-2">
                        Минимум не должен превышать максимум.
                    </div>
                ) : null;
            })()}
        </div>
    );
}

function StepDesc({
                      value,
                      onChange,
                      file = null,                       // ixtiyoriy: tanlangan fayl
                      onFileChange = () => {},           // ixtiyoriy: (File|null) => void
                      onPreview = () => {},              // ixtiyoriy: () => void
                  }) {
    const MAX = 100 * 1024 * 1024;     // 100 MB

    const handlePick = (e) => {
        const f = e.target.files?.[0] || null;
        if (!f) return onFileChange(null);
        if (f.size > MAX) {
            // oddiy alert; xohlasang toast qo'y
            alert("Файл превышает 100 МБ");
            e.target.value = ""; // reset
            return;
        }
        onFileChange(f);
    };

    return (
        <div className="text-black">
            <label className="block text-[14px] font-semibold mb-3">
                6. Опишите что вам нужно
            </label>

            {/* Textarea */}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Уже есть описание, вставьте его сюда..."
                className="w-full min-h-[160px] rounded-xl border border-[#C9C9C9] px-3 py-3 outline-none focus:border-[#3066BE] placeholder:text-black/40"
            />

            {/* File attach row */}
            <div className="mt-4">
                <label className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-[#C9C9C9] bg-white cursor-pointer text-[#3066BE]">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm font-medium">Файл</span>
                    <input
                        type="file"
                        className="hidden"
                        onChange={handlePick}
                        // kerakli turlarni xohlaganingcha kengaytir
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                    />
                </label>

                <div className="text-[12px] text-black/50 mt-2">
                    Макс. размер 100мб
                </div>

                {/* Tanlangan fayl nomi (ixtiyoriy ko'rsatish) */}
                {file ? (
                    <div className="text-[12px] text-black/70 mt-1">
                        Выбранный файл: <span className="font-medium">{file.name}</span>
                    </div>
                ) : null}
            </div>

            {/* Bottom actions (Preview left). Publish tugmasi sening sticky footeringda) */}
            <div className="mt-6">
                <button
                    type="button"
                    onClick={onPreview}
                    className="h-11 px-5 rounded-xl border border-[#3066BE] text-[#3066BE] hover:bg-[#3066BE]/5 active:scale-95"
                >
                    Предпросмотр
                </button>
            </div>
        </div>
    );
}

function StepSkills({ skills, setF }) {
    const [chip, setChip] = useState("");

    const add = () => {
        const t = chip.trim();
        if (!t) return;
        if (skills.includes(t)) return;
        setF({ skills: [...skills, t] });
        setChip("");
    };

    const remove = (i) => setF({ skills: skills.filter((_, k) => k !== i) });

    return (
        <div>
            <label className="block text-[14px] font-semibold mb-2 text-black">
                2. Поиск навыков или добавление своих собственных:
            </label>

            {/* search style input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    value={chip}
                    onChange={(e) => setChip(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && add()}
                    placeholder="Например: Adobe Illustrator"
                    className="w-full h-11 rounded-xl border border-gray-300 pl-10 pr-3 text-black outline-none focus:border-[#3066BE]"
                />
            </div>

            {/* tip text */}
            <div className="mt-2 text-[12px] text-gray-500">
                Для достижения наилучших результатов добавьте 3–5 навыков.
            </div>

            {/* selected skills */}
            {!!skills.length && (
                <div className="mt-4">
                    <div className="text-[14px] font-semibold mb-2 text-black">
                        Выбранные навыки:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((s, i) => (
                            <span
                                key={i}
                                className="px-4 py-1 rounded-full bg-[#D9D9D9] text-black text-sm flex items-center gap-2"
                            >
                {s}
                                <div
                                    onClick={() => remove(i)}
                                    className="text-black/70 hover:text-black"
                                >
                  ×
                </div>
              </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StepLocation({ is_remote, location, setF }) {
    const COUNTRIES = [
        "Узбекистан", "Казахстан", "Россия", "Турция", "США", "Германия", "Польша", "Украина", "ОАЭ", "Индия",
    ];
    const update = (patch) => setF(patch);

    return (
        <div className="text-black">
            <label className="block text-[14px] font-semibold mb-3">
                5. Выберите локацию.
            </label>

            <div className="flex items-center gap-6">
                {/* Country select */}
                <div className="relative">
                    <select
                        disabled={is_remote}
                        value={location || ""}
                        onChange={(e) => update({ location: e.target.value })}
                        className={
                            "h-11 min-w-[190px] rounded-xl border border-[#C9C9C9] bg-white px-3 pr-8 outline-none " +
                            (is_remote ? "opacity-60 cursor-not-allowed" : "focus:border-[#3066BE]")
                        }
                    >
                        <option value="" disabled>Выберите страну</option>
                        {COUNTRIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Remote checkbox */}
                <label className="flex items-center gap-2 select-none">
                    <input
                        type="checkbox"
                        checked={is_remote}
                        onChange={(e) => update({ is_remote: e.target.checked })}
                    />
                    Удаленная работа
                </label>
            </div>
        </div>
    );
}


function StepEvaluation({ form, setF }) {
    const update = (k, v) => setF({ [k]: v });

    return (
        <div className="space-y-6 text-[14px] text-black">
            {/* 1. Размер работы */}
            <div>
                <div className="font-semibold mb-2">3. Далее оцените срок вашей работы:</div>
                <div className="space-y-2">
                    {[
                        {v:"big", t:"Большой"},
                        {v:"medium", t:"Средний"},
                        {v:"small", t:"Маленький"},
                    ].map((o) => (
                        <label key={o.v} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="project_size"
                                checked={form.project_size === o.v}
                                onChange={() => update("project_size", o.v)}
                            />
                            {o.t}
                        </label>
                    ))}
                </div>
            </div>

            {/* 2. Длительность */}
            <div>
                <div className="font-semibold mb-2">Сколько времени займет ваша работа?</div>
                <div className="space-y-2">
                    {[
                        {v:"gt6", t:"Более 6 месяцев"},
                        {v:"m3to6", t:"От 3 до 6 месяцев"},
                        {v:"m1to3", t:"От 1 до 3 месяцев"},
                    ].map((o) => (
                        <label key={o.v} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="duration"
                                checked={form.duration === o.v}
                                onChange={() => update("duration", o.v)}
                            />
                            {o.t}
                        </label>
                    ))}
                </div>
            </div>

            {/* 3. Уровень опыта */}
            <div>
                <div className="font-semibold mb-2">Какой уровень опыта для этого потребуется?</div>
                <div className="space-y-2">
                    {[
                        {v:"junior", t:"Начальный уровень"},
                        {v:"middle", t:"Средний уровень"},
                        {v:"senior", t:"Эксперт"},
                    ].map((o) => (
                        <label key={o.v} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="experience_level"
                                checked={form.experience_level === o.v}
                                onChange={() => update("experience_level", o.v)}
                            />
                            {o.t}
                        </label>
                    ))}
                </div>
            </div>

            {/* 4. Контрактная возможность */}
            <div>
                <div className="font-semibold mb-2">
                    Является ли эта работа возможностью трудоустройства по контракту?
                </div>
                <div className="space-y-2">
                    {[
                        {v:"yes", t:"Да, это может стать постоянной работой"},
                        {v:"no",  t:"Нет, не сейчас"},
                    ].map((o) => (
                        <label key={o.v} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="contract_opportunity"
                                checked={form.contract_opportunity === o.v}
                                onChange={() => update("contract_opportunity", o.v)}
                            />
                            {o.t}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
