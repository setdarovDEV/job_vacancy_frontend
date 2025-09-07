import React from "react";
import { Star, MapPin, Briefcase, ChevronRight, ArrowLeft } from "lucide-react";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter.jsx";
import ReviewsCarousel from "./ReviewsCarousel.jsx";


const toMediaUrl = (u, host = (typeof window !== "undefined" ? window.location.origin : "")) => {
    if (!u) return "/company-fallback.png";
    try { new URL(u); return u; } catch {}
    return u.startsWith("/") ? `${host}${u}` : `${host}/${u}`;
};

export default function CompanyDetailFullPage({ company, onClose = () => {} }) {
    const blue = "#3066BE";
    const logo = toMediaUrl(company?.logo);
    const cover = company?.cover || "/company-cover.png"; // fon rasmi bo'lmasa placeholder
    const rating = Number(company?.avg_rating ?? 4.0).toFixed(1);

    return (
        <div className="min-h-[100dvh] flex flex-col bg-white">
            {/* NAVBAR */}
            <MobileNavbar />

            {/* BODY (scrollable area emas – odatiy page) */}
            <main className="flex-1">
                {/* TOP COVER */}
                <div className="w-full h-[120px] sm:h-[140px] relative overflow-hidden mb-[50px]">
                    <img
                        src="/kompaniya-modal.png"
                        alt="cover"
                        className="w-full h-full object-cover"
                    />

                    {/* EXIT ICON BUTTON */}
                    <div
                        onClick={onClose}
                        className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center active:scale-95"
                        aria-label="Назад"
                    >
                        <ArrowLeft className="w-6 h-6 text-[#3066BE] drop-shadow-md" />
                    </div>
                </div>

                {/* HEADER BLOCK: logo + name + actions */}
                <section className="px-4 -mt-8">
                    <div className="flex items-start gap-3">
                        <img
                            src={logo}
                            onError={(e)=>{ e.currentTarget.src="/company-fallback.png"; }}
                            alt={company?.name || "Company"}
                            className="w-14 h-14 rounded-full object-contain bg-white border shadow"
                        />

                        <div className="flex-1">
                            <h1 className="text-[22px] font-bold leading-none text-black">
                                {company?.name || "—"}
                            </h1>

                            <div className="mt-2 flex items-center gap-3 text-[13px] text-black">
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                    {company?.employee_count_label || "1000+ сотрудников"}
                </span>
                                <span className="text-[color:var(--c-blue)]" style={{["--c-blue"]:blue}}>•</span>
                                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                                    {company?.location || "Узбекистан"}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* actions */}
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            className="h-9 px-4 rounded-xl border bg-white border-[color:var(--c-blue)] text-[color:var(--c-blue)] text-[14px] font-semibold"
                            style={{["--c-blue"]:blue}}
                        >
                            Подписаться
                        </button>
                        <button
                            className="h-9 px-4 rounded-xl bg-[color:var(--c-blue)] text-white text-[14px] font-semibold"
                            style={{["--c-blue"]:blue}}
                        >
                            Оставить отзыв
                        </button>

                        <div className="ml-auto inline-flex items-center gap-1 text-[14px] text-[color:var(--c-blue)]"
                             style={{["--c-blue"]:blue}}>
                            <span className="font-semibold">{rating}</span>
                            <Star className="w-4 h-4" color={blue} fill={blue}/>
                        </div>
                    </div>
                </section>

                {/* TABS (Overview active) */}
                <section className="mt-5 border-b border-[#AEAEAE] bg-white">
                    <div className="px-4 h-12 flex items-center justify-between text-[14px]">
                        <button className="font-semibold text-[color:var(--c-blue)] bg-white" style={{["--c-blue"]:blue}}>
                            Обзор
                        </button>
                        <div className="flex items-center gap-6 text-black/80">
                            <span><b>{company?.reviews_count ?? 2}</b> Отзыва</span>
                            <span><b>{company?.open_jobpost_count ?? 20}</b> Вакансии</span>
                            <span><b>{company?.interviews_count ?? 20}</b> Интервью</span>
                            <span><b>{company?.photos_count ?? 20}</b> Фотографии</span>
                        </div>
                    </div>
                </section>

                {/* BLUE INFO CARD */}
                <section className="px-4 py-5">
                    <div
                        className="rounded-2xl border"
                        style={{ borderColor: blue }}
                    >
                        <div className="p-4">
                            <h3 className="text-[16px] font-semibold" style={{color: blue}}>
                                Найдите то, что подходит именно вам — быстрее.
                            </h3>
                            <p className="text-[14px] text-black/80 mt-2">
                                Получите персонализированную информацию о работе в компании {company?.name || "—"} за один быстрый шаг.
                            </p>
                            <button
                                className="mt-4 h-10 px-4 rounded-xl bg-[color:var(--c-blue)] text-white text-[14px] font-semibold"
                                style={{["--c-blue"]:blue}}
                            >
                                Заполнить резюме
                            </button>
                        </div>
                    </div>
                </section>

                {/* DESCRIPTION */}
                <section className="px-4">
                    <p className="text-[14px] leading-[22px] text-black/90">
                        {company?.description || (
                            <>
                                С момента своего основания в 1998 году компания Google стремительно развивалась. Начав с двух студентов-компьютерщиков
                                в университетском общежитии, мы теперь имеем более ста тысяч сотрудников и более ста офисов по всему миру…
                            </>
                        )}
                    </p>
                </section>

                {/* REVIEWS PREVIEW HEADER */}
                <section className="px-4 mt-8">
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-[18px] font-bold text-black">Что люди говорят о {company?.name || "компании"}?</h3>
                        <button className="inline-flex items-center gap-1 text-[14px] bg-white border-none underline text-[color:var(--c-blue)]"
                                style={{["--c-blue"]:blue}}>
                            Просмотреть все отзывы
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

                {/* REVIEWS CAROUSEL */}
                <ReviewsCarousel
                    items={[
                        {
                            stars: 5,
                            text:
                                "Используйте гибкие структуры, чтобы предоставлять наглядный обзор для обзоров вакансий, проектов и данных корпораций.",
                            author: "Сергей",
                            country: "Узбекистан",
                            avatar: "/review-user.png",
                        },
                        {
                            stars: 5,
                            text:
                                "Команда профессиональная, процессы выстроены. Было приятно участвовать в интервью и онбординге.",
                            author: "Алексей",
                            country: "Узбекистан",
                            avatar: "/review-user.png",
                        },
                        {
                            stars: 4,
                            text:
                                "Культура и бенефиты отличные. Иногда много бюрократии, но в целом впечатления позитивные.",
                            author: "Дильшод",
                            country: "Узбекистан",
                            avatar: "/review-user.png",
                        },
                    ]}
                />


                {/* bottom spacer for safe area */}
                <div style={{ height: "calc(env(safe-area-inset-bottom) + 16px)" }} />
            </main>

            {/* FOOTER */}
            <MobileFooter />
        </div>
    );
}
