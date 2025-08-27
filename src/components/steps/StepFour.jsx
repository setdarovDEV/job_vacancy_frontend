// components/steps/StepFour.jsx
import React from "react";

export default function StepFour({ formData, setFormData }) {
    const currencyOptions = ["$", "€", "₽", "UZS"];

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div>
            <label className="block text-[16px] leading-[24px] text-black font-semibold mb-4">
                4. Расскажите нам о своем бюджете:
            </label>

            <div className="flex gap-10">
                {/* FROM */}
                <div>
                    <label className="block text-[16px] leading-[24px] text-black font-normal mb-2">
                        ОТ
                    </label>
                    <div className="flex items-center justify-between w-[250px] h-[49px] border border-black rounded-[10px] px-3">
                        <input
                            type="number"
                            placeholder="0.00"
                            value={formData.budget_min}
                            onChange={(e) => handleChange("budget_min", e.target.value)}
                            className="w-full outline-none border-none text-[16px] text-black bg-transparent"
                        />
                        <select className="outline-none border-none text-black bg-transparent" disabled>
                            <option>$</option>
                        </select>
                    </div>
                </div>

                {/* TO */}
                <div>
                    <label className="block text-[14px] font-medium text-black mb-2">ДО</label>
                    <div className="flex items-center justify-between w-[250px] h-[49px] border border-black rounded-[10px] px-3">
                        <input
                            type="number"
                            placeholder="0.00"
                            value={formData.budget_max}
                            onChange={(e) => handleChange("budget_max", e.target.value)}
                            className="w-full outline-none border-none text-[16px] text-black bg-transparent"
                        />
                        <select className="outline-none border-none text-black bg-transparent" disabled>
                            <option>$</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Fixed price toggle */}
            <div className="mt-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.is_fixed_price}
                    onChange={(e) => handleChange("is_fixed_price", e.target.checked)}
                    className="accent-[#3066BE]"
                />
                <span className="text-[15px] text-black">Фиксированная цена</span>
            </div>
        </div>
    );
}
