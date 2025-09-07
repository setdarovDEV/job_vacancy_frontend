import React, { useEffect, useState } from "react";
import { X, Star, ChevronDown, ChevronUp } from "lucide-react";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter.jsx";

export default function CompaniesFilterFullModal({
                                                     open,
                                                     onClose = () => {},
                                                     // existing states (lifted from parent):
                                                     query, setQuery,
                                                     location, setLocation,
                                                     keyword, setKeyword,
                                                     rating, setRating,
                                                     size, setSize,
                                                     // callbacks:
                                                     onApply = () => {},
                                                     onClear = () => {},
                                                 }) {
    const [showRoles, setShowRoles] = useState(true);
    const ROLES = ["Администрация", "Дизайн", "Образование", "Маркетинг", "Разработка"];

    if (!open) return null;

    const blue = "#2B50A4";

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            {/* NAVBAR (sening komponenting) */}
            <MobileNavbar />

            {/* Top title row (screenshotga mos) */}
            <div className="h-[48px] border-b border-[#AEAEAE] flex items-center justify-center relative px-4">
                <p className="text-[15px] font-semibold text-black">Фильтр компаний</p>
                <button
                    onClick={onClose}
                    className="absolute right-3 p-2 bg-white border-none rounded-md active:scale-95"
                    aria-label="Close"
                >
                    <X className="w-5 h-5 text-[#3066BE]" />
                </button>
            </div>

            {/* BODY (scrollable) */}
            <div
                className="flex-1 overflow-y-auto"
                style={{ paddingBottom: "calc(120px + env(safe-area-inset-bottom))" }} // tugmalar + footer uchun joy
            >
                <div className="px-4 py-4 space-y-5">
                    {/* Inputs */}
                    <div>
                        <label className="block text-[15px] font-semibold mb-2 text-black">Компания:</label>
                        <input
                            value={query}
                            onChange={(e)=>setQuery(e.target.value)}
                            placeholder="Выберите компанию"
                            className="w-full h-11 bg-[#F4F6FA] border-none text-black rounded-xl px-3 text-[14px] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[15px] font-semibold mb-2">Локация:</label>
                        <input
                            value={location}
                            onChange={(e)=>setLocation(e.target.value)}
                            placeholder="Выберите локацию"
                            className="w-full h-11 bg-[#F4F6FA] border-none text-black rounded-xl px-3 text-[14px] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[15px] font-semibold mb-2">Ключевое слово:</label>
                        <input
                            value={keyword}
                            onChange={(e)=>setKeyword(e.target.value)}
                            placeholder="Образование, интернет"
                            className="w-full h-11 bg-[#F4F6FA] border-none text-black rounded-xl px-3 text-[14px] outline-none"
                        />
                    </div>
                </div>

                {/* divider */}
                <div className="h-px bg-[#AEAEAE]" />

                {/* Roles (collapsible) */}
                <div className="px-4 py-4">
                    <button
                        onClick={()=>setShowRoles(v=>!v)}
                        className="w-full flex items-center justify-between bg-white border-none text-black"
                    >
                        <span className="text-[15px] font-semibold bg-white text-black ml-[-18px]">Должность</span>
                        {showRoles ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {showRoles && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                            {ROLES.map((r, i)=>(
                                <label key={i} className="flex items-center gap-2 text-[14px]">
                                    <input type="checkbox" className="w-4 h-4 accent-[#3066BE] text-black" />
                                    <p className="text-black">{r}</p>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* divider */}
                <div className="h-px bg-[#AEAEAE]" />

                {/* Rating + Size */}
                <div className="px-4 py-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[15px] font-semibold text-black">Рейтинг компании</p>
                            <div className="mt-2 flex items-center gap-1">
                                {[1,2,3,4,5].map((s)=>(
                                    <button
                                        key={s}
                                        onClick={()=>setRating(s===rating?0:s)}
                                        className="p-1 active:scale-95 bg-white border-none"
                                        aria-label={`rating ${s}`}
                                    >
                                        <Star
                                            className="w-5 h-5"
                                            color={s <= rating ? "#FFBF00" : "#D9D9D9"}
                                            fill={s <= rating ? "#FFBF00" : "#D9D9D9"}
                                        />
                                    </button>
                                ))}
                                <button
                                    onClick={()=> rating>0 && setRating(rating)}
                                    className="ml-2 text-[#3066BE] bg-white text-[14px] font-medium"
                                >
                                    и выше
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-[15px] font-semibold mb-2 text-black">Размер компании</p>
                        <div className="grid grid-cols-1 gap-2">
                            {["1-50","51-200","200-500","500-1000","1000+","любой размер"].map((opt)=>(
                                <label key={opt} className="flex items-center gap-2 text-[14px]">
                                    <input
                                        type="radio"
                                        name="company_size"
                                        className="w-4 h-4 accent-[#3066BE]"
                                        checked={size===opt}
                                        onChange={()=>setSize(opt)}
                                    />
                                    <p className="text-black">{opt}</p>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions (inside body, screenshot-style) */}
                <div className="px-4 pt-2">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClear}
                            className="h-10 px-4 rounded-xl border border-[#3066BE] text-[#3066BE] text-[14px] font-medium bg-white active:scale-95"
                        >
                            Очистить все
                        </button>
                        <button
                            onClick={onApply}
                            className="h-10 px-6 rounded-xl bg-[#3066BE] text-white text-[14px] font-semibold active:scale-95"
                        >
                            Поиск
                        </button>
                    </div>
                </div>

                {/* FOOTER – fixed emas, kontent bilan birga skrollanadi */}
                <div className="mt-6 modal-footer-as-content">
                    {/* local override – faqat shu modal scope’da ishlaydi */}
                    <style>
                        {`
                      .modal-footer-as-content > * {
                        position: static !important;
                        inset: initial !important;
                        bottom: auto !important;
                        width: 100% !important;
                      }
                    `}
                    </style>

                    <MobileFooter />
                </div>
            </div>
        </div>
    );
}
