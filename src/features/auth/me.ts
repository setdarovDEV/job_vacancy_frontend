import { api } from "@/lib/api";

export async function fetchMe() {
    const { data } = await api.get("/accounts/me/");
    return data;
}
