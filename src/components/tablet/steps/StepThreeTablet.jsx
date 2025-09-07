// components/steps/StepThree.jsx
import React from "react";

export default function StepThree({ formData, setFormData }) {
    const setField = (k, v) => setFormData({ ...formData, [k]: v });

    const sizeOptions = ["Большой", "Средний", "Маленький"];
    const durationOptions = ["Более 6 месяцев", "От 3 до 6 месяцев", "От 1 до 3 месяцев"];
    const levelOptions = ["Начальный уровень", "Средний уровень", "Эксперт"];
    const permanentOptions = [
        "Да, это может стать постоянной работой.",
        "Нет, не сейчас.",
    ];

    return (
        <div className="space-y-6">
            {/* 1. Hajmi */}
            <Section title="3. Далее оцените срок вашей работы:">
                {sizeOptions.map((opt) => (
                    <RadioLike
                        key={opt}
                        name="size"
                        label={opt}
                        checked={formData.size === opt}
                        onChange={() => setField("size", opt)}
                    />
                ))}
            </Section>

            {/* 2. Duration */}
            <Section title="Сколько времени займет ваша работа?">
                {durationOptions.map((opt) => (
                    <RadioLike
                        key={opt}
                        name="duration"
                        label={opt}
                        checked={formData.duration === opt}
                        onChange={() => setField("duration", opt)}
                    />
                ))}
            </Section>

            {/* 3. Level */}
            <Section title="Какой уровень опыта для этого потребуется?">
                {levelOptions.map((opt) => (
                    <RadioLike
                        key={opt}
                        name="level"
                        label={opt}
                        checked={formData.level === opt}
                        onChange={() => setField("level", opt)}
                    />
                ))}
            </Section>

            {/* 4. Permanent */}
            <Section title="Является ли эта работа возможностью трудоустройства по контракту?">
                {permanentOptions.map((opt) => (
                    <RadioLike
                        key={opt}
                        name="permanent"
                        label={opt}
                        checked={formData.permanent === (opt.startsWith("Да") ? "Да" : "Нет")}
                        onChange={() => setField("permanent", opt.startsWith("Да") ? "Да" : "Нет")}
                    />
                ))}
            </Section>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <p className="text-[14px] font-semibold text-black mb-3">{title}</p>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

/** Kvadrat indikatorli radio-like varianti (checkboxga o‘xshash UI) */
function RadioLike({ name, label, checked, onChange }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            {/* haqiqiy radio — eksklyuziv tanlov uchun */}
            <input
                type="radio"
                name={name}
                className="peer sr-only"
                checked={checked}
                onChange={onChange}
            />
            {/* kvadrat indikator */}
            <span
                className={`w-[18px] h-[18px] rounded-[4px] border
          ${checked ? "bg-[#3066BE] border-[#3066BE]" : "bg-white border-gray-300"}`}
            />
            {/* label */}
            <span className="text-[14px] text-[#0F172A]">{label}</span>
        </label>
    );
}
