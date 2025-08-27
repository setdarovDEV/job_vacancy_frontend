import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
export default function ResetPasswordPage() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Parollar mos emas.");
            return;
        }

        try {
            await api.post("auth/password-reset-confirm/", {
                uid,
                token,
                password,
            });
            setSuccess("Parol muvaffaqiyatli tiklandi.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.detail || "Xatolik yuz berdi.");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <div className="bg-[#F4F6FA] rounded-[30px] shadow-md px-10 py-12 w-[430px]">
                <h2 className="text-[24px] font-bold text-center mb-8">Yangi parol</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="password"
                        placeholder="Yangi parol"
                        className="w-full border-0 border-b border-[#000] bg-[#F4F6FA] text-[16px] placeholder-[#777] focus:outline-none py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Parolni tasdiqlash"
                        className="w-full border-0 border-b border-[#000] bg-[#F4F6FA] text-[16px] placeholder-[#777] focus:outline-none py-2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-600 text-sm text-center">{success}</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#3066BE] text-white py-3 rounded-[12px] font-semibold hover:bg-[#2a58a6] transition"
                    >
                        Saqlash ➞
                    </button>
                </form>
            </div>
        </div>
    );
}
