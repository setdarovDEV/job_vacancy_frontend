import React from "react";

export default function StepFour({ formData, setFormData }) {
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-4">
            <label className="block text-[14px] font-semibold text-black">
                4. Расскажите нам о своем бюджете:
            </label>

            {/* Min / Max */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* FROM */}
                <div>
                    <p className="text-[13px] text-[#0F172A] mb-1">ОТ</p>
                    <div className="relative">
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.budget_min}
                            onChange={(e) => handleChange("budget_min", e.target.value)}
                            className="w-full h-[44px] rounded-[10px] border border-[#CBD5E1] px-3 pr-10
                         text-[14px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#3066BE]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-500">$</span>
                    </div>
                </div>

                {/* TO */}
                <div>
                    <p className="text-[13px] text-[#0F172A] mb-1">ДО</p>
                    <div className="relative">
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.budget_max}
                            onChange={(e) => handleChange("budget_max", e.target.value)}
                            className="w-full h-[44px] rounded-[10px] border border-[#CBD5E1] px-3 pr-10
                         text-[14px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#3066BE]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-500">$</span>
                    </div>
                </div>
            </div>

            {/* Fixed price toggle */}
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.is_fixed_price}
                    onChange={(e) => handleChange("is_fixed_price", e.target.checked)}
                    className="accent-[#3066BE]"
                />
                <span className="text-[14px] text-[#0F172A]">Фиксированная цена</span>
            </label>

            <p className="text-[12px] text-gray-500">
                Укажите диапазон. Для почасовой оплаты введите сумму за час.
            </p>
        </div>
    );
}
