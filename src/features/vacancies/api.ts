import { api } from "../../lib/api";
import type { Page, Vacancy } from "../../types/";

export async function fetchVacancies(params?: { page?: number; search?: string; company?: number }) {
    const { data } = await api.get<Page<Vacancy>>("/vacancies/", { params });
    return data;
}

export async function fetchVacancy(id: number) {
    const { data } = await api.get<Vacancy>(`/vacancies/${id}/`);
    return data;
}
