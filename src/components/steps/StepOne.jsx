// components/steps/StepOne.jsx
import React from "react";

export default function StepOne({ formData, setFormData }) {
    const handleChange = (e) => {
        setFormData({ ...formData, title: e.target.value });
    };

    return (
        <div>
            <label className="block text-[16px] leading-[24px] ml-[10px] font-semibold text-black mb-2">
                1. Напишите название вашей вакансии:
            </label>
            <input
                type="text"
                placeholder="Напр. Google, Microsoft"
                value={formData.title}
                onChange={handleChange}
                className="w-[1007px] h-[49px] ml-[10px] border border-[#000000] rounded-[10px] px-4 text-[16px] leading-[24px] text-black focus:outline-none focus:border-[#3066BE]"
            />
        </div>
    );
}
