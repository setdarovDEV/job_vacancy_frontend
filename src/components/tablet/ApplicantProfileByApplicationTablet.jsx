import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import NavbarTabletLogin from "../tablet/NavbarTabletLogIn.jsx";
import { ArrowLeft } from "lucide-react";
import { normalizeName } from "../../utils/normalizeName";

export default function ApplicantProfileByApplicationTablet() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const AVATAR_FALLBACK = "/user.png";

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError("");
        api
            .get(`/api/applications/${applicationId}/applicant/`)
            .then((res) => alive && setData(res.data))
            .catch((e) =>
                alive &&
                setError(e?.response?.data?.detail || "Profilni yuklashda xatolik.")
            )
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
    }, [applicationId]);

    if (loading)
        return (
            <div className="hidden md:flex lg:hidden items-center justify-center min-h-screen bg-[#F4F6FA]">
                <div className="animate-pulse text-[#0F172A]/70">Yuklanmoqda…</div>
            </div>
        );

    if (error)
        return (
            <div className="hidden md:block lg:hidden bg-[#F4F6FA] min-h-screen">
                <NavbarTabletLogin />
                <div className="h-[84px]" />
                <div className="max-w-[960px] mx-auto px-4 py-8">
                    <div className="rounded-2xl bg-white p-6 border text-red-600 mb-4">{error}</div>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 h-[42px] rounded-[10px] border text-[#0F172A]"
                    >
                        <ArrowLeft size={18} /> Orqaga
                    </button>
                </div>
            </div>
        );

    if (!data)
        return (
            <div className="hidden md:flex lg:hidden items-center justify-center min-h-screen bg-[#F4F6FA]">
                Ma’lumot topilmadi
            </div>
        );

    const skills = Array.isArray(data.skills) ? data.skills : [];
    const languages = Array.isArray(data.languages) ? data.languages : [];
    const educations = Array.isArray(data.educations) ? data.educations : [];
    const portfolio = Array.isArray(data.portfolio_projects) ? data.portfolio_projects : [];
    const certificates = Array.isArray(data.certificates) ? data.certificates : [];
    const experiences = Array.isArray(data.experiences) ? data.experiences : [];
    const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

    return (
        <div className="hidden md:block lg:hidden bg-[#F4F6FA] min-h-screen">
            <NavbarTabletLogin />
            {/* header spacer */}
            <div className="h-[84px]" />

            {/* page */}
            <div className="max-w-[960px] mx-auto px-4 py-4 space-y-6">
                {/* Top card */}
                <div className="bg-white border border-[#E3E6EA] rounded-[20px]">
                    <div className="px-4 py-4 border-b border-[#E3E6EA] flex items-center justify-between">
                        {/* left: avatar + name */}
                        <div className="flex items-center gap-3">
                            <div className="w-[64px] h-[64px] rounded-full overflow-hidden border bg-gray-100">
                                <img
                                    src={data.avatar || AVATAR_FALLBACK}
                                    onError={(e) => (e.currentTarget.src = AVATAR_FALLBACK)}
                                    alt={data.full_name || "avatar"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-bold text-[#0F172A]">
                                    {normalizeName(data.full_name)}
                                </h2>
                                <p className="text-[12px] text-[#6B7280]">{data.position || "—"}</p>
                            </div>
                        </div>

                        {/* right: back */}
                        <button
                            onClick={() => navigate(-1)}
                            className="h-[42px] px-3 rounded-[10px] bg-[#3066BE] text-white text-[13px] font-semibold hover:bg-[#2452a6]"
                        >
                            Orqaga
                        </button>
                    </div>

                    {/* about / weekly hours / languages / education */}
                    <div className="p-4 space-y-6">
                        {/* Hours */}
                        <section>
                            <h3 className="text-[18px] font-bold mb-1 text-[#0F172A]">Часов в неделю</h3>
                            <p className="text-[13px] text-[#0F172A]">
                                {data.work_hours_per_week || "—"}
                            </p>
                            <p className="text-[12px] text-[#6B7280]">
                                Открыт для заключения контракта на найм
                            </p>
                        </section>

                        {/* Languages */}
                        <section>
                            <h3 className="text-[18px] font-bold mb-2 text-[#0F172A]">Языки</h3>
                            {languages.length === 0 ? (
                                <span className="text-[#9CA3AF] text-[13px]">—</span>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((l, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-[6px] rounded-full border text-[12px] bg-[#F3F4F6] text-[#0F172A]"
                                        >
                      {l.language} — {l.level}
                    </span>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Education */}
                        <section>
                            <h3 className="text-[18px] font-bold mb-2 text-[#0F172A]">Образование</h3>
                            {educations.length === 0 ? (
                                <span className="text-[#9CA3AF] text-[13px]">—</span>
                            ) : (
                                <div className="space-y-3">
                                    {educations.map((e, i) => (
                                        <div key={i} className="text-[13px] text-[#0F172A]">
                                            <div className="font-semibold">{e.academy_name}</div>
                                            <div className="text-[#6B7280]">{e.degree}</div>
                                            <div className="text-[#9CA3AF]">
                                                {e.start_year} — {e.end_year}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {/* About */}
                <CardBlock title="О себе">
                    <p className="text-[14px] leading-relaxed whitespace-pre-line text-[#0F172A]">
                        {data.bio || "—"}
                    </p>
                </CardBlock>

                {/* Portfolio */}
                <CardBlock title="Портфолио">
                    {portfolio.length === 0 ? (
                        <div className="text-[#9CA3AF] text-[13px]">—</div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {portfolio.map((p) => (
                                <div key={p.id} className="border rounded-[12px] p-4">
                                    <div className="font-semibold text-[14px] text-[#0F172A]">{p.title}</div>
                                    {p.description && (
                                        <div className="text-[12px] text-[#6B7280] mt-1 whitespace-pre-line">
                                            {p.description}
                                        </div>
                                    )}
                                    {p.skills_list?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {p.skills_list.map((s, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-[6px] rounded-full border text-[12px] bg-[#F3F4F6] text-[#0F172A]"
                                                >
                          {s}
                        </span>
                                            ))}
                                        </div>
                                    )}
                                    {p.media?.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            {p.media.map((m, idx) => (
                                                <a
                                                    key={idx}
                                                    href={m.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title={m.file_type}
                                                    className="block"
                                                >
                                                    {m.file_type === "image" ? (
                                                        <img
                                                            src={m.file_url}
                                                            alt="media"
                                                            className="w-[120px] h-[80px] object-cover rounded border"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-[12px] underline text-[#3066BE]">
                              {m.file_type.toUpperCase()}
                            </span>
                                                    )}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardBlock>

                {/* Skills */}
                <CardBlock title="Навыки">
                    {skills.length === 0 ? (
                        <span className="text-[#9CA3AF] text-[13px]">—</span>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {skills.slice(0, 30).map((s, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-[6px] rounded-full border text-[12px] bg-[#F3F4F6] text-[#0F172A]"
                                >
                  {typeof s === "string" ? s : s?.name || "Skill"}
                </span>
                            ))}
                        </div>
                    )}
                </CardBlock>

                {/* Certificates */}
                <CardBlock title="Сертификаты">
                    {certificates.length === 0 ? (
                        <div className="text-[#9CA3AF] text-[13px]">—</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {certificates.map((c) => (
                                <div
                                    key={c.id}
                                    className="border border-[#E5E7EB] rounded-[12px] overflow-hidden"
                                >
                                    {/\.(png|jpg|jpeg|webp)$/i.test(c.file_url) ? (
                                        <img src={c.file_url} alt={c.name} className="w-full object-cover" />
                                    ) : (
                                        <div className="h-[160px] flex items-center justify-center bg-gray-100 text-gray-500">
                                            Fayl
                                        </div>
                                    )}
                                    <div className="p-3">
                                        <div className="text-[14px] font-semibold text-[#0F172A]">{c.name}</div>
                                        <div className="text-[12px] text-[#6B7280]">{c.organization}</div>
                                        <div className="text-[12px] text-[#9CA3AF]">{fmtDate(c.issue_date)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBlock>

                {/* Experience */}
                <CardBlock title="Опыт работы">
                    {experiences.length === 0 ? (
                        <div className="text-[#9CA3AF] text-[13px]">—</div>
                    ) : (
                        <div className="space-y-3">
                            {experiences.map((ex) => (
                                <div key={ex.id} className="border rounded-[12px] p-4">
                                    <div className="text-[14px] font-semibold text-[#0F172A]">
                                        {ex.position} @ {ex.company_name}
                                    </div>
                                    <div className="text-[12px] text-[#6B7280]">
                                        {fmtDate(ex.start_date)} — {ex.end_date ? fmtDate(ex.end_date) : "Hozir"}
                                        {(ex.city || ex.country) &&
                                            ` • ${[ex.city, ex.country].filter(Boolean).join(", ")}`}
                                    </div>
                                    {ex.description && (
                                        <div className="text-[12px] text-[#4B5563] mt-1 whitespace-pre-line">
                                            {ex.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardBlock>

                {/* bottom spacer */}
                <div className="h-6" />
            </div>
        </div>
    );
}

/* Reusable tablet card */
function CardBlock({ title, children }) {
    return (
        <section className="bg-white border border-[#E3E6EA] rounded-[20px] p-4">
            <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">{title}</h3>
            {children}
        </section>
    );
}
