import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/api";
import { getCompany, getCompanyStats as getStats, getReviews, followCompany, unfollowCompany } from "../../utils/companyApi";
import { toMediaUrl } from "../../utils/mediaUrl";
import ResumeButton from "../ResumeButton.jsx";

export default function VacancyModal({ company: companyProp, companyId: companyIdProp, onClose, companyId }) {
    const id = companyIdProp ?? companyProp?.id ?? null;

    const [company, setCompany] = useState(companyProp || null);
    const [stats, setStats] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState("Обзор");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followBusy, setFollowBusy] = useState(false);

    // slider step – tablet vs desktop
    const [stepPx, setStepPx] = useState(660);
    useEffect(() => {
        const onResize = () => setStepPx(window.innerWidth < 1024 ? 320 : 660);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // used in arrows
    const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
    const handleNext = () => setCurrentIndex((i) => Math.min(Math.max(0, (reviews?.length || 1) - 1), i + 1));

    // company by companyId (explicit)
    useEffect(() => {
        if (!companyId) return;
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
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

    // initial load (company + stats)
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const [{ data: c }, { data: s }] = await Promise.all([getCompany(id), getStats(id)]);
                setCompany(c);
                setStats(s);
                setIsFollowing(!!s?.is_following);
            } catch (e) {
                console.error("CompanyModal init error:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // reviews when Reviews tab active
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

    const tabs = useMemo(() => ([
        { label: "Обзор", count: null },
        { label: "Отзывы", count: stats?.reviews_count ?? 0 },
        { label: "Вакансии", count: stats?.vacancies_count ?? 0 },
        { label: "Интервью", count: stats?.interviews_count ?? 0 },
        { label: "Фотографии", count: stats?.photos_count ?? 0 },
    ]), [stats]);

    const toggleFollow = async () => {
        if (!id || followBusy) return;
        setFollowBusy(true);
        try {
            const res = isFollowing ? await unfollowCompany(id) : await followCompany(id);
            if (res?.data) {
                setIsFollowing(!!res.data.is_following);
                setStats((prev) => ({ ...(prev || {}), followers_count: res.data.followers_count, is_following: res.data.is_following }));
            } else {
                const { data } = await getStats(id);
                setStats(data);
                setIsFollowing(!!data.is_following);
            }
        } catch (e) {
            console.error("Follow toggle error:", e);
        } finally {
            setFollowBusy(false);
        }
    };

    if (!id || !company) return null;

    const bannerSrc = toMediaUrl(company?.banner) || "/kompaniya-modal.png";
    const logoSrc   = toMediaUrl(company?.logo)   || "/google.png";

    return (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-auto">
            {/* Right sheet: mobile full, tablet ~760px, desktop 1051px */}
            <div
                className="absolute top-0 right-0 bg-white shadow-lg flex flex-col rounded-none max-h-screen overflow-y-auto w-full md:w-[760px] lg:w-[1051px]"
                style={{ borderRadius: "2px" }}
            >
                {/* Banner */}
                <div className="relative h-[160px] md:h-[214px] w-full">
                    <img src={bannerSrc} alt="cover" className="w-full h-full object-cover blur-sm brightness-90" />

                    {/* Back */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 z-[5] w-[34px] h-[18px] bg-transparent border-none p-0 flex items-center justify-center"
                    >
                        <img src="/back.png" alt="exit" className="w-full h-full object-contain" />
                    </button>
                </div>

                {/* Content */}
                <div className="w-full px-4 md:px-10 lg:px-[69px] flex flex-col gap-6 md:gap-8 mt-4 md:mt-[30px]">
                    {/* Logo + name + buttons */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex flex-col items-center gap-[10px] md:gap-[14px]">
                            <div className="w-[72px] h-[72px] md:w-[78px] md:h-[78px] rounded-full overflow-hidden border-4 border-white bg-white">
                                <img src={logoSrc} alt={`${company.name} Logo`} className="w-full h-full object-contain" />
                            </div>
                            <p className="text-[22px] md:text-[30px] font-bold text-black leading-[30px] md:leading-[45px] text-center">
                                {company.name}
                            </p>
                        </div>

                        <div className="flex gap-3 md:gap-4 md:mt-[20px] justify-center">
                            <button
                                onClick={toggleFollow}
                                disabled={followBusy}
                                className={
                                    isFollowing
                                        ? "px-4 md:px-5 h-[40px] md:h-[44px] bg-[#E8EEF9] text-[#3066BE] rounded-md font-semibold"
                                        : "px-4 md:px-5 h-[40px] md:h-[44px] border border-[#3066BE] bg-white text-[#3066BE] rounded-md font-semibold hover:bg-[#3066BE]/10"
                                }
                            >
                                {isFollowing ? "Вы подписаны" : "Подписаться"}
                            </button>

                            <button
                                onClick={() => setActiveTab("Отзывы")}
                                className="px-5 md:px-6 h-[40px] md:h-[44px] bg-[#3066BE] text-white rounded-md text-[14px] md:text-[15px] font-semibold hover:opacity-90 transition"
                            >
                                Оставить отзыв
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b w-full">
                        <div className="flex gap-4 md:gap-8 overflow-x-auto">
                            {tabs.map((tab) => (
                                <div
                                    key={tab.label}
                                    onClick={() => setActiveTab(tab.label)}
                                    className="cursor-pointer flex flex-col items-center justify-center relative px-2 md:px-4 pb-2"
                                >
                                    {tab.count !== null && (
                                        <span className={`text-[18px] md:text-[24px] font-semibold ${activeTab === tab.label ? "text-black" : "text-[#AEAEAE]"}`}>
                      {tab.count}
                    </span>
                                    )}
                                    <span className="text-[18px] md:text-[24px] font-semibold text-black">{tab.label}</span>
                                    {activeTab === tab.label && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3066BE] rounded-sm"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 md:mt-8 px-4 md:px-6 py-6 md:py-8 border border-[#3066BE] bg-[#F4F6FA] rounded-[20px] md:rounded-[30px] w-full max-w-[906px]">
                        <h3 className="text-[22px] md:text-[30px] leading-[28px] md:leading-[36px] text-[#3066BE] font-bold mb-3 md:mb-[17px]">
                            Найдите то, что подходит именно вам — быстрее.
                        </h3>
                        <p className="text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] text-[#AEAEAE] font-[400] max-w-[807px] mb-4 md:mb-[19px]">
                            Получите персонализированную информацию о работе в компании {company.name} за один быстрый шаг.
                        </p>
                        <ResumeButton />
                    </div>

                    {/* Overview */}
                    <div className="w-full max-w-[902px]">
                        <p className="text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] text-black font-medium">
                            {company.description ? company.description : (<>Описание пока не добавлено. <span className="text-[#3066BE]">•</span> {company.location || "—"}</>)}
                        </p>
                    </div>

                    {/* Reviews header */}
                    <div className="w-full max-w-[902px] flex items-center justify-between mt-6 md:mt-10">
                        <h2 className="text-[22px] md:text-[28px] font-bold text-[#3066BE]">
                            Что люди говорят о {company.name}?
                        </h2>
                        <button
                            onClick={() => setActiveTab("Отзывы")}
                            className="text-[14px] md:text-[16px] text-[#3066BE] bg-white underline font-medium hover:opacity-80 transition"
                        >
                            Просмотреть все отзывы
                        </button>
                    </div>

                    {/* Slider */}
                    <div className="relative w-full max-w-[1300px] overflow-hidden mb-12 md:mb-[87px]">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * stepPx}px)` }}
                        >
                            {(reviews.length > 0 ? reviews : Array.from({ length: 1 })).map((item, idx) => (
                                <div
                                    key={item?.id || idx}
                                    className="w-[300px] md:w-[636px] h-auto md:h-[238px] border-[2px] border-[#3066BE] rounded-[10px] p-4 md:p-5 flex-shrink-0 mr-4 md:mr-[24px] bg-white"
                                >
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-3 text-[18px] md:text-[20px] text-yellow-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i}>{i < (item?.rating ?? 5) ? "★" : "☆"}</span>
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <p className="text-black text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] mb-4">
                                        {item?.text || "Пока что отзывов нет."}
                                    </p>

                                    {/* User */}
                                    <div className="flex items-center gap-3 md:gap-4 mt-auto">
                                        <img
                                            src="/review-user.png"
                                            alt={item?.user_name || "User"}
                                            className="w-[48px] h-[48px] md:w-[60px] md:h-[60px] rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-[16px] md:text-[18px] font-bold text-black">{item?.user_name || "Пользователь"}</p>
                                            <p className="text-[12px] md:text-[14px] text-[#2F2F2F]">{item?.country || "—"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Prev */}
                        {currentIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[36px] h-[36px] md:w-[42px] md:h-[42px] bg-white border-[2px] border-[#3066BE] rounded-full shadow-md hover:bg-[#F0F7FF] transition"
                            >
                                <img
                                    src="/pagination.png"
                                    alt="prev"
                                    className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain mx-auto rotate-180"
                                />
                            </button>
                        )}

                        {/* Next */}
                        {currentIndex < Math.max(0, (reviews?.length || 1) - 1) && (
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[36px] h-[36px] md:w-[42px] md:h-[42px] bg-white border-[2px] border-[#3066BE] rounded-full shadow-md hover:bg-[#F0F7FF] transition"
                            >
                                <img
                                    src="/pagination.png"
                                    alt="next"
                                    className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain mx-auto"
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
