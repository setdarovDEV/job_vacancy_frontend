// CertificateModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CertificateModalEdit({ isOpen, onClose, onSave, editMode = false, initialData = {} }) {
    const [name, setName] = useState("");
    const [organization, setOrganization] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (editMode && initialData) {
            setName(initialData.name || "");
            setOrganization(initialData.organization || "");
            setIssueDate(initialData.issue_date || "");
        } else {
            setName("");
            setOrganization("");
            setIssueDate("");
            setFile(null);
        }
    }, [isOpen, editMode, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("organization", organization);
        formData.append("issue_date", issueDate);
        if (file) formData.append("file", file); // Faqat yangilansa

        onSave(formData); // parentga yuboriladi
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-[500px] p-6 rounded-[15px] relative">
                <button onClick={onClose} className="absolute top-4 right-4">
                    <X />
                </button>

                <h2 className="text-[20px] font-bold mb-4">
                    {editMode ? "Сертификатни тахрирлаш" : "Сертификат қўшиш"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="text" placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded px-4 py-2" required />
                    <input type="text" placeholder="Организация" value={organization} onChange={(e) => setOrganization(e.target.value)} className="border border-gray-300 rounded px-4 py-2" required />
                    <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="border border-gray-300 rounded px-4 py-2" required />
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border border-gray-300 rounded px-4 py-2" accept=".pdf,image/*" />
                    <button type="submit" className="bg-[#3066BE] text-white py-2 rounded hover:bg-[#2552a3] transition">
                        {editMode ? "Сақлаш" : "Қўшиш"}
                    </button>
                </form>
            </div>
        </div>
    );
}
