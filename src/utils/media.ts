export function asMediaUrl(path?: string | null) {
    if (!path) return "";
    const base = import.meta.env.VITE_API_BASE_URL as string;
    return new URL(path, base).href;
}
