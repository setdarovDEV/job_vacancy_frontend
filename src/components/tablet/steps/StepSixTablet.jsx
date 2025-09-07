// components/steps/StepSix.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export default function StepSix({ formData, setFormData }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    };

    const clearFile = () => setFile(null);

    return (
        <div className="space-y-5">
            {/* Tavsif */}
            <div>
                <label className="block mb-2 font-semibold text-[14px] text-black">
                    6. Расскажите о своей работе:
                </label>
                <textarea
                    rows={6}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Напишите краткое описание задачи..."
                    className="w-full min-h-[160px] rounded-[10px] border border-[#CBD5E1]
                     px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-gray-400
                     outline-none focus:ring-2 focus:ring-[#3066BE]"
                />
            </div>

            {/* Fayl yuklash (hozircha only UI) */}
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer h-[44px] inline-flex items-center gap-2
                       rounded-[10px] border border-[#CBD5E1] px-4
                       text-[14px] text-[#3066BE] bg-white hover:bg-[#F0F7FF]"
                    >
                        <img src="/upload.png" alt="" className="w-[18px] h-[18px]" />
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
                        <span className="inline-flex items-center gap-2 max-w-full">
              <span className="truncate max-w-[260px] text-[13px] text-gray-700">
                {file.name}
              </span>
              <button
                  type="button"
                  onClick={clearFile}
                  className="w-6 h-6 rounded-full border border-gray-300 bg-white
                           inline-flex items-center justify-center hover:bg-gray-50"
                  aria-label="Удалить файл"
              >
                <X size={14} className="text-[#0F172A]" />
              </button>
            </span>
                    )}
                </div>

                <p className="text-[12px] text-gray-500">Макс. размер 100 МБ</p>
            </div>
        </div>
    );
}
