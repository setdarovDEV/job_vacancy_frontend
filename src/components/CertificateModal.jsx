// components/CertificateModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export default function CertificateModal({ isOpen, onClose, onSave }) {
    const [name, setName] = useState("");
    const [organization, setOrganization] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [file, setFile] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("organization", organization);
        formData.append("issue_date", issueDate);
        formData.append("file", file);
        onSave(formData); // parentga yuboriladi
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-[500px] p-6 rounded-[15px] relative">
                {/* Close icon */}
                <button onClick={onClose} className="absolute top-4 bg-white border-none text-[#3066BE] right-4">
                    <X />
                </button>

                <h2 className="text-[20px] font-bold mb-4">Сертификат добавить</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Название"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-[#3066BE] text-black rounded-[10px] px-4 py-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Организация"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="border border-[#3066BE] text-black rounded-[10px] px-4 py-2"
                        required
                    />
                    <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="border border-[#3066BE] text-black rounded-[10px] px-4 py-2"
                        required
                    />
                    <label className="cursor-pointer border w-[452px] border-[#3066BE] px-6 py-3 rounded-[10px] text-center block mx-auto text-[14px] font-medium text-black hover:bg-gray-100 transition">
                        + Rasmni tanlang
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />
                    </label>

                    <button
                        type="submit"
                        className="bg-[#3066BE] text-white py-2 rounded hover:bg-[#2552a3] transition"
                    >
                        Сохранить
                    </button>
                </form>
            </div>
        </div>
    );
}
