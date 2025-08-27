// components/steps/StepTwo.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export default function StepTwo({ formData, setFormData }) {
    const [inputValue, setInputValue] = useState("");

    const handleAddSkill = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !formData.skills.includes(trimmed)) {
            setFormData({
                ...formData,
                skills: [...formData.skills, trimmed]
            });
            setInputValue("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((skill) => skill !== skillToRemove)
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <div>
            <label className="block text-[16px] leading-[24px] font-semibold text-black mb-2">
                2. Поиск навыков или добавление своих собственных:
            </label>

            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-[1017px] h-[49px] border border-[#000000] rounded-[10px] px-10 text-[16px] text-black focus:outline-none focus:border-[#3066BE]"
                />
                <img src="/search.png" alt="" className="mt-[-35px] ml-[10px]" />
            </div>

            <p className="text-[16px] leading-[24px] text-[#AEAEAE] font-medium mt-[15px] mb-4">
                Для достижения наилучших результатов добавьте 3–5 навыков.
            </p>

            <p className="text-[16px] leading-[24px] text-black font-semibold mb-2">
                Выбранные навыки:
            </p>

            <div className="flex flex-wrap gap-2 justify-start mt-[21px]">
                {formData.skills.map((tag, idx) => (
                    <div
                        key={idx}
                        className="flex items-center h-[31px] gap-2 bg-[#D9D9D9] text-[15px] px-4 py-1 rounded-full border border-gray-300 text-black"
                    >
                        {tag}
                        <button
                            onClick={() => handleRemoveSkill(tag)}
                            className="w-[20px] h-[20px] rounded-full bg-[#D9D9D9] flex border-none items-center justify-center p-[2px]"
                        >
                            <X size={14} className="text-black" />
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}
