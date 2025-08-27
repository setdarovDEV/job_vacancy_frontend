import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../utils/api";

export default function ProfileExperienceModal({
    isOpen,
    onClose,
    onSave = () => {},
    editMode = false,
    initialData = {},
}) {
    const [company, setCompany] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [position, setPosition] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [currentlyWorking, setCurrentlyWorking] = useState(false);

    useEffect(() => {
        if (editMode && initialData) {
            setCompany(initialData.company_name || "");
            setCity(initialData.city || "");
            setCountry(initialData.country || "");
            setPosition(initialData.position || "");
            setStartDate(initialData.start_date || "");
            setEndDate(initialData.end_date || "");
            setDescription(initialData.description || "");
            setCurrentlyWorking(!initialData.end_date);
        } else {
            setCompany("");
            setCity("");
            setCountry("");
            setPosition("");
            setStartDate("");
            setEndDate("");
            setDescription("");
            setCurrentlyWorking(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            company_name: company,
            position: position,
            start_date: startDate,
            end_date: currentlyWorking ? null : endDate,
            description: description,
            city,
            country,
        };

        try {
            if (editMode) {
                await api.patch(`/experience/experiences/${initialData.id}/`, payload);
            } else {
                await api.post("/experience/experiences/", payload);
            }

            onSave(payload);
            onClose();
        } catch (err) {
            console.error("Xatolik:", err);
            alert("Xatolik yuz berdi");
        }
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center text-black">
            <div className="bg-white w-[1110px] h-[850px] rounded-[10px] shadow-lg px-10 py-8 relative overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-[25px] right-6 bg-white border-none text-[#3066BE]"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h3 className="text-[24px] leading-[36px] ml-[353px] font-bold text-[#000000]">
                    {editMode ? "Редактировать опыт работы" : "Добавить опыт работы"}
                </h3>

                <div className="w-full h-[1px] bg-[#AEAEAE] my-6"></div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Компания */}
                    <div>
                        <label className="block font-semibold mb-2">Компания:</label>
                        <input
                            type="text"
                            placeholder="Нап. Google, Microsoft"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full h-[42px] px-4 border border-black rounded-[10px]"
                            required
                        />
                    </div>

                    {/* Город и Страна */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block font-semibold mb-2">Город:</label>
                            <input
                                type="text"
                                placeholder="Введите город"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full h-[42px] px-4 border border-black rounded-[10px]"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block font-semibold mb-2">Страна:</label>
                            <input
                                type="text"
                                placeholder="Введите страну"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full h-[42px] px-4 border border-black rounded-[10px]"
                            />
                        </div>
                    </div>

                    {/* Заголовок */}
                    <div>
                        <label className="block font-medium mb-2">Заголовок:</label>
                        <input
                            type="text"
                            placeholder="Нап. frontend разработчик"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full h-[42px] px-4 border border-black rounded-[10px]"
                            required
                        />
                    </div>

                    {/* Дата */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block font-semibold mb-2">Дата начала:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full h-[42px] px-4 border border-black rounded-[10px]"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block font-semibold mb-2">Дата окончания:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full h-[42px] px-4 border border-black rounded-[10px]"
                                disabled={currentlyWorking}
                            />
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={currentlyWorking}
                            onChange={() => setCurrentlyWorking(!currentlyWorking)}
                            className="w-4 h-4"
                        />
                        <label className="font-semibold">Сейчас я работаю здесь</label>
                    </div>

                    {/* Описание */}
                    <div>
                        <label className="block font-semibold mb-2">Описание (не обязательно):</label>
                        <textarea
                            placeholder="Напишите..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-[148px] border border-black rounded-[10px] px-4 py-2 text-[14px]"
                        />
                    </div>

                    {/* Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="w-[222px] h-[59px] bg-[#3066BE] text-white rounded-[10px] font-semibold text-[16px] hover:bg-[#2a58a6] transition"
                        >
                            {editMode ? "Сохранить" : "Публиковать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
