// components/tablet/EmployerProfileTablet.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function EmployerProfileTablet() {
    const { id } = useParams();
    const [employer, setEmployer] = useState(null);

    useEffect(() => {
        api.get(`/api/auth/profile/${id}/`).then(r => setEmployer(r.data));
    }, [id]);

    if (!employer) return <div>Загрузка...</div>;

    return (
        <div className="max-w-[768px] mx-auto px-4 py-6">
            <div className="bg-white border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <img src={employer.avatar || "/user.jpg"} alt="avatar" className="w-16 h-16 rounded-full" />
                    <div>
                        <h2 className="text-xl font-bold">{employer.full_name}</h2>
                        <p className="text-sm text-gray-500">{employer.title}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600">{employer.about_me}</p>
            </div>
        </div>
    );
}