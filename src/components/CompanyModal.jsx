import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import { getCompany } from "../utils/companyApi"; // yo‘lingizga moslang


import {
    getCompanyStats as getStats,
    getReviews,
    followCompany,
    unfollowCompany,
} from "../utils/companyApi";
import { toMediaUrl } from "../utils/mediaUrl";
import ResumeButton from "./ResumeButton.jsx";


const TABS = [
    { label: "Обзор", count: null },
    { label: "Отзыва", count: 2 },
    { label: "Вакансии", count: 20 },
    { label: "Интервью", count: 20 },
    { label: "Фотографии", count: 20 },
];

export default function VacancyModal({ company: companyProp, companyId: companyIdProp, onClose, companyId }) {
    // const companyId = company?.id;
    const id = companyIdProp ?? companyProp?.id ?? null;

    // 2) State
    const [company, setCompany] = useState(companyProp || null);
    const [stats, setStats] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState("Обзор");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followBusy, setFollowBusy] = useState(false);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const token = localStorage.getItem("access_token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const { data } = await api.get(`/api/companies/${encodeURIComponent(companyId)}/`, { headers });
                if (isMounted) setCompany(data);
            } catch (e) {
                console.error("Company detail error:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [companyId]);

    // 3) Dastlabki yuklash (company + stats)
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const [{ data: c }, { data: s }] = await Promise.all([
                    getCompany(id),
                    getStats(id),
                ]);
                setCompany(c);
                setStats(s);
            } catch (e) {
                console.error("CompanyModal init error:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        if (activeTab !== "Отзывы" || !id) return;
        (async () => {
            try {
                setLoading(true);
                const { data } = await getReviews(id);
                const list = Array.isArray(data?.results) ? data.results : data;
                setReviews(list || []);
                setCurrentIndex(0);
            } catch (e) {
                console.error("Reviews load error:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [activeTab, id]);

    // 6) Tabs countlari
    const TABS = useMemo(
        () => [
            { label: "Обзор", count: null },
            { label: "Отзывы", count: stats?.reviews_count ?? 0 },
            { label: "Вакансии", count: stats?.vacancies_count ?? 0 },
            { label: "Интервью", count: stats?.interviews_count ?? 0 },
            { label: "Фотографии", count: stats?.photos_count ?? 0 },
        ],
        [stats]
    );


    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const [{ data: c }, { data: s }] = await Promise.all([getCompany(id), getStats(id)]);
                setCompany(c);
                setStats(s);
                setIsFollowing(!!s?.is_following); // <— YANGI
            } finally {}
        })();
    }, [id]);

    const toggleFollow = async () => {
        if (!id || followBusy) return;
        setFollowBusy(true);
        try {
            const res = isFollowing ? await unfollowCompany(id) : await followCompany(id);
            // Agar backend patch 2 ni qo‘ysang ↓ bir martada yangilanadi:
            if (res?.data) {
                setIsFollowing(!!res.data.is_following);
                setStats((prev) => ({ ...(prev || {}), followers_count: res.data.followers_count }));
            } else {
                // Aks holda statsni qayta olib kelamiz
                const { data } = await getStats(id);
                setStats(data);
                setIsFollowing(!!data.is_following);
            }
        } catch (e) {
            console.error("Follow toggle error:", e);
            // bu yerda login modal ochish yoki toast ko‘rsatish mumkin
        } finally {
            setFollowBusy(false);
        }
    };

    if (!company && loading) return null;


    // 7) Guard — id yoki company yo‘q bo‘lsa hech narsa chizma
    if (!id || !company) return null;

    // 8) Rasm src’larini xavfsiz olish (null bo‘lsa fallback)
    const bannerSrc = toMediaUrl(company?.banner) || "/kompaniya-modal.png";
    const logoSrc   = toMediaUrl(company?.logo)   || "/google.png";

    if (!company) return null;

    if (loading || !company) return <div className="text-gray-500">Yuklanmoqda…</div>;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-auto">
            {/* MODAL OYNA */}
            <div
                className="absolute top-0 right-0 bg-white shadow-lg flex flex-col rounded-none max-h-screen overflow-y-auto"
                style={{ width: "1051px", borderRadius: "2px" }}
            >
                {/* ✅ RASM QISMI */}
                <div className="relative h-[214px] w-full">
                    <img src={bannerSrc} alt="cover" className="w-full h-full object-cover blur-sm brightness-90" />


                    {/* CHIQISH TUGMASI */}
                    <button
                        onClick={onClose}
                        className="absolute top-[20px] left-[20px] z-[9999] w-[34px] h-[18px] bg-transparent border-none p-0"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <img src="/back.png" alt="exit" className="w-full h-full object-contain" />
                    </button>
                </div>

                {/* ✅ KONTENT QISMI */}
                <div className="w-full px-[69px] flex flex-col gap-8 mt-[30px]">
                    {/* Logo + Company Name */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col items-center gap-[14px]">
                            <div className="w-[78px] h-[78px] rounded-full overflow-hidden border-4 border-white bg-white">
                                <img src={logoSrc} alt={`${company.name} Logo`} className="w-full h-full object-contain" />
                            </div>
                            <p className="text-[30px] font-bold text-black leading-[45px]">
                                {company.name}
                            </p>
                        </div>

                        {/* Tugmalar */}
                        <div className="flex gap-4 mt-[20px]">
                            <button
                                onClick={toggleFollow}
                                disabled={followBusy}
                                className={
                                    isFollowing
                                        ? "px-5 h-[44px] bg-[#E8EEF9] text-[#3066BE] rounded-md font-semibold"
                                        : "px-5 h-[44px] border border-[#3066BE] bg-white text-[#3066BE] rounded-md font-semibold hover:bg-[#3066BE]/10"
                                }
                            >
                                {isFollowing ? "Вы подписаны" : "Подписаться"}
                            </button>

                            <button
                                onClick={() => setActiveTab("Отзывы")}
                                className="px-6 h-[44px] bg-[#3066BE] text-white rounded-md text-[15px] font-semibold hover:opacity-90 transition"
                            >
                                Оставить отзыв
                            </button>
                        </div>
                    </div>

                    {/* ✅ TABS */}
                    <div className="border-b w-full">
                        <div className="flex gap-8">
                            {TABS.map((tab) => (
                                <div
                                    key={tab.label}
                                    onClick={() => setActiveTab(tab.label)}
                                    className="cursor-pointer flex flex-col items-center justify-center relative px-4 pb-2"
                                >
                                    {/* Son tepada */}
                                    {tab.count !== null && (
                                        <span
                                            className={`text-[24px] font-semibold ${
                                                activeTab === tab.label ? "text-black" : "text-[#AEAEAE]"
                                            }`}
                                        >
                      {tab.count}
                    </span>
                                    )}

                                    {/* Label pastda */}
                                    <span className={`text-[24px] font-semibold ${activeTab === tab.label ? "text-black" : "text-black"}`}>
                    {tab.label}
                  </span>

                                    {/* Chiziq */}
                                    {activeTab === tab.label && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3066BE] rounded-sm"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA + Overview description (dinamik) */}
                    <div className="mt-8 px-6 py-8 border border-[#3066BE] bg-[#F4F6FA] rounded-[30px] w-[906px] h-[273px]">
                        <h3 className="text-[30px] leading-[36px] text-[#3066BE] font-bold max-w-[1000px] mb-[17px]">
                            Найдите то, что подходит именно вам — быстрее.
                        </h3>
                        <p className="text-[20px] leading-[30px] text-[#AEAEAE] font-[400] max-w-[807px] mb-[19px]">
                            Получите персонализированную информацию о работе в компании {company.name} за один быстрый шаг.
                        </p>
                        <ResumeButton />
                    </div>

                    <div className="max-w-[902px] mx-auto mt-10">
                        <p className="text-[20px] leading-[30px] text-black font-medium">
                            {company.description
                                ? company.description
                                : (
                                    <>Описание пока не добавлено. <span className="text-[#3066BE]">•</span> {company.location || "—"}</>
                                )}
                        </p>
                    </div>

                    {/* Reviews preview (slider) */}
                    <div className="w-full flex justify-between items-center max-w-[902px] mx-auto mt-10">
                        <h2 className="text-[28px] font-bold text-[#3066BE]">
                            Что люди говорят о {company.name}?
                        </h2>
                        <button
                            onClick={() => setActiveTab("Отзывы")}
                            className="text-[16px] text-[#3066BE] bg-white underline font-medium hover:opacity-80 transition"
                        >
                            Просмотреть все отзывы
                        </button>
                    </div>

                    <div className="relative w-full max-w-[1300px] mx-auto overflow-hidden mb-[87px]">
                        {/* SLIDER container */}
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 660}px)` }}
                        >
                            {(reviews.length > 0 ? reviews : Array.from({ length: 1 })).map((item, idx) => (
                                <div
                                    key={item?.id || idx}
                                    className="w-[636px] h-[238px] border-[2px] border-[#3066BE] rounded-[10px] p-5 flex-shrink-0 mr-[24px] bg-white"
                                >
                                    {/* Yulduzcha */}
                                    <div className="flex gap-1 mb-3 text-[20px] text-yellow-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i}>{i < (item?.rating ?? 5) ? "★" : "☆"}</span>
                                        ))}
                                    </div>

                                    {/* Matn */}
                                    <p className="text-black text-[16px] leading-[24px] mb-4">
                                        {item?.text || "Пока что отзывов нет."}
                                    </p>

                                    {/* User */}
                                    <div className="flex items-center gap-4 mt-auto">
                                        <img
                                            src="/review-user.png"
                                            alt={item?.user_name || "User"}
                                            className="w-[60px] h-[60px] rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-[18px] font-bold text-black">{item?.user_name || "Пользователь"}</p>
                                            <p className="text-[14px] text-[#2F2F2F]">{item?.country || "—"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CHAP tugma */}
                        {currentIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[42px] h-[42px] bg-white border-[2px] border-[#3066BE] rounded-full shadow-md relative hover:bg-[#F0F7FF] transition"
                            >
                                <img
                                    src="/pagination.png"
                                    alt="prev"
                                    className="w-[24px] h-[24px] object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180"
                                />
                            </button>
                        )}

                        {/* O‘NG tugma */}
                        {currentIndex < Math.max(0, reviews.length - 1) && (
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[42px] h-[42px] bg-white border-[2px] border-[#3066BE] rounded-full shadow-md relative hover:bg-[#F0F7FF] transition"
                            >
                                <img
                                    src="/pagination.png"
                                    alt="next"
                                    className="w-[24px] h-[24px] object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
