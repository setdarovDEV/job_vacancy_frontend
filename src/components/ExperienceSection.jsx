import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ProfileExperienceModal from "../components/ProfileExperienceModal";
import api from "../utils/api";

export default function ExperienceSection({ isEditable }) {
    const [experiences, setExperiences] = useState([]);
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [editExperience, setEditExperience] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🔁 Pagination bo'lsa ham, oddiy arrayga aylantirish
    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.results)) return data.results;
        return [];
    };

    useEffect(() => {
        setLoading(true);
        api
            .get("/api/experiences/")
            .then((res) => {
                console.log("Experiences response:", res.data);
                setExperiences(normalizeList(res.data));
            })
            .catch((err) => console.error("Xatolik:", err))
            .finally(() => setLoading(false));
    }, []);

    const reloadExperiences = async () => {
        try {
            const res = await api.get("/api/experiences/");
            setExperiences(normalizeList(res.data));
        } catch (err) {
            console.error("Reload xato:", err.response?.data || err);
        }
    };

    const handleSaveExperience = async (data) => {
        try {
            await api.post("/api/experiences/", data);
            await reloadExperiences();
            setIsExperienceOpen(false);
        } catch (err) {
            console.error("Xatolik:", err.response?.data || err);
            throw err;
        }
    };

    const handleUpdateExperience = async (data) => {
        if (!editExperience) return;

        try {
            await api.patch(`/api/experiences/${editExperience.id}/`, data);
            await reloadExperiences();
            setEditModalOpen(false);
            setEditExperience(null);
        } catch (err) {
            console.error("Tahrirlashda xatolik:", err.response?.data || err);
            throw err;
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/experiences/${id}/`);
        } catch (err) {
            // Agar backend "No WorkExperience matches the given query" desa ham
            // bu odatda allaqachon o'chib ketganini anglatadi – frontdan baribir o'chirib tashlaymiz
            if (err.response?.status !== 404) {
                console.error("O‘chirishda xatolik:", err.response?.data || err);
                return;
            }
            console.warn("Server 404 qaytardi, lekin local ro'yxatdan olib tashlayapmiz");
        }

        // Local state-dan o‘chiramiz
        setExperiences((prev) => prev.filter((e) => e.id !== id));
    };

    const hasExperiences = Array.isArray(experiences) && experiences.length > 0;

    return (
        <>
            <div className="w-full bg-white border text-black border-[#AEAEAE] mt-[67px] rounded-[25px] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#AEAEAE]">
                    <h3 className="text-[24px] leading-[36px] font-bold text-[#000000] font-gilroy">
                        Опыт работы
                    </h3>
                    <button
                        onClick={() => {
                            if (isEditable) {
                                setEditExperience(null);
                                setIsExperienceOpen(true);
                            }
                        }}
                        className="bg-white border-none w-[10px]"
                    >
                        <div
                            className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition ${
                                isEditable
                                    ? "border-[#3066BE] cursor-pointer bg-white"
                                    : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                            }`}
                        >
                            <Plus size={25} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                        </div>
                    </button>
                </div>

                {/* Ro'yxat */}
                {loading ? (
                    <div className="flex items-center justify-center bg-white text-center px-4 py-10">
                        <p className="text-[#AEAEAE] text-[18px]">Загрузка опыта работы...</p>
                    </div>
                ) : !hasExperiences ? (
                    <div className="flex items-center justify-center bg-white text-center px-4 py-10">
                        <p className="text-[#AEAEAE] text-[20px] leading-[30px] max-w-[604px] font-[400]">
                            Перечисление вашего опыта работы может помочь <br />
                            подтвердить ваши особые знания и способности.
                        </p>
                    </div>
                ) : (
                    <div className="p-6 flex flex-col gap-4">
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="border border-gray-300 rounded-[15px] p-4 bg-gray-50"
                            >
                                <h4 className="font-bold text-lg">{exp.position}</h4>
                                <p className="text-sm text-gray-500">{exp.company_name}</p>
                                <p className="text-sm text-gray-400">
                                    {exp.start_date} — {exp.end_date || (exp.is_current ? "Hozirgacha" : "")}
                                </p>
                                {(exp.city || exp.country) && (
                                    <p className="text-sm text-gray-500">
                                        {exp.city}
                                        {exp.city && exp.country ? ", " : ""}
                                        {exp.country}
                                    </p>
                                )}
                                {exp.description && (
                                    <p className="mt-2 text-sm whitespace-pre-line">
                                        {exp.description}
                                    </p>
                                )}

                                {isEditable && (
                                    <div className="flex justify-end gap-3 mt-3">
                                        <button
                                            onClick={() => {
                                                setEditExperience(exp);
                                                setEditModalOpen(true);
                                            }}
                                            className="px-3 py-1 text-white bg-yellow-500 rounded-[10px]"
                                        >
                                            Тахрирлаш
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="px-3 py-1 text-white bg-red-500 rounded-[10px]"
                                        >
                                            Ўчириш
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Yangi experience yaratish modal */}
            <ProfileExperienceModal
                isOpen={isExperienceOpen}
                onClose={() => setIsExperienceOpen(false)}
                onSave={handleSaveExperience}
                editMode={false}
                initialData={null}
            />

            {/* Tahrirlash modal */}
            <ProfileExperienceModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleUpdateExperience}
                editMode={true}
                initialData={editExperience}
            />
        </>
    );
}
