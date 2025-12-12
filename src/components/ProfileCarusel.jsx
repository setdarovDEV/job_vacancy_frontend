import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function PortfolioCarousel({ items }) {
    // ✅ Agar 1 ta yoki kamroq bo'lsa - carousel kerak emas
    if (!items || items.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-400">
                <p>Portfolio mavjud emas</p>
            </div>
        );
    }

    // ✅ Agar 1 ta bo'lsa - faqat bitta rasm
    if (items.length === 1) {
        return (
            <div className="w-full">
                <img
                    src={items[0].file}
                    alt={items[0].project?.title || 'Portfolio'}
                    className="w-full h-[300px] object-cover rounded-[15px]"
                />
            </div>
        );
    }

    // ✅ Agar 2+ bo'lsa - carousel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,  // ✅ Faqat 1 ta ko'rsatish
        slidesToScroll: 1,  // ✅ 1 tadan siljish
        arrows: true,
        autoplay: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div className="portfolio-carousel">
            <Slider {...settings}>
                {items.map((item, index) => (
                    <div key={item.id || index} className="px-2">
                        <img
                            src={item.file}
                            alt={item.project?.title || `Portfolio ${index + 1}`}
                            className="w-full h-[300px] object-cover rounded-[15px]"
                        />
                    </div>
                ))}
            </Slider>

            <style jsx>{`
                .portfolio-carousel :global(.slick-prev),
                .portfolio-carousel :global(.slick-next) {
                    width: 40px;
                    height: 40px;
                    z-index: 10;
                }

                .portfolio-carousel :global(.slick-prev) {
                    left: 10px;
                }

                .portfolio-carousel :global(.slick-next) {
                    right: 10px;
                }

                .portfolio-carousel :global(.slick-prev:before),
                .portfolio-carousel :global(.slick-next:before) {
                    font-size: 40px;
                    color: #3066BE;
                }

                .portfolio-carousel :global(.slick-dots li button:before) {
                    color: #3066BE;
                }

                .portfolio-carousel :global(.slick-dots li.slick-active button:before) {
                    color: #3066BE;
                }
            `}</style>
        </div>
    );
}