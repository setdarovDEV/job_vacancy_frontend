import { jwtDecode } from "jwt-decode"; // ✅ VITE uchun to‘g‘ri

export function getUserRole() {
    try {
        const token = localStorage.getItem("access");
        if (!token) return null;
        const decoded = jwtDecode(token); // ✅ default emas, named import
        return decoded?.role || null;
    } catch (err) {
        console.error("❌ JWT decode error:", err);
        return null;
    }
}
