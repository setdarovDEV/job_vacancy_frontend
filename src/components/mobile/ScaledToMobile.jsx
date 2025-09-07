import React, { useMemo } from "react";

/**
 * Desktop UI'ni mobilga TEZ kichraytirish uchun wrapper.
 * - designWidth: desktop dizayn kengligi (1440 yoki 1280)
 * - targetWidth: mobil kenglik (default 393)
 */
export default function ScaledToMobile({
                                           designWidth = 1440,
                                           targetWidth = 393,
                                           children,
                                           className = "",
                                           style = {},
                                       }) {
    const scale = useMemo(() => targetWidth / designWidth, [designWidth, targetWidth]);

    return (
        <div
            className={className}
            style={{
                ...style,
                width: targetWidth,               // mobil konteyner eni (px)
                transform: `scale(${scale})`,     // hamma narsani kichraytirish
                transformOrigin: "top left",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
            }}
        >
            {/* MUHIM: ichki kontent asl desktop kenglikda bo'lsin */}
            <div style={{ width: designWidth }}>{children}</div>
        </div>
    );
}
