import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileDropdownJobSeeker from "./ProfileDropdownJobSeeker.jsx";
import ProfileDropdownEmployer from "./ProfileDropdownEmployer.jsx";

export default function ProfileDropdown() {
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
        return <ProfileDropdownJobSeeker />;
    } else if (role === "EMPLOYER") {
        return <ProfileDropdownEmployer />;
    } else {
        return <div>Nomaʼlum rol!</div>;
    }
}
