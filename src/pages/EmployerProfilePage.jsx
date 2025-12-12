import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown.jsx";

export default function EmployerProfilePage() {
    const { id } = useParams(); // URL'dan employer ID ni olamiz
    const [employer, setEmployer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployer = async () => {
            try {
                const res = await api.get(`/api/auth/profile/${id}/`);
                setEmployer(res.data);
            } catch (err) {
                console.error("Employer profilni olishda xatolik:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployer();
    }, [id]);

    if (loading) return <div className="text-center py-20">Загрузка...</div>;
    if (!employer) return <div className="text-center py-20">Профиль не найден</div>;

    return (
        <div className="font-sans bg-[#F4F6FA] min-h-screen">
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-10 h-[90px]">
                    <a href="/"><img src="/logo.png" alt="Logo" className="w-[109px] h-[72px]" /></a>
                    <div className="flex gap-8 font-semibold text-[16px]">
                        <a href="/community" className="hover:text-[#3066BE]">Сообщество</a>
                        <a href="/vacancies" className="hover:text-[#3066BE]">Вакансии</a>
                        <a href="/chat" className="hover:text-[#3066BE]">Чат</a>
                        <a href="/companies" className="hover:text-[#3066BE]">Компании</a>
                    </div>
                    <ProfileDropdown />
                </div>
            </nav>

            <div className="pt-[120px] pb-10 max-w-7xl mx-auto px-4">
                {/* USER CARD */}
                <div className="bg-white border border-[#AEAEAE] rounded-[25px] p-8">
                    <div className="flex items-center gap-6 mb-6">
                        <img
                            src={employer.avatar || "/user-white.jpg"}
                            alt="avatar"
                            className="w-[100px] h-[100px] rounded-full object-cover border"
                        />
                        <div>
                            <h2 className="text-[28px] font-bold text-black">{employer.full_name}</h2>
                            <p className="text-[16px] text-[#AEAEAE]">{employer.title || "Должность не указана"}</p>
                            <p className="text-[14px] text-gray-500 flex items-center gap-2 mt-2">
                                <img src="/location.png" alt="loc" className="w-4 h-4" />
                                {employer.latitude && employer.longitude
                                    ? `${employer.latitude}, ${employer.longitude}`
                                    : "Местоположение не указано"}
                            </p>
                        </div>
                    </div>

                    {/* ABOUT ME */}
                    <div className="mb-6">
                        <h3 className="text-[20px] font-bold mb-2">О себе</h3>
                        <p className="text-[15px] text-gray-600">{employer.about_me || "Информация отсутствует"}</p>
                    </div>

                    {/* EDUCATIONS */}
                    {employer.educations?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-[20px] font-bold mb-2">Образование</h3>
                            {employer.educations.map((edu, i) => (
                                <div key={i} className="border-b pb-2 mb-2">
                                    <p className="font-semibold">{edu.academy_name}</p>
                                    <p className="text-sm text-gray-500">{edu.degree} ({edu.start_year} - {edu.end_year})</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CERTIFICATES */}
                    {employer.certificates?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-[20px] font-bold mb-2">Сертификаты</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {employer.certificates.map((cert, i) => (
                                    <div key={i} className="border rounded-lg p-3">
                                        <p className="font-semibold text-sm">{cert.name}</p>
                                        <p className="text-xs text-gray-500">{cert.organization}</p>
                                        <a href={cert.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Просмотреть</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}