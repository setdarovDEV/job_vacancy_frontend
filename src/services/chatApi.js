// src/services/chatApi.js
import api from "../utils/api.js";

export const chatApi = {
    async listChats() {
        const res = await api.get("/api/chats/");
        return res.data;
    },

    async getMessages(chatId, limit = 100) {
        const res = await api.get(`/api/chats/${chatId}/messages/?limit=${limit}`);
        return res.data;
    },

    async sendMessage(chatId, { text, file, image }) {
        const formData = new FormData();
        if (text) formData.append("text", text);
        if (file) formData.append("file", file);
        if (image) formData.append("image", image);
        const res = await api.post(`/api/chats/${chatId}/messages/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    async getOrCreate(userId) {
        const res = await api.post("/api/chats/get_or_create/", { user_id: userId });
        return res.data;
    },

    async markRead(chatId, lastId) {
        // backendda alohida “mark as read” yo‘q, shuning uchun hozircha no-op
        // agar keyin WS qo‘shilsa — shu yerda ishlatamiz
        return Promise.resolve(true);
    },
};
