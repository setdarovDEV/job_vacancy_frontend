// components/steps/StepTwo.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export default function StepTwo({ formData, setFormData }) {
    const [inputValue, setInputValue] = useState("");

    const addSkill = () => {
        const s = inputValue.trim();
        if (!s) return;
        // takrorni bloklash (case-insensitive)
        const exists = formData.skills.some((k) => k.toLowerCase() === s.toLowerCase());
        if (exists) return setInputValue("");
        setFormData({ ...formData, skills: [...formData.skills, s] });
        setInputValue("");
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((skill) => skill !== skillToRemove),
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((skill) => skill !== skillToRemove)
        });
    };


    const count = formData.skills.length;

    return (
        <div className="space-y-3">
            <label className="block text-[14px] font-semibold text-black">
                2. Поиск навыков или добавление своих собственных:
            </label>

            {/* Faqat input (Enter bilan qo'shiladi) */}
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напр.: React, Django, PostgreSQL…"
                    autoComplete="off"
                    className="w-full h-[44px] pl-10 pr-3 rounded-[10px] border border-[#CBD5E1]
                     text-[14px] text-[#0F172A] placeholder:text-gray-400
                     bg-white focus:bg-white caret-[#3066BE]
                     outline-none focus:ring-2 focus:ring-[#3066BE]"
                />
                <img
                    src="/search.png"
                    alt=""
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                />
            </div>

            <div className="flex items-center justify-between text-[12px] text-gray-500">
                <span>Для наилучших результатов добавьте 3–5 навыков. Нажмите Enter, чтобы добавить.</span>
                <span>Выбрано: {count}</span>
            </div>

            {/* Tanlangan skilllar */}
            <div className="flex flex-wrap gap-2 mt-1">
                {formData.skills.map((tag, idx) => (
                    <span
                        key={idx}
                        className="inline-flex items-center h-[28px] px-2 rounded-full
                 bg-[#D9D9D9] text-[#0F172A]"
                    >
                      <span className="text-[12px] leading-none truncate max-w-[160px]">
                        {tag}
                      </span>

                      <button
                          type="button"
                          onClick={() => removeSkill(tag)}
                          aria-label={`Удалить ${tag}`}
                          className="w-[20px] h-[20px] rounded-full bg-[#D9D9D9] flex border-none items-center justify-center p-[2px]"
                      >
                        <X size={12} strokeWidth={2.5} className="text-[#0F172A]" />
                      </button>
                    </span>
                ))}
            </div>

        </div>
    );
}
