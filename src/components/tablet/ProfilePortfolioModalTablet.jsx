import React, { useState } from "react";
import { X } from "lucide-react";
import { FiImage, FiVideo, FiType, FiLink, FiFile, FiMusic } from "react-icons/fi";
import api from "../../utils/api";

const getIconByType = (type) => {
    switch (type) {
        case "image": return <FiImage />;
        case "video": return <FiVideo />;
        case "text":  return <FiType />;
        case "link":  return <FiLink />;
        case "file":  return <FiFile />;
        case "audio": return <FiMusic />;
        default: return null;
    }
};

export default function ProfilePortfolioModal({ isOpen, onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileType, setSelectedFileType] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async () => {
        try {
            const projectRes = await api.post("/portfolio/projects/", { title, description, skills });
            const projectId = projectRes.data.id;

            if (selectedFile && selectedFileType) {
                const formData = new FormData();
                formData.append("project", projectId);
                formData.append("file", selectedFile);
                formData.append("file_type", selectedFileType);
                await api.post("/portfolio/portfolio-media/", formData, { headers: { "Content-Type": "multipart/form-data" }});
            }

            alert("Loyiha muvaffaqiyatli yuklandi!");
            onClose();
        } catch (err) {
            console.error("Xatolik:", err);
            alert("Xatolik yuz berdi!");
        }
    };

    return (
        // Overlay: chetlardan bo‘sh joy uchun padding
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 md:p-6">
            {/* Card: endi juda katta emas */}
            <div className="relative w-full max-w-[600px] md:max-w-[700px] lg:max-w-[820px] bg-white rounded-[14px] md:rounded-[18px] shadow-xl">
                {/* HEADER */}
                <div className="relative px-4 md:px-6 pt-4 md:pt-5 pb-3 md:pb-4 border-b border-[#AEAEAE] rounded-t-[inherit]">
                    <h3 className="text-center text-[18px] md:text-[22px] font-bold text-black">
                        Добавить новый проект портфолио
                    </h3>

                    {/* CLOSE (fixed) */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2
                                   inline-flex items-center justify-center
                                   w-8 h-8 rounded-full border-none border-[#3066BE] text-[#3066BE]
                                   hover:bg-[#F0F7FF] transition bg-white
                                   !p-0 focus:outline-none focus:ring-0"
                    >
                        <X size={18} />
                    </button>
                </div>



                {/* Full-bleed divider */}
                <div className="h-px bg-[#AEAEAE]" />

                {/* Body: ichki scroll, balandlik cheklangan */}
                <div className="px-4 md:px-6 py-5 md:py-6 max-h-[70vh] overflow-y-auto">
                    {/* Название проекта */}
                    <div>
                        <label className="block text-[14px] md:text-[16px] font-semibold text-black mb-2">
                            Название проекта:
                        </label>
                        <input
                            type="text"
                            placeholder="Введите краткое, но описательное название"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-10 md:h-11 px-4 rounded-[10px] border border-[#D9D9D9] text-black placeholder:text-[#AEAEAE] outline-none focus:border-[#3066BE]"
                        />
                    </div>

                    {/* Описание проекта */}
                    <div className="mt-4 md:mt-5">
                        <label className="block text-[14px] md:text-[16px] font-semibold text-black mb-2">
                            Описание проекта:
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Кратко опишите цели проекта, ваше решение и оказанное вами влияние"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[96px] px-4 py-3 rounded-[10px] border border-[#D9D9D9] text-black placeholder:text-[#AEAEAE] outline-none focus:border-[#3066BE]"
                        />
                    </div>

                    {/* Навыки и результаты */}
                    <div className="mt-4 md:mt-5">
                        <label className="block text-[14px] md:text-[16px] font-semibold text-black mb-2">
                            Навыки и результаты:
                        </label>
                        <input
                            type="text"
                            placeholder="Введите, чтобы добавить навыки, имеющие отношение к этому проекту"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="w-full h-10 md:h-11 px-4 rounded-[10px] border border-[#D9D9D9] text-black placeholder:text-[#AEAEAE] outline-none focus:border-[#3066BE]"
                        />
                    </div>

                    {/* Media upload */}
                    <div className="mt-5 md:mt-6 border border-[#D9D9D9] rounded-[12px] p-4 md:p-5 h-[140px] md:h-[160px] grid place-content-center">
                        <div className="flex items-center justify-center gap-4 md:gap-6">
                            {["image", "video", "text", "link", "file", "audio"].map((type) => (
                                <label key={type} className="cursor-pointer">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (!f) return;
                                            setSelectedFile(f);
                                            setSelectedFileType(type);
                                        }}
                                    />
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#3066BE] grid place-items-center hover:bg-[#F0F7FF] transition">
                    <span className="text-[#3066BE] text-[18px] md:text-[20px]">
                      {getIconByType(type)}
                    </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex flex-col md:flex-row justify-end gap-3 md:gap-4">
                        <button className="h-10 md:h-11 px-5 border border-[#3066BE] text-[#3066BE] bg-white rounded-[10px] font-semibold">
                            Предпросмотр
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="h-10 md:h-11 px-5 bg-[#3066BE] text-white rounded-[10px] font-semibold"
                        >
                            Опубликовать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
