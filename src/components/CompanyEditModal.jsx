import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function CompanyEditModal({ isOpen, onClose, company, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        industry: "",
        website: "",
        location: "",
    });

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || "",
                industry: company.industry || "",
                website: company.website || "",
                location: company.location || "",
            });
        }
    }, [company]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("access_token");
        try {
            await axios.patch(`http://localhost:8000/api/companies/${company.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onSuccess(); // parentni yangilash
            onClose();
        } catch (err) {
            console.error("Tahrirlashda xatolik:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white w-[500px] rounded-lg p-6 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
                    <X />
                </button>
                <h3 className="text-xl font-bold mb-4">Kompaniyani tahrirlash</h3>

                <input name="name" value={formData.name} onChange={handleChange} className="input mb-2" placeholder="Nomi" />
                <input name="industry" value={formData.industry} onChange={handleChange} className="input mb-2" placeholder="Sohasi" />
                <input name="website" value={formData.website} onChange={handleChange} className="input mb-2" placeholder="Sayt" />
                <input name="location" value={formData.location} onChange={handleChange} className="input mb-4" placeholder="Joylashuvi" />

                <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Saqlash</button>
            </div>
        </div>
    );
}
