import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../utils/api";

export default function LanguageSection({ isEditable, viewOnly = false, targetUserId = null }) {
    const [languages, setLanguages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ language: "", level: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLanguages();
    }, [viewOnly, targetUserId]);

    const fetchLanguages = async () => {
        try {
            // ✅ ViewOnly mode uchun profile API, aks holda languages API
            const endpoint = viewOnly && targetUserId
                ? `/api/auth/profile/${targetUserId}/`
                : "/api/languages/";

            console.log("✅ Fetching languages from:", endpoint);
            const res = await api.get(endpoint);
            console.log("✅ Languages response:", res.data);

            // ✅ ViewOnly mode da profile ichidan, aks holda API dan
            if (viewOnly && targetUserId) {
                setLanguages(res.data.languages || []);
            } else {
                setLanguages(Array.isArray(res.data) ? res.data : (res.data.results || []));
            }
        } catch (err) {
            console.error("❌ Languages fetch error:", err.response?.data);
            setLanguages([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ ViewOnly mode da edit qilish mumkin emas
        if (viewOnly) {
            alert("Bu profilni tahrirlash mumkin emas!");
            return;
        }

        if (!formData.language.trim() || !formData.level.trim()) {
            alert("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        setLoading(true);

        try {
            if (editId) {
                await api.patch(`/api/languages/${editId}/`, formData);
                console.log("✅ Language updated");
            } else {
                await api.post("/api/languages/", formData);
                console.log("✅ Language created");
            }

            await fetchLanguages();
            handleCancel();
        } catch (err) {
            console.error("❌ Save error:", err.response?.data);
            alert(`Xatolik: ${JSON.stringify(err.response?.data)}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (lang) => {
        if (viewOnly) return;
        setFormData({ language: lang.language, level: lang.level });
        setEditId(lang.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (viewOnly) return;
        if (!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;

        try {
            await api.delete(`/api/languages/${id}/`);
            console.log("✅ Language deleted");
            await fetchLanguages();
        } catch (err) {
            console.error("❌ Delete error:", err.response?.data);
            alert("O'chirishda xatolik!");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({ language: "", level: "" });
        setEditId(null);
    };

    return (
        <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[24px] leading-[36px] font-bold text-black">Языки</h3>

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

            {/* Language List */}
            {languages.length > 0 ? (
                <div className="space-y-2">
                    {languages.map((lang) => (
                        <div
                            key={lang.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                        >
                            <div>
                                <p className="text-[15px] font-semibold text-black">{lang.language}</p>
                                <p className="text-[13px] text-gray-500">{lang.level}</p>
                            </div>

                            {/* ✅ Edit/Delete buttons - faqat edit mode va viewOnly emas */}
                            {isEditable && !viewOnly && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(lang)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <Pencil size={16} className="text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(lang.id)}
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
                <p className="text-gray-400 text-sm">Tillar qo'shilmagan</p>
            )}

            {/* Form Modal - faqat viewOnly emas bo'lsa */}
            {!viewOnly && showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[15px] w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4">
                            {editId ? "Tilni tahrirlash" : "Til qo'shish"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Til</label>
                                <input
                                    type="text"
                                    value={formData.language}
                                    onChange={(e) =>
                                        setFormData({ ...formData, language: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        color: '#000000',
                                        border: '1px solid #D1D5DB'
                                    }}
                                    placeholder="Masalan: English"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Daraja</label>
                                <input
                                    type="text"
                                    value={formData.level}
                                    onChange={(e) =>
                                        setFormData({ ...formData, level: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        color: '#000000',
                                        border: '1px solid #D1D5DB'
                                    }}
                                    placeholder="Masalan: B2"
                                    required
                                />
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