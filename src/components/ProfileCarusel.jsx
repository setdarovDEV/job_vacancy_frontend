import React from "react";
import Slider from "react-slick";

export default function PortfolioCarousel({ items }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // bir vaqtning o‘zida nechta ko‘rsatilsin
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <div className="w-full mt-6">
            <Slider {...settings}>
                {items.map((item, index) => {
                    const fileUrl = item.file?.startsWith("http")
                        ? item.file
                        : `http://127.0.0.1:8000${item.file}`;

                    return (
                        <div key={index} className="px-2">
                            <div className="w-full h-[180px] rounded-[15px] overflow-hidden bg-gray-200">
                                {item.file_type === "image" ? (
                                    <img
                                        src={fileUrl}
                                        alt="portfolio"
                                        className="w-full h-full object-cover"
                                    />
                                ) : item.file_type === "video" ? (
                                    <video
                                        src={fileUrl}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#D9D9D9] flex items-center justify-center text-gray-500 text-sm">
                                        {item.file_type.toUpperCase()}
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
