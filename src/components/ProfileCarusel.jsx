// src/components/ProfileCarusel.jsx

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function PortfolioCarousel({ items }) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfileCarusel.jsx:8',message:'PortfolioCarousel rendered',data:{itemsCount:items?.length||0,firstItem:items?.[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-60 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[15px]">
                <svg className="w-20 h-20 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 text-lg font-medium">Портфолио пусто</p>
                <p className="text-gray-400 text-sm mt-1">Добавьте проекты, чтобы показать свою работу</p>
            </div>
        );
    }

    if (items.length === 1) {
        const firstItem = items[0];
        const mediaFile = firstItem.media_files && firstItem.media_files.length > 0 
            ? firstItem.media_files[0] 
            : null;
        const fileUrl = firstItem.file || mediaFile?.file_url || mediaFile?.file;
        
        return (
            <div className="w-full">
                <div className="relative h-[300px] bg-gray-100 rounded-[15px] overflow-hidden">
                    {fileUrl ? (
                        <img
                            src={fileUrl}
                            alt={firstItem.title || firstItem.project?.title || 'Portfolio'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error("❌ Portfolio rasm yuklanmadi:", fileUrl);
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    {/* Placeholder */}
                    <div className={`${fileUrl ? "hidden" : "flex"} absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100`}>
                        <svg className="w-20 h-20 text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-blue-600 font-medium">{firstItem.title || "Изображение недоступно"}</p>
                    </div>
                </div>
            </div>
        );
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
    };

    return (
        <div className="portfolio-carousel">
            <Slider {...settings}>
                {items.map((item, index) => {
                    // media_files array ichidan file'ni olamiz yoki item.file'ni ishlatamiz
                    const mediaFile = item.media_files && item.media_files.length > 0 
                        ? item.media_files[0] 
                        : null;
                    const fileUrl = item.file || mediaFile?.file_url || mediaFile?.file;
                    
                    return (
                        <div key={item.id || index} className="px-2">
                            <div className="relative h-[300px] bg-gray-100 rounded-[15px] overflow-hidden">
                                {fileUrl ? (
                                    <img
                                        src={fileUrl}
                                        alt={item.title || item.project?.title || `Portfolio ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.error("❌ Portfolio rasm yuklanmadi:", fileUrl);
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                {/* Placeholder */}
                                <div className={`${fileUrl ? "hidden" : "flex"} absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100`}>
                                    <svg className="w-20 h-20 text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-blue-600 font-medium text-lg">{item.title || `Проект ${index + 1}`}</p>
                                    <p className="text-blue-500 text-sm mt-1">Изображение недоступно</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}