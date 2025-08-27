import React from "react";

export default function StepThree({ formData, setFormData }) {
    const handleChange = (section, value) => {
        setFormData({ ...formData, [section]: value });
    };

    const renderOption = (section, value, label) => (
        <label className="flex items-center gap-2 mb-2 cursor-pointer text-black font-normal" key={value}>
            <input
                type="radio"
                name={section} // har bir section o‘z nomi bilan bo‘ladi
                value={value}
                checked={formData[section] === value}
                onChange={() => handleChange(section, value)}
                className="accent-[#3066BE]"
            />
            <span>{label}</span>
        </label>
    );

    return (
        <div className="space-y-6">
            {/* 1. Hajmi */}
            <div>
                <p className="text-[16px] leading-[24px] text-black font-semibold mb-2">
                    3. Далее оцените срок вашей работы:
                </p>
                {renderOption("size", "Большой", "Большой")}
                {renderOption("size", "Средний", "Средний")}
                {renderOption("size", "Маленький", "Маленький")}
            </div>

            {/* 2. Duration */}
            <div>
                <p className="text-[16px] leading-[24px] text-black font-semibold mb-2">
                    Сколько времени займет ваша работа?
                </p>
                {renderOption("duration", "Более 6 месяцев", "Более 6 месяцев")}
                {renderOption("duration", "От 3 до 6 месяцев", "От 3 до 6 месяцев")}
                {renderOption("duration", "От 1 до 3 месяцев", "От 1 до 3 месяцев")}
            </div>

            {/* 3. Level */}
            <div>
                <p className="text-[16px] leading-[24px] text-black font-semibold mb-2">
                    Какой уровень опыта для этого потребуется?
                </p>
                {renderOption("level", "Начальный уровень", "Начальный уровень")}
                {renderOption("level", "Средний уровень", "Средний уровень")}
                {renderOption("level", "Эксперт", "Эксперт")}
            </div>

            {/* 4. Permanent */}
            <div>
                <p className="text-[16px] leading-[24px] text-black font-semibold mb-2">
                    Является ли эта работа возможностью трудоустройства по контракту?
                </p>
                {renderOption("permanent", "Да", "Да, это может стать постоянной работой.")}
                {renderOption("permanent", "Нет", "Нет, не сейчас.")}
            </div>
        </div>
    );
}
