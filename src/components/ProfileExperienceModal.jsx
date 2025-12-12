import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../utils/api";

export default function ProfileExperienceModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        company_name: "",
        city: "",
        country: "",
        position: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
    });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // ✅ Agar checkbox belgilansa, end_date ni bo'shatish
        if (name === 'is_current' && checked) {
            setFormData(prev => ({
                ...prev,
                end_date: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            // ✅ Ma'lumotlarni tayyorlash
            const dataToSend = {
                company_name: formData.company_name,
                position: formData.position,
                start_date: formData.start_date,
                is_current: formData.is_current,
            };

            // ✅ Optional fields - faqat bo'sh bo'lmasa qo'shish
            if (formData.city) {
                dataToSend.city = formData.city;
            }

            if (formData.country) {
                dataToSend.country = formData.country;
            }

            if (formData.description) {
                dataToSend.description = formData.description;
            }

            // ✅ end_date - faqat is_current false bo'lsa va bo'sh bo'lmasa
            if (!formData.is_current && formData.end_date) {
                dataToSend.end_date = formData.end_date;
            }
            // ✅ Agar is_current true bo'lsa, end_date yubormaslik (omit)

            console.log("📤 Experience yuborilmoqda:", dataToSend);

            await api.post("/api/experiences/", dataToSend);

            console.log("✅ Experience saqlandi!");

            // Reset form
            setFormData({
                company_name: "",
                city: "",
                country: "",
                position: "",
                start_date: "",
                end_date: "",
                is_current: false,
                description: "",
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error("❌ Xatolik:", err);
            console.error("❌ Response:", err.response?.data);

            if (err.response?.data) {
                setErrors(err.response.data);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[15px] w-[800px] max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">Добавить опыт работы</h2>

                <form onSubmit={handleSubmit}>
                    {/* Company */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Компания: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="Нап. Google, Microsoft"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            required
                            style={{
                                backgroundColor: '#FFFFFF',
                                color: '#000000'
                            }}
                        />
                        {errors.company_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
                        )}
                    </div>

                    {/* City & Country */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Город:</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Введите город"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#000000'
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Страна:</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Введите страну"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#000000'
                                }}
                            />
                        </div>
                    </div>

                    {/* Position */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Заголовок: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder="Нап. Frontend разработчик"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            required
                            style={{
                                backgroundColor: '#FFFFFF',
                                color: '#000000'
                            }}
                        />
                        {errors.position && (
                            <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Дата начала: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                required
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#000000'
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Дата окончания:
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                disabled={formData.is_current}
                                style={{
                                    backgroundColor: formData.is_current ? '#F3F4F6' : '#FFFFFF',
                                    color: '#000000',
                                    cursor: formData.is_current ? 'not-allowed' : 'text'
                                }}
                            />
                        </div>
                    </div>

                    {/* ✅ CHECKBOX - KO'RINADIGAN! */}
                    <div className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <div className="relative flex-shrink-0">
                                <input
                                    type="checkbox"
                                    name="is_current"
                                    checked={formData.is_current}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#3066BE] peer-checked:border-[#3066BE] flex items-center justify-center transition cursor-pointer">
                                    {formData.is_current && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm font-medium">
                                Сейчас я работаю здесь
                            </span>
                        </label>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Описание (не обязательно):
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Напишите..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            style={{
                                backgroundColor: '#FFFFFF',
                                color: '#000000'
                            }}
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-[#3066BE] text-white py-3 rounded-lg font-semibold hover:bg-[#2452a6] transition"
                    >
                        Публиковать
                    </button>
                </form>
            </div>
        </div>
    );
}