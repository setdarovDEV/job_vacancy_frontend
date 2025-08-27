import api from "./api"; // sening axios instance

export const listPosts = (params = {}) =>
    api.get("/api/community/posts/", { params });

export const createPost = (payload) =>
    api.post("/api/community/posts/", payload); // {content, image? (FormData bilan)}

export const likePost = (id) => api.post(`/api/community/posts/${id}/like/`);
export const unlikePost = (id) => api.post(`/api/community/posts/${id}/unlike/`);

export const getComments = (postId, page = 1) =>
    api.get(`/api/community/posts/${postId}/comments/?page=${page}`);

export const addComment = (postId, payload) =>
    api.post(`/api/community/posts/${postId}/comments/`, payload); // {text, parent?}
