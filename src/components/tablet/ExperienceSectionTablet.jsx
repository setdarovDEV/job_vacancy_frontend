// ExperienceSectionTablet.jsx — CLEAN & WORKING
import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "../../utils/api";

const BASE = "/api/experiences/"; // GET/POST -> experience/experiences/ ; PATCH/DELETE -> experience/experiences/:id/

const MONTHS = [
    { v: "01", t: "Январь" }, { v: "02", t: "Февраль" }, { v: "03", t: "Март" },
    { v: "04", t: "Апрель" }, { v: "05", t: "Май" }, { v: "06", t: "Июнь" },
    { v: "07", t: "Июль" }, { v: "08", t: "Август" }, { v: "09", t: "Сентябрь" },
    { v: "10", t: "Октябрь" }, { v: "11", t: "Ноябрь" }, { v: "12", t: "Декабрь" },
];
const YEARS = Array.from({ length: 51 }, (_, i) => `${new Date().getFullYear() - i}`);

export default function ExperienceSectionModal({ isEditable }) {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(false);

    // modal & form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [companyName, setCompanyName] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [title, setTitle] = useState(""); // -> position
    const [startMonth, setStartMonth] = useState("");
    const [startYear, setStartYear] = useState("");
    const [worksHere, setWorksHere] = useState(false);
    const [endMonth, setEndMonth] = useState("");
    const [endYear, setEndYear] = useState("");
    const [description, setDescription] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(BASE);
            const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setExperiences(list);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);

    const resetForm = () => {
        setEditingId(null);
        setCompanyName(""); setCity(""); setCountry("");
        setTitle(""); setStartMonth(""); setStartYear("");
        setWorksHere(false); setEndMonth(""); setEndYear("");
        setDescription(""); setErrMsg("");
    };

    const openCreate = () => { resetForm(); setIsModalOpen(true); };

    const openEdit = (exp) => {
        resetForm();
        setEditingId(exp.id);
        setCompanyName(exp.company_name || "");
        setCity(exp.city || "");
        setCountry(exp.country || "");
        setTitle(exp.position || "");

        if (exp.start_date) {
            const [y, m] = exp.start_date.split("-");
            setStartYear(y || "");
            setStartMonth(m || "");
        }
        if (exp.end_date) {
            const [y, m] = exp.end_date.split("-");
            setWorksHere(false);
            setEndYear(y || "");
            setEndMonth(m || "");
        } else {
            setWorksHere(true);
        }
        setDescription(exp.description || "");
        setIsModalOpen(true);
    };

    const buildDate = (y, m) => (y && m ? `${y}-${String(m).padStart(2, "0")}-01` : null);

    const save = async () => {
        if (saving) return;
        setErrMsg("");

        // validation (backend 400'ni oldini oladi)
        if (!companyName.trim() || !title.trim() || !startYear || !startMonth) {
            setErrMsg("Компания, заголовок va boshlanish oy/yili majburiy.");
            return;
        }
        // end-date faqat worksHere = false bo‘lsa talab qilinishi mumkin (ixtiyoriy; to‘ldirilsa yuboramiz)
        const start_date = buildDate(startYear, startMonth);
        const end_date = worksHere ? null : buildDate(endYear, endMonth);

        // payload backend nomlari bilan
        const payload = {
            company_name: companyName.trim(),
            position: title.trim(),
            start_date,
            description,
            city,
            country,
            // end_date ni faqat kerak bo‘lsa qo‘shamiz (null yubormaslik uchun)
            ...(worksHere ? {} : (end_date ? { end_date } : {})),
        };

        try {
            setSaving(true);
            if (editingId) {
                await api.patch(`${BASE}${editingId}/`, payload, { headers: { "Content-Type": "application/json" } });
            } else {
                await api.post(BASE, payload, { headers: { "Content-Type": "application/json" } });
            }
            setIsModalOpen(false);
            resetForm();
            await load();
        } catch (e) {
            const d = e?.response?.data;
            setErrMsg(typeof d === "object" ? JSON.stringify(d) : "Saqlashda xatolik");
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id) => {
        try {
            await api.delete(`${BASE}${id}/`);
            setExperiences((prev) => prev.filter((x) => x.id !== id));
        } catch (e) {
            // optional: toast
        }
    };

    return (
        <div className="w-full bg-white border mt-8 border-[#AEAEAE] rounded-[20px] overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#AEAEAE]">
                <h3 className="text-[18px] md:text-[20px] lg:text-[24px] font-bold text-black">Опыт работы</h3>
                <button
                    type="button"
                    onClick={() => { if (isEditable) openCreate(); }}
                    className={`${!isEditable ? "pointer-events-none" : ""}`}
                    aria-label="Добавить опыт"
                >
                    <div className={`border w-[22px] h-[22px] md:w-[23px] md:h-[23px] rounded-full flex items-center justify-center
            ${isEditable ? "border-[#3066BE] cursor-pointer hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 opacity-50"}`}>
                        <Plus size={18} stroke={isEditable ? "#3066BE" : "#AFAFAF"} />
                    </div>
                </button>
            </div>

            {/* list */}
            {loading ? (
                <div className="px-4 md:px-6 py-10 text-center text-[#AEAEAE]">Загрузка…</div>
            ) : experiences?.length ? (
                <ul className="p-4 md:p-6 space-y-3">
                    {experiences.map((exp) => (
                        <li key={exp.id} className="p-4 border border-gray-200 rounded-[12px]">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[15px] md:text-[16px] font-semibold text-black truncate">{exp.position}</p>
                                    <p className="text-[12px] md:text-[13px] text-[#666] truncate">
                                        {exp.company_name}
                                        {exp.city ? ` • ${exp.city}` : ""}
                                        {exp.country ? `, ${exp.country}` : ""}
                                    </p>
                                    <p className="text-[12px] md:text-[13px] text-[#999]">
                                        {exp.start_date} — {exp.end_date || "Hozirgacha"}
                                    </p>
                                    {exp.description && (
                                        <p className="text-[12px] md:text-[13px] text-[#666] mt-1 line-clamp-2">{exp.description}</p>
                                    )}
                                </div>
                                {/* actions (edit/delete) */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {/* EDIT */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => isEditable && openEdit(exp)}
                                        onKeyDown={(e) => {
                                            if (!isEditable) return;
                                            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEdit(exp); }
                                        }}
                                        aria-label="Редактировать"
                                        className={`relative w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-full
      ${isEditable ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    >
                                        {/* pill background */}
                                        <div className={`absolute inset-0 rounded-full border bg-white transition
      ${isEditable ? "border-[#3066BE] hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 opacity-50"}`} />
                                        {/* icon on top */}
                                        <Pencil
                                            size={14}
                                            strokeWidth={2}
                                            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        ${isEditable ? "text-[#3066BE]" : "text-[#AFAFAF]"}`}
                                        />
                                    </div>

                                    {/* DELETE */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => isEditable && remove(exp.id)}
                                        onKeyDown={(e) => {
                                            if (!isEditable) return;
                                            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); remove(exp.id); }
                                        }}
                                        aria-label="Удалить"
                                        className={`relative w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-full
      ${isEditable ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    >
                                        <div className={`absolute inset-0 rounded-full border bg-white transition
      ${isEditable ? "border-[#3066BE] hover:bg-[#F0F7FF]" : "border-gray-300 bg-gray-100 opacity-50"}`} />
                                        <Trash2
                                            size={14}
                                            strokeWidth={2}
                                            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        ${isEditable ? "text-[#3066BE]" : "text-[#AFAFAF]"}`}
                                        />
                                    </div>
                                </div>

                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="px-4 md:px-6 py-10 md:py-14 text-center text-[#AEAEAE] text-[14px] md:text-[16px]">
                    Перечисление вашего опыта работы может помочь подтвердить ваши особые знания и способности.
                </div>
            )}

            {/* modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
                    <div className="bg-white w-full max-w-[760px] rounded-[16px] shadow-lg flex flex-col max-h-[90vh] overflow-hidden">
                        {/* header */}
                        <div className="relative px-6 py-5 border-b border-[#E5E7EB]">
                            <h4 className="text-[20px] md:text-[22px] font-extrabold text-black text-center">
                                {editingId ? "Редактировать опыт" : "Добавить опыт работы"}
                            </h4>
                            <button
                                type="button"
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                aria-label="Close"
                                className="absolute right-4 top-4 w-9 h-9 p-0 rounded-full flex items-center justify-center
                           border-none border-[#3066BE] text-[#3066BE] bg-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* server/client errors */}
                        {errMsg && (
                            <div className="px-6 pt-3 text-[13px] text-red-600 break-words">{errMsg}</div>
                        )}

                        {/* body (scroll) */}
                        <div className="px-6 py-5 space-y-5 overflow-y-auto">
                            {/* Company */}
                            <div>
                                <label className="block text-[14px] font-semibold text-black mb-1">Компания:</label>
                                <input
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Напр., Google, Microsoft"
                                    className="w-full h-11 rounded-[10px] border px-4 text-black placeholder:text-[#9CA3AF] outline-none"
                                    type="text"
                                />
                            </div>

                            {/* City / Country */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[14px] font-semibold text-black mb-1">Город:</label>
                                    <input
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Введите город"
                                        className="w-full h-11 rounded-[10px] border px-4 text-black placeholder:text-[#9CA3AF] outline-none"
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-semibold text-black mb-1">Страна:</label>
                                    <input
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="Введите страну"
                                        className="w-full h-11 rounded-[10px] border px-4 text-black placeholder:text-[#9CA3AF] outline-none"
                                        type="text"
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-[14px] font-semibold text-black mb-1">Заголовок:</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Напр., графический дизайнер, веб дизайнер"
                                    className="w-full h-11 rounded-[10px] border px-4 text-black placeholder:text-[#9CA3AF] outline-none"
                                    type="text"
                                />
                            </div>

                            {/* Start Month / Year */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[14px] font-semibold text-black mb-1">Месяц (начало):</label>
                                    <select
                                        value={startMonth}
                                        onChange={(e) => setStartMonth(e.target.value)}
                                        className="w-full h-11 rounded-[10px] border px-3 text-black outline-none bg-white"
                                    >
                                        <option value="" disabled>от, месяц</option>
                                        {MONTHS.map(m => <option key={m.v} value={m.v}>{m.t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[14px] font-semibold text-black mb-1">Год (начало):</label>
                                    <select
                                        value={startYear}
                                        onChange={(e) => setStartYear(e.target.value)}
                                        className="w-full h-11 rounded-[10px] border px-3 text-black outline-none bg-white"
                                    >
                                        <option value="" disabled>от, год</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Works here */}
                            <label className="flex items-center gap-2 text-[14px] select-none">
                                <input
                                    type="checkbox"
                                    checked={worksHere}
                                    onChange={(e) => setWorksHere(e.target.checked)}
                                    className="w-4 h-4 accent-[#3066BE]"
                                />
                                <p className="text-black">Сейчас я работаю здесь</p>
                            </label>

                            {/* End Month/Year (only if not working) */}
                            {!worksHere && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[14px] font-semibold text-black mb-1">Месяц (конец):</label>
                                        <select
                                            value={endMonth}
                                            onChange={(e) => setEndMonth(e.target.value)}
                                            className="w-full h-11 rounded-[10px] border px-3 text-black outline-none bg-white"
                                        >
                                            <option value="" disabled>до, месяц</option>
                                            {MONTHS.map(m => <option key={m.v} value={m.v}>{m.t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-semibold text-black mb-1">Год (конец):</label>
                                        <select
                                            value={endYear}
                                            onChange={(e) => setEndYear(e.target.value)}
                                            className="w-full h-11 rounded-[10px] border px-3 text-black outline-none bg-white"
                                        >
                                            <option value="" disabled>до, год</option>
                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-[14px] font-semibold text-black mb-1">
                                    Описание (не обязательно):
                                </label>
                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Напишите…"
                                    className="w-full rounded-[10px] border px-4 py-3 text-black placeholder:text-[#9CA3AF] outline-none"
                                />
                            </div>
                        </div>

                        {/* footer */}
                        <div className="flex justify-end px-6 py-5 border-t">
                            <button
                                type="button"
                                onClick={save}
                                disabled={saving}
                                className="h-11 px-6 rounded-[10px] bg-[#3066BE] text-white font-semibold disabled:opacity-60"
                            >
                                {saving ? "Сохраняю..." : (editingId ? "Сохранить" : "Опубликовать")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
