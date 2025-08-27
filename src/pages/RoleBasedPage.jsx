import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfilePage from "./ProfilePage"; // to‘g‘ri yo‘ldan import qil
import HomeEmployer from "./HomeEmployer";

export default function RoleBasedPage() {
    const [role, setRole] = useState(null);
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        if (!token) return;

        axios.get("http://127.0.0.1:8000/api/auth/me/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => setRole(res.data.role))
        .catch(err => console.error("Rolda xatolik:", err));
    }, []);

    if (role === null) {
        return <div>Yuklanmoqda...</div>;
    }

    if (role === "JOB_SEEKER") {
        return <ProfilePage />;
    } else if (role === "EMPLOYER") {
        return <HomeEmployer />;
    } else {
        return <div>Nomaʼlum rol!</div>;
    }
}
