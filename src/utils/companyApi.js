import api from "./api"; // axios instance

export const getCompany = (id, headers = {}) => {
    if (!id) throw new Error("getCompany: id kerak");
    return api.get(`/api/companies/${encodeURIComponent(id)}/`, { headers });
};

export const getCompanyStats = (id) => api.get(`/api/companies/${id}/stats/`);

export const getReviews = (id, page = 1) =>
    api.get(`/api/companies/${id}/reviews/?page=${page}`);
export const postReview = (id, payload) =>
    api.post(`/api/companies/${id}/reviews/`, payload);

export const getPhotos = (id, page = 1) =>
    api.get(`/api/companies/${id}/photos/?page=${page}`);
export const uploadPhoto = (id, file, caption = "") => {
    const form = new FormData();
    form.append("image", file);
    if (caption) form.append("caption", caption);
    return api.post(`/api/companies/${id}/photos/`, form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getInterviews = (id, page = 1) =>
    api.get(`/api/companies/${id}/interviews/?page=${page}`);
export const postInterview = (id, payload) =>
    api.post(`/api/companies/${id}/interviews/`, payload);

// 🔹 FOLLOW / UNFOLLOW TOGGLE (backenddagi endpoint `toggle-follow`)
export const followCompany = (id) => api.post(`/api/companies/${id}/toggle-follow/`);
export const unfollowCompany = (id) => api.post(`/api/companies/${id}/toggle-follow/`);
