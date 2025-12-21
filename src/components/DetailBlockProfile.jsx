import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import api from "../utils/api";

export default function DetailBlock({ title, salary, isEditable, viewOnly = false, targetUserId = null }) {
    const [inputValue, setInputValue] = useState("");
    const [salaryValue, setSalaryValue] = useState(salary || "0.00");
    const [aboutMe, setAboutMe] = useState("");

    const [editingField, setEditingField] = useState(null); // 'title' | 'salary' | 'about' | null

    // ✅ YANGI: targetUserId o'zgarganda ma'lumotlarni yuklash
    useEffect(() => {
        const loadUserData = async () => {
            if (viewOnly && targetUserId) {
                try {
                    console.log(`📡 Fetching profile for DetailBlock: ${targetUserId}`);
                    const res = await api.get(`/api/auth/profile/${targetUserId}/`);
                    console.log("✅ DetailBlock profile data:", res.data);
                    
                    setInputValue(res.data.title || res.data.job_title || "");
                    setSalaryValue(res.data.salary_usd || res.data.salary || "0.00");
                    setAboutMe(res.data.about_me || res.data.description || "");
                } catch (err) {
                    console.error("❌ DetailBlock profile yuklashda xatolik:", err);
                }
            } else {
                // Oddiy rejim - localStorage yoki prop'lardan
                const savedTitle = localStorage.getItem("user_title");
                if (savedTitle) {
                    setInputValue(savedTitle);
                } else {
                    setInputValue(title || "");
                }

                const savedSalary = localStorage.getItem("user_salary");
                if (savedSalary) {
                    setSalaryValue(savedSalary);
                } else {
                    setSalaryValue(salary || "0.00");
                }

                const savedAbout = localStorage.getItem("user_about_me");
                if (savedAbout) {
                    setAboutMe(savedAbout);
                }
            }
        };

        loadUserData();
    }, [title, salary, viewOnly, targetUserId]);

    const handleSaveTitle = async () => {
        if (viewOnly) return;
        try {
            await api.patch("/api/auth/update-title/", { title: inputValue });
            localStorage.setItem("user_title", inputValue);
        } catch (err) {
            console.error("Saqlashda xatolik:", err);
        } finally {
            setEditingField(null);
        }
    };

    const handleSaveSalary = async () => {
        if (viewOnly) return;
        try {
            await api.patch("/api/auth/update-salary/", { salary_usd: salaryValue });
            localStorage.setItem("user_salary", salaryValue);
        } catch (err) {
            console.error("Salary saqlashda xatolik:", err);
        } finally {
            setEditingField(null);
        }
    };

    const handleSaveAbout = async () => {
        if (viewOnly) return;
        try {
            await api.patch("/api/auth/update-about/", { about_me: aboutMe });
            localStorage.setItem("user_about_me", aboutMe);
        } catch (err) {
            console.error("About me saqlashda xatolik:", err);
        } finally {
            setEditingField(null);
        }
    };

    return (
        <div className="w-[762px] bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between relative">
                {/* === TITLE === */}
                <div className="flex items-center gap-[8px]">
                    {editingField === "title" ? (
                        <input
                            type="text"
                            className="text-[24px] font-bold border-b border-[#3066BE] rounded-[10px] text-black outline-none"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleSaveTitle}
                            autoFocus
                        />
                    ) : (
                        <h3 className="text-[24px] leading-[36px] font-bold text-black">
                            {inputValue}
                        </h3>
                    )}

                    {editingField === null && !viewOnly && (
                        <div
                            className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition ${
                                isEditable
                                    ? "border-[#3066BE] cursor-pointer bg-white"
                                    : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                            }`}
                            onClick={() => {
                                if (isEditable) setEditingField("title");
                            }}
                        >
                            <Pencil size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                        </div>
                    )}

                </div>

                {/* === SALARY === */}
                <div className="top-0 flex items-center gap-[8px]">
                    {editingField === "salary" ? (
                        <input
                            type="number"
                            step="0.01"
                            className="text-[24px] font-bold border-b rounded-[10px] text-black border-[#3066BE] outline-none w-[100px]"
                            value={salaryValue}
                            onChange={(e) => setSalaryValue(e.target.value)}
                            onBlur={handleSaveSalary}
                            autoFocus
                        />
                    ) : (
                        <p className="text-[24px] leading-[36px] font-bold text-black">
                            {salaryValue || "0.00"}$
                        </p>
                    )}

                    {editingField === null && !viewOnly && (
                        <div
                            className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition ${
                                isEditable
                                    ? "border-[#3066BE] cursor-pointer bg-white"
                                    : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                            }`}
                            onClick={() => {
                                if (isEditable) setEditingField("salary");
                            }}
                        >
                            <Pencil size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                        </div>
                    )}

                </div>
            </div>

            {/* === ABOUT ME === */}
            <div className="flex items-start justify-between mt-[60px]">
                {editingField === "about" ? (
                    <textarea
                        rows="4"
                        className="w-full border border-[#3066BE] rounded-[10px] p-2 text-black text-[16px] outline-none"
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        onBlur={handleSaveAbout}
                        autoFocus
                    />
                ) : (
                    <p className="text-[15px] leading-[30px] font-semibold text-[#AEAEAE] mb-[150px] max-w-[90%]">
                        {aboutMe || "Опишите свои сильные стороны и навыки"}
                    </p>
                )}

                {editingField === null && !viewOnly && (
                    <div
                        className={`w-[23px] h-[23px] rounded-full flex items-center justify-center transition ${
                            isEditable
                                ? "border-[#3066BE] cursor-pointer bg-white"
                                : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                        }`}
                        onClick={() => {
                            if (isEditable) setEditingField("about");
                        }}
                    >
                        <Pencil size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                    </div>
                )}

            </div>
        </div>
    );
}
