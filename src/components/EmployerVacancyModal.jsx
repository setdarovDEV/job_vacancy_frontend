// src/components/EmployerVacancyModal.jsx
import React, { useState, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
import StepOne from "./steps/StepOne.jsx";
import StepTwo from "./steps/StepTwo.jsx";
import StepThree from "./steps/StepThree.jsx";
import StepFour from "./steps/StepFour.jsx";
import StepFive from "./steps/StepFive.jsx";
import StepSix from "./steps/StepSix.jsx";
import EmployerVacancyModalTablet from "./tablet/EmployerVacancyModalTablet.jsx";
import api from "../utils/api";

export default function EmployerVacancyModal({ onClose, vacancy = null, onSubmit }) {
    const isEdit = Boolean(vacancy);

    const [step, setStep] = useState(1);
    const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const [formData, setFormData] = useState({
        title: "",
        skills: [],
        duration: "",
        size: "",
        level: "",
        permanent: "",
        budget_min: "",
        budget_max: "",
        is_fixed_price: true,
        location: "",
        is_remote: false,
        description: "",
    });

    // edit bo'lsa formani to'ldirish
    useEffect(() => {
        if (vacancy) {
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
        }
    }, [vacancy]);

    // Bitta universal submit (desktop va tablet uchun)
    const submit = async (data) => {
        try {
            if (typeof onSubmit === "function") {
                // Parent (HomeEmployer) o'zi POST/PATCH qilib, ro'yxatni yangilaydi
                await onSubmit(data);
            } else if (isEdit) {
                await api.patch(`/api/vacancies/jobposts/${vacancy.id}/`, data);
                alert("Vakansiya tahrirlandi!");
            } else {
                await api.post("/api/vacancies/jobposts/", data);
                alert("Vakansiya yaratildi!");
            }
            if (typeof onClose === "function") onClose();
        } catch (err) {
            console.error("❌ Vakansiyani saqlashda xatolik:", err.response?.data || err.message);
            alert("Xatolik yuz berdi!");
        }
    };

    const handlePublishClick = () => {
        submit(formData);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepOne formData={formData} setFormData={setFormData} />;
            case 2:
                return <StepTwo formData={formData} setFormData={setFormData} />;
            case 3:
                return <StepThree formData={formData} setFormData={setFormData} />;
            case 4:
                return <StepFour formData={formData} setFormData={setFormData} />;
            case 5:
                return <StepFive formData={formData} setFormData={setFormData} />;
            case 6:
                return <StepSix formData={formData} setFormData={setFormData} />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* md / tablet / mobile uchun – alohida modal (allaqachon yozilgansan) */}
            <div className="block lg:hidden">
                <EmployerVacancyModalTablet
                    onClose={onClose}
                    vacancy={vacancy}
                    onSubmit={submit}
                />
            </div>

            {/* faqat lg+ uchun desktop modal */}
            <div className="hidden lg:flex fixed inset-0 z-50 bg-black bg-opacity-50 justify-center items-center px-4">
                <div className="bg-white w-[1110px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative p-8 animate-slide-up">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            {step > 1 && (
                                <button className="bg-white border-none mt-[5px]" onClick={prevStep}>
                                    <ArrowLeft className="text-[#3066BE] hover:text-blue-700 bg-white" />
                                </button>
                            )}
                            <h2 className="font-bold text-[24px] mx-auto text-center text-black">
                                Разместить вакансию
                            </h2>
                        </div>
                        <button className="bg-white border-none mt-[5px]" onClick={onClose}>
                            <X className="text-[#3066BE] hover:text-blue-700 bg-white" />
                        </button>
                    </div>

                    <div className="w-[1110px] h-[1px] ml-[-32px] bg-[#AEAEAE] mb-6" />

                    {/* Step Content */}
                    {renderStep()}

                    {/* Footer */}
                    <div className="mt-8 flex justify-end">
                        {step < 6 ? (
                            <button
                                onClick={nextStep}
                                className="w-[177px] h-[57px] mr-[29px] bg-[#3066BE] text-white text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] hover:bg-[#2a58a6] transition flex items-center justify-center gap-2"
                            >
                                Следующий
                                <img src="/next.png" alt="next icon" className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    className="w-[177px] h-[57px] mr-[5px] border-[#3066BE] bg-white text-[#3066BE] text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] transition flex items-center justify-center gap-2"
                                >
                                    Предпросмотр
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePublishClick}
                                    className="w-[177px] h-[57px] bg-[#3066BE] text-white text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] hover:bg-[#2a58a6] transition flex items-center justify-center gap-2"
                                >
                                    Опубликовать
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
