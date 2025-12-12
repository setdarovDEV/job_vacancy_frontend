import React, {useState, useEffect} from "react";
import { Plus, Pencil, ArrowUpDown } from "lucide-react";
import DetailBlock from "./DetailBlockTablet.jsx";
import PortfolioCarousel from "./ProfileCaruselTablet.jsx";
import SkillEditModal from "../../components/SkillEditModal";
import ProfilePortfolioModal from "./ProfilePortfolioModalTablet.jsx";
import api from "../../utils/api";

export default function ProfileRightPane({
                                             isEditable,
                                             portfolioItems,
                                             skills,               // parentdan kelishi mumkin, lekin biz lokal state ham ishlatamiz
                                             selectedSkill,
                                             setSelectedSkill,
                                             isModalOpen,
                                             setIsModalOpen,
                                             handleSaveSkills,     // ixtiyoriy: parent refreshi bo'lsa chaqiramiz
                                             setIsPortfolioOpen,
                                         }) {
    // ✅ Lokal state: shu yerda ko'rsatamiz
    const [localSkills, setLocalSkills] = useState(Array.isArray(skills) ? skills : []);
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [skillsErr, setSkillsErr] = useState("");

    const reloadSkills = async () => {
        try {
            setSkillsLoading(true);
            setSkillsErr("");
            const { data } = await api.get("/api/skills/");   // faqat user skilleri
            setLocalSkills(Array.isArray(data) ? data : []);
        } catch (e) {
            setSkillsErr("Навыки не загрузились");
        } finally {
            setSkillsLoading(false);
        }
    };

    useEffect(() => { reloadSkills(); }, []);


    return (
        <div className="w-full md:w-[56%] md:pl-6 px-3 md:px-0 py-4 md:py-5 min-w-0">
            {/* Title / Salary / About */}
            <DetailBlock isEditable={isEditable} />

            {/* Divider — full-bleed (right pane) */}
            <div className="-mx-3 md:-ml-6 md:-mr-8 h-px bg-[#AEAEAE] my-6 md:my-8" />

            {/* Portfolio — tablet + empty state */}
            <div className="w-full bg-white rounded-xl p-4 md:p-5 lg:p-6 min-w-0">
                <div className="flex items-center justify-between gap-2 md:gap-3">
                    <h3 className="truncate text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#000] mb-1 md:mb-2">
                        Портфолио
                    </h3>

                    <div className="flex items-center gap-2">
                        {/* Add */}
                        <button
                            type="button"
                            onClick={() => { if (isEditable) setIsPortfolioOpen(true); }}
                            className={`${!isEditable ? "pointer-events-none" : ""}`}
                            aria-label="Добавить в портфолио"
                        >
                            <div className={`border w-[22px] h-[22px] md:w-[23px] md:h-[23px] rounded-full flex items-center justify-center transition
          ${isEditable ? "border-[#3066BE] cursor-pointer hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 opacity-50"}`}>
                                <Plus size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                            </div>
                        </button>
                    </div>
                </div>

                {Array.isArray(portfolioItems) && portfolioItems.length > 0 ? (
                    <div className="mt-3 md:mt-4 overflow-hidden">
                        <PortfolioCarousel items={portfolioItems} />
                    </div>
                ) : (
                    // EMPTY STATE — 3ta kulrang blok
                    <div className="mt-3 md:mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div className="rounded-xl bg-[#E5E7EB] h-[100px] md:h-[100px]" />
                        <div className="rounded-xl bg-[#E5E7EB] h-[100px] md:h-[100px]" />
                        <div className="rounded-xl bg-[#E5E7EB] h-[100px] md:h-[100px]" />
                    </div>
                )}
            </div>

            <ProfilePortfolioModal />

            <div className="-mx-3 md:-ml-6 md:-mr-8 h-px bg-[#AEAEAE] my-6 md:my-8" />


            <div className="w-full bg-white rounded-xl p-4">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                    <h3 className="text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#000]">Навыки</h3>
                    <button
                        type="button"
                        onClick={() => { if (isEditable){ setSelectedSkill(null); setIsModalOpen(true); } }}
                        className={`${!isEditable ? "pointer-events-none" : ""}`}
                    >
                        <div className={`border w-[22px] h-[22px] md:w-[23px] md:h-[23px] rounded-full flex items-center justify-center transition
              ${isEditable ? "border-[#3066BE] cursor-pointer hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 opacity-50"}`}>
                            <Plus size={16} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                        </div>
                    </button>
                </div>

                {skillsLoading ? (
                    <p className="text-sm text-[#AEAEAE]">Загрузка…</p>
                ) : skillsErr ? (
                    <p className="text-sm text-red-600">{skillsErr}</p>
                ) : localSkills.length === 0 ? (
                    <p className="text-sm text-[#AEAEAE]">У вас пока нет навыков. Добавьте первый.</p>
                ) : (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {localSkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="flex items-center gap-1 bg-[#D9D9D9] text-[12px] md:text-[13px] px-3 md:px-4 py-1 rounded-full border border-gray-300 text-black"
                            >
                                {skill.name}
                                <Pencil
                                    size={14}
                                    className={`${isEditable ? "cursor-pointer text-[#3066BE]" : "cursor-not-allowed text-gray-400"} ml-1`}
                                    onClick={() => { if (isEditable) { setSelectedSkill(skill); setIsModalOpen(true); } }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal: saqlangandan keyin qayta yuklaymiz */}
            <SkillEditModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedSkill(null); }}
                skill={selectedSkill}
                onSave={async () => {
                    await reloadSkills();          // lokal ro'yxatni yangilash
                    handleSaveSkills?.();          // agar parentda ham refresh bo'lsa
                }}
            />
        </div>
    );
}
