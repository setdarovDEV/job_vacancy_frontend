import React from "react"

// src/components/ResponsivePage.jsx
export default function ResponsivePage({ children }) {
    return (
        <div className="
      md:[&_h1]:text-[20px]
      md:[&_h2]:text-[18px]
      md:[&_h3]:text-[18px]
      md:[&_p]:text-[13px]
      md:[&_button]:text-[13px] md:[&_button]:h-[38px] md:[&_button]:px-3
      md:[&_input]:text-[13px] md:[&_input]:py-[6px] md:[&_input]:rounded-[8px]
    ">
            {children}
        </div>
    );
}
