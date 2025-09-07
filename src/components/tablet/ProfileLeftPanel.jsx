import React from "react";
import { Pencil } from "lucide-react";
import LanguageSection from "./LanguageSectionTablet.jsx";
import EducationSection from "./EducationSectionTablet.jsx";

export default function ProfileLeftPane({
                                            isEditable,
                                            workHours,
                                            isEditing,
                                            setIsEditing,
                                            tempValue,
                                            setTempValue,
                                            handleSave,
                                        }) {
    return (
        <div className="w-full md:w-[44%] md:pr-6">
            {/* Часов в неделю */}
            <div className="px-3 md:px-0 py-3 md:py-4 mb-4 md:mb-6 rounded-xl">
                <div className="grid grid-cols-[1fr_auto] items-center">
                    <h3 className="text-[16px] leading-[28px] md:leading-[30px] font-bold text-black">
                        Часов в неделю
                    </h3>
                    <div
                        className={`border w-[22px] h-[22px] md:w-[23px] md:h-[23px] rounded-full flex items-center justify-center transition
        ${isEditable ? "border-[#3066BE] cursor-pointer hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 opacity-50"}`}
                        onClick={() => {
                            if (isEditable) {
                                setTempValue(workHours);
                                setIsEditing(true);
                            }
                        }}
                    >
                        <Pencil size={15} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                    </div>
                </div>

                <div className="mt-2 md:mt-3">
                    {isEditing ? (
                        <div className="flex flex-col items-start gap-2 md:gap-3">
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="h-9 md:h-10 w-full md:w-48 border border-gray-300 rounded-[10px] px-3 text-[12px] md:text-[14px] font-medium text-black"
                            />
                            <div className="flex gap-2 md:gap-3">
                                <button
                                    onClick={handleSave}
                                    className="h-9 md:h-10 px-3 md:px-4 bg-[#3066BE] text-white text-[12px] md:text-[13px] rounded-[10px]"
                                >
                                    Сохранить
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="h-9 md:h-10 px-3 md:px-4 border border-[#3066BE] text-[#3066BE] text-[12px] md:text-[13px] rounded-[10px] bg-white"
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>

                    ) : (
                        <>
                            <p className="text-[12px] leading-[20px] md:leading-[22px] text-black font-medium">
                                {workHours}
                            </p>
                            <p className="text-[10px] leading-[20px] text-[#AEAEAE] mt-1 font-medium">
                                Открыт для заключения контракта на найм
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Языки */}
            <LanguageSection isEditable={isEditable} />

            {/* Образование */}
            <EducationSection isEditable={isEditable} />
        </div>
    );
}
