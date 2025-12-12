// components/mobile/EmployerProfileMobile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function EmployerProfileMobile() {
    const { id } = useParams();
    const [employer, setEmployer] = useState(null);

    useEffect(() => {
        api.get(`/api/auth/profile/${id}/`).then(r => setEmployer(r.data));
    }, [id]);

    if (!employer) return <div className="text-center py-10">Загрузка...</div>;

    return (
        <div className="px-3 py-4">
            <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                    <img src={employer.avatar || "/user.jpg"} alt="avatar" className="w-14 h-14 rounded-full" />
                    <div>
                        <h2 className="text-lg font-bold">{employer.full_name}</h2>
                        <p className="text-xs text-gray-500">{employer.title}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600">{employer.about_me}</p>
            </div>
        </div>
    );
}