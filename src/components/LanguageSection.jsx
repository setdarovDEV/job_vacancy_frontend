import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import api from "../utils/api";

const LanguageSection = ({ isEditable }) => {
    const [languages, setLanguages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ language: "", level: "" });
    const [editId, setEditId] = useState(null);
    const [setIsEditable] = useState(false);


    useEffect(() => {
        api.get("/language/languages/")
            .then(res => {
                // ✅ DRF pagination bo‘lsa, results ichidan olamiz
                setLanguages(res.data.results || []);
            })
            .catch(err => console.error("Tillarni olishda xatolik:", err));
    }, []);


    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                const res = await api.patch(`/language/languages/${editId}/`, formData);
                setLanguages(languages.map(lang => lang.id === editId ? res.data : lang));
            } else {
                const res = await api.post("/language/languages/", formData);
                setLanguages([...languages, res.data]);
            }
            resetForm();
        } catch (err) {
            console.error("Saqlashda xatolik:", err);
        }
    };

    const resetForm = () => {
        setFormData({ language: "", level: "" });
        setEditId(null);
        setShowForm(false);
    };

    const handleAddClick = () => {
        setFormData({ language: "", level: "" });
        setEditId(null);
        setShowForm(true);
    };

    const handleEditClick = (lang) => {
        setFormData({ language: lang.language, level: lang.level });
        setEditId(lang.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Tilni o‘chirishga ishonchingiz komilmi?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/language/languages/${id}/`);
            setLanguages(languages.filter((lang) => lang.id !== id));
        } catch (err) {
            console.error("O‘chirishda xatolik:", err);
        }
    };

    return (
        <div className="px-3 md:px-0 py-3 md:py-4 mb-4 md:mb-6 rounded-xl">
            <div className="flex justify-between items-center">
                <h3 className="text-[16px] leading-[36px] font-bold text-black">Языки</h3>
                <div className="flex gap-2">
                    <div
                        className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition 
        ${isEditable
                            ? "border-[#3066BE] cursor-pointer bg-white hover:bg-[#F0F7FF]"
                            : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                        }`}
                        onClick={() => {
                            if (isEditable) handleAddClick();
                        }}
                    >
                        <Plus size={20} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                    </div>

                </div>
            </div>

            {/* Ro‘yxat */}
            <ul className="mt-2 space-y-1 text-[12px] leading-[22px] text-black font-normal">
                {Array.isArray(languages) && languages.map((lang) => (
                    <li
                        key={lang.id}
                        className="flex justify-between items-center text-[15px] leading-[22px] text-black font-medium"
                    >
                    <span>
                        {lang.language}: <span className="text-[#AEAEAE]">{lang.level}</span>
                    </span>

                        <div className="flex gap-2">
                            <div
                                className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition 
                                      ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 cursor-not-allowed bg-gray-100 opacity-50"}`}
                                onClick={() => {
                                    if (isEditable) handleEditClick(lang);
                                }}
                            >
                                <Pencil size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>
                            <div
                                className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition
                                      ${isEditable ? "border-[#3066BE] cursor-pointer bg-white" : "border-gray-300 cursor-not-allowed bg-gray-100 opacity-50"}`}
                                onClick={() => {
                                    if (isEditable) handleDelete(lang.id);
                                }}
                            >
                                <Trash2 size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>

                        </div>
                    </li>
                ))}
            </ul>

            {/* Forma */}
            {showForm && (
                <form onSubmit={handleSave} className="mt-1 space-y-2">
                    <input
                        type="text"
                        placeholder="Til nomi"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-2 py-1 border rounded-[10px] text-black text-sm"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Daraja (B2, родной язык)"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-2 py-1 border rounded-[10px] text-black text-sm"
                        required
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-[#3066BE] text-white text-sm  px-4 py-1 rounded-[10px]"
                        >
                            {editId ? "Сохранить" : "Добавить"}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-sm px-4 py-1 border-[#3066DE] text-[#3066DE] rounded-[10px]"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default LanguageSection;
