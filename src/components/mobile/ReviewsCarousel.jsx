import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function ReviewsCarousel({ items = [] }) {
    const blue = "#3066BE";
    const trackRef = useRef(null);
    const [idx, setIdx] = useState(0);

    // indexni skrolldan hisoblash
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const onScroll = () => {
            const w = el.clientWidth;                 // ko‘rinadigan kenglik
            const i = Math.round(el.scrollLeft / w);  // eng yaqin slayd
            setIdx(Math.max(0, Math.min(i, items.length - 1)));
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [items.length]);

    const go = (next) => {
        const el = trackRef.current;
        if (!el) return;
        const w = el.clientWidth;
        const target = Math.max(0, Math.min(idx + (next ? 1 : -1), items.length - 1));
        el.scrollTo({ left: target * w, behavior: "smooth" });
    };

    return (
        <section className="mt-3">
            <div className="relative">
                {/* SLIDES */}
                <div
                    ref={trackRef}
                    className="overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                >
                    <div className="flex">
                        {items.map((r, i) => (
                            <article
                                key={i}
                                className="snap-start shrink-0 w-full px-4"
                                aria-roledescription="slide"
                            >
                                <div className="rounded-2xl border bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-1 text-[#FFBF00]">
                                        {Array.from({ length: r.stars ?? 5 }).map((_, k) => (
                                            <Star key={k} className="w-4 h-4" color="#FFBF00" fill="#FFBF00" />
                                        ))}
                                    </div>
                                    <p className="mt-2 text-[14px] text-black/80">
                                        {r.text}
                                    </p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <img
                                            src={r.avatar || "/avatar.png"}
                                            alt={r.author}
                                            className="w-8 h-8 rounded-full object-cover bg-gray-200"
                                        />
                                        <div className="text-[13px]">
                                            <p className="font-semibold">{r.author}</p>
                                            <p className="text-black/60">{r.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {/* DOTS */}
            {items.length > 1 && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                    {items.map((_, i) => (
                        <span
                            key={i}
                            className={`transition-all rounded-full ${i === idx ? "w-4 h-1.5" : "w-1.5 h-1.5"}`}
                            style={{ background: i === idx ? blue : "#D1D5DB" }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
