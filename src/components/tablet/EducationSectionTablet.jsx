import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../utils/api";

export default function EducationSection({ isEditable }) {
    const [educations, setEducations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        academy_name: "",
        degree: "",
        start_year: "",
        end_year: "",
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            const res = await api.get("/api/education/");
            const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setEducations(list);
        } catch (err) {
            console.error("Ma'lumot olishda xatolik:", err);
        }
    };

    const handleSave = async () => {
        try {
            if (editId) {
                await api.put(`/education/education/${editId}/`, formData);
            } else {
                await api.post("/api/education/", formData);
            }
            setFormData({ academy_name: "", degree: "", start_year: "", end_year: "" });
            setEditId(null);
            setShowForm(false);
            fetchEducations();
        } catch (err) {
            console.error("Xatolik:", err);
        }
    };

    const handleEdit = (edu) => {
        setEditId(edu.id);
        setFormData({
            academy_name: edu.academy_name || "",
            degree: edu.degree || "",
            start_year: edu.start_year || "",
            end_year: edu.end_year || "",
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/education/education/${id}/`);
            fetchEducations();
        } catch (err) {
            console.error("O‘chirishda xatolik:", err);
        }
    };

    return (
        <div className="px-3 md:px-0 py-3 md:py-4 mb-4 md:mb-6 rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-[16px] md:text-[20px] font-bold text-black">Образование</h3>

                <div
                    className={`border w-[22px] h-[22px] md:w-[23px] md:h-[23px] rounded-full flex items-center justify-center transition
          ${isEditable ? "border-[#3066BE] cursor-pointer hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 opacity-50"}`}
                    onClick={() => {
                        if (!isEditable) return;
                        setEditId(null);
                        setFormData({ academy_name: "", degree: "", start_year: "", end_year: "" });
                        setShowForm((s) => !s);
                    }}
                >
                    <Plus size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                </div>
            </div>

            {/* List */}
            {Array.isArray(educations) && educations.length > 0 ? (
                <div className="mt-3 space-y-3">
                    {educations.map((edu) => (
                        <div
                            key={edu.id}
                            className="relative p-4 border border-gray-200 rounded-[12px] bg-white"
                        >
                            {/* Actions — inside card, top-right */}
                            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Редактировать"
                                    className={`w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-full border bg-white flex items-center justify-center transition
                    ${isEditable ? "border-[#3066BE] hover:bg-[#F0F7FF] cursor-pointer" : "border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed"}`}
                                    onClick={() => { if (isEditable) handleEdit(edu); }}
                                    onKeyDown={(e) => {
                                        if (isEditable && (e.key === "Enter" || e.key === " ")) {
                                            e.preventDefault(); handleEdit(edu);
                                        }
                                    }}
                                >
                                    <Pencil size={16} strokeWidth={2} color={isEditable ? "#3066BE" : "#AFAFAF"} />
                                </div>

                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Удалить"
                                    className={`w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-full border bg-white flex items-center justify-center transition
                    ${isEditable ? "border-[#3066BE] hover:bg-[#F0F7FF] cursor-pointer" : "border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed"}`}
                                    onClick={() => { if (isEditable) handleDelete(edu.id); }}
                                    onKeyDown={(e) => {
                                        if (isEditable && (e.key === "Enter" || e.key === " ")) {
                                            e.preventDefault(); handleDelete(edu.id);
                                        }
                                    }}
                                >
                                    <Trash2 size={16} strokeWidth={2} color={isEditable ? "#3066BE" : "#AFAFAF"} />
                                </div>
                            </div>

                            {/* Content (leave room for icons) */}
                            <div className="pr-16">
                                <p className="text-[16px] font-semibold text-black">{edu.academy_name}</p>
                                <p className="text-[14px] text-[#666]">{edu.degree}</p>
                                <p className="text-[14px] text-[#999]">
                                    {edu.start_year} – {edu.end_year || "Hozirgacha"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-left text-[#AEAEAE] mt-4">Ma'lumotlar topilmadi.</p>
            )}

            {/* Form — add/edit */}
            {showForm && (
                <div className="mt-4 space-y-2 bg-white p-4 rounded-lg border border-gray-200">
                    <input
                        type="text"
                        placeholder="O‘quv maskani (academy_name)"
                        value={formData.academy_name}
                        onChange={(e) => setFormData({ ...formData, academy_name: e.target.value })}
                        className="w-full p-2 rounded-[10px] border text-black"
                    />
                    <input
                        type="text"
                        placeholder="Yo‘nalish (degree)"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full p-2 rounded-[10px] border text-black"
                    />
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Boshlanish (start_year)"
                            value={formData.start_year}
                            onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                            className="w-full p-2 rounded-[10px] border text-black"
                        />
                        <input
                            type="number"
                            placeholder="Tugash (end_year)"
                            value={formData.end_year}
                            onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                            className="w-full p-2 rounded-[10px] border text-black"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="bg-[#3066BE] text-white py-2 px-4 rounded-[10px]"
                            onClick={handleSave}
                        >
                            Saqlash
                        </button>
                        <button
                            className="border border-[#3066BE] text-[#3066BE] py-2 px-4 rounded-[10px] bg-white"
                            onClick={() => { setShowForm(false); setEditId(null); }}
                        >
                            Bekor qilish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
