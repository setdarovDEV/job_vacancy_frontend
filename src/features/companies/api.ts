import { api } from "@/lib/api";
import type { Page, Company } from "@/types";

export async function fetchCompanies(params?: { page?: number; search?: string }) {
    const { data } = await api.get<Page<Company>>("/companies/", { params });
    return data;
}

export async function fetchCompany(id: number) {
    const { data } = await api.get<Company>(`/companies/${id}/`);
    return data;
}
