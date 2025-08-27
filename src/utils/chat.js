// services/chatApi.js
import api from "../utils/api";

export const chatApi = {
    async listRooms(q = "") {
        const { data } = await api.get(`/api/chat/rooms/`, { params: { q } });
        return data;
    },
    async listMessages(roomId) {
        const { data } = await api.get(`/api/chat/messages/`, { params: { room: roomId } });
        return data;
    },
    async sendMessage(roomId, { text, file }) {
        const form = new FormData();
        form.append("room", roomId);
        if (text) form.append("text", text);
        if (file) form.append("attachment", file);
        const { data } = await api.post(`/api/chat/messages/`, form);
        return data;
    },
    async markRead(roomId, upToId) {
        return api.post(`/api/chat/messages/mark-read/`, { room_id: roomId, up_to_id: upToId });
    },
    async touch(roomId) {
        return api.post(`/api/chat/messages/touch/`, { room_id: roomId });
    },
    async peerStatus(roomId) {
        const { data } = await api.get(`/api/chat/rooms/${roomId}/peer-status/`);
        return data;
    },
    async searchUsers(q) {
        const { data } = await api.get(`/api/chat/users/search/`, { params: { q } });
        return data;
    },
    async getOrCreateByUsername(username) {
        const { data } = await api.post(`/api/chat/rooms/get-or-create-by-username/`, { username });
        return data;
    },
    // ✅ Ariza bo‘yicha xona yaratish/topish
    async getOrCreateByApplication(applicationId) {
        const { data } = await api.post(`/api/chat/rooms/by-application/`, {
            application_id: applicationId,
        });
        return data; // { id, peer, ... }
    },
};
