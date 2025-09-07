import React from "react";
import { ChevronRight } from "lucide-react";

export default function CirclePaginationMobile({
                                                   current = 1,
                                                   total = 5,
                                                   onChange = () => {},
                                               }) {
    const blue = "#2B50A4";

    const Item = ({ n }) => {
        const active = n === current;
        return (
            <button
                onClick={() => onChange(n)}
                // global button paddingni bekor qilish uchun p-0 + inline padding:0
                className={[
                    "inline-flex items-center justify-center shrink-0",
                    "rounded-full aspect-square w-8 h-8 leading-none",
                    "transition active:scale-95 select-none",
                    active ? "text-white" : "text-[color:var(--c-blue)]",
                ].join(" ")}
                style={{
                    padding: 0,
                    background: active ? blue : "#fff",
                    border: `1.5px solid ${blue}`,
                    // Tailwind arbitrary color var:
                    ["--c-blue"]: blue,
                }}
                aria-current={active ? "page" : undefined}
                aria-label={`Sahifa ${n}`}
            >
                <span className="text-[13px] font-semibold">{n}</span>
            </button>
        );
    };

    const canNext = current < total;

    return (
        <nav
            className="w-full flex items-center justify-center gap-2 mt-3"
            role="navigation"
            aria-label="Pagination"
        >
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                <Item key={n} n={n} />
            ))}

            {/* NEXT: doira + markazdagi ko‘k strelka */}
            <button
                onClick={() => canNext && onChange(current + 1)}
                disabled={!canNext}
                className="inline-flex items-center justify-center shrink-0 rounded-full aspect-square w-8 h-8 leading-none transition active:scale-95 disabled:opacity-40"
                style={{
                    padding: 0,                 // global paddingni bekor qilamiz
                    border: `1.5px solid ${blue}`,
                    background: "#fff",
                    color: blue,                // lucide stroke currentColor
                }}
                aria-label="Keyingi sahifa"
            >
                <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
            </button>
        </nav>
    );
}
