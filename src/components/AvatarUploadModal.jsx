import React, { useState, useRef } from "react";
import api from "../utils/api";

export default function ChangeProfileImageModal({ onClose, onSuccess, setProfileImage }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("profile_image", selectedFile);

        try {
            const response = await api.patch(
                "/api/auth/profile/update-photo/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const imagePath = response?.data?.image;
            if (imagePath) {
                const newImageUrl = `${imagePath}?t=${Date.now()}`;
                setProfileImage(newImageUrl);
                localStorage.setItem("profile_image", newImageUrl);
                onSuccess?.(newImageUrl);
                onClose?.();
            } else {
                alert("Rasm muvaffaqiyatli yuklanmadi. Qayta urinib ko‘ring.");
            }

        } catch (error) {
            console.error("Rasm yuklashda xatolik:", error);
            alert("Rasmni yuklashda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg p-6 w-[400px] shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-center">Profil rasmni yangilash</h2>

                {/* Rasm tanlash */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={triggerFileInput}
                        className="w-full py-3 bg-white border border-black hover:bg-gray-100 rounded-lg font-semibold text-black"
                    >
                        + Rasmni tanlang
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                </div>

                {/* Preview rasm */}
                {preview && (
                    <div className="flex justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover mb-4 border"
                        />
                    </div>
                )}

                {/* Tugmalar */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-[#3066BE] bg-white rounded-[10px] text-[#3066BE] hover:bg-gray-100"
                    >
                        Bekor qilish
                    </button>
                    <button
                        disabled={loading || !selectedFile}
                        onClick={handleUpload}
                        className="px-4 py-2 bg-[#3066BE] text-white rounded-[10px] hover:bg-[#2452a6]"
                    >
                        {loading ? "Yuklanmoqda..." : "Saqlash"}
                    </button>
                </div>
            </div>
        </div>
    );
}
