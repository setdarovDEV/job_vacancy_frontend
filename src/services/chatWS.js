// src/services/chatWS.js
function resolveWsBase() {
    // 1) Maxsus env bo‘lsa, o‘shani olamiz
    if (import.meta?.env?.VITE_WS_BASE) {
        return import.meta.env.VITE_WS_BASE.replace(/\/+$/, "");
    }
    // 2) Aks holda API bazadan hosil qilamiz (http->ws)
    const httpBase =
        import.meta?.env?.VITE_API_BASE ||
        `${window.location.protocol}//${window.location.host}`;
    const u = new URL(httpBase);
    u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
    return u.origin;
}

export class ChatWS {
    constructor({ roomId, token }) {
        this.roomId = roomId;
        this.token = token;
        this.ws = null;
    }
    connect({ onMessage, onTyping, onPresence, onRead } = {}) {
        const base = resolveWsBase();
        const url = `${base}/ws/chat/${this.roomId}/?token=${this.token}`;
        this.ws = new WebSocket(url);

        this.ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.event === "message.created" && onMessage) onMessage(data.message);
                else if (data.event === "typing" && onTyping) onTyping(data);
                else if (data.event === "presence" && onPresence) onPresence(data);
                else if (data.event === "message.read" && onRead) onRead(data);
            } catch {}
        };
        this.ws.onclose = () => { this.ws = null; };
    }
    sendNewMessage(text) {
        if (this.ws?.readyState === 1) {
            this.ws.send(JSON.stringify({ type: "message.new", text }));
        }
    }
    sendTyping(start = true) {
        if (this.ws?.readyState === 1) {
            this.ws.send(JSON.stringify({ type: start ? "typing.start" : "typing.stop" }));
        }
    }
    sendRead(up_to_id) {
        if (this.ws?.readyState === 1) {
            this.ws.send(JSON.stringify({ type: "message.read", up_to_id }));
        }
    }
    close() { if (this.ws) { this.ws.close(); this.ws = null; } }
}
