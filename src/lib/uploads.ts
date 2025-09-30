import { api } from "@/lib/api";

export async function uploadFile(endpoint: string, file: File, field = "file", extra: Record<string, any> = {}) {
    const form = new FormData();
    form.append(field, file);
    Object.entries(extra).forEach(([k, v]) => form.append(k, String(v)));
    const { data } = await api.post(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}
