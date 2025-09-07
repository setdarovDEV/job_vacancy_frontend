// SkillEditModal.jsx (yangi, soddalashtirilgan)
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../utils/api";

export default function SkillEditModal({ isOpen, onClose, skill, onSave }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        if (isOpen) {
            setName(skill?.name || "");
            setErr("");
        }
    }, [isOpen, skill]);

    if (!isOpen) return null;

// SkillEditModal.jsx ichidagi handleSubmit() ni shu bilan almashtir:
    const handleSubmit = async (e) => {
        e?.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) { setErr("Введите название навыка"); return; }

        try {
            setLoading(true);

            // <- marshrutni o'zingdagi routerga moslashtir:
            // Agar sendeda /skills/skills/ bo'lsa, quyidagiga "skills/skills/" deb yoz.
            const BASE = "/skills/skills/"; // yoki "skills/skills/"

            if (skill?.id) {
                // PATCH: faqat nomni yangilash
                await api.patch(`${BASE}${skill.id}/`, { name: trimmed });
            } else {
                // POST: backend BulkSkillSerializer kutadi
                await api.post(`${BASE}`, { skills: [trimmed] });
            }

            onSave?.();  // ro'yxatni qayta yuklash
            onClose?.(); // modalni yopish
        } catch (e) {
            console.error(e);
            setErr("Не удалось сохранить навык");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 md:p-6">
            <div className="w-full max-w-[420px] md:max-w-[500px] bg-white rounded-[16px] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="relative px-4 md:px-6 pt-4 md:pt-5 pb-3 md:pb-4 border-b border-[#E5E7EB] rounded-t-[inherit]">
                    <h3 className="text-center text-[18px] md:text-[20px] font-bold text-black">
                        {skill?.id ? "Изменить навык" : "Добавить навык"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center
                       w-8 h-8 rounded-full border border-[#3066BE] text-[#3066BE] hover:bg-[#F0F7FF] bg-white !p-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-4 md:px-6 py-5 space-y-4">
                    <label className="block text-[14px] md:text-[15px] font-semibold text-black">
                        Название навыка:
                    </label>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Например: React, Figma, Python"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 px-4 rounded-[10px] border border-[#D9D9D9] text-black outline-none focus:border-[#3066BE]"
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }}
                    />
                    {err && <p className="text-[12px] text-red-600">{err}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-4 border border-[#3066BE] text-[#3066BE] rounded-[10px] bg-white"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-10 px-5 bg-[#3066BE] text-white rounded-[10px] font-semibold disabled:opacity-60"
                        >
                            {skill?.id ? "Сохранить" : "Добавить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
