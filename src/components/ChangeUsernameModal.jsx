import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function ChangeUsernameModal({ currentUsername, onClose, onSuccess }) {
    const [currentUsernameValue, setCurrentUsernameValue] = useState(currentUsername || "");
    const [newUsername, setNewUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangeUsername = async () => {
        // Validation
        if (!currentUsernameValue.trim()) {
            toast.error("Введите текущий логин");
            return;
        }

        if (!newUsername.trim()) {
            toast.error("Введите новый логин");
            return;
        }

        if (newUsername.length < 3) {
            toast.error("Логин должен содержать минимум 3 символа");
            return;
        }

        if (currentUsernameValue === newUsername) {
            toast.error("Новый логин должен отличаться от текущего");
            return;
        }

        // Username validation (only letters, numbers, underscores)
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(newUsername)) {
            toast.error("Логин может содержать только буквы, цифры и подчеркивания");
            return;
        }

        try {
            setLoading(true);
            // Backend'ga username o'zgartirish uchun API chaqirish
            await api.patch("/api/auth/update-username/", {
                current_username: currentUsernameValue.trim(),
                new_username: newUsername.trim(),
            });
            toast.success("Имя пользователя успешно обновлено");
            onSuccess();
        } catch (err) {
            console.error("❌ Change username error:", err);
            const errorMessage = err.response?.data?.error || err.response?.data?.detail || "Ошибка изменения логина";
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
                        Изменение логина
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
                    {/* Current Username */}
                    <div>
                        <label className="block text-[14px] font-semibold text-black mb-2">
                            Текущий логин
                        </label>
                        <input
                            type="text"
                            value={currentUsernameValue}
                            onChange={(e) => setCurrentUsernameValue(e.target.value)}
                            placeholder="Текущий логин"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3066BE] text-black"
                        />
                    </div>

                    {/* New Username */}
                    <div>
                        <label className="block text-[14px] font-semibold text-black mb-2">
                            Новый логин
                        </label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Новый логин"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3066BE] text-black"
                        />
                        <p className="text-[12px] text-gray-500 mt-1">
                            Логин может содержать только буквы, цифры и подчеркивания
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleChangeUsername}
                        disabled={loading}
                        className="px-6 py-3 bg-[#3066BE] text-white rounded-xl font-semibold hover:bg-[#2757a4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Изменение..." : "Изменить логин"}
                    </button>
                </div>
            </div>
        </div>
    );
}







