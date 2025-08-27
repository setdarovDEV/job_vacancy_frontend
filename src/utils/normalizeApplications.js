// src/utils/normalizeApplications.js
import api from "../utils/api";

// Nisbiy URL'larni absolyutga aylantirish (masalan: /media/... -> http://host/media/...)
const abs = (u) =>
    u && !/^https?:\/\//i.test(u) ? `${api?.defaults?.baseURL || ""}${u}` : u;

/**
 * toList — backend javobini massivga normalizatsiya qiladi.
 * Qabul qiladi: [], {results: []}, {items: []}, {data: []}, DRF paginate va hok.
 */
export function toList(payload) {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.results)) return payload.results;
    if (payload && Array.isArray(payload.items)) return payload.items;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (
        payload &&
        typeof payload === "object" &&
        "count" in payload &&
        Array.isArray(payload.results)
    ) {
        return payload.results;
    }
    return [];
}

/**
 * normalizeApplications — KIRISH: xom javob (array yoki {results:[...]})
 * CHIQISH: normalizatsiya qilingan array
 */
export function normalizeApplications(raw) {
    const list = toList(raw);
    return list.map(normalizeApplicationItem);
}

// ---------- ichki helperlar (export qilinmaydi) ----------

function normalizeApplicationItem(a = {}) {
    // nomzodga ustunlik: applicant || user
    const u = a.applicant ?? a.user ?? null;
    const user = normalizeUser(u);

    // job_post || job
    const jp = a.job_post ?? a.job ?? null;
    const job_post = normalizeJob(jp);

    const cover_letter =
        typeof a.cover_letter === "string" ? a.cover_letter.trim() : "";

    // bio: user.bio/about/summary -> bo'lmasa cover_letter
    const bio = (user.bio || cover_letter || "").trim();

    const created_at = a.created_at || a.applied_at || a.submitted_at || null;
    const status = a.status ?? a.state ?? null;
    const resume = a.resume ?? null;

    return {
        id: a.id ?? a.pk ?? null,
        cover_letter,
        bio,
        created_at,
        status,
        resume,
        user,
        job_post,
    };
}

function normalizeUser(u) {
    if (!u || typeof u !== "object") {
        return {
            id: null,
            full_name: "",
            username: "",
            email: "",
            avatar: null,
            title: null,
            profession: null,
            position: null,
            bio: "",
            skills: [],
        };
    }

    const full_name =
        u.full_name ??
        u.name ??
        `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();

    const username = u.username ?? u.user_name ?? "";
    const email = u.email ?? "";

    // avatar -> absolute url
    const avatarRaw = u.avatar ?? u.photo ?? u.image ?? null;
    const avatar = abs(avatarRaw);

    // kasb/yo'nalish
    const title = u.title ?? u.profession ?? u.job_title ?? u.position ?? null;

    // bio
    const bio = u.bio ?? u.about ?? u.summary ?? "";

    // skills (string yoki {name} bo'lishi mumkin)
    let skills = [];
    if (Array.isArray(u.skills)) {
        skills = u.skills
            .map((s) => (typeof s === "string" ? s : s?.name ?? null))
            .filter(Boolean);
    } else if (u.skills && typeof u.skills === "object" && typeof u.skills.all === "function") {
        // DRF ManyToMany RelatedManager (agar serializer to'g'ridan bermagan bo'lsa)
        try {
            skills = u.skills
                .all()
                .map((s) => (typeof s === "string" ? s : s?.name ?? String(s)))
                .filter(Boolean);
        } catch (_) {}
    }

    return {
        id: u.id ?? null,
        full_name,
        username,
        email,
        avatar,
        title,
        profession: u.profession ?? null,
        position: u.position ?? null,
        bio,
        skills,
    };
}

function normalizeJob(jp) {
    // faqat id kelsa
    if (!jp || typeof jp !== "object") {
        const id =
            typeof jp === "number" && Number.isFinite(jp)
                ? jp
                : jp && !Number.isNaN(Number(jp))
                    ? Number(jp)
                    : null;
        return { id, title: "", skills: [] };
    }

    const id = jp.id ?? null;
    const title = jp.title ?? jp.name ?? "";

    let skills = [];
    if (Array.isArray(jp.skills)) {
        skills = jp.skills
            .map((s) => (typeof s === "string" ? s : s?.name ?? null))
            .filter(Boolean);
    } else if (jp.skills && typeof jp.skills === "object" && typeof jp.skills.all === "function") {
        try {
            skills = jp.skills
                .all()
                .map((s) => (typeof s === "string" ? s : s?.name ?? String(s)))
                .filter(Boolean);
        } catch (_) {}
    }

    return { id, title, skills };
}
