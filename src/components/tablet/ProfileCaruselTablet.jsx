import React from "react";
import Slider from "react-slick";

export default function PortfolioCarousel({ items = [] }) {
    // Dublikatlar bo‘lsa (id yoki file bo‘yicha) filtrlab tashlaymiz
    const unique = Array.from(
        new Map(items.map(it => [(it?.id ?? it?.file), it])).entries()
    ).map(([, v]) => v);

    const total = unique.length;
    const showLg = Math.min(3, total);
    const showMd = Math.min(2, total);

    const settings = {
        dots: false,
        arrows: total > 1,
        speed: 400,
        rows: 1,            // MUHIM: vertikal bo‘lib ketmasin
        slidesPerRow: 1,    // MUHIM
        centerMode: false,
        variableWidth: false,
        slidesToShow: showLg || 1,
        slidesToScroll: 1,
        infinite: total > (showLg || 1),   // 3 tadan ko‘p bo‘lsa cheksiz
        lazyLoad: "ondemand",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: showMd || 1,
                    infinite: total > (showMd || 1),
                    rows: 1,
                    slidesPerRow: 1,
                    arrows: total > 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    infinite: total > 1,
                    rows: 1,
                    slidesPerRow: 1,
                    arrows: total > 1,
                },
            },
        ],
    };

    if (!total) return null;

    return (
        <div className="w-full mt-4 md:mt-5">
            <Slider {...settings}>
                {unique.map((item) => {
                    const key = item?.id ?? item?.file ?? Math.random();
                    const fileUrl = item?.file?.startsWith("http")
                        ? item.file
                        : `http://127.0.0.1:8000${item?.file || ""}`;

                    return (
                        <div key={key} className="px-2">
                            <div className="w-full h-[140px] md:h-[160px] lg:h-[180px] rounded-[15px] overflow-hidden bg-gray-200">
                                {item?.file_type === "image" ? (
                                    <img
                                        src={fileUrl}
                                        alt={item?.title || "portfolio"}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : item?.file_type === "video" ? (
                                    <video
                                        src={fileUrl}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#D9D9D9] flex items-center justify-center text-gray-500 text-sm">
                                        {(item?.file_type || "FILE").toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}
