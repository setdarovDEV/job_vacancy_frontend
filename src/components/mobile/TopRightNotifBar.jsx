// components/TopRightNotifBar.jsx
import React from "react";

export default function TopRightNotifBar({
                                             count = 1,
                                             onHelpClick,
                                             onBellClick,
                                             fixed = true,      // true -> ekranning eng tepasiga "yopishtiriladi"
                                             className = "",
                                         }) {
    const position = fixed
        ? "fixed top-2 right-4 sm:top-3 sm:right-6"
        : "absolute top-2 right-4 sm:top-3 sm:right-6";

    return (
        <div className={`${position} z-[60] ${className}`}>
            <div className="flex items-center gap-6 text-black mt-[50px] mb-[40px]">
                {/* Bell */}
                <button onClick={onBellClick} className="relative bg-white" aria-label="Notifications">
                    {/* kontur qo‘ng‘iroq (figmadagi kabi) */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1"
                        />
                    </svg>

                    {/* Qizil badge */}
                    {count > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                          {count}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
