import React from "react";

export default function StepFive({ formData, setFormData }) {
    const countries = [
        "Узбекистан",
        "Россия",
        "США",
        "Германия",
        "Казахстан",
        "Индия",
        "Турция",
        "Другая страна"
    ];

    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        // location tanlanganda remote ishlash imkoniyatini tiklash yoki tozalash
        setFormData({
            ...formData,
            location: selectedLocation,
            is_remote: selectedLocation ? formData.is_remote : false
        });
    };

    const handleRemoteChange = (e) => {
        setFormData({ ...formData, is_remote: e.target.checked });
    };

    return (
        <div>
            <label className="block text-[16px] leading-[24px] text-black font-semibold mb-4">
                5. Выберите локацию
            </label>

            {/* Lokatsiya tanlash */}
            <div className="flex flex-wrap items-center gap-4">
                <select
                    value={formData.location || ""}
                    onChange={handleLocationChange}
                    className="border border-black rounded-[10px] text-black px-4 py-2 outline-none"
                >
                    <option value="">Выберите...</option>
                    {countries.map((country, idx) => (
                        <option key={idx} value={country}>{country}</option>
                    ))}
                </select>

                {/* Remote work checkbox faqat lokatsiya tanlanganda ko‘rinadi */}
                {formData.location && (
                    <label className="flex items-center gap-2 ml-[40px] text-black">
                        <input
                            type="checkbox"
                            checked={formData.is_remote || false}
                            onChange={handleRemoteChange}
                            className="accent-[#3066BE]"
                        />
                        Удаленная работа
                    </label>
                )}
            </div>
        </div>
    );
}
