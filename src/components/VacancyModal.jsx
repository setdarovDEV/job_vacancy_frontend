import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function VacancyModal({ onClose, vacancy }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchVacancyDetail = async () => {
            if (!vacancy?.id) return;
            try {
                const token = localStorage.getItem("access_token");
                const res = await axios.get(`http://localhost:8000/api/vacancies/jobposts/${vacancy.id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(res.data);
            } catch (err) {
                console.error("Vakansiya detailni olishda xatolik:", err);
            }
        };

        fetchVacancyDetail();
    }, [vacancy?.id]);

    const handleApply = async () => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.post(
                "http://localhost:8000/api/applications/apply/",
                {
                    job_post: data.id,
                    cover_letter: "", // optional, xohlasa qo‘shasan
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("Arizangiz yuborildi ✅");
        } catch (err) {
            if (err.response?.status === 400) {
                alert("Siz allaqachon ariza yuborgansiz ❗️");
            } else {
                console.error("Xatolik:", err);
                alert("Xatolik yuz berdi");
            }
        }
    };


    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end items-start p-4 overflow-auto">
            <div
                className="fixed top-0 right-0 z-50 bg-white shadow-lg flex flex-col lg:flex-row rounded-none"
                style={{ width: "1051px", height: "900px" }}
            >

                {/* LEFT - Vakansiya Ma’lumotlari */}
                <div className="w-full lg:w-3/4 p-8 overflow-y-auto">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 left-6 z-50 bg-white border-none ml-[-8px]"
                    >
                        <img
                            src="/back.png"
                            alt="Back"
                            className="w-[34px] h-[18px] object-contain bg-white"
                        />
                    </button>



                    <h2
                        className="w-[433px] h-[45px] text-[30px] leading-[150%] text-black font-semibold mt-12 mb-2"
                    >
                        {data?.title}
                    </h2>

                    <div className="flex items-center gap-3 mb-4 ml-[2px]">
                        {/* Soat blok */}
                        <div className="flex items-center gap-[6px] text-[#AEAEAE] text-[12px] leading-[18px] font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12.86"
                                height="12.86"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#AEAEAE"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{data?.timeAgo}</span> {/* backenddan keladi */}
                        </div>

                        <div className="flex items-center gap-[6px] text-[#AEAEAE] text-[12px] leading-[17px] font-medium">
                            {/* Lokatsiya icon (inline SVG) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#AEAEAE"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>

                            <span>{data?.location || "Не указано"}</span>
                        </div>

                    </div>

                    <div className="w-[800px] h-[1px] bg-[#AEAEAE] mx-auto my-6 ml-[2px]"></div>

                    <h3 className="text-[18px] leading-[29px] text-black mb-2 font-semibold ml-[2px]">
                        Описание
                    </h3>

                    <div
                        className="text-[15px] leading-[22.5px] text-black mb-6 font-medium ml-[2px]"
                    >
                        {data?.description}
                    </div>

                    <div className="w-[800px] h-[1px] bg-[#AEAEAE] mx-auto my-6 ml-[2px]"></div>

                    {/* Budget va Deadline */}
                    <div className="flex flex-wrap items-center gap-6">
                        {/* Dollar icon + Budget */}
                        <div className="flex items-center gap-[6px] text-[20px] leading-[30px] text-black font-medium ml-[2px]">
                            <img src="/dollar.png" alt="budget" className="w-[16px] h-[28px] object-contain" />
                            <span className="text-[#3066BE]">:</span>
                            {data?.budget}
                        </div>

                        <div className="text-[18px] leading-[29px] text-black font-semibold ml-[164px]">
                            Крайний срок: {data?.duration ? new Date(data.duration).toLocaleDateString() : "Не указано"}
                        </div>
                    </div>


                    <div className="w-[800px] h-[1px] bg-[#AEAEAE] mx-auto my-6 ml-[2px]"></div>

                    {/* Skills */}
                    <div className="mb-6">
                        {/* Sarlavha */}
                        <p
                            className="text-[18px] leading-[29px] text-black mb-3 font-semibold ml-[2px]"
                        >
                            Навыки и опыт
                        </p>

                        {/* Skill teglar */}
                        <div className="flex flex-wrap gap-3">
                            {data?.skills?.map((skill, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-200 text-black text-[14px] px-4 py-1.5 rounded-full font-medium ml-[2px]"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="w-[800px] h-[1px] bg-[#AEAEAE] mx-auto my-6 ml-[2px]"></div>

                    {/* Boshqa vakansiyalar */}
                    <div className="">
                        <p className="text-[18px] leading-[29px] text-black mb-3 font-semibold ml-[2px]">
                            Другие открытые вакансии этого клиента
                        </p>

                        <div className="flex flex-col gap-[6px]">
                            {data?.otherVacancies?.length > 0 ? (
                                data.otherVacancies.map((item, i) => (
                                    <a
                                        key={i}
                                        href={`/vacancies/${item.id}`} // yoki modal orqali ochilsa, `onClick` beriladi
                                        className="text-[#3066BE] text-[16px] cursor-pointer hover:underline font-medium ml-[2px]"
                                    >
                                        {item.title}
                                    </a>
                                ))
                            ) : (
                                <span className="text-[#AEAEAE] text-[15px] ml-[2px]">
                                    Нет других открытых вакансий
                                </span>
                            )}
                        </div>
                    </div>


                </div>

                <div className="w-px h-[calc(100%-150px)] bg-[#AEAEAE] my-[75px] mx-4"></div>

                {/* RIGHT - Client Info */}
                <div className="w-1/4 mt-[90px] bg-white p-8 rounded-r-xl flex flex-col items-center gap-4 overflow-y-auto">

                    {/* Откликнуться tugmasi */}
                    <button
                        onClick={handleApply}
                        className="flex items-center justify-center gap-[10px] bg-[#3066BE] hover:bg-[#2b58a8] text-white text-[16px] font-medium rounded-[10px] px-[25px] py-[15px]"
                        style={{ width: '167px', height: '59px' }}
                    >
                        Откликнуться
                    </button>


                    {/* Сохранить tugmasi */}
                    <button
                        className="flex items-center justify-center gap-[11px] border border-[#3066BE] text-[#3066BE] text-[16px] font-medium rounded-[10px] px-[25px] py-[15px] bg-white hover:bg-[#f2f7ff] transition"
                        style={{ width: '168px', height: '59px' }}
                    >
                        <img src="/save.png" alt="save" className="w-4 h-4" />
                        Сохранить
                    </button>

                    <div className="mt-6">
                        <p className="text-[20px] leading-[32px] font-gilroy font-bold text-black">
                            О клиенте
                        </p>
                    </div>

                    {/* Info */}
                    <div className="text-sm mt-4 space-y-2 text-gray-700 w-full">
                        <div className="flex items-center gap-2 relative">
                            <img src="/badge-background.svg" alt="bg" className="w-6 h-6" />
                            <img src="/check.svg" alt="check" className="absolute w-3 h-3 top-[6px] left-[6px]" />
                            {data?.is_fixed_price ? "Фиксированная оплата" : "Почасовая оплата"}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Yulduzlar */}
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < data?.average_stars ? "fill-yellow-400" : "fill-gray-300"}`}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09L5.82 12.5 1 8.91l6.09-.9L10 2.5l2.91 5.51 6.09.9-4.82 3.59 1.698 5.59z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Matn */}
                            <p className="text-[13px] leading-[150%] font-medium text-[#AEAEAE] text-center whitespace-nowrap">
                                {data?.average_stars} из {data?.ratings_count} отзывов
                            </p>
                        </div>
                        <div className="text-[15px] leading-[150%] text-[#AEAEAE] font-medium">
                            {data?.location}
                        </div>
                        <p className="text-[15px] leading-[150%] font-medium text-[#AEAEAE]">
                            Компания:
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-8 h-8 rounded-full bg-[#D9D9D9] overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-[#D9D9D9] overflow-hidden">
                                    {data?.company?.logo && (
                                        <img
                                            src={data.company.logo}
                                            alt="Logo"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    )}
                                </div>

                            </div>


                            <p className="text-[13px] leading-[150%] font-medium text-black">
                                {data?.company?.name || "Компания не указана"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-[15px] leading-[150%] font-medium text-[#AEAEAE]">
                                {data?.company?.jobpost_count} вакансий размещено
                            </p>
                            <p className="text-[10px] leading-[150%] font-medium text-[#AEAEAE]">
                                Уровень найма {data?.company?.hire_rate}, {data?.company?.open_jobpost_count} открытые вакансии
                            </p>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    );
}
