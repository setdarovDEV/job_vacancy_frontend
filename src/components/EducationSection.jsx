import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../utils/api";

export default function EducationSection({isEditable}) {
    const [educations, setEducations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        academy_name: "",
        degree: "",
        start_year: "",
        end_year: "",
    });
    const [editId, setEditId] = useState(null);
    const [setIsEditable] = useState(false);


    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            const res = await api.get("/education/education/");
            console.log("BACKEND RESPONSE:", res.data.results); // endi to‘g‘ri bo‘ladi
            setEducations(res.data.results);
        } catch (err) {
            console.error("Ma'lumot olishda xatolik:", err);
        }
    };

    const handleSave = async () => {
        try {
            if (editId) {
                await api.put(`/education/education/${editId}/`, formData);
            } else {
                await api.post("/education/education/", formData);
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
        setFormData(edu);
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
            <div className="flex justify-between items-center">
                <h3 className="text-[24px] leading-[36px] font-bold text-black">Образование</h3>
                <div className="flex gap-2">
                    <div
                        className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition 
              ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"}`}
                        onClick={() => {
                            if (isEditable) {
                                setEditId(null);
                                setFormData({ academy_name: "", degree: "", start_year: "", end_year: "" });
                                setShowForm(!showForm);
                            }
                        }}
                    >
                        <Plus size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                    </div>
                </div>
            </div>

            {Array.isArray(educations) && educations.length > 0 ? (
                educations.map((edu) => (
                    <div key={edu.id} className="mt-4 p-4 border border-gray-200 rounded-[10px] bg-white shadow-sm">
                        <p className="text-[16px] font-semibold text-black">{edu.academy_name}</p>
                        <p className="text-[14px] text-[#666]">{edu.degree}</p>
                        <p className="text-[14px] text-[#999]">
                            {edu.start_year} – {edu.end_year || "Hozirgacha"}
                        </p>

                        <div className="flex gap-2">
                            <div
                                className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition 
                                      ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 cursor-not-allowed bg-gray-100 opacity-50"}`}
                                onClick={() => {
                                    if (isEditable) handleEdit(edu);
                                }}
                            >
                                <Pencil size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>
                            <div
                                className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition 
                                      ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"}`}
                                onClick={() => {
                                    if (isEditable) handleDelete(edu.id);
                                }}
                            >
                                <Trash2 size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>

                        </div>
                    </div>
                ))
            ) : (
                <p className="text-left text-[#AEAEAE] mt-4">Ma'lumotlar topilmadi.</p>
            )}

            {/* FORM — Add/Edit */}
            {showForm && (
                <div className="mt-4 space-y-2 bg-white p-4 rounded-lg">
                    <input
                        type="text"
                        placeholder="Ishxona nomi"
                        value={formData.academy_name}
                        onChange={(e) => setFormData({ ...formData, academy_name: e.target.value })}
                        className="w-full p-2 rounded-[10px] border text-black"
                    />
                    <input
                        type="text"
                        placeholder="Yo'nalish"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full p-2 rounded-[10px] border text-black"
                    />
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Boshlanish yili"
                            value={formData.start_year}
                            onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                            className="w-full p-2 rounded-[10px] border text-black"
                        />
                        <input
                            type="number"
                            placeholder="Tugash yili"
                            value={formData.end_year}
                            onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                            className="w-full p-2 rounded-[10px] border text-black"
                        />
                    </div>
                    <button
                        className="bg-[#3066BE] text-white py-2 px-4 rounded-[10px]"
                        onClick={handleSave}
                    >
                        Saqlash
                    </button>
                </div>
            )}
        </div>
    );
}
