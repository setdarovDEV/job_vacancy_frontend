import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // yoki <i className="fas fa-chevron-left" />

const dummyAccounts = Array(10).fill({
    name: "Consulting",
    desc: "Сообщество профессионалов в области консалтинга из разных компаний",
});

export default function TopAccountsCarousel({ lang, texts }) {
    const scrollRef = useRef();

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;
        const scrollAmount = 300;
        container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    };

    return (
        <section className="mt-12">
            <div className="w-full h-px bg-gray-300 mb-6" />
            <div className="flex justify-between items-center px-2 mb-[40px]">
                <h2 className="text-xl font-bold text-black ml-[40px]">{texts?.[lang]?.topAccounts || "Top accounts"}</h2>
                <a href="#" className="text-[#3066BE] text-sm hover:underline">
                    {texts?.[lang]?.seeAll || "See all →"}
                </a>
            </div>

            <div className="relative">
                {/* Left button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute top-1/2 left-0 -translate-y-1/2 z-30
             w-10 h-10 bg-white border border-gray-300 rounded-full
             flex items-center justify-center shadow hover:bg-gray-100"
                >
                    <ChevronLeft className="w-5 h-5 text-[#3066BE] absolute inset-0 m-auto z-40" />
                </button>

                {/* Cards */}
                <div
                    ref={scrollRef}
                    className="overflow-x-auto no-scrollbar flex gap-4 px-12 scroll-smooth"
                >
                    {dummyAccounts.map((acc, idx) => (
                        <div
                            key={idx}
                            className="min-w-[200px] max-w-[200px] bg-white border border-gray-300 rounded-xl p-4 flex flex-col items-center text-center shrink-0"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
                            <h3 className="font-semibold text-black mb-1">{acc.name}</h3>
                            <p className="text-[13px] text-gray-500 mb-3">{acc.desc}</p>
                            <button className="bg-[#E7ECFF] hover:bg-[#d0dcff] text-[#3066BE] px-4 py-1.5 rounded-md text-sm font-medium">
                                {texts?.[lang]?.subscribe || "Subscribe"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Right button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute top-1/2 right-0 -translate-y-1/2 z-30
             w-10 h-10 bg-white border border-gray-300 rounded-full
             flex items-center justify-center shadow hover:bg-gray-100"
                >
                    <ChevronRight className="w-5 h-5 text-[#3066BE] absolute inset-0 m-auto z-40" />
                </button>
            </div>
            <div className="w-full h-px bg-gray-300 mt-6" />
        </section>
    );
}
