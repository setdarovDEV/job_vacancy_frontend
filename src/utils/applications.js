// utils/applications.js
import api from "../utils/api";
const BASE = "/api/vacancies/applications"; // <— aynan shu!

export async function fetchEmployerJobApplications(jobPostId, params = {}) {
    if (jobPostId) {
        try {
            const { data } = await api.get(`${BASE}/employer/job/${jobPostId}/`, { params });
            return data;
        } catch {
            const { data } = await api.get(`${BASE}/`, { params: { ...params, job_post_id: jobPostId } });
            return data;
        }
    }
    const { data } = await api.get(`${BASE}/`, { params });
    return data;
}
