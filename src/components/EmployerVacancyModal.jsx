import React, { useState, useEffect } from "react";
import axios from "axios"; // <-- ADD THIS
import { X, ArrowLeft } from "lucide-react";
import StepOne from "./steps/StepOne.jsx";
import StepTwo from "./steps/StepTwo.jsx";
import StepThree from "./steps/StepThree.jsx";
import StepFour from "./steps/StepFour.jsx";
import StepFive from "./steps/StepFive.jsx";
import StepSix from "./steps/StepSix.jsx";
// ... step component importlari

export default function EmployerVacancyModal({ onClose, vacancy = null }) {
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
        description: ""
    });

    // 🔁 Tahrirlash bo‘lsa, formani to‘ldirish
    useEffect(() => {
        if (vacancy) {
            setFormData({
                title: vacancy.title || "",
                skills: vacancy.skills || [],
                duration: vacancy.duration || "",
                size: vacancy.size || "",
                level: vacancy.level || "",
                permanent: vacancy.permanent || "",
                budget_min: vacancy.budget_min || "",
                budget_max: vacancy.budget_max || "",
                is_fixed_price: vacancy.is_fixed_price ?? true,
                location: vacancy.location || "",
                is_remote: vacancy.is_remote || false,
                description: vacancy.description || "",
            });
        }
    }, [vacancy]);

    // ✅ Yaratish yoki Tahrirlash
    const handleSubmit = async () => {
        const token = localStorage.getItem("access_token");

        try {
            if (isEdit) {
                const res = await axios.patch(
                    `http://localhost:8000/api/vacancies/jobposts/${vacancy.id}/`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("🟢 Tahrirlandi:", res.data);
                alert("Vakansiya tahrirlandi!");
            } else {
                const res = await axios.post(
                    "http://localhost:8000/api/vacancies/jobposts/",
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("🟢 Yaratildi:", res.data);
                alert("Vakansiya yaratildi!");
            }
            onClose(); // modalni yopamiz
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

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
            <div className="bg-white w-[1110px] h-max rounded-xl shadow-lg relative p-8 animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 h-[0px]">
                        {step > 1 && (
                            <button className="bg-white border-none mt-[5px]" onClick={prevStep}>
                                <ArrowLeft className="text-[#3066BE] hover:text-blue-700 bg-white" />
                            </button>
                        )}
                        <h2 className="font-bold text-[24px] ml-[400px] text-center text-black">Разместить вакансию</h2>
                    </div>
                    <button className="bg-white border-none mt-[5px]" onClick={onClose}>
                        <X className="text-[#3066BE] hover:text-blue-700 bg-white" />
                    </button>
                </div>

                <div className="w-[1110px] h-[1px] ml-[-32px] bg-[#AEAEAE] mb-6"></div>

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
                            <button className="w-[177px] h-[57px] mr-[5px] border-[#3066BE] bg-white text-[#3066BE] text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] transition flex items-center justify-center gap-2">
                                Предпросмотр
                            </button>
                            <button
                                onClick={handleSubmit} // ✅ ULANDI!
                                className="w-[177px] h-[57px] bg-[#3066BE] text-white text-[16px] font-semibold rounded-[10px] px-[25px] py-[15px] hover:bg-[#2a58a6] transition flex items-center justify-center gap-2"
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
