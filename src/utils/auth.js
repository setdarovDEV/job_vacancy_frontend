// src/utils/auth.js

/**
 * Token mavjudligini tekshirish
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    return !!token;
};

/**
 * Token va user ma'lumotlarini olish
 */
export const getAuthData = () => {
    return {
        accessToken: localStorage.getItem("access_token"),
        refreshToken: localStorage.getItem("refresh_token"),
        role: localStorage.getItem("role"),
        username: localStorage.getItem("username"),
        userId: localStorage.getItem("user_id"),
    };
};

/**
 * Logout - barcha ma'lumotlarni o'chirish
 */
export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");

    console.log("✅ Logout successful - all tokens cleared");
};

/**
 * Token'ni tekshirish va decode qilish
 */
export const isTokenValid = (token) => {
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;

        return Date.now() < expiry;
    } catch (error) {
        console.error("❌ Token validation error:", error);
        return false;
    }
};

/**
 * Current user role'ni olish
 */
export const getUserRole = () => {
    return localStorage.getItem("role") || null;
};

/**
 * User ID olish
 */
export const getUserId = () => {
    return localStorage.getItem("user_id") || null;
};

/**
 * Username olish
 */
export const getUsername = () => {
    return localStorage.getItem("username") || null;
};