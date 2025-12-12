// src/utils/api.js
import axios from 'axios';

// ✅ BASE URL - Production
const BASE_URL = 'https://jobvacancy-api.duckdns.org';

// ✅ API instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 90000,
    withCredentials: true,
});

// ✅ Request interceptor - token qo'shish
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// ✅ Response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ✅ 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                console.error('❌ No refresh token found - logging out');
                isRefreshing = false;
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                console.log('🔄 Refreshing access token...');

                const res = await axios.post(
                    `${BASE_URL}/api/auth/refresh/`,
                    { refresh: refreshToken }
                );

                const newAccessToken = res.data.access;

                console.log('✅ Token refreshed successfully');

                localStorage.setItem('access_token', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                isRefreshing = false;

                return api(originalRequest);

            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);

                processQueue(refreshError, null);
                isRefreshing = false;

                localStorage.clear();
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        // ✅ Boshqa error'lar
        if (error.response) {
            console.error('❌ API Error:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url
            });
        }

        return Promise.reject(error);
    }
);

// ✅ MEDIA URL HELPER - Avatar, Certificate, Portfolio rasmlari uchun
export const getMediaURL = (path) => {
    if (!path) {
        console.warn('⚠️ getMediaURL: path is null or undefined');
        return null;
    }

    // Agar allaqachon to'liq URL bo'lsa (http:// yoki https:// bilan boshlansa)
    if (typeof path === 'string' && (path.startsWith('http://') || path.startsWith('https://'))) {
        return path;
    }

    // Nisbiy yo'lni to'liq URL ga aylantirish
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${BASE_URL}${cleanPath}`;
};

// ✅ FILE URL HELPER - Backend dan kelgan file obyektlarini to'g'ri URL ga aylantirish
export const getFileURL = (fileObj) => {
    if (!fileObj) return null;

    // Agar string bo'lsa
    if (typeof fileObj === 'string') {
        return getMediaURL(fileObj);
    }

    // Agar obyekt bo'lsa va file yoki url fieldi bo'lsa
    if (typeof fileObj === 'object') {
        const url = fileObj.file || fileObj.url || fileObj.file_url;
        return getMediaURL(url);
    }

    return null;
};

// ✅ AVATAR URL HELPER - User avatar rasmini olish
export const getAvatarURL = (user, fallback = '/user.jpg') => {
    if (!user) return fallback;

    // Turli avatar field nomlarini tekshirish
    const avatarPath = user.profile_image || user.avatar || user.photo || user.image;

    if (!avatarPath) return fallback;

    return getMediaURL(avatarPath);
};

// ✅ LOGO URL HELPER - Company logo rasmini olish
export const getLogoURL = (company, fallback = '/company-default.png') => {
    if (!company) return fallback;

    const logoPath = company.logo || company.logo_url;

    if (!logoPath) return fallback;

    return getMediaURL(logoPath);
};

// ✅ BANNER URL HELPER - Company banner rasmini olish
export const getBannerURL = (company, fallback = '/banner-default.png') => {
    if (!company) return fallback;

    const bannerPath = company.banner || company.banner_url;

    if (!bannerPath) return fallback;

    return getMediaURL(bannerPath);
};

// ✅ CHECK IF IMAGE EXISTS - Rasm mavjudligini tekshirish
export const checkImageExists = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};

// ✅ FORMAT FILE SIZE - Fayl o'lchamini formatli ko'rsatish
export const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// ✅ GET FILE EXTENSION - Fayl kengaytmasini olish
export const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
};

// ✅ IS IMAGE FILE - Fayl rasm ekanligini tekshirish
export const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const ext = getFileExtension(filename);
    return imageExtensions.includes(ext);
};

// ✅ IS VIDEO FILE - Fayl video ekanligini tekshirish
export const isVideoFile = (filename) => {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
    const ext = getFileExtension(filename);
    return videoExtensions.includes(ext);
};

// ✅ IS PDF FILE - Fayl PDF ekanligini tekshirish
export const isPDFFile = (filename) => {
    const ext = getFileExtension(filename);
    return ext === 'pdf';
};

// ✅ DOWNLOAD FILE - Faylni yuklab olish
export const downloadFile = async (url, filename) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('❌ Download error:', error);
        throw error;
    }
};

// ✅ DEFAULT EXPORT
export default api;