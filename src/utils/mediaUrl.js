export const toMediaUrl = (u, host = "http://localhost:8000") => {
    if (!u) return null;
    try { new URL(u); return u; } catch { /* relative */ }
    return u.startsWith("/") ? `${host}${u}` : `${host}/${u}`;
};
