import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import api from "../../utils/api";

export default function CompanyModalMobile({ isOpen, onClose, onSuccess, company = null }) {
    const [formData, setFormData] = useState({
        name: "",
        industry: "",
        website: "",
        location: "",
        description: "",
    });

    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Edit mode uchun - mavjud kompaniya ma'lumotlarini yuklash
    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || "",
                industry: company.industry || "",
                website: company.website || "",
                location: company.location || "",
                description: company.description || "",
            });

            if (company.logo) {
                setLogoPreview(company.logo);
            }
            if (company.banner) {
                setBannerPreview(company.banner);
            }
        }
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Kompaniya nomini kiriting!");
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();
            data.append("name", formData.name);
            data.append("industry", formData.industry);
            data.append("website", formData.website);
            data.append("location", formData.location);
            data.append("description", formData.description);

            if (logoFile) {
                data.append("logo_file", logoFile);
            }
            if (bannerFile) {
                data.append("banner_file", bannerFile);
            }

            if (company) {
                // Update
                await api.patch(`/api/companies/${company.id}/`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("✅ Kompaniya yangilandi!");
            } else {
                // Create
                await api.post("/api/companies/", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("✅ Kompaniya yaratildi!");
            }

            onSuccess?.();
            onClose();

        } catch (error) {
            console.error("❌ Xatolik:", error);
            alert("Xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
            <div className="w-full max-h-[90vh] bg-white rounded-t-3xl overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-[18px] font-bold text-black">
                        {company ? "Редактировать компанию" : "Добавить компанию"}
                    </h2>
                    <button onClick={onClose} className="p-1">
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Logo Upload */}
                    <div>
                        <label className="block text-[14px] font-medium text-black mb-2">
                            Логотип
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload size={24} className="text-gray-400" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="flex-1 text-sm text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Banner Upload */}
                    <div>
                        <label className="block text-[14px] font-medium text-black mb-2">
                            Баннер
                        </label>
                        <div className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                            {bannerPreview ? (
                                <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Загрузить баннер</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerChange}
                            className="w-full mt-2 text-sm text-gray-600"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-[14px] font-medium text-black mb-2">
                            Название компании *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Например: Tech Solutions"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3066BE]"
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-[14px] font-medium text-black mb-2">
                            Отрасль
                        </label>
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            placeholder="Например: IT, Финансы"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3066BE]"
                        />
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-[14px] font-medium text-black mb-2">
                            Веб-сайт
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3066BE]"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-[14px] font-medium text-black mb-2">
                            Местоположение
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Например: Ташкент, Узбекистан"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3066BE]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[14px] font-medium text-black mb-2">
                            Описание
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Краткое описание компании..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3066BE] resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-[#3066BE] text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {loading ? "Сохранение..." : company ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}