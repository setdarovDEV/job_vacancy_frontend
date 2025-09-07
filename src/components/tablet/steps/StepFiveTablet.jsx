import React, { useState } from "react";

export default function StepFive({ formData, setFormData }) {
    const countries = [
        "Узбекистан",
        "Россия",
        "США",
        "Германия",
        "Казахстан",
        "Индия",
        "Турция",
        "Другая страна",
    ];

    const [isOther, setIsOther] = useState(formData.location && !countries.includes(formData.location));

    const handleLocationChange = (e) => {
        const v = e.target.value;
        if (v === "Другая страна") {
            setIsOther(true);
            setFormData({ ...formData, location: "" });
        } else {
            setIsOther(false);
            setFormData({ ...formData, location: v });
        }
    };

    const handleRemoteChange = (e) => {
        setFormData({ ...formData, is_remote: e.target.checked });
    };

    return (
        <div className="space-y-4">
            <label className="block text-[14px] font-semibold text-black">
                5. Выберите локацию
            </label>

            <div className="flex flex-wrap items-center gap-3">
                <select
                    value={isOther ? "Другая страна" : (formData.location || "")}
                    onChange={handleLocationChange}
                    className="w-full md:w-auto h-[44px] rounded-[10px] border border-[#CBD5E1] px-3
                     text-[14px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#3066BE]"
                >
                    <option value="">Выберите...</option>
                    {countries.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                {/* Custom country input when "Другая страна" */}
                {isOther && (
                    <input
                        type="text"
                        placeholder="Страна / город"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full md:flex-1 h-[44px] rounded-[10px] border border-[#CBD5E1] px-3
                       text-[14px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#3066BE]"
                    />
                )}

                {/* Remote checkbox (doim ko'rinsin) */}
                <label className="inline-flex items-center gap-2 text-[#0F172A] text-[14px]">
                    <input
                        type="checkbox"
                        checked={!!formData.is_remote}
                        onChange={handleRemoteChange}
                        className="accent-[#3066BE]"
                    />
                    Удаленная работа
                </label>
            </div>

            <p className="text-[12px] text-gray-500">
                Укажите страну (и город при необходимости). Если работа удалённая — отметьте чекбокс.
            </p>
        </div>
    );
}
