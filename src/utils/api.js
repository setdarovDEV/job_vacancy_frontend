// src/utils/api.js
import axios from "axios";

// Asosiy axios instansiya
const api = axios.create({
    baseURL: "http://localhost:8000",
});

// Refresh uchun alohida axios instansiya (interceptorlarsiz)
const refreshApi = axios.create({
    baseURL: "http://localhost:8000",
});

// Har bir requestdan oldin access_token ni qo‘sh
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Agar 401 bo‘lsa → token yangilash logikasi
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh/")
        ) {
            originalRequest._retry = true;

            try {
                const refresh_token = localStorage.getItem("refresh_token");

                const res = await refreshApi.post("/api/auth/refresh/", {
                    refresh: refresh_token,
                });

                const new_access_token = res.data.access;
                localStorage.setItem("access_token", new_access_token);

                originalRequest.headers["Authorization"] = `Bearer ${new_access_token}`;
                return api(originalRequest);
            } catch (refreshErr) {
                console.error("Token yangilash xatosi:", refreshErr);

                // Logout
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
