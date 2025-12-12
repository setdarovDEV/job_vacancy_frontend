// src/pages/CommunityPageNew.jsx
import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Plus, X, Search, MoreHorizontal, Menu, HelpCircle, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import MobileFooter from "./MobileFooter.jsx";
import MobileNavbar from "./MobileNavbar.jsx";
import MobileNavbarLogin from "./MobileNavbarLogin.jsx";

// ============================================
// API & MEDIA URL HELPERS
// ============================================
const API_BASE = (api?.defaults?.baseURL || "https://jobvacancy-api.duckdns.org").replace(/\/+$/, "");
const API_ORIGIN = API_BASE.replace(/\/api$/i, "");

const mediaUrl = (path, fallback = "/user1.png") => {
    if (!path) return fallback;
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path.replace(/^\/+/, "");
    return `${API_ORIGIN}/${clean}`;
};

const timeAgo = (iso, langCode = "RU") => {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const sec = Math.max(1, Math.floor(diff / 1000));
    if (sec < 60) return langCode === "RU" ? `${sec} с` : `${sec} s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return langCode === "RU" ? `${min} м` : `${min} daq`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return langCode === "RU" ? `${hr} ч` : `${hr} soat`;
    const d = Math.floor(hr / 24);
    return langCode === "RU" ? `${d} д` : `${d} kun`;
};

const capitalizeName = (fullName) => {
    if (!fullName) return "";
    return fullName
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

// ============================================
// TEXTS
// ============================================
const TEXTS = {
    RU: {
        search: "Поиск...",
        login: "Войти",
        like: "Лайк",
        comment: "Комментарий",
        share: "Отправить",
        topAccounts: "Топ аккаунты",
        seeAll: "Посмотреть все",
        subscribe: "Подписаться",
        unsubscribe: "Отписаться",
        createPost: "Разместить пост анонимно",
        placeholder: "Поделитесь своим опытом...",
        publish: "Опубликовать",
        publishing: "Публикую...",
        logo: "Logo",
        help: "Помощь",
        vacancies: "Наши вакансии",
        ads: "Реклама на сайте",
        requirements: "Требования к ПО",
        investors: "Инвесторам",
        catalog: "Каталог компаний",
        jobs: "Работа по профессиям",
        copyright: "© 2025 «HeadHunter – Вакансии».",
        allRights: "Все права защищены.",
        sitemap: "Карта сайта",
    },
    UZ: {
        search: "Qidiruv...",
        login: "Kirish",
        like: "Layk",
        comment: "Izoh",
        share: "Yuborish",
        topAccounts: "Top akkauntlar",
        seeAll: "Hammasini ko'rish",
        subscribe: "Obuna bo'lish",
        unsubscribe: "Bekor qilish",
        createPost: "Postni anonim joylashtirish",
        placeholder: "Tajribangiz bilan bo'lishing...",
        publish: "Yaratish",
        publishing: "Yuklanmoqda...",
        logo: "Logo",
        help: "Yordam",
        vacancies: "Bizning vakansiyalar",
        ads: "Saytda reklama",
        requirements: "Dastur talablari",
        investors: "Investorlar uchun",
        catalog: "Kompaniyalar katalogi",
        jobs: "Kasblar bo'yicha ishlar",
        copyright: "© 2025 «HeadHunter – Vakansiyalar».",
        allRights: "Barcha huquqlar himoyalangan.",
        sitemap: "Sayt xaritasi",
    },
};

export default function CommunityPageNew() {
    const navigate = useNavigate();

    const [selectedLang, setSelectedLang] = useState({ code: "RU" });
    const [openMenu, setOpenMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newPostContent, setNewPostContent] = useState("");
    const [creating, setCreating] = useState(false);

    const [likePending, setLikePending] = useState({});
    const [commentOpen, setCommentOpen] = useState(null);
    const [commentsMap, setCommentsMap] = useState({});
    const [newCommentMap, setNewCommentMap] = useState({});

    const [searchText, setSearchText] = useState("");
    const [topCompanies, setTopCompanies] = useState([]);

    const langCode = selectedLang?.code || "RU";
    const t = TEXTS[langCode];

    // Fetch user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);
            } catch (err) {
                console.error("User fetch error:", err);
            }
        };
        fetchUser();
    }, []);

    // Fetch posts
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/api/posts/", { params: { ordering: "-created_at", page: 1 } });
            const items = Array.isArray(data) ? data : data?.results ?? [];
            setPosts(items);
        } catch (e) {
            console.error("Posts fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Fetch top companies
    useEffect(() => {
        api.get("/api/companies/top/", { params: { limit: 5 } })
            .then(({ data }) => setTopCompanies(Array.isArray(data) ? data : data?.results || []))
            .catch((e) => console.error("Top companies error:", e));
    }, []);

    // Toggle like
    const toggleLike = async (postId) => {
        if (likePending[postId]) return;

        const prev = posts.find((p) => p.id === postId);
        const prevLiked = !!prev?.is_liked;
        const prevCount = prev?.likes_count ?? 0;

        setPosts((cur) =>
            cur.map((p) =>
                p.id === postId ? { ...p, is_liked: !prevLiked, likes_count: Math.max(0, prevCount + (prevLiked ? -1 : 1)) } : p
            )
        );
        setLikePending((s) => ({ ...s, [postId]: true }));

        try {
            const { data } = await api.post(`/api/posts/${postId}/like/`);
            setPosts((cur) => cur.map((p) => (p.id === postId ? { ...p, is_liked: data.liked, likes_count: data.likes_count } : p)));
        } catch (err) {
            setPosts((cur) => cur.map((p) => (p.id === postId ? { ...p, is_liked: prevLiked, likes_count: prevCount } : p)));
            console.error("Like error:", err);
        } finally {
            setLikePending((s) => ({ ...s, [postId]: false }));
        }
    };

    // Comments
    const toggleCommentsOpen = (postId) => {
        if (commentOpen === postId) {
            setCommentOpen(null);
            return;
        }
        setCommentOpen(postId);
        if (!commentsMap[postId]?.items) loadComments(postId);
    };

    const loadComments = async (postId) => {
        setCommentsMap((m) => ({ ...m, [postId]: { ...(m[postId] || {}), loading: true } }));
        try {
            const { data } = await api.get(`/api/posts/${postId}/comments/`);
            setCommentsMap((m) => ({
                ...m,
                [postId]: { items: data.results || [], count: data.count, next: data.next, loading: false },
            }));
        } catch (e) {
            console.error("Comments load error:", e);
            setCommentsMap((m) => ({ ...m, [postId]: { ...(m[postId] || {}), loading: false } }));
        }
    };

    const handleAddComment = async (postId) => {
        const text = (newCommentMap[postId] || "").trim();
        if (!text) return;

        const temp = { id: `temp-${Date.now()}`, author_name: "Вы", content: text, created_at: new Date().toISOString() };

        setCommentsMap((m) => {
            const prev = m[postId]?.items || [];
            return { ...m, [postId]: { ...(m[postId] || {}), items: [temp, ...prev], count: (m[postId]?.count || 0) + 1 } };
        });
        setNewCommentMap((m) => ({ ...m, [postId]: "" }));

        try {
            const { data } = await api.post(`/api/posts/${postId}/comments/`, { content: text });
            setCommentsMap((m) => {
                const items = (m[postId]?.items || []).map((c) => (c.id === temp.id ? data : c));
                return { ...m, [postId]: { ...(m[postId] || {}), items } };
            });
        } catch (e) {
            setCommentsMap((m) => {
                const items = (m[postId]?.items || []).filter((c) => c.id !== temp.id);
                return { ...m, [postId]: { ...(m[postId] || {}), items, count: Math.max(0, (m[postId]?.count || 1) - 1) } };
            });
            console.error("Comment add error:", e);
        }
    };

    // Create post
    const handleCreatePost = async () => {
        if (!newPostContent.trim()) {
            alert("Текст обязателен.");
            return;
        }
        const formData = new FormData();
        formData.append("content", newPostContent);

        try {
            setCreating(true);
            const { data } = await api.post("/api/posts/", formData);
            setPosts((prev) => [data, ...prev]);
            setNewPostContent("");
            setShowModal(false);
        } catch (error) {
            console.error("Post create error:", error);
            alert("Ошибка при создании поста.");
        } finally {
            setCreating(false);
        }
    };

    // Follow toggle
    const toggleFollow = async (companyId) => {
        try {
            setTopCompanies((prev) =>
                prev.map((c) =>
                    c.id === companyId
                        ? { ...c, is_following: !c.is_following, followers_count: Math.max(0, (c.followers_count ?? 0) + (c.is_following ? -1 : 1)) }
                        : c
                )
            );

            const { data } = await api.post(`/api/companies/${companyId}/toggle-follow/`);
            setTopCompanies((prev) =>
                prev.map((c) => (c.id === companyId ? { ...c, is_following: data.is_following, followers_count: data.followers_count } : c))
            );
        } catch (err) {
            console.error("Follow toggle error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            {/* NAVBAR */}
            {user ? <MobileNavbarLogin /> : <MobileNavbar />}

            <div className="h-[56px]" />

            {/* TOP ICONS ROW */}
            <div className="flex items-center justify-end gap-3 px-4 py-2 bg-white border-b">
                <button className="p-2 bg-transparent border-none">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                </button>
                <button className="relative p-2 bg-transparent border-none">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>

            {/* SEARCH */}
            <div className="px-4 py-3 bg-white">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t.search}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full h-9 pl-10 pr-10 rounded-lg bg-[#F5F7FA] text-sm outline-none border-none"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-transparent border-none">
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="8" x2="20" y2="8" />
                            <line x1="4" y1="16" x2="20" y2="16" />
                            <line x1="8" y1="4" x2="8" y2="20" />
                            <line x1="16" y1="4" x2="16" y2="20" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* POSTS */}
            <div className="px-4 pt-3 pb-4 space-y-3">
                {loading && <div className="text-center text-gray-400 py-6">Загрузка...</div>}

                {!loading && posts.length === 0 && <div className="text-center text-gray-400 py-6">Нет постов</div>}

                {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <img src={mediaUrl(post.author?.avatar)} alt="" className="w-10 h-10 rounded-full object-cover border" />
                                <div>
                                    <div className="text-[14px] font-semibold text-black">{capitalizeName(post.author?.full_name || "Пользователь")}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[12px] text-gray-400">{timeAgo(post.created_at, langCode)}</span>
                                <button className="p-1 bg-transparent border-none">
                                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-[13px] text-gray-700 leading-relaxed mb-3">{post.content}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-6 text-gray-400 text-[13px]">
                            <button
                                onClick={() => toggleLike(post.id)}
                                disabled={!!likePending[post.id]}
                                className={`flex items-center gap-1.5 bg-transparent border-none ${post.is_liked ? "text-red-500" : "text-gray-400"}`}
                            >
                                <Heart className={`w-4 h-4 ${post.is_liked ? "fill-red-500" : ""}`} />
                                <span>{t.like}</span>
                            </button>

                            <button onClick={() => toggleCommentsOpen(post.id)} className="flex items-center gap-1.5 bg-transparent border-none text-gray-400">
                                <MessageCircle className="w-4 h-4" />
                                <span>{t.comment}</span>
                            </button>
                        </div>

                        {/* Comments */}
                        {commentOpen === post.id && (
                            <div className="mt-3 pt-3 border-t">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={newCommentMap[post.id] || ""}
                                        onChange={(e) => setNewCommentMap((m) => ({ ...m, [post.id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                                        className="flex-1 h-8 rounded-md border border-gray-300 px-3 text-[13px] outline-none"
                                        placeholder="Комментарий..."
                                    />
                                    <button
                                        onClick={() => handleAddComment(post.id)}
                                        className="h-8 px-4 rounded-md bg-[#3066BE] text-white text-[12px]"
                                    >
                                        {t.share}
                                    </button>
                                </div>

                                <div className="mt-2 space-y-2">
                                    {(commentsMap[post.id]?.items || []).map((c) => (
                                        <div key={c.id} className="text-[12px] text-gray-700">
                                            <span className="font-medium">{c.author_name}: </span>
                                            <span>{c.content}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* TOP COMPANIES */}
            <div className="px-4 pb-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[16px] font-semibold text-black">{t.topAccounts}</span>
                    <Link to="/companies" className="text-[#3066BE] text-[13px] underline">
                        {t.seeAll}
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {topCompanies.slice(0, 4).map((c) => (
                        <div key={c.id} className="bg-white rounded-xl p-3 text-center shadow-sm border">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img src={mediaUrl(c.logo_url || c.logo, "/company.png")} alt={c.name} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-[13px] font-semibold text-black mb-1 truncate">{c.name}</h4>
                            <p className="text-[10px] text-gray-400 mb-3 line-clamp-2">Consulting</p>
                            <button
                                onClick={() => toggleFollow(c.id)}
                                className={`w-full h-7 rounded-lg text-[11px] font-medium ${
                                    c.is_following ? "bg-gray-200 text-gray-600" : "bg-[#E8F0FE] text-[#3066BE]"
                                }`}
                            >
                                {c.is_following ? t.unsubscribe : t.subscribe}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* REMAINING POSTS */}
            {posts.length > 3 && (
                <div className="px-4 pb-20 space-y-3">
                    {posts.slice(3).map((post) => (
                        <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img src={mediaUrl(post.author?.avatar)} alt="" className="w-10 h-10 rounded-full object-cover border" />
                                    <div>
                                        <div className="text-[14px] font-semibold text-black">
                                            {capitalizeName(post.author?.full_name || "Пользователь")}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] text-gray-400">{timeAgo(post.created_at, langCode)}</span>
                                    <button className="p-1 bg-transparent border-none">
                                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-[13px] text-gray-700 leading-relaxed mb-3">{post.content}</p>

                            <div className="flex items-center gap-6 text-gray-400 text-[13px]">
                                <button
                                    onClick={() => toggleLike(post.id)}
                                    disabled={!!likePending[post.id]}
                                    className={`flex items-center gap-1.5 bg-transparent border-none ${post.is_liked ? "text-red-500" : "text-gray-400"}`}
                                >
                                    <Heart className={`w-4 h-4 ${post.is_liked ? "fill-red-500" : ""}`} />
                                    <span>{t.like}</span>
                                </button>

                                <button onClick={() => toggleCommentsOpen(post.id)} className="flex items-center gap-1.5 bg-transparent border-none text-gray-400">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{t.comment}</span>
                                </button>

                                <button className="flex items-center gap-1.5 bg-transparent border-none text-gray-400">
                                    <Share2 className="w-4 h-4" />
                                    <span>Отправить</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FLOATING CREATE POST BUTTON */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-4 right-4 z-50 flex items-center gap-2 h-11 px-4 rounded-full shadow-xl bg-[#3066BE] text-white text-[13px] font-medium"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 10h18M7 10l2-3h6l2 3" />
                    <circle cx="9" cy="15" r="2" />
                    <circle cx="15" cy="15" r="2" />
                    <path d="M11 15h2" />
                </svg>
                <span>{t.createPost}</span>
                <Plus className="w-4 h-4" />
            </button>

            {/* CREATE POST MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    {/* Header */}
                    <div className="h-[56px] px-4 flex items-center justify-between bg-white border-b">
                        <button onClick={() => setShowModal(false)} className="p-2 bg-transparent border-none">
                            <X className="w-5 h-5 text-black" />
                        </button>
                        <span className="text-[15px] font-semibold">Создать публикацию</span>
                        <div className="w-8" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <textarea
                            className="w-full min-h-[200px] p-3 rounded-lg border border-gray-300 text-[14px] resize-none outline-none"
                            placeholder={t.placeholder}
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white border-t">
                        <button
                            onClick={handleCreatePost}
                            disabled={creating}
                            className="w-full h-10 rounded-lg bg-[#3066BE] text-white text-[14px] font-medium disabled:opacity-50"
                        >
                            {creating ? t.publishing : t.publish}
                        </button>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <MobileFooter/>
        </div>
    );
}