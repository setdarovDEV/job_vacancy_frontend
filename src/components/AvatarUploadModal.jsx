import React, { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import api from "../utils/api";

export default function AvatarUploadModal({ isOpen, onClose, setProfileImage }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef();

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Faqat rasm fayllari qabul qilinadi!");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
            return;
        }

        setError("");
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Iltimos, avval rasm tanlang!");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("profile_image", selectedFile);

        try {
            console.log("📤 Avatar yuklanmoqda...");

            const response = await api.patch("/api/auth/profile/update-photo/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("✅ Response:", response.data);

            // Backend'dan kelgan rasm URL'ini olish
            const imagePath = response.data.profile_image || response.data.image;

            if (imagePath) {
                // To'liq URL yaratish
                const baseURL = api.defaults.baseURL || "http://127.0.0.1:8000";
                const fullImageUrl = imagePath.startsWith("http")
                    ? imagePath
                    : `${baseURL}${imagePath}`;

                console.log("🖼️ Yangi avatar URL:", fullImageUrl);

                // State'ni yangilash
                setProfileImage(fullImageUrl);
                localStorage.setItem("profile_image", fullImageUrl);

                // Modal'ni yopish
                onClose();

                // Page'ni reload qilish (yangi rasmni ko'rish uchun)
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                throw new Error("Backend'dan rasm URL kelmadi");
            }

        } catch (err) {
            console.error("❌ Avatar yuklashda xatolik:", err);
            console.error("Response:", err.response?.data);

            const errorMsg = err.response?.data?.detail
                || err.response?.data?.error
                || err.response?.data?.profile_image?.[0]
                || "Rasmni yuklashda xatolik yuz berdi";

            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreview(null);
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[15px] w-full max-w-[500px] shadow-2xl">
                {/* Header */}
                <div className="relative px-6 py-4 border-b border-gray-200">
                    <h2 className="text-[20px] font-bold text-black text-center">
                        Profil rasmini yangilash
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
                        aria-label="Yopish"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-4">
                    {/* Preview */}
                    {preview ? (
                        <div className="flex justify-center">
                            <div className="relative w-32 h-32">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                                <button
                                    onClick={() => {
                                        setPreview(null);
                                        setSelectedFile(null);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <Upload size={32} className="text-gray-400" />
                            </div>
                        </div>
                    )}

                    {/* File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Select Button */}
                    <button
                        onClick={triggerFileInput}
                        disabled={loading}
                        style={{
                            backgroundColor: '#FFFFFF',
                            color: '#3066BE',
                            border: '2px solid #3066BE'
                        }}
                        className="w-full py-3 rounded-[10px] font-semibold hover:bg-[#F0F7FF] transition disabled:opacity-50"
                    >
                        {selectedFile ? "Boshqa rasm tanlash" : "Rasmni tanlang"}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* File Info */}
                    {selectedFile && (
                        <div className="p-3 bg-gray-50 rounded-[10px]">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Fayl:</span> {selectedFile.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Hajmi:</span> {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        style={{
                            backgroundColor: '#FFFFFF',
                            color: '#4B5563',
                            border: '2px solid #D1D5DB'
                        }}
                        className="flex-1 py-3 rounded-[10px] font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={loading || !selectedFile}
                        style={{
                            backgroundColor: '#3066BE',
                            color: '#FFFFFF',
                            border: 'none'
                        }}
                        className="flex-1 py-3 rounded-[10px] font-semibold hover:bg-[#2452a6] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Yuklanmoqda...
                            </>
                        ) : (
                            "Saqlash"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}