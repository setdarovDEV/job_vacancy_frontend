// src/components/CreateCompanyModal.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function CreateCompanyModal({ onClose, onSuccess, company = null }) {
    const isEdit = Boolean(company);

    const [name, setName] = useState("");
    const [industry, setIndustry] = useState("");
    const [website, setWebsite] = useState("");
    const [location, setLocation] = useState("");
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        if (isEdit && company) {
            setName(company.name || "");
            setIndustry(company.industry || "");
            setWebsite(company.website || "");
            setLocation(company.location || "");
            setLogo(null); // eski logoni qayta yuborish shart emas
        }
    }, [company, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("industry", industry);
        formData.append("website", website);
        formData.append("location", location);
        if (logo) {
            formData.append("logo", logo);
        }

        try {
            let response;
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            if (isEdit) {
                response = await api.patch(`/api/companies/${company.id}/`, formData, config);
                alert("Kompaniya tahrirlandi!");
            } else {
                response = await api.post("/api/companies/", formData, config);
                alert("Kompaniya yaratildi!");
            }

            console.log("✅ Javob:", response.data);
            if (typeof onSuccess === "function") onSuccess();
            if (typeof onClose === "function") onClose();
        } catch (err) {
            console.error("❌ Xatolik:", err.response?.data || err.message);
            alert("Xatolik: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white text-black p-6 rounded-xl w-[500px] flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold">
                    {isEdit ? "Kompaniyani tahrirlash" : "Yangi Kompaniya Qo‘shish"}
                </h2>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nomi"
                    required
                    className="border px-3 py-2 rounded-[10px]"
                />
                <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Sohasi"
                    className="border px-3 py-2 rounded-[10px]"
                />
                <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website"
                    className="border px-3 py-2 rounded-[10px]"
                />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Joylashuv"
                    className="border px-3 py-2 rounded-[10px]"
                />

                <div className="relative w-full">
                    <input
                        type="file"
                        name="logo"
                        id="companyLogo"
                        onChange={(e) => setLogo(e.target.files[0])}
                        className="opacity-0 absolute z-50 w-full h-full cursor-pointer"
                    />
                    <div className="border border-[#3066BE] rounded-[10px] text-[#3066BE] bg-white px-4 py-2 text-center cursor-pointer">
                        {logo ? logo.name : "Logotip yuklash"}
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-[10px]"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#3066BE] text-white rounded-[10px]"
                    >
                        {isEdit ? "Saqlash" : "Qo‘shish"}
                    </button>
                </div>
            </form>
        </div>
    );
}
