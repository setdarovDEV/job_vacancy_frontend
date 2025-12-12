import React, {useEffect, useState} from "react";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";
import api from "../../utils/api.js";
import UserSearch from "./UserSearchTablet";
import {useNavigate} from "react-router-dom";
import TopAccountsCarousel from "./TopAccountsCarousel";
import { ThumbsUp, MessageCircle} from 'lucide-react';



export default function CommunityTablet() {
    // ==========================
    // STATE
    // ==========================
    const [showModal, setShowModal] = useState(false);
    const [selectedLang, setSelectedLang] = useState({flag: "/ru.png", code: "RU"});
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostImage, setNewPostImage] = useState(null);
    const [creating, setCreating] = useState(false);
    const [likePending, setLikePending] = useState({});
    const [commentOpen, setCommentOpen] = useState(null);     // qaysi post uchun panel ochiq
    const [commentsMap, setCommentsMap] = useState({});       // { [postId]: {items, count, next, loading} }
    const [newCommentMap, setNewCommentMap] = useState({});
    const navigate = useNavigate();
    const [profileImage] = useState(localStorage.getItem("profile_image") || null);
    const [user, setUser] = useState(null);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [posts, setPosts] = useState([]);
    const [paging, setPaging] = useState({ page: 1 });
    const [selectedUser, setSelectedUser] = useState(null);
    const [topCompanies, setTopCompanies] = useState([]);

    const fetchPost = async ({ authorId = null, page = 1 } = {}) => {
        try {
            const params = { ordering: "-created_at", page };
            if (authorId) params.author = authorId;   // ✅ to‘g‘ri filter
            const { data } = await api.get("/api/posts/", { params }); // ✅ DOIMO /posts/
            const items = data?.results ?? data ?? [];
            setPosts(Array.isArray(items) ? items : []);
            setPaging({
                page,
                next: data?.next || null,
                prev: data?.previous || null,
                count: data?.count || items.length,
            });
        } catch (e) {
            console.error("Postlarni olishda xatolik:", e);
        }
    };

// boshlang'ich yuklash
    useEffect(() => { fetchPost(); }, []);

// user tanlanganda
    const handlePickUser = (u) => {
        setSelectedUser(u);
        fetchPost({ authorId: u.id, page: 1 });   // ✅ page=1 dan boshlaymiz
    };

// sahifalash misoli:
    const gotoPage = (p) => {
        fetchPost({ authorId: selectedUser?.id || null, page: p });
    };


    const timeAgo = (iso, langCode="RU") => {
        if (!iso) return "";
        const diff = Date.now() - new Date(iso).getTime();
        const sec = Math.max(1, Math.floor(diff / 1000));
        if (sec < 60)  return langCode === "RU" ? `${sec} c`     : `${sec} s`;
        const min = Math.floor(sec / 60);
        if (min < 60)  return langCode === "RU" ? `${min} мин`   : `${min} daq`;
        const hr  = Math.floor(min / 60);
        if (hr  < 24)  return langCode === "RU" ? `${hr} ч`      : `${hr} soat`;
        const d   = Math.floor(hr / 24);
        return langCode === "RU" ? `${d} д` : `${d} kun`;
    };

    const fetchPosts = async (page = 1) => {
        try {
            setLoading(true);
            const { data } = await api.get("/api/posts/", { params: { page, ordering: "-created_at" } });
            setPosts(Array.isArray(data) ? data : (data.results || []));
        } catch (e) {
            console.error("Postlarni olishda xatolik:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(1); }, []);

    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewPostImage(e.target.files[0]);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim() && !newPostImage) {
            alert("Post matni yoki rasm bo‘lishi shart.");
            return;
        }

        const formData = new FormData();
        formData.append("content", newPostContent);
        if (newPostImage) {
            formData.append("image", newPostImage);
        }

        try {
            setCreating(true);
            const { data } = await api.post("/api/posts/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Yangi postni ro‘yxatga qo‘shamiz
            setPosts((prev) => [data, ...prev]);
            // Modalni tozalash va yopish
            setNewPostContent("");
            setNewPostImage(null);
            setShowModal(false);
        } catch (error) {
            console.error("Post yaratishda xatolik:", error);
            alert("Post yaratishda xatolik yuz berdi.");
        } finally {
            setCreating(false);
        }
    };


    const toggleLike = async (postId) => {
        if (likePending[postId]) return;

        const prev = posts.find((p) => p.id === postId);
        const prevLiked = !!prev?.is_liked;
        const prevCount = prev?.likes_count ?? 0;

        // Optimistik UI
        setPosts((cur) =>
            cur.map((p) =>
                p.id === postId
                    ? { ...p, is_liked: !prevLiked, likes_count: Math.max(0, prevCount + (prevLiked ? -1 : 1)) }
                    : p
            )
        );
        setLikePending((s) => ({ ...s, [postId]: true }));

        try {
            const { data } = await api.post(`/api/posts/${postId}/like/`);
            setPosts((cur) =>
                cur.map((p) => (p.id === postId ? { ...p, is_liked: data.liked, likes_count: data.likes_count } : p))
            );
        } catch (err) {
            // Revert
            setPosts((cur) =>
                cur.map((p) => (p.id === postId ? { ...p, is_liked: prevLiked, likes_count: prevCount } : p))
            );
            if (err?.response?.status === 401) alert("Лайк uchun tizimga kiring.");
            console.error("Like xatosi:", err);
        } finally {
            setLikePending((s) => ({ ...s, [postId]: false }));
        }
    };

// PANELNI OCHISH/YOPISH
    const toggleCommentsOpen = (postId) => {
        if (commentOpen === postId) {
            setCommentOpen(null);
            return;
        }
        setCommentOpen(postId);
        if (!commentsMap[postId]?.items) loadComments(postId);
    };

// KOMMENTLARNI YUKLASH
    const loadComments = async (postId, pageUrl = null) => {
        setCommentsMap(m => ({ ...m, [postId]: { ...(m[postId]||{}), loading: true } }));
        try {
            const url = pageUrl || `/api/posts/${postId}/comments/`;
            const { data } = await api.get(url);
            setCommentsMap(m => ({
                ...m,
                [postId]: {
                    items: pageUrl ? [ ...(m[postId]?.items||[]), ...data.results ] : data.results,
                    count: data.count,
                    next: data.next,
                    loading: false,
                }
            }));
        } catch (e) {
            console.error("Comments load error:", e);
            setCommentsMap(m => ({ ...m, [postId]: { ...(m[postId]||{}), loading: false } }));
        }
    };

    const loadMoreComments = (postId) => {
        const next = commentsMap[postId]?.next;
        if (next) loadComments(postId, next);
    };

// YANGI KOMMENT YUBORISH (optimistik)
    const handleAddComment = async (postId) => {
        const text = (newCommentMap[postId] || "").trim();
        if (!text) return;

        const temp = {
            id: `temp-${Date.now()}`,
            author_name: "Siz",
            content: text,
            created_at: new Date().toISOString(),
        };

        // UIga darhol qo‘shamiz
        setCommentsMap(m => {
            const prev = m[postId]?.items || [];
            return { ...m, [postId]: { ...(m[postId]||{}), items: [temp, ...prev], count: (m[postId]?.count||0)+1 } };
        });
        setNewCommentMap(m => ({ ...m, [postId]: "" }));
        setPosts(cur => cur.map(p => p.id === postId ? { ...p, comments_count: (p.comments_count||0)+1 } : p));

        try {
            const { data } = await api.post(`/api/posts/${postId}/comments/`, { content: text });
            // temp ni haqiqiy kommentga almashtiramiz
            setCommentsMap(m => {
                const items = (m[postId]?.items || []).map(c => c.id === temp.id ? data : c);
                return { ...m, [postId]: { ...(m[postId]||{}), items } };
            });
        } catch (e) {
            // Revert
            setCommentsMap(m => {
                const items = (m[postId]?.items || []).filter(c => c.id !== temp.id);
                return { ...m, [postId]: { ...(m[postId]||{}), items, count: Math.max(0, (m[postId]?.count||1)-1) } };
            });
            setPosts(cur => cur.map(p => p.id === postId ? { ...p, comments_count: Math.max(0, (p.comments_count||1)-1) } : p));
            if (e?.response?.status === 401) alert("Kommentariya uchun tizimga kiring.");
            console.error("Comment add error:", e);
        }
    };

    useEffect(() => {
    const fetchTopCompanies = async () => {
        try {
        const { data } = await api.get("/api/companies/top/", {
            params: { ordering: "-followers_count", limit: 5 },
        });
        const items = Array.isArray(data) ? data : data.results || [];
        setTopCompanies(items);
        console.log("✅ Top companies:", items);
        } catch (e) {
        console.error("❌ Top companies error:", e);
        }
    };

    fetchTopCompanies();
    }, []);

// sahifaning ichida yoki alohida util qilib
    const mediaUrl = (path, fallback = "/profile.png") => {
        // bo'sh bo'lsa darrov fallback
        if (!path || typeof path !== "string") return fallback;

        // allaqachon to‘liq yoki data/blob bo‘lsa o‘zgartirmaymiz
        if (/^(?:https?:)?\/\//i.test(path) || /^data:/i.test(path) || /^blob:/i.test(path)) {
            return path;
        }

        // BASE oxiridagi / larni kesib tashlaymiz
        const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        const BASE = String(RAW_BASE).replace(/\/+$/, "");

        // kerakli / ni qo‘shamiz
        const p = path.startsWith("/") ? path : `/${path}`;
        return `${BASE}${p}`;
    };


    const handleView = (rawId) => {
        const id = rawId ?? null;
        if (!id) return console.warn("TopCompany: id yo‘q:", rawId);
        navigate(`/companies?open=${encodeURIComponent(id)}`);
    };

    const capitalizeName = (fullName) => {
        if (!fullName) return "";
        return fullName
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);
            } catch (err) {
                console.error("Foydalanuvchi ma'lumotini olishda xatolik:", err);
            }
        };

        fetchUser();
    }, []);

    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    const texts = {
        RU: {
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            login: "Войти",
            logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО",
                "Инвесторам", "Каталог компаний", "Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            anonymous: "Разместить пост анонимно",
            asSchoolStudent: "как студент школы",
            asCollegeStudent: "как студент колледжа",
            asUniversityStudent: "как студент университета",
            createPost: "Создать публикацию",
            createPublication: "Создать публикацию",
            placeholder: "Поделитесь своим опытом или получите совет от других профессионалов...",
            publish: "Опубликовать",
            like: "Лайк",
            comment: "Комментарий",
            send: "Отправить",
            search: "Поиск...",
            postText: "Я сказал, что мой ожидаемый ctc составляет 10 lpa, но я чувствую, что у них есть лучший диапазон зарплат от 12 lpa до 16 lpa... Если честно, я думаю что ожидания могут совпасть с предложениями на рынке. Посмотрим что будет дальше.",
            hour: "2 ч",
            topAccounts: "Топ аккаунты",
            seeAll: "Посмотреть все →",
            communityDesc: "Сообщество профессионалов в области...",
            view: "Смотреть",
            subscribe: "Подписаться"
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            login: "Kirish",
            logo: "Logo",
            links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari",
                "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo‘yicha ishlar"],
            copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            anonymous: "Postni anonim joylashtirish",
            asSchoolStudent: "maktab o‘quvchisi sifatida",
            asCollegeStudent: "kollej talabasi sifatida",
            asUniversityStudent: "universitet talabasi sifatida",
            createPost: "Post yaratish",
            createPublication: "Post yaratish",
            placeholder: "O‘z tajribangiz bilan o‘rtoqlashing yoki boshqa professionallardan maslahat oling...",
            publish: "Yaratish",
            like: "Layk",
            comment: "Izoh",
            send: "Yuborish",
            search: "Qidiruv...",
            postText: "Men aytdimki, mening kutilayotgan ish haqi (ctc) 10 lpa, lekin ular 12 lpa dan 16 lpa gacha yaxshiroq diapazonga ega deb o‘ylayman... Ochig‘i, o‘ylaymanki, kutgan narsalarim bozor takliflari bilan mos kelishi mumkin. Ko‘ramiz, nima bo‘ladi.",
            hour: "2 s",
            topAccounts: "Top akkauntlar",
            seeAll: "Hammasini ko‘rish →",
            communityDesc: "Konsalting sohasidagi professionallar jamiyati...",
            view: "Ko‘rish",
            subscribe: "Obuna bo‘lish"
        },
        EN: {
            community: "Community", vacancies: "Vacancies", chat: "Chat", companies: "Companies",
            login: "Login",
            logo: "Logo",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements",
                "For Investors", "Company Catalog", "Jobs by Profession"],
            copyright: "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            anonymous: "Post anonymously",
            asSchoolStudent: "as a school student",
            asCollegeStudent: "as a college student",
            asUniversityStudent: "as a university student",
            createPost: "Create post",
            createPublication: "Create publication",
            placeholder: "Share your experience or get advice from other professionals...",
            publish: "Publish",
            like: "Like",
            comment: "Comment",
            send: "Send",
            search: "Search...",
            postText: "I said my expected ctc is 10 lpa, but I feel they have a better salary range from 12 lpa to 16 lpa... Honestly, I think my expectations might match the market offers. Let’s see what happens next.",
            hour: "2 h",
            topAccounts: "Top accounts",
            seeAll: "See all →",
            communityDesc: "Community of professionals in consulting...",
            view: "View",
            subscribe: "Subscribe"
        }
    };

    function renderPost(givenPost, idx, arr) {
        const post = posts.find(p => p.id === givenPost.id) || givenPost;
        return (
            <div key={post.id ?? idx} className={`${idx === arr.length - 1 ? 'mb-[72px]' : ''}`}>
                <div className="flex flex-col gap-4 p-5 transition duration-300 bg-white shadow-sm rounded-2xl hover:shadow-md">

                    {/* USTKI QISM */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-[48px] h-[48px] rounded-full overflow-hidden border border-gray-200">
                                <img
                                    key={profileImage}
                                    src={mediaUrl(post.author?.avatar_url || post.author_avatar, "/user1.png")}
                                    alt="avatar"
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </div>

                            <h2 className="text-[18px] font-bold text-black">
                                {capitalizeName(post.author?.full_name || post.author_name || "Foydalanuvchi")}
                            </h2>
                        </div>

                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <button className="relative w-8 h-8 transition bg-white border-2 border-transparent rounded hover:border-black">
                                <img src="/three-dots.svg" alt="menu" className="absolute inset-0 w-4 h-4 m-auto" />
                            </button>
                            <div className="text-[13px] leading-[18px] text-[#AEAEAE]">
                                {timeAgo(post.created_at, langCode)}
                            </div>
                        </div>
                    </div>

                    {/* MARKAZIY QISM */}
                    <p className="text-[15px] text-gray-800 leading-relaxed">
                        {post.content}
                    </p>

                    {/* PASTKI QISM */}
                    <div className="flex gap-8 text-[#AEAEAE] font-medium text-[14px]">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleLike(post.id)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleLike(post.id)}
                            className={`flex items-center gap-2 cursor-pointer transition
                            ${post.is_liked ? "text-[#3066BE]" : "text-[#AEAEAE] hover:text-[#3066BE]"}
                            ${likePending[post.id] ? "pointer-events-none opacity-60" : ""}`}
                            aria-pressed={post.is_liked}
                        >
                            <ThumbsUp size={18} />
                            {texts[langCode].like}
                        </div>

                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleCommentsOpen(post.id)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleCommentsOpen(post.id)}
                            className="flex items-center gap-2 transition cursor-pointer hover:text-blue-600"
                        >
                            <MessageCircle size={18} />
                            {texts[langCode].comment}
                        </div>
                    </div>

                    {/* Kommentlar */}
                    {commentOpen === post.id && (
                        <div className="mt-1">
                            <div className="flex items-center w-full gap-2">
                                <input
                                    type="text"
                                    value={newCommentMap[post.id] || ""}
                                    onChange={(e) =>
                                        setNewCommentMap((m) => ({ ...m, [post.id]: e.target.value }))
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleAddComment(post.id)
                                    }
                                    placeholder={texts[langCode].commentPlaceholder || "Комментарий..."}
                                    autoComplete="off"
                                    className="flex-1 h-10 border border-gray-300 rounded-md px-3 text-sm text-gray-800 outline-none
                  focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/30"
                                />
                                <button
                                    onClick={() => handleAddComment(post.id)}
                                    className="shrink-0 h-10 px-4 rounded-md bg-[#3066BE] text-white text-sm hover:bg-[#264f90] transition"
                                >
                                    {texts[langCode].send || "Отправить"}
                                </button>
                            </div>

                            <div className="mt-3 space-y-2">
                                {(commentsMap[post.id]?.items || []).map((c) => (
                                    <div key={c.id} className="text-sm text-gray-800">
                  <span className="font-medium">
                    {c.author_name || c.author?.full_name || "User"}:{" "}
                  </span>
                                        <span>{c.content}</span>
                                    </div>
                                ))}

                                {commentsMap[post.id]?.loading && (
                                    <div className="text-[#AEAEAE] text-sm">Yuklanmoqda...</div>
                                )}

                                {commentsMap[post.id]?.next && !commentsMap[post.id]?.loading && (
                                    <button
                                        onClick={() => loadMoreComments(post.id)}
                                        className="text-[#3066BE] text-sm hover:underline"
                                    >
                                        {texts[langCode].loadMore || "Yana ko‘rsatish"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full h-px mt-4 bg-gray-200" />
            </div>
        );
    }



    return (
        <>
            <NavbarTabletLogin />

            {/* ========================== */}
            {/* SEARCH BLOK — TABLET       */}
            {/* ========================== */}
            <div className="bg-white mt-[84px] md:mt-[90px] md:block lg:hidden">
                <div className="mx-auto max-w-[960px] px-4 py-3">
                    {/* Qator: qidiruv (markazda) + ikonlar */}
                    <div className="flex items-center justify-between gap-3">
                        {/* Qidiruv */}
                        <div className="flex justify-center flex-1">
                            <div className="w-full max-w-[420px]">
                                <UserSearch onSelect={handlePickUser} />
                            </div>
                        </div>

                        {/* O‘ngdagi ikonlar */}
                        <div className="flex items-center gap-3 shrink-0">
                        </div>
                    </div>

                    {/* Tanlangan user filtri (chip) */}
                    {selectedUser && (
                        <div className="mt-2 flex items-center gap-2 text-[13px]">
                            <span className="text-black">Filtr:</span>
                            <img
                                src={mediaUrl(selectedUser.avatar_url ?? "", "/profile.png")}
                                className="object-cover w-5 h-5 rounded-full"
                                alt=""
                            />
                            <span className="text-[#3066BE] truncate">@{selectedUser.username}</span>

                            <button
                                className="ml-auto h-8 px-3 rounded-md border border-[#3066BE] text-[#3066BE] bg-white hover:bg-[#F5F8FF] transition"
                                onClick={() => {
                                    setSelectedUser(null);
                                    fetchPosts();
                                }}
                            >
                                Tozalash
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ================================
               COMMUNITY BODY — TABLET (md)
           ================================ */}
            <div className="md:block lg:hidden">
                <div className="max-w-[960px] mx-auto w-full px-4 mt-6 space-y-8">

                    {/* 1-QATOR: POST YARATISH + FAQAT 2TA POST */}
                    <div className="grid md:grid-cols-[260px_1fr] gap-6">
                        {/* LEFT (post yaratish) */}
                        <aside className="sticky top-[96px] h-max">
                            <div className="bg-white p-4 rounded-xl shadow-lg border border-[#E7ECF3]">
                                <div className="text-[#AEAEAE] text-[13px] leading-[18px] mb-2">
                                    {texts?.[langCode]?.anonymous || "Anonymous"}
                                </div>

                                <select
                                    className="w-full mb-4 px-3 py-2.5 rounded-md bg-[#3066BE]/10 text-black
                        focus:outline-none border-none appearance-none cursor-pointer"
                                >
                                    <option>{texts?.[langCode]?.asSchoolStudent || "Maktab o‘quvchisi"}</option>
                                    <option>{texts?.[langCode]?.asCollegeStudent || "Kollej o‘quvchisi"}</option>
                                    <option>{texts?.[langCode]?.asUniversityStudent || "Universitet talaba"}</option>
                                </select>

                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full h-[44px] bg-[#3066BE] text-white rounded-[10px]
                        text-[14px] font-medium hover:bg-[#274f94] transition"
                                >
                                    {texts?.[langCode]?.createPost || "Post yaratish"}
                                </button>
                            </div>
                        </aside>

                        {/* RIGHT (faqat 2ta post) */}
                        <main className="flex flex-col gap-6">
                            {(loading || posts.length > 0) && (
                                <div className="w-full h-px mb-1 bg-gray-200" />
                            )}

                            {loading && (
                                <div className="text-center text-[#AEAEAE] py-6">Yuklanmoqda...</div>
                            )}

                            {!loading && posts.length === 0 && (
                                <div className="text-center text-[#AEAEAE] py-6">Hozircha postlar yo‘q</div>
                            )}

                            {posts.slice(0, 2).map(renderPost)}
                        </main>
                    </div>

                    {/* 2-QATOR: TOP ACCOUNTS (BUTUN ENI) */}
                    <TopAccountsCarousel
                        lang={langCode?.toUpperCase()}
                        texts={texts}
                        companies={topCompanies}   // 🔹 qo‘shildi!
                    />

                    {/* 3-QATOR: QOLGAN POSTLAR */}
                    <div className="flex flex-col gap-6 w-[450px] ml-[284px]">
                        {posts.slice(2).map(renderPost)}
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                        <div className="bg-white rounded-2xl pt-5 pb-4 px-5 w-[680px] max-w-[95%] relative shadow-xl">

                            {/* Yopish tugmasi */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
        bg-white border border-[#3066BE] rounded-full border-none text-[#3066BE] text-[20px] transition"
                            >
                                ×
                            </button>

                            {/* Sarlavha */}
                            <h2 className="text-center text-[17px] text-black font-semibold pb-3 border-b border-gray-200">
                                {texts[langCode].createPublication}
                            </h2>

                            {/* Textarea */}
                            <textarea
                                className="mt-3 w-full h-[220px] border-none border-[#E1E6EF] rounded-lg p-4 text-sm text-gray-800 resize-none placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-[#3066BE]/30 focus:border-[#3066BE]"
                                placeholder={texts[langCode].placeholder}
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />

                            {/* PASTKI QISM: rasm + tugma */}
                            <div className="flex items-center justify-between mt-4">
                                {/* Yaratish tugmasi */}
                                <button
                                    onClick={handleCreatePost}
                                    disabled={creating}
                                    className="bg-[#3066BE] text-white rounded-md px-5 py-2 text-sm hover:bg-[#264f90] transition disabled:opacity-60"
                                >
                                    {creating ? (texts[langCode].publishing || "Yuklanmoqda...") : texts[langCode].publish}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>


            {/*<TopAccountsCarousel lang={langCode?.toUpperCase()} texts={texts} />*/}


            {/* ==========================
                FOOTER (Tablet)
            ========================== */}
            <footer className="relative overflow-hidden md:block lg:hidden mt-[50px]">
                {/* Background */}
                <img
                    src="/footer-bg.png"
                    alt="Footer background"
                    className="absolute inset-0 z-0 object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                {/* Content */}
                <div className="relative z-20 max-w-[960px] mx-auto px-4 py-8 text-white">
                    {/* Top area */}
                    <div className="flex flex-col gap-6">
                        {/* Logo */}
                        <h2 className="text-[36px] font-black">
                            {texts?.[langCode]?.logo || "Community"}
                        </h2>

                        {/* Links (2 columns) */}
                        <div className="grid grid-cols-2 text-white gap-x-10 gap-y-3">
                            {texts?.[langCode]?.links?.slice(0, 4).map((link, i) => (
                                <a
                                    key={`l-${i}`}
                                    href="#"
                                    className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors"
                                >
                                    <span>›</span> {link}
                                </a>
                            ))}
                            {texts?.[langCode]?.links?.slice(4).map((link, i) => (
                                <a
                                    key={`r-${i}`}
                                    href="#"
                                    className="flex items-center text-white gap-2 text-[15px] hover:text-[#E7ECFF] transition-colors"
                                >
                                    <span>›</span> {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[13px] leading-snug">
                                {texts?.[langCode]?.copyright}
                            </p>

                            <div className="flex items-center gap-4 text-[20px]">
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-whatsapp" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-instagram" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-facebook" /></a>
                                <a href="#" className="text-white hover:opacity-90"><i className="fab fa-twitter" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    );
}