// src/pages/LoginSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const access = params.get("access");
        const refresh = params.get("refresh");

        if (access && refresh) {
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return <p>Logging in...</p>;
}
