// utils/applicationsApi.js
import api from "../utils/api";

// Barcha arizalar (employer)
export const fetchEmployerApplications = async ({ page = 1, job = null } = {}) => {
    const q = new URLSearchParams();
    q.set("page", page);
    if (job) q.set("job", job);
    const res = await api.get(`/api/applications/my/applications/?${q.toString()}`);
    return res.data; // {count, results:[{ id, name, avatar, bio, position, skills, userId, ... }]}
};

// Muayyan job bo‘yicha arizalar
export const fetchJobApplicants = async (jobId, page = 1) => {
    const res = await api.get(`/api/applications/jobs/${jobId}/applications/?page=${page}`);
    return res.data;
};

export const normalizeApplicants = (data) => {
    const list = Array.isArray(data?.results)
        ? data.results
        : (Array.isArray(data) ? data : []);
    return list.map((item) => {
        const nested = item.applicant || item.user || {};
        // userId ni to'g'ri olish: item.userId, nested.user?.id, nested.id (agar nested user bo'lsa)
        const userId = item.userId || 
                       item.user?.id || 
                       nested.user?.id || 
                       nested.id || 
                       (nested && typeof nested === 'object' && nested.id ? nested.id : null);
        
        return {
            id: item.id,
            userId: userId,
            name: item.name ?? nested.full_name ?? nested.username ?? "—",
            avatar: (item.avatar || nested.avatar || nested.profile_image || "") || "/user-white.jpg",
            bio: item.bio ?? nested.bio ?? nested.profile?.about_me ?? "",
            cover_letter: item.cover_letter || "",
            position: item.position ?? nested.position ?? item.job?.title ?? "—",
            skills: Array.isArray(item.skills)
                ? item.skills
                : (Array.isArray(nested.skills) ? nested.skills : []),
            rating: item.rating ?? "4.5",
            };
        });
    };

export const fetchApplicantOfApplication = (applicationId) => {
    // api instansiya odatda bazaviy "/api" bilan, shuning uchun bu "/api/applications/..." bo'lib ketadi
    return api.get(`/api/applications/${applicationId}/applicant/`);
};