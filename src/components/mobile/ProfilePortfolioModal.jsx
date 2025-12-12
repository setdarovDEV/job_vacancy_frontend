// src/components/mobile/PortfolioFullModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Image as ImageIcon, Paperclip, Hash, Loader2, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import api from "../../utils/api";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter.jsx";

/* helpers */
const parseTags = (raw="") =>
    raw.split(",").map(s=>s.trim()).filter(Boolean).map(t => (t.startsWith("#") ? t : `#${t}`));

function TagInput({ value, onChange }) {
    const [text, setText] = useState("");
    const tags = useMemo(() => parseTags(value), [value]);
    const add = () => { const t = text.trim(); if (!t) return; onChange((value?value+", ":"")+t); setText(""); };
    const removeAt = (i) => onChange(tags.filter((_,idx)=>idx!==i).join(", "));

    return (
        <div>
            <input
                value={text}
                onChange={(e)=>setText(e.target.value)}
                onKeyDown={(e)=>{ if (e.key==="Enter"||e.key===","){ e.preventDefault(); add(); } }}
                className="w-full h-11 rounded-[10px] border text-black border-[#AEAEAE] px-3 outline-none"
                placeholder="Навык, результат… (Enter yoki ,)"
            />
        </div>
    );
}

export default function PortfolioFullModal({ isOpen, onClose, onSuccess }) {
    const [title, setTitle]   = useState("");
    const [desc, setDesc]     = useState("");
    const [skills, setSkills] = useState("");
    const [files, setFiles]   = useState([]); // {file,url,kind}
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e)=> e.key==="Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }, [isOpen, onClose]);

    const canPublish = title.trim().length>0 && !loading;

    const pickFiles = () => fileRef.current?.click();
    const onFileChange = (e) => {
        const list = Array.from(e.target.files || []);
        const mapped = list.map(f => ({ file:f, url:URL.createObjectURL(f), kind: f.type.includes("image") ? "image" : f.type.includes("video") ? "video" : "file" }));
        setFiles(prev => [...prev, ...mapped]);
    };
    const removeFile = (url) => setFiles(prev => prev.filter(x => x.url !== url));

    const handlePublish = async () => {
        if (!canPublish) return;
        try {
            setLoading(true);
            const { data: project } = await api.post("/api/projects/", {
                title: title.trim(),
                description: desc.trim(),
                tags: parseTags(skills).map(t=>t.replace(/^#/,"")),
            });
            if (files.length) {
                await Promise.all(files.map(({file})=>{
                    const fd = new FormData();
                    fd.append("project", project.id);
                    fd.append("file", file);
                    return api.post("/api/portfolio-media/", fd, { headers: { "Content-Type": "multipart/form-data" }});
                }));
            }
            setTitle(""); setDesc(""); setSkills(""); setFiles([]);
            onSuccess?.(); onClose?.();
        } catch (e) {
            console.error(e); alert("Saqlashda xatolik.");
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[110]">
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            {/* full page */}
            <div className="absolute inset-0 flex justify-center">
                <div className="w-full max-w-[393px] bg-white min-h-[100dvh] flex flex-col">
                    <MobileNavbar />

                    {/* header */}
                    <div className="px-4 py-3 border-b border-[#AEAEAE] flex items-center justify-between">
                        <h2 className="text-[12px] ml-[60px] font-semibold text-black">Добавить новый проект портфолио</h2>
                        <button
                            onClick={onClose}
                            className="absolute right-3 p-2 bg-white border-none rounded-md active:scale-95"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-[#3066BE]" />
                        </button>
                    </div>

                    {/* scrollable content (footer+buttons ichkarida!) */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ overscrollBehavior: "contain" }}>
                        {/* Title */}
                        <div>
                            <label className="block text-[12px] text-black mb-1">Название проекта:</label>
                            <input
                                id="pf-title" value={title} onChange={(e)=>setTitle(e.target.value)}
                                placeholder="Введите краткое, но емкое название"
                                className="w-full h-11 border border-[#AEAEAE] text-black rounded-[10px] px-3 outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[12px] text-black mb-1">Описание проекта:</label>
                            <textarea
                                value={desc} onChange={(e)=>setDesc(e.target.value)} rows={4}
                                placeholder="Кратко опишите цели проекта, ваше решение и оказанное вами влияние"
                                className="w-full border border-[#AEAEAE] rounded-[10px] text-black px-3 outline-none resize-none"
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-[12px] text-black mb-1">Навыки и результаты:</label>
                            <TagInput value={skills} onChange={setSkills} />
                        </div>

                        {/* Media */}
                        <div>
                            <label className="block text-[12px] text-black mb-1">Медиа:</label>
                            <div className="rounded-[10px] border border-[#AEAEAE] p-3">
                                <div className="flex items-center gap-3">
                                    <div onClick={pickFiles} className="w-10 h-10 rounded-md border text-[#3066BE] border-[#3066BE] flex items-center justify-center">
                                        <ImageIcon size={18} />
                                    </div>
                                    <div onClick={pickFiles} className="w-10 h-10 rounded-md border text-[#3066BE] border-[#3066BE] flex items-center justify-center">
                                        <Paperclip size={18} />
                                    </div>
                                    <input ref={fileRef} type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={onFileChange} />
                                </div>

                                {files.length>0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-8">
                                        {files.map(({url,kind,file})=>(
                                            <div key={url} className="relative">
                                                {kind==="image" ? (
                                                    <img src={url} alt={file.name} className="w-full aspect-square object-cover rounded-md border border-black/10" />
                                                ) : kind==="video" ? (
                                                    <video src={url} className="w-full aspect-square object-cover rounded-md border border-black/10" muted />
                                                ) : (
                                                    <div className="w-full aspect-square rounded-md border border-black/10 flex items-center justify-center text-[12px]">
                                                        {file.name.endsWith(".pdf") ? "PDF" : "FILE"}
                                                    </div>
                                                )}
                                                <button onClick={()=>removeFile(url)} className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ACTION BUTTONS — endi sticky EMAS, scroll bilan ketadi */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between gap-2">
                                <button className="h-11 px-4 rounded-[10px] border border-[#3066BE] bg-white text-[#3066BE] text-sm active:scale-95">Предпросмотр</button>
                                <button
                                    onClick={handlePublish}
                                    disabled={!canPublish}
                                    className={`h-11 px-4 rounded-[10px] text-sm font-medium flex items-center gap-2 active:scale-95 ${
                                        canPublish ? "bg-[#3066BE] text-white" : "bg-black/20 text-white/80"
                                    }`}
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Опубликовать
                                </button>
                            </div>
                        </div>

                        <div className="-mx-4 -mb-4 mt-6">
                            <MobileFooter fixed={false} fluid />
                        </div>

                        {/* iOS safe-area pad */}
                        <div className="h-[env(safe-area-inset-bottom)]" />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
