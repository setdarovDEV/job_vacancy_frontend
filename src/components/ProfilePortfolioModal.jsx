import React, { useState } from "react";
import { X } from "lucide-react";
import { FiImage, FiVideo, FiType, FiLink, FiFile, FiMusic } from 'react-icons/fi';
import api from "../utils/api";

const getIconByType = (type) => {
    switch (type) {
        case 'image': return <FiImage />;
        case 'video': return <FiVideo />;
        case 'text': return <FiType />;
        case 'link': return <FiLink />;
        case 'file': return <FiFile />;
        case 'audio': return <FiMusic />;
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
            const projectRes = await api.post("/portfolio/projects/", {
                title,
                description,
                skills,
            });

            const projectId = projectRes.data.id;

            if (selectedFile && selectedFileType) {
                const formData = new FormData();
                formData.append("project", projectId);
                formData.append("file", selectedFile);
                formData.append("file_type", selectedFileType);

                await api.post("/portfolio/portfolio-media/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            alert("Loyiha muvaffaqiyatli yuklandi!");
            onClose();
        } catch (err) {
            console.error("Xatolik:", err);
            alert("Xatolik yuz berdi!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white w-[1110px] h-[813px] rounded-[10px] shadow-lg p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="w-[24px] h-[24px] absolute top-[25px] right-6 text-[#3066BE] hover:text-blue-700 bg-white border-none "
                >
                    <X size={20} />
                </button>

                <h3 className="text-[24px] leading-[36px] ml-[353px] font-bold text-[#000000]">
                    Добавить новый проект портфолио
                </h3>

                <div className="absolute right-[0px] w-[1110px] h-[1px] bg-[#AEAEAE] mt-[24.5px]"></div>

                <div className="p-6 space-y-6">
                    {/* Название проекта */}
                    <div>
                        <label className="block text-[16px] font-semibold leading-[150%] text-[#000000] mb-3 mt-[48.5px]">
                            Название проекта:
                        </label>
                        <input
                            type="text"
                            placeholder="Введите краткое, но описательное название"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-[42px] px-4 border border-black
                                       focus:outline-none rounded-[10px] focus:border-[#3066BE] focus:ring-0 text-black"
                        />
                    </div>

                    {/* Описание проекта */}
                    <div>
                        <label className="block text-[16px] font-semibold text-[#000000] leading-[150%] mb-2 mt-[40px]">
                            Описание проекта:
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Кратко опишите цели проекта, ваше решение и оказанное вами влияние"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-[42px] px-4 border border-black rounded-[10px]
                                       focus:outline-none focus:border-[#3066BE] focus:ring-0 text-black"
                        />
                    </div>

                    {/* Навыки и результаты */}
                    <div>
                        <label className="block text-[16px] font-semibold text-black mb-2 mt-[40px]">
                            Навыки и результаты:
                        </label>
                        <input
                            type="text"
                            placeholder="Введите, чтобы добавить навыки, имеющие отношение к этому проекту"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="w-full border border-black rounded-[10px] px-4 py-3 outline-none text-[14px] text-black placeholder:text-[#AEAEAE] mb-[40px]"
                        />
                    </div>

                    {/* Media Upload Icons */}
                    <div className="border border-black rounded-[10px] p-4 flex flex-wrap justify-center items-center gap-6 w-[1007px] h-[178px]">
                        {['image', 'video', 'text', 'link', 'file', 'audio'].map((type) => (
                            <label key={type}>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        setSelectedFile(e.target.files[0]);
                                        setSelectedFileType(type);
                                    }}
                                />
                                <div
                                    className={`w-[50px] h-[50px] border border-[#3066BE] bg-white rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#F0F7FF] transition`}
                                >
                                <span className="text-[#3066BE] text-[20px]">
                                  {getIconByType(type)}
                                </span>
                                </div>
                            </label>
                        ))}
                    </div>


                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button className="w-[222px] h-[59px] px-[25px] py-[15px] border border-[#3066BE] bg-white text-[#3066BE] rounded-[10px] font-semibold text-[16px]">
                            Предпросмотр
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="w-[222px] h-[59px] px-[25px] py-[15px] bg-[#3066BE] text-white rounded-[10px] font-semibold text-[16px]"
                        >
                            Публиковать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
