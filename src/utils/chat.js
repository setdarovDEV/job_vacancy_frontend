// src/services/chatApi.js
import api from "../utils/api";

export const chatApi = {
    // Get all user's chats
    listChats: async () => {
        const { data } = await api.get("/api/chats/");
        return data;
    },

    // Get or create chat with specific user
    getOrCreateChat: async (userId) => {
        const { data } = await api.post("/api/chats/get_or_create/", { user_id: userId });
        return data;
    },

    // Get messages for specific chat
    getMessages: async (chatId, limit = 100) => {
        const { data } = await api.get(`/api/chats/${chatId}/messages/`, {
            params: { limit },
        });
        return data;
    },

    // Send message (text or file)
    sendMessage: async (chatId, payload) => {
        const formData = new FormData();

        if (payload.text) {
            formData.append("text", payload.text);
        }

        if (payload.file) {
            formData.append("file", payload.file);
        }

        if (payload.image) {
            formData.append("image", payload.image);
        }

        const { data } = await api.post(`/api/chats/${chatId}/messages/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return data;
    },

    // Mark message as read (optional, if backend supports)
    markRead: async (chatId, messageId) => {
        try {
            await api.patch(`/api/chats/${chatId}/messages/${messageId}/`, {
                is_read: true,
            });
        } catch (err) {
            console.warn("Mark read failed:", err);
        }
    },
};