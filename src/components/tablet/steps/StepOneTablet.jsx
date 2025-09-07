// components/steps/StepOne.jsx
import React from "react";

export default function StepOne({ formData, setFormData }) {
    const title = formData.title ?? "";
    const len = title.trim().length;
    const invalid = len > 0 && len < 3; // 3 ta belgidan kam bo‘lsa qizil border

    const handleChange = (e) => {
        setFormData({ ...formData, title: e.target.value });
    };

    return (
        <div className="space-y-2">
            <label className="block text-[14px] font-semibold text-black">
                1. Напишите название вашей вакансии:
            </label>

            <input
                type="text"
                value={title}
                onChange={handleChange}
                placeholder="Напр. Backend Engineer"
                maxLength={80}
                autoComplete="off"
                className={`w-full h-[44px] rounded-[10px] text-black px-3 text-[14px] outline-none
          focus:ring-2 focus:ring-[#3066BE]
          ${invalid ? "border border-red-400" : "border border-[#CBD5E1]"}`}
            />

            <div className="flex items-center justify-between text-[12px] text-gray-500">
                <span>Укажите роль/должность (например: Backend Engineer)</span>
            </div>
        </div>
    );
}
