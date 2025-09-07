// utils/api.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000", // moslang
    withCredentials: true, // agar cookie-based auth bo‘lsa
});

// JWT bo‘lsa, localStorage’dan token qo‘shamiz
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;


// Query builder: frontdagi filterlarni backend paramlarga aylantiradi
export function buildVacancyParams({ title, location, salary, plan, page }) {
    const params = {};
    if (title?.trim()) params.search = title.trim();     // yoki `title`
    if (location?.trim()) params.location = location.trim();

    // salary.min/max ni mos qilib yuboramiz
    if (salary?.min) params.salary_min = salary.min;
    if (salary?.max) params.salary_max = salary.max;

    if (plan) params.plan = plan;                         // "Basic" | "Pro" | "Premium"
    if (page) params.page = page;

    return params;
}

export async function fetchVacancies(params) {
    // server endpointingizni moslang: masalan "/api/v1/vacancies/"
    const { data } = await api.get("/api/vacancies/", { params });
    return data; // DRF: { count, next, previous, results: [...] }
}
