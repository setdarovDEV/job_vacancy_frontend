import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../utils/api";

export default function SkillEditModal({ isOpen, onClose, skill, initialSkills, onSave }) {
    const [skillName, setSkillName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (skill) {
            setSkillName(skill.name || "");
        } else {
            setSkillName("");
        }
    }, [skill, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!skillName.trim()) {
            setError("Навык не может быть пустым");
            return;
        }

        try {
            if (skill) {
                // 🔄 OLDIN DELETE + POST edi – endi oddiy PATCH
                console.log("📝 Updating skill:", skill.id);

                await api.patch(`/api/skills/${skill.id}/`, {
                    name: skillName.trim(),
                });

                console.log("✅ Skill updated");
            } else {
                // ➕ Yangi skill qo‘shish – o‘sha eski logika
                console.log("➕ Adding new skill:", skillName);

                await api.post("/api/skills/", {
                    skills: [skillName.trim()],
                });

                console.log("✅ Skill added!");
            }

            onSave();
            setSkillName("");
            onClose();
        } catch (err) {
            console.error("❌ Error:", err);
            console.error("❌ Response:", err.response?.data);

            const errorMsg = err.response?.data?.skills
                ? err.response.data.skills[0]
                : err.response?.data?.name
                    ? err.response.data.name[0]
                    : "Произошла ошибка";

            setError(errorMsg);
        }
    };

    const handleDelete = async () => {
        if (!skill) return;

        if (!window.confirm(`Удалить навык "${skill.name}"?`)) {
            return;
        }

        try {
            console.log("🗑️ Deleting skill:", skill.id);

            await api.delete(`/api/skills/${skill.id}/`);

            console.log("✅ Skill deleted!");

            onSave();
            onClose();
        } catch (err) {
            console.error("❌ Delete error:", err);
            setError("Не удалось удалить навык");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[15px] w-[400px] p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {skill ? "Изменить навык" : "Добавить навык"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Название навыка:
                        </label>
                        <input
                            type="text"
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            placeholder="Например: Python, React, Node.js"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            autoFocus
                            style={{
                                backgroundColor: '#FFFFFF',
                                color: '#000000'
                            }}
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-between gap-3">
                        {skill && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Удалить
                            </button>
                        )}

                        <div className="flex gap-3 ml-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#3066BE] text-white rounded-lg hover:bg-[#2452a6]"
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}