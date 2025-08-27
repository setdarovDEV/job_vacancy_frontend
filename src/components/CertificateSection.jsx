import React, { useState } from "react";
import { Plus } from "lucide-react";
import CertificateModal from "./CertificateModal.jsx";

export default function CertificateSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditable, setIsEditable] = useState(false);


    const handleSave = () => {
        // refresh qismni keyin qo‘shamiz, hozircha faqat console
        console.log("Yangi sertifikat saqlandi");
    };

    return (
        <div className="bg-white border-none rounded-xl p-6 mt-6">
            <div className="flex justify-between items-center">
                <h3 className="text-[24px] font-bold text-black">Sertifikatlar</h3>
                <button
                    onClick={() => {
                        if (isEditable) setIsModalOpen(true);
                    }}
                    className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition 
                    ${isEditable
                        ? "border-[#3066BE] bg-white hover:bg-[#F0F7FF] cursor-pointer"
                        : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                    }`}
                >
                    <Plus
                        size={20}
                        stroke={isEditable ? "#3066BE" : "#AFAFAF"}
                    />
                </button>

            </div>

            {/* Modal */}
            <CertificateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
}
