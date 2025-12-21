// src/services/chatApi.js
import api from "../utils/api";
import { fetchApplicantOfApplication } from "./applicationsApi";

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

    // Get or create chat by application ID
    // Application'dan user_id ni olib, chat yaratadi yoki topadi
    getOrCreateByApplication: async (applicationId) => {
        try {
            console.log("🔍 getOrCreateByApplication called with applicationId:", applicationId);
            
            // 1. Application'dan applicant ma'lumotlarini olamiz
            const appRes = await fetchApplicantOfApplication(applicationId);
            const applicant = appRes.data;
            
            console.log("📋 Applicant data from API:", applicant);
            
            // 2. User ID ni olamiz (turli xil strukturalarni qo'llab-quvvatlash)
            // applicant.id, applicant.user?.id, applicant.user_id, yoki to'g'ridan-to'g'ri applicant o'zi user bo'lishi mumkin
            const userId = applicant?.id || 
                          applicant?.user?.id || 
                          applicant?.user_id ||
                          applicant?.applicant?.id ||
                          applicant?.applicant?.user?.id ||
                          (applicant?.user && typeof applicant.user === 'number' ? applicant.user : null);
            
            console.log("👤 Extracted userId:", userId);
            
            if (!userId) {
                console.error("❌ Applicant data structure:", JSON.stringify(applicant, null, 2));
                throw new Error("Application'dan user_id topilmadi. Ma'lumotlar: " + JSON.stringify(applicant));
            }

            // 3. Chat yaratamiz yoki topamiz
            console.log("💬 Creating/getting chat for userId:", userId);
            const chatRes = await api.post("/api/chats/get_or_create/", { user_id: userId });
            const chat = chatRes.data;
            
            console.log("✅ Chat created/found:", chat);

            // 4. Peer (boshqa foydalanuvchi) ma'lumotlarini qaytaramiz
            // chat.other_user mavjud bo'lsa, uni ishlatamiz, aks holda applicant ma'lumotlarini
            const peer = chat.other_user || applicant?.user || applicant?.applicant || applicant;
            
            console.log("👥 Peer data:", peer);
            
            return {
                id: chat.id,
                peer: peer,
            };
        } catch (err) {
            console.error("❌ getOrCreateByApplication error:", err);
            console.error("Error details:", err.response?.data || err.message);
            throw err;
        }
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