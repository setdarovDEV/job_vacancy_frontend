// components/steps/StepSix.jsx
import React, { useState } from "react";
import MultiStepForm from "../steps/MultiStepForm.jsx";

export default function StepSix({ formData, setFormData }) {
    const [file, setFile] = useState(null); // Fayl hozircha local

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDescriptionChange = (e) => {
        setFormData({ ...formData, description: e.target.value });
    };

    return (
        <div className="space-y-6">
            {/* Tavsif */}
            <div>
                <label className="block mb-2 font-semibold text-[16px] text-black">6. Расскажите о своей работе:</label>
                <textarea
                    rows="6"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    placeholder="Напишите краткое описание задачи..."
                    className="w-full border border-black text-black rounded-[10px] px-4 py-2 focus:outline-none"
                />
            </div>

            {/* Fayl yuklash (hozircha faqat ko‘rinadi, backendga ketmaydi) */}
            <div>
                <div className="flex items-center gap-4">
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-[#ffffff] hover:bg-[#e5e9f1] transition px-4 py-2 rounded-[10px] text-[#3066BE] flex items-center gap-2 border border-[#D9D9D9]"
                    >
                        <img src="/upload.png" alt=""/>
                        Файл
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    {file && (
                        <span className="text-sm text-gray-600">{file.name}</span>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Макс. размер 100мб</p>
            </div>
        </div>
    );
}
