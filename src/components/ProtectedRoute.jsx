import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
            navigate("/login", { replace: true });
        } else {
            setChecking(false);
        }
    }, [navigate]);

    // Token tekshirilguncha hech narsa render qilmaymiz
    if (checking) return null;

    return children;
}
