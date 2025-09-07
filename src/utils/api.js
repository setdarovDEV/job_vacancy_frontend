// utils/api.js
import axios from "axios";

const API_BASE = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: API_BASE,
    // withCredentials: false  // JWT uchun odatda kerak emas
});

// Request: access tokenni headerga qo'yish
api.interceptors.request.use((config) => {
    const access = localStorage.getItem("access") || localStorage.getItem("access_token");
    if (access) {
        config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
});

// Response: 401 bo'lsa refresh qilib qayta urinish
let isRefreshing = false;
let pending = [];

function onRefreshed(newToken) {
    pending.forEach((cb) => cb(newToken));
    pending = [];
}

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error?.response?.status;
        const original = error.config;

        if (status === 401 && !original._retry) {
            original._retry = true;

            const refresh = localStorage.getItem("refresh") || localStorage.getItem("refresh_token");
            if (!refresh) {
                // logout/redirect logic bo'lishi mumkin
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // refresh tugaguncha navbatda turamiz
                return new Promise((resolve) => {
                    pending.push((token) => {
                        original.headers.Authorization = `Bearer ${token}`;
                        resolve(api.request(original));
                    });
                });
            }

            try {
                isRefreshing = true;
                const { data } = await axios.post(`${API_BASE}/api/auth/refresh/`, { refresh });
                const newAccess = data?.access || data?.access_token;
                if (newAccess) {
                    localStorage.setItem("access", newAccess);
                    localStorage.setItem("access_token", newAccess);
                    api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
                    onRefreshed(newAccess);
                    return api.request(original);
                }
            } catch (e) {
                // refresh ham o'tmadi -> logout
                localStorage.removeItem("access");
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh");
                localStorage.removeItem("refresh_token");
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
