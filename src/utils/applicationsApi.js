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
        const nested = item.applicant || {};
        return {
            id: item.id,
            userId: item.userId ?? nested.id,
            name: item.name ?? nested.full_name ?? "—",
            avatar: (item.avatar || nested.avatar || "") || "/user-white.jpg",
            bio: item.bio || nested.bio || nested.profile?.about_me || "",
            cover_letter: item.cover_letter || "",
            position: item.position || nested.position || item.job?.title || "—",
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