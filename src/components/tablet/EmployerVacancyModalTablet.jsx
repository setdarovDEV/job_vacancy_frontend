// src/components/EmployerVacancyModalTablet.jsx
import React, { useState, useEffect } from "react";
import { X, ArrowLeft, ChevronRight } from "lucide-react";
import api from "../../utils/api";

import StepOne from "./steps/StepOneTablet.jsx";
import StepTwo from "./steps/StepTwoTablet.jsx";
import StepThree from "./steps/StepThreeTablet.jsx";
import StepFour from "./steps/StepFourTablet.jsx";
import StepFive from "./steps/StepFiveTablet.jsx";
import StepSix from "./steps/StepSixTablet.jsx";

export default function EmployerVacancyModalTablet({ onClose, vacancy = null, onSubmit }) {
    const isEdit = Boolean(vacancy);

    const [step, setStep] = useState(1);
    const nextStep = () => setStep((s) => Math.min(s + 1, 6));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const [open, setOpen] = useState(true);
    const handleClose = (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        if (typeof onClose === "function") onClose();
        else setOpen(false); // fallback: agar onClose kelmasa ham yopiladi
    };

    useEffect(() => {
        const onEsc = (e) => { if (e.key === "Escape") handleClose(); };
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, []);

    const [formData, setFormData] = useState({
        title: "", skills: [], duration: "", size: "", level: "", permanent: "",
        budget_min: "", budget_max: "", is_fixed_price: true, location: "", is_remote: false, description: "",
    });

    useEffect(() => {
        if (!vacancy) return;
        setFormData({
            title: vacancy.title || "",
            skills: vacancy.skills || [],
            duration: vacancy.duration || "",
            size: vacancy.size || "",
            level: vacancy.level || "",
            permanent: vacancy.permanent || "",
            budget_min: vacancy.budget_min ?? "",
            budget_max: vacancy.budget_max ?? "",
            is_fixed_price: vacancy.is_fixed_price ?? true,
            location: vacancy.location || "",
            is_remote: vacancy.is_remote || false,
            description: vacancy.description || "",
        });
    }, [vacancy]);

    const handleSubmit = async () => {
        try {
            if (typeof onSubmit === "function") {
                await onSubmit(formData);
            } else if (isEdit) {
                await api.patch(`/api/vacancies/jobposts/${vacancy.id}/`, formData);
                alert("Vakansiya tahrirlandi!");
            } else {
                await api.post(`/api/vacancies/jobposts/`, formData);
                alert("Vakansiya yaratildi!");
            }
            handleClose();
        } catch (err) {
            console.error("❌ Xatolik:", err.response?.data || err.message);
            alert("Xatolik yuz berdi!");
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <StepOne formData={formData} setFormData={setFormData} />;
            case 2: return <StepTwo formData={formData} setFormData={setFormData} />;
            case 3: return <StepThree formData={formData} setFormData={setFormData} />;
            case 4: return <StepFour formData={formData} setFormData={setFormData} />;
            case 5: return <StepFive formData={formData} setFormData={setFormData} />;
            case 6: return <StepSix formData={formData} setFormData={setFormData} />;
            default: return null;
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center" role="dialog" aria-modal="true">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50 z-0" onClick={handleClose} />

            {/* modal */}
            <div
                className="relative z-10 w-full max-w-[720px] md:max-w-[760px] bg-white rounded-2xl shadow-xl mx-3 flex flex-col"
                onClick={(e) => e.stopPropagation()} // ichki kliklar overlayga ketmasin
            >
                {/* header */}
                <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div className="w-[44px] flex justify-start">
                        {step > 1 && (
                            <button type="button" onClick={prevStep} className="p-2 rounded-lg hover:bg-gray-100">
                                <ArrowLeft className="text-[#3066BE]" size={18} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 text-center">
                        <h2 className="text-[18px] font-bold text-black leading-none">Разместить вакансию</h2>
                        <div className="text-[12px] text-gray-500 mt-1">Шаг {step} из 6</div>
                    </div>

                    <div className="w-[44px] flex justify-end">
                        <button type="button" onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100">
                            <X className="text-[#3066BE]" size={18} />
                        </button>
                    </div>
                </div>

                {/* body */}
                <div className="px-4 py-4 max-h-[65vh] overflow-y-auto">
                    {renderStep()}
                </div>

                {/* footer */}
                <div className="px-4 py-3 flex items-center justify-end gap-2">
                    {step < 6 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="h-[44px] px-4 rounded-[10px] bg-[#3066BE] text-white text-[14px] font-semibold inline-flex items-center gap-2 hover:bg-[#2a58a6]"
                        >
                            Следующий <ChevronRight size={18} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="h-[44px] px-4 rounded-[10px] border bg-white border-[#3066BE] text-[#3066BE] text-[14px] font-semibold hover:bg-[#F0F7FF]"
                            >
                                Предпросмотр
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="h-[44px] px-4 rounded-[10px] bg-[#3066BE] text-white text-[14px] font-semibold hover:bg-[#2a58a6]"
                            >
                                Опубликовать
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
