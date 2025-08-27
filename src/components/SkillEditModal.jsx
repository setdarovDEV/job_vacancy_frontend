// components/SkillEditModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../utils/api";

export default function SkillEditModal({ isOpen, onClose = [], skill = null, onSave }) {
    const [skills, setSkills] = useState("");

    useEffect(() => {
        if (skill) {
            setSkills(skill.name); // Tahrirlash rejimi
        } else {
            setSkills(""); // Yangi qo‘shish rejimi
        }
    }, [skill]);

    const handleSave = async () => {
        try {
            if (skill) {
                // PATCH – mavjud skillni tahrirlash
                await api.patch(`/skills/skills/${skill.id}/`, {
                    name: skills,
                });

                onSave();  // signal
            } else {
                // POST – bir nechta skill qo‘shish
                const newSkills = skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);

                await api.post("/skills/skills/", {
                    skills: newSkills,
                });

                onSave();  // reload uchun signal
            }

            onClose();  // modalni yopish
        } catch (err) {
            console.error("Skill saqlashda xatolik:", err);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-[500px] relative">
                <button className="absolute bg-white border-none text-[#3066BE] right-4 top-4" onClick={onClose}>
                    <X />
                </button>
                <h2 className="text-lg font-bold mb-4">
                    {skill ? "Skillni tahrirlash" : "Yangi skill(lar) qo‘shish"}
                </h2>

                {skill ? (
                    <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full border border-[#3066BE] text-black rounded-[10px] p-2"
                        placeholder="Masalan: Adobe Illustrator"
                    />
                ) : (
                    <textarea
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full h-[120px] border border-[#3066BE] text-black rounded-[10px] p-2"
                        placeholder="Adobe Photoshop, UI/UX, Лого дизайн..."
                    />
                )}

                <button
                    onClick={handleSave}
                    className="mt-4 bg-[#3066BE] text-white px-6 py-2 rounded-[10px] hover:bg-[#2553a0] transition"
                >
                    Saqlash
                </button>
            </div>
        </div>
    );
}
