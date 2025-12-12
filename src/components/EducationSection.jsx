import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../utils/api";

export default function EducationSection({ isEditable, viewOnly = false, targetUserId = null }) {
    const [educations, setEducations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        academy_name: "",
        degree: "",
        start_year: "",
        end_year: "",
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEducations();
    }, [viewOnly, targetUserId]);

    const fetchEducations = async () => {
        try {
            // ✅ ViewOnly mode uchun profile API, aks holda education API
            const endpoint = viewOnly && targetUserId
                ? `/api/auth/profile/${targetUserId}/`
                : "/api/education/";

            console.log("✅ Fetching education from:", endpoint);
            const res = await api.get(endpoint);
            console.log("✅ Education response:", res.data);

            // ✅ ViewOnly mode da profile ichidan, aks holda API dan
            if (viewOnly && targetUserId) {
                setEducations(res.data.education || []);
            } else {
                setEducations(Array.isArray(res.data) ? res.data : (res.data.results || []));
            }
        } catch (err) {
            console.error("❌ Education fetch error:", err.response?.data);
            setEducations([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ ViewOnly mode da edit qilish mumkin emas
        if (viewOnly) {
            alert("Bu profilni tahrirlash mumkin emas!");
            return;
        }

        if (!formData.academy_name.trim() || !formData.degree.trim()) {
            alert("Iltimos, kamida akademiya va yo'nalishni kiriting!");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                academy_name: formData.academy_name,
                degree: formData.degree,
                start_year: formData.start_year ? parseInt(formData.start_year) : null,
                end_year: formData.end_year ? parseInt(formData.end_year) : null,
            };

            if (editId) {
                await api.put(`/api/education/${editId}/`, payload);
                console.log("✅ Education updated");
            } else {
                await api.post("/api/education/", payload);
                console.log("✅ Education created");
            }

            await fetchEducations();
            handleCancel();
        } catch (err) {
            console.error("❌ Save error:", err.response?.data);
            alert(`Xatolik: ${JSON.stringify(err.response?.data)}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (edu) => {
        if (viewOnly) return;
        setFormData({
            academy_name: edu.academy_name,
            degree: edu.degree,
            start_year: edu.start_year || "",
            end_year: edu.end_year || "",
        });
        setEditId(edu.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (viewOnly) return;
        if (!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;

        try {
            await api.delete(`/api/education/${id}/`);
            console.log("✅ Education deleted");
            await fetchEducations();
        } catch (err) {
            console.error("❌ Delete error:", err.response?.data);
            alert("O'chirishda xatolik!");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({
            academy_name: "",
            degree: "",
            start_year: "",
            end_year: "",
        });
        setEditId(null);
    };

    return (
        <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[24px] leading-[36px] font-bold text-black">Образование</h3>

                {/* ✅ Plus button - faqat edit mode va viewOnly emas */}
                {isEditable && !viewOnly && (
                    <div
                        onClick={() => setShowForm(true)}
                        className="w-[23px] h-[23px] rounded-full flex items-center justify-center border-[#3066BE] cursor-pointer bg-white hover:bg-[#3066BE]/10 transition"
                    >
                        <Plus size={25} stroke="#3066BE" />
                    </div>
                )}
            </div>

            {/* Education List */}
            {educations.length > 0 ? (
                <div className="space-y-3">
                    {educations.map((edu) => (
                        <div
                            key={edu.id}
                            className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                        >
                            <div>
                                <p className="text-[15px] font-semibold text-black">
                                    {edu.academy_name}
                                </p>
                                <p className="text-[13px] text-gray-600">{edu.degree}</p>
                                <p className="text-[12px] text-gray-400">
                                    {edu.start_year} - {edu.end_year || "Hozir"}
                                </p>
                            </div>

                            {/* ✅ Edit/Delete buttons - faqat edit mode va viewOnly emas */}
                            {isEditable && !viewOnly && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(edu)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <Pencil size={16} className="text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(edu.id)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <Trash2 size={16} className="text-red-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm">Ma'lumotlar topilmadi</p>
            )}

            {/* Form Modal - faqat viewOnly emas bo'lsa */}
            {!viewOnly && showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[15px] w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4">
                            {editId ? "Ta'limni tahrirlash" : "Ta'lim qo'shish"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    O'quv muassasasi *
                                </label>
                                <input
                                    type="text"
                                    value={formData.academy_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, academy_name: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        color: '#000000',
                                        border: '1px solid #D1D5DB'
                                    }}
                                    placeholder="Masalan: BMG Soft"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Yo'nalish *
                                </label>
                                <input
                                    type="text"
                                    value={formData.degree}
                                    onChange={(e) =>
                                        setFormData({ ...formData, degree: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        color: '#000000',
                                        border: '1px solid #D1D5DB'
                                    }}
                                    placeholder="Masalan: IT"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Boshlanish yili
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.start_year}
                                        onChange={(e) =>
                                            setFormData({ ...formData, start_year: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            color: '#000000',
                                            border: '1px solid #D1D5DB'
                                        }}
                                        placeholder="2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Tugash yili
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.end_year}
                                        onChange={(e) =>
                                            setFormData({ ...formData, end_year: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            color: '#000000',
                                            border: '1px solid #D1D5DB'
                                        }}
                                        placeholder="2026"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        color: '#3066BE',
                                        border: '2px solid #3066BE'
                                    }}
                                    className="flex-1 px-4 py-2 rounded-[10px] hover:bg-gray-50 font-semibold transition"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        backgroundColor: '#3066BE',
                                        color: '#FFFFFF',
                                        border: 'none'
                                    }}
                                    className="flex-1 px-4 py-2 rounded-[10px] hover:bg-[#2452a6] disabled:opacity-50 font-semibold transition"
                                >
                                    {loading ? "Yuklanmoqda..." : editId ? "Saqlash" : "Добавить"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}