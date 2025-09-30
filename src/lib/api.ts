import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PREFIX}`;

export const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});

// ---- Token storage (localStorage) ----
const getAccess = () => localStorage.getItem("access") || "";
const getRefresh = () => localStorage.getItem("refresh") || "";
const setTokens = (a: string, r?: string) => {
    localStorage.setItem("access", a);
    if (r) localStorage.setItem("refresh", r);
};
export const clearTokens = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};

// ---- Attach token on each request ----
api.interceptors.request.use((config) => {
    const token = getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ---- 401 -> refresh once -> retry ----
let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const orig = err.config as any;
        if (err.response?.status === 401 && !orig?._retry) {
            if (refreshing) {
                await new Promise<void>((resolve) => queue.push(resolve));
                orig.headers.Authorization = `Bearer ${getAccess()}`;
                orig._retry = true;
                return api(orig);
            }
            orig._retry = true;
            refreshing = true;
            try {
                const { data } = await axios.post(
                    `${baseURL}/auth/token/refresh/`,
                    { refresh: getRefresh() },
                    { headers: { "Content-Type": "application/json" } }
                );
                setTokens(data.access);
                queue.forEach((fn) => fn());
                queue = [];
                return api(orig);
            } catch {
                clearTokens();
                throw err;
            } finally {
                refreshing = false;
            }
        }
        throw err;
    }
);

// ---- Auth helpers ----
export async function login(email: string, password: string) {
    const { data } = await api.post("/auth/token/", { email, password });
    setTokens(data.access, data.refresh);
    return data;
}

export function authHeader() {
    const t = getAccess();
    return t ? { Authorization: `Bearer ${t}` } : {};
}
