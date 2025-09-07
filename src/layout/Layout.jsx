import React from "react"

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#F7F8FA]">
            <main className="mx-auto w-full max-w-[1200px] px-[var(--page-x)]">
                {children}
            </main>
        </div>
    );
}