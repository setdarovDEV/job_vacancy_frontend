// API helperlar: saqlangan vakansiyalar va arizalar (applylar) uchun
// Mavjud axios instance'ni ishlatamiz (utils/api) – sendagi loyiha shunday edi.
import api from "../utils/api";

// --- Saqlangan vakansiyalar ---
// GET /api/vacancies/saved/
export async function fetchSavedVacancies(page = 1) {
    const { data } = await api.get(`/api/vacancies/saved/?page=${page}`);
    // Backend ko‘pincha {results, count, next, previous} qaytaradi
    return normalizePaginated(data);
}

// DELETE /api/vacancies/saved/:id/
export async function removeSavedVacancy(id) {
    await api.delete(`/api/vacancies/saved/${id}/`);
    return true;
}

// --- ARIZALAR (APPLY) ---
// GET /api/vacancies/applications/
export async function fetchApplications(page = 1) {
    const { data } = await api.get(`/api/vacancies/applications/?page=${page}`);
    return normalizePaginated(data);
}

// --- helper ---
function normalizePaginated(payload) {
    // Backend turli format bo‘lishi mumkin, xavfsiz normalize
    if (Array.isArray(payload)) {
        return { results: payload, count: payload.length, next: null, previous: null };
    }
    return {
        results: payload.results ?? [],
        count: payload.count ?? (payload.results?.length ?? 0),
        next: payload.next ?? null,
        previous: payload.previous ?? null,
    };
}
