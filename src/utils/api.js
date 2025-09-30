import axios from "axios";

const RAW = (import.meta.env.VITE_API_URL || "").replace(/\/+$/,""); // trailing slash yo'q
export const API_BASE = RAW || "https://job-vacancy-z5uo.onrender.com";

const api = axios.create({
    baseURL: API_BASE, // ← bu yerda /api YO'Q (bazaga to'liq domen)
    withCredentials: false,
});

// Token avtomatik qo'shilsin
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;

// Yordamchilar
export const apiPath = (p) => {
    const right = String(p || "").replace(/^\/+/,'');
    return `${API_BASE}/${right}`.replace(/([^:]\/)\/+/g,'$1');
};

export const mediaUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return apiPath(path.startsWith("/") ? path.slice(1) : path);
};
