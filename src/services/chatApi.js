// services/chatApi.js
import api from "../utils/api";

export const chatApi = {
    // 1. Hamma xonalar
    async fetchChatRooms() {
        const res = await api.get("/api/chat/rooms/");
        return res.data;
    },

    // 2. Yangi xona yaratish
    async createRoom(userId) {
        const res = await api.post("/api/chat/rooms/", {
            users: [userId],
        });
        return res.data;
    },

    // 3. Biror xonadagi xabarlar
    async fetchMessages(roomId) {
        const res = await api.get(`/api/chat/rooms/${roomId}/messages/`);
        return res.data;
    },

    // 4. Xabar yuborish
    async sendMessage({ roomId, text }) {
        const res = await api.post("/api/chat/messages/", {
            room: roomId,
            text: text,
        });
        return res.data;
    },

    // 5. O'qilgan deb belgilash
    async markRead(roomId, messageId) {
        return api.post(`/api/chat/messages/${messageId}/mark_read/`);
    },
};