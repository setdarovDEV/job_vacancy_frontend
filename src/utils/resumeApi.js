// utils/resumeApi.js
import api from "./api";
export const getMyResume = () => api.get("/api/resumes/my/");
export const createResume = (payload) => api.post("/api/resumes/", payload);
export const updateMyResume = (payload) => api.patch("/api/resumes/my/", payload);
