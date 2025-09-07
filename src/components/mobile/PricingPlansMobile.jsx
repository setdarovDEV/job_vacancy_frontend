import React from "react";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter.jsx";
import HeaderNotifications from "./HeaderNotifications.jsx";

export default function PricingPlansMobile({ currentPlan = "basic", onSelect = () => {} }) {
    const plans = [
        {
            key: "basic",
            name: "Basic",
            price: 0,
            oldPrice: null,
            badge: "Ваш текущий план",
            cta: null,
            positive: 5,
            negative: 3,
        },
        {
            key: "pro",
            name: "Pro",
            price: 12,
            oldPrice: 15,
            badge: null,
            cta: "Купить Pro",
            positive: 5,
            negative: 3,
        },
        {
            key: "premium",
            name: "Premium",
            price: 20,
            oldPrice: 25,
            badge: null,
            cta: "Купить Premium",
            positive: 5,
            negative: 3,
        },
    ];

    return (
        <div className="w-full max-w-[430px] mx-auto bg-white min-h-[100dvh]">
            <MobileNavbar />

            <HeaderNotifications />

            <div className="px-4 pt-4 pb-24 space-y-8">
                {plans.map((p) => (
                    <PlanCard
                        key={p.key}
                        plan={p}
                        isCurrent={currentPlan === p.key}
                        onSelect={() => onSelect(p.key)}
                    />
                ))}
            </div>

            <MobileFooter />
        </div>
    );
}

function PlanCard({ plan, isCurrent, onSelect }) {
    const { name, price, oldPrice, badge, cta, positive = 5, negative = 3 } = plan;

    return (
        <div className="relative">
            {/* Ribbon (full width, rounded-top) */}
            {badge && (
                <div className="mx-auto w-[86%] h-9 rounded-t-[14px] bg-[#2F61C9] text-white flex items-center justify-center text-[12px] font-semibold shadow-md">
                    {badge}
                </div>
            )}

            {/* Card */}
            <div
                className={
                    "mx-auto w-[86%] rounded-[18px] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] border " +
                    (isCurrent ? "border-[#2F61C9]" : "border-[#E6EBF3]") +
                    (badge ? " rounded-t-none" : "")
                }
            >
                {/* Header area (like screenshot: title left spacing) */}
                <div className="px-5 pt-4 pb-2">
                    <h3 className="text-[16px] font-semibold text-black">{name}</h3>
                    {oldPrice ? (
                        <div className="text-[12px] text-black/30 line-through mt-2 select-none">
                            {oldPrice.toFixed(2)}$
                        </div>
                    ) : (
                        <div className="h-5" />
                    )}
                    <div className="mt-[-2px] text-[18px] font-extrabold text-black">
                        {price.toFixed(2)}$
                        <span className="text-[12px] font-semibold">/месяц</span>
                    </div>

                    {cta ? (
                        <button
                            onClick={onSelect}
                            className="w-full h-8 mt-3 rounded-[8px] bg-[#2F61C9] text-white text-[12px] font-semibold active:scale-[.99]"
                        >
                            {cta}
                        </button>
                    ) : (
                        <div className="h-2" />
                    )}
                </div>

                {/* Feature list */}
                <div className="px-5 pb-5">
                    <ul className="space-y-2">
                        {Array.from({ length: positive }).map((_, i) => (
                            <li key={`ok-${i}`} className="flex items-center gap-2 text-[12px]">
                                <CheckIcon className="text-[#2F61C9]" />
                                <span className="text-black/70">Lorem ipsum Lorem ipsum</span>
                            </li>
                        ))}
                        {Array.from({ length: negative }).map((_, i) => (
                            <li key={`no-${i}`} className="flex items-center gap-2 text-[12px]">
                                <CrossIcon className="text-[#9BB3E6]" />
                                <span className="text-black/40">Lorem ipsum Lorem ipsum</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

/* tiny SVG icons matching screenshot look */
function CheckIcon({ className = "" }) {
    return (
        <svg
            className={`w-[14px] h-[14px] ${className}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}
function CrossIcon({ className = "" }) {
    return (
        <svg
            className={`w-[14px] h-[14px] rotate-45 ${className}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}
