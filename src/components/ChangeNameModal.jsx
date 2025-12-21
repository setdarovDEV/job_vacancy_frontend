import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function ChangeNameModal({ currentFirstName, currentLastName, onClose, onSuccess }) {
    const [firstName, setFirstName] = useState(currentFirstName || "");
    const [lastName, setLastName] = useState(currentLastName || "");
    const [loading, setLoading] = useState(false);

    const handleChangeName = async () => {
        // Validation
        if (!firstName.trim() && !lastName.trim()) {
            toast.error("Введите имя или фамилию");
            return;
        }

        try {
            setLoading(true);
            // Backend'ga ism va familiya o'zgartirish uchun API chaqirish
            await api.patch("/api/auth/update-name/", {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
            });
            toast.success("Имя и фамилия успешно обновлены");
            onSuccess();
        } catch (err) {
            console.error("❌ Change name error:", err);
            const errorMessage = err.response?.data?.error || err.response?.data?.detail || "Ошибка изменения имени";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] font-bold text-black">
                        Изменение имени
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                    >
                        <X size={20} className="text-[#3066BE]" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* First Name */}
                    <div>
                        <label className="block text-[14px] font-semibold text-black mb-2">
                            Имя
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Введите имя"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3066BE] text-black"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-[14px] font-semibold text-black mb-2">
                            Фамилия
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Введите фамилию"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3066BE] text-black"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleChangeName}
                        disabled={loading}
                        className="px-6 py-3 bg-[#3066BE] text-white rounded-xl font-semibold hover:bg-[#2757a4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Изменение..." : "Изменить"}
                    </button>
                </div>
            </div>
        </div>
    );
}







