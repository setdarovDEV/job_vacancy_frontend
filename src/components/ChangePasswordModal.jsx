import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ChangePasswordModal({ onClose, onSuccess }) {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleChangePassword = async () => {
        // Validation
        if (!currentPassword.trim()) {
            toast.error("Введите текущий пароль");
            return;
        }

        if (!newPassword.trim()) {
            toast.error("Введите новый пароль");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Пароль должен содержать минимум 8 символов");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Пароли не совпадают");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error("Новый пароль должен отличаться от текущего");
            return;
        }

        try {
            setLoading(true);
            // Backend'ga parol o'zgartirish uchun API chaqirish
            await api.patch("/api/auth/change-password/", {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            toast.success("Пароль успешно изменен");
            onSuccess();
        } catch (err) {
            console.error("❌ Change password error:", err);
            const errorMessage = err.response?.data?.error || err.response?.data?.detail || "Ошибка изменения пароля";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        onClose();
        navigate("/forgot-password");
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] font-bold text-black">
                        Изменение пароля
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
                    {/* Current Password */}
                    <div>
                        <label className="block text-[14px] font-semibold text-black mb-2">
                            Текущий пароль
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Текущий пароль"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3066BE] text-black pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-[14px] font-semibold text-black mb-2">
                            Новый пароль
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Новый пароль"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3066BE] text-black pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-[14px] font-semibold text-black mb-2">
                            Введите пароль еще раз
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Введите пароль еще раз"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3066BE] text-black pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div>
                        <button
                            onClick={handleForgotPassword}
                            className="text-[#3066BE] text-[14px] hover:underline"
                        >
                            Забыли пароль?
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="px-6 py-3 bg-[#3066BE] text-white rounded-xl font-semibold hover:bg-[#2757a4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Изменение..." : "Изменить пароль"}
                    </button>
                </div>
            </div>
        </div>
    );
}

