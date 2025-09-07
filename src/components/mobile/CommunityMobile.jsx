import React, { useEffect, useState, useRef } from "react";
import { Menu, X, Search, Bell, HelpCircle, Plus, Check, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import FollowButton from "../FollowButton.jsx";
import MobileNavbar from "./MobileNavbarLogin.jsx";

export default function CommunityMobile({ initialLang = { flag: "/ru.png", code: "RU" } }) {
    const navigate = useNavigate();

    // UI
    const [selectedLang, setSelectedLang] = useState(initialLang);
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [openMenu, setOpenMenu] = useState(false);
    const [openLang, setOpenLang] = useState(false);

    // Posts
    const [posts, setPosts] = useState([]);
    const [likePending, setLikePending] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [creating, setCreating] = useState(false);
    const [postMode, setPostMode] = useState("anon");         // 'anon' | 'self'
    const [anonLevel, setAnonLevel] = useState("school")

    // Comments
    const [commentOpen, setCommentOpen] = useState(null);
    const [commentsMap, setCommentsMap] = useState({});
    const [newCommentMap, setNewCommentMap] = useState({});

    // Top companies (horizontal scroll)
    const [topCompanies, setTopCompanies] = useState([]);
    const [user, setUser] = React.useState(null);
    const [profileImage, setProfileImage] = React.useState(null);
    const [newPostImage, setNewPostImage] = useState(null);
    const [newPostImageUrl, setNewPostImageUrl] = useState("");
    // i18n
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";
    const t = TEXTS[langCode];

    // utils
    const mediaUrl = (path, fallback = "/profile.png") => {
        if (!path || typeof path !== "string") return fallback;
        if (/^(?:https?:)?\/\//i.test(path) || /^data:/i.test(path) || /^blob:/i.test(path)) return path;
        const RAW = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        const BASE = String(RAW).replace(/\/+$/, "");
        const p = path.startsWith("/") ? path : `/${path}`;
        return `${BASE}${p}`;
    };
    const timeAgo = (iso) => {
        if (!iso) return "";
        const diff = Date.now() - new Date(iso).getTime();
        const sec = Math.max(1, Math.floor(diff / 1000));
        if (sec < 60) return langCode === "RU" ? `${sec} c` : `${sec} s`;
        const min = Math.floor(sec / 60);
        if (min < 60) return langCode === "RU" ? `${min} мин` : `${min} daq`;
        const hr = Math.floor(min / 60);
        if (hr < 24) return langCode === "RU" ? `${hr} ч` : `${hr} soat`;
        const d = Math.floor(hr / 24);
        return langCode === "RU" ? `${d} д` : `${d} kun`;
    };

    // data
    useEffect(() => { fetchPosts(); }, []);
    const fetchPosts = async () => {
        try {
            const { data } = await api.get("/api/posts/", { params: { ordering: "-created_at", page: 1 } });
            setPosts(Array.isArray(data) ? data : (data?.results || []));
        } catch (e) { console.error(e); }
    };
    useEffect(() => {
        api.get("/api/companies/top/", { params: { limit: 10 } })
            .then(({ data }) => setTopCompanies(data || []))
            .catch((e) => console.error("top companies:", e));
    }, []);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewPostImage(file);
        // preview uchun blob URL
        const url = URL.createObjectURL(file);
        setNewPostImageUrl(url);
    };

// --- NEW: preview URL ni tozalash
    useEffect(() => {
        return () => {
            if (newPostImageUrl) URL.revokeObjectURL(newPostImageUrl);
        };
    }, [newPostImageUrl]);

// (ixtiyoriy) tanlangan rasmni bekor qilish
    const clearPickedImage = () => {
        if (newPostImageUrl) URL.revokeObjectURL(newPostImageUrl);
        setNewPostImage(null);
        setNewPostImageUrl("");
    };

    // actions
    const toggleLike = async (postId) => {
        if (likePending[postId]) return;
        const prev = posts.find(p => p.id === postId);
        const prevLiked = !!prev?.is_liked;
        const prevCount = prev?.likes_count ?? 0;

        setPosts(cur => cur.map(p => p.id === postId ? { ...p, is_liked: !prevLiked, likes_count: Math.max(0, prevCount + (prevLiked ? -1 : 1)) } : p));
        setLikePending(s => ({ ...s, [postId]: true }));
        try {
            const { data } = await api.post(`/api/posts/${postId}/like/`);
            setPosts(cur => cur.map(p => p.id === postId ? { ...p, is_liked: data.liked, likes_count: data.likes_count } : p));
        } catch (e) {
            setPosts(cur => cur.map(p => p.id === postId ? { ...p, is_liked: prevLiked, likes_count: prevCount } : p));
            if (e?.response?.status === 401) alert(t.loginWarn);
        } finally {
            setLikePending(s => ({ ...s, [postId]: false }));
        }
    };

    const toggleCommentsOpen = (postId) => {
        if (commentOpen === postId) { setCommentOpen(null); return; }
        setCommentOpen(postId);
        if (!commentsMap[postId]?.items) loadComments(postId);
    };
    const loadComments = async (postId, pageUrl = null) => {
        setCommentsMap(m => ({ ...m, [postId]: { ...(m[postId] || {}), loading: true } }));
        try {
            const url = pageUrl || `/api/posts/${postId}/comments/`;
            const { data } = await api.get(url);
            setCommentsMap(m => ({
                ...m,
                [postId]: {
                    items: pageUrl ? [ ...(m[postId]?.items||[]), ...data.results ] : (data.results || []),
                    count: data.count,
                    next: data.next,
                    loading: false
                }
            }));
        } catch (e) {
            setCommentsMap(m => ({ ...m, [postId]: { ...(m[postId]||{}), loading: false } }));
        }
    };
    const handleAddComment = async (postId) => {
        const text = (newCommentMap[postId] || "").trim();
        if (!text) return;
        const temp = { id: `tmp-${Date.now()}`, author_name: t.you, content: text, created_at: new Date().toISOString() };
        setCommentsMap(m => ({ ...m, [postId]: { ...(m[postId]||{}), items: [temp, ...(m[postId]?.items||[])], count: (m[postId]?.count||0)+1 } }));
        setNewCommentMap(m => ({ ...m, [postId]: "" }));
        try {
            const { data } = await api.post(`/api/posts/${postId}/comments/`, { content: text });
            setCommentsMap(m => ({ ...m, [postId]: { ...(m[postId]||{}), items: (m[postId]?.items||[]).map(c => c.id === temp.id ? data : c) } }));
        } catch (e) {
            setCommentsMap(m => {
                const filtered = (m[postId]?.items||[]).filter(c => c.id !== temp.id);
                return { ...m, [postId]: { ...(m[postId]||{}), items: filtered, count: Math.max(0, (m[postId]?.count||1)-1) } };
            });
            if (e?.response?.status === 401) alert(t.loginWarn);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim() && !newPostImage) { alert(t.needTextOrImage); return; }
        const fd = new FormData();
        fd.append("content", newPostContent);
        if (newPostImage) fd.append("image", newPostImage);
        try {
            setCreating(true);
            const { data } = await api.post("/api/posts/", fd, { headers: { "Content-Type": "multipart/form-data" } });
            setPosts(prev => [data, ...prev]);
            setNewPostContent(""); setNewPostImage(null); setShowModal(false);
        } catch (e) { alert(t.postError); }
        finally { setCreating(false); }
    };

    const sliderRef = useRef(null);


    function TopCompanies({ topCompanies = [], mediaUrl, t, langCode }) {
        const sliderRef = React.useRef(null);

        const scrollBy = (dir) => {
            const el = sliderRef.current;
            if (!el) return;
            const card = el.querySelector(".company-card");
            const step = (card?.offsetWidth || 240) + 16; // cardWidth + gap
            el.scrollBy({left: dir * step, behavior: "smooth"});
        };
    }

    useEffect(() => {
        if (showModal) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [showModal]);

    React.useEffect(() => {
        // localStorage dan olish
        try {
            const img = localStorage.getItem("profile_image");
            if (img) setProfileImage(img);
        } catch (_) {}
    }, []);

    React.useEffect(() => {
        // foydalanuvchini olish (ixtiyoriy, bo‘lsa avatarni ko‘rsatamiz)
        (async () => {
            try {
                const res = await api.get("/api/auth/me/");
                setUser(res.data);
            } catch (_) {}
        })();
    }, []);

    const items = (topCompanies || []).slice(0, 5);
    const showArrows = items.length > 1;

    const top3Posts = (posts ?? []).slice(0, 3);
    const remainingPosts = (posts ?? []).slice(3);

    const renderPost = (post) => (
        <div key={post.id} className="bg-white p-4 rounded-2xl shadow">
            {/* header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={mediaUrl(post.author?.avatar_url || post.author_avatar)}
                        className="w-11 h-11 rounded-full object-cover border"
                        alt="avatar"
                    />
                    <div>
                        <div className="text-[15px] font-semibold text-black">
                            {post.author?.full_name || post.author_name || "User"}
                        </div>
                        <div className="text-[12px] text-[#AEAEAE]">
                            {timeAgo(post.created_at, langCode)}
                        </div>
                    </div>
                </div>
                <button className="p-2 rounded-md bg-white border-none">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* content */}
            <p className="mt-3 text-[14px] text-gray-800">{post.content}</p>

            {/* actions */}
            <div className="mt-3 flex items-center gap-6 text-[14px]">
                <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 bg-white border-none ${
                        post.is_liked ? "text-[#3066BE]" : "text-[#AEAEAE] hover:text-[#3066BE]"
                    }`}
                    disabled={!!likePending[post.id]}
                >
                    <ThumbsUp className="w-4 h-4" />
                    {t.like}
                </button>

                <button
                    onClick={() => toggleCommentsOpen(post.id)}
                    className="flex items-center gap-2 bg-white border-none text-[#AEAEAE] hover:text-[#3066BE]"
                >
                    <MessageCircle className="w-4 h-4" />
                    {t.comment}
                    {typeof post.comments_count === "number" ? ` (${post.comments_count})` : ""}
                </button>
            </div>

            {/* comments panel */}
            {commentOpen === post.id && (
                <div className="mt-3">
                    <div className="flex items-center gap-2">
                        <input
                            value={newCommentMap[post.id] || ""}
                            onChange={(e) => setNewCommentMap(m => ({ ...m, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                            className="flex-1 h-10 rounded-md border px-3 text-[14px] outline-none focus:border-[#3066BE]"
                            placeholder={t.commentPlaceholder}
                        />
                        <button
                            onClick={() => handleAddComment(post.id)}
                            className="h-10 px-4 rounded-md bg-[#3066BE] text-white text-sm"
                        >
                            {t.send}
                        </button>
                    </div>

                    <div className="mt-3 space-y-2">
                        {(commentsMap[post.id]?.items || []).map(c => (
                            <div key={c.id} className="text-[13px] text-gray-800">
              <span className="font-medium">
                {c.author_name || c.author?.full_name || "User"}:{" "}
              </span>
                                <span>{c.content}</span>
                            </div>
                        ))}

                        {commentsMap[post.id]?.next && !commentsMap[post.id]?.loading && (
                            <button
                                onClick={() => loadComments(post.id, commentsMap[post.id].next)}
                                className="text-[#3066BE] text-[13px]"
                            >
                                {t.loadMore}
                            </button>
                        )}

                        {commentsMap[post.id]?.loading && (
                            <div className="text-[#AEAEAE] text-[13px]">{t.loading}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="font-sans bg-white">
            <MobileNavbar />

            {/* top-right notification only */}
            <div className="relative">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="absolute right-4 top-3 z-30 p-2 rounded-full border-none bg-transparent active:scale-95"
                    // onClick={() => setShowNotifications(true)} // xohlasang callback qo‘shasan
                >
                    <div className="relative">
                        <Bell className="w-6 h-6 text-[#3066BE]" />
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center
                       w-4 h-4 rounded-full bg-red-600 text-white text-[10px]">
                            1
                        </span>
                    </div>
                </button>
            </div>

            <div className="px-4 mt-[60px]">
                <label className="relative block">
                    <Search
                        className="absolute left-4 top-1/2 ml-[80px] -translate-y-1/2 w-7 h-7 text-black"
                        strokeWidth={2.5}
                    />
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder={(texts?.[langCode]?.search || "Поиск...").toUpperCase()}
                        className="w-[230px] h-10 pl-14 pr-4 ml-[80px] rounded-[18px] bg-[#F4F6FA]
                 text-[14px] text-[#111] placeholder:text-[#111]/70
                 outline-none border-0"
                    />
                </label>
            </div>

            <section className="px-4 pt-4 pb-4 space-y-4">
                {top3Posts.map(renderPost)}
            </section>

            <section className="px-4 pb-8">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{t.topAccounts}</span>
                    <Link to="/companies" className="text-[#3066BE] text-sm">
                        {t.seeAll}
                    </Link>
                </div>

                <div className="relative">
                    <div
                        ref={sliderRef}
                        className="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4"
                    >
                        <div className="flex gap-4 w-max px-6">
                            {items.map((c) => (
                                <div
                                    key={c.id}
                                    className="company-card snap-start w-[220px] sm:w-[240px] bg-white rounded-2xl
                           border-2 border-[#CFCFCF] p-4 flex flex-col items-center text-center shadow-sm"
                                >
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E5E5E5] overflow-hidden mb-4">
                                        {c.logo ? (
                                            <img
                                                src={mediaUrl(c.logo)}
                                                alt={c.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>

                                    <h4 className="text-[18px] sm:text-[20px] font-extrabold text-black">
                                        {c.name}
                                    </h4>
                                    <p className="mt-2 text-[#AEAEAE] text-[12px] leading-5 line-clamp-3">
                                        {c.description || t.communityDesc}
                                    </p>

                                    <button
                                        type="button"
                                        className="mt-4 h-10 px-4 rounded-xl bg-[#E8EFFD] text-[14px] font-semibold"
                                    >
                                        {t.subscribe}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {remainingPosts.length > 0 && (
                <section className="px-4 pt-4 pb-16 space-y-4">
                    {remainingPosts.map(renderPost)}
                </section>
            )}


            <button
                onClick={() => setShowModal(true)}
                aria-label="Разместить пост анонимно"
                className="
                    fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100]
                    flex items-center gap-3
                    h-12 px-4 md:px-5
                    rounded-2xl shadow-xl
                    bg-[#3066BE] text-white
                    active:scale-95 transition
                    pb-[env(safe-area-inset-bottom)]  /* iPhone safe area */
                  "
                            >
                    {/* chapdagi “anon” piktogramma */}
                    <span className="inline-flex items-center justify-center mb-[10px] w-8 h-8 rounded-full bg-white/15">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                      {/* shlyapa + ko‘zoynak – oddiy, yengil ikon */}
                        <path d="M3 10h18M7 10l2-3h6l2 3" />
                      <circle cx="9" cy="15" r="2" />
                      <circle cx="15" cy="15" r="2" />
                      <path d="M11 15h2" />
                    </svg>
                  </span>

                <span className="font-semibold text-[15px] whitespace-nowrap mb-[10px]">
                    Разместить пост анонимно
                </span>

                <Plus className="w-5 h-5 mb-[8px]" />
            </button>

            {showModal && (
                <div className="fixed inset-0 z-[9999] bg-white flex flex-col h-[100dvh]">
                    {/* HEADER */}
                    <div className="bg-white">
                        <nav className="fixed top-0 inset-x-0 z-[120] bg-[#F4F6FA]/95 backdrop-blur shadow-md">
                            {/* iOS safe-area uchun biroz tepaga pad */}
                            <div className="pt-[env(safe-area-inset-top)]">
                                <div className="h-[60px] px-3 flex items-center justify-between relative">
                                    {/* 1) Chap: dropdown (links) */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenu(v => !v)}
                                            className="w-10 h-10 rounded-md bg-[#F4F6FA] border-none flex flex-col items-center justify-center active:scale-[0.98]"
                                            aria-label="Open menu"
                                        >
                                            <span className="block w-6 h-0.5 bg-black rounded"></span>
                                            <span className="block w-6 h-0.5 bg-black rounded my-1"></span>
                                            <span className="block w-6 h-0.5 bg-black rounded"></span>
                                        </button>

                                        {/* Main dropdown */}
                                        {openMenu && (
                                            <div className="absolute left-0 top-[calc(100%+8px)] w-48 rounded-lg bg-white shadow-lg border z-50 overflow-hidden">
                                                <a href="/login" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                                    {texts[langCode].community}
                                                </a>
                                                <a href="/login" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                                    {texts[langCode].vacancies}
                                                </a>
                                                <a href="/login" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE] mb-[-20px]">
                                                    {texts[langCode].chat}
                                                </a>
                                                <a href="/login" className="block px-4 py-3 text-sm text-black hover:text-[#3066BE]">
                                                    {texts[langCode].companies}
                                                </a>

                                                <div className="h-px bg-gray-200 my-1" />

                                                {/* Language item */}
                                                <button
                                                    onClick={() => setOpenLang(v => !v)}
                                                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center justify-between bg-white border-none"
                                                >
                                      <span className="flex items-center gap-2">
                                        <img src={selectedLang.flag} alt={selectedLang.code} className="w-5 h-3 rounded object-cover" />
                                        <span className="text-black">Язык</span>
                                      </span>
                                                    <svg className={`w-4 h-4 transition-transform ${openLang ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                {openLang && (
                                                    <div className="px-2 pb-2">
                                                        <button
                                                            onClick={() => { setSelectedLang({ flag: "/ru.png", code: "RU" }); setOpenMenu(false); setOpenLang(false); }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 text-sm bg-white border-none"
                                                        >
                                                            <img src="/ru.png" alt="RU" className="w-5 h-3 rounded object-cover" />
                                                            <p className="text-black">Русский</p>
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedLang({ flag: "/uz.png", code: "UZ" }); setOpenMenu(false); setOpenLang(false); }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 text-sm bg-white border-none"
                                                        >
                                                            <img src="/uz.png" alt="UZ" className="w-5 h-3 rounded object-cover" />
                                                            <p className="text-black">O‘zbekcha</p>
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedLang({ flag: "/uk.png", code: "EN" }); setOpenMenu(false); setOpenLang(false); }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 text-sm bg-white border-none"
                                                        >
                                                            <img src="/uk.png" alt="EN" className="w-5 h-3 rounded object-cover" />
                                                            <p className="text-black">English</p>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* 2) O‘rta: logo */}
                                    <img src="/logo.png" alt="Logo" className="h-[40px] object-contain" />

                                    {/* 3) O‘ng: login */}
                                    <a href="/login">
                                        <button className="px-4 h-9 rounded-md bg-[#3066BE] text-white text-[14px] font-medium active:scale-[0.98]">
                                            {texts[langCode].login}
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </nav>

                        <div className="h-[60px] md:h-[80px] lg:h-[90px]" aria-hidden />

                        {/* 2-qator: sarlavha + X o‘ng burchakda */}
                        <div className="relative h-[44px] border-t border-b border-black/10 flex items-center justify-center">
                              <span className="text-[14px] font-semibold text-black">
                                {t.createPublication}
                              </span>

                            {/* Close button — sarlavha qatorining o‘ng burchagida */}
                            <button
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                                className="absolute right-2 top-1/2 bg-white border-none -translate-y-1/2 p-2 rounded-md hover:bg-black/5
                                           focus:outline-none focus:ring-2 focus:ring-[#2B50A4]/30"
                            >
                                <X className="w-5 h-5 text-[#2B50A4]" />
                            </button>
                        </div>

                    </div>

                    {/* KONTENT (SCROLLABLE) */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="px-4 pt-4 space-y-6">
                            {/* O‘z nomidan post */}
                            <div>
                                <div className="text-[13px] text-[#8A8A8A] mb-2">
                                    Разместить пост от имени себя
                                </div>

                                <button
                                    onClick={() => setPostMode("self")}
                                    className={`w-full flex items-center justify-between rounded-2xl bg-white px-4 py-4 border-none ${
                                        postMode === "self" ? "border-black" : "border-black/20"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={profileImage || "/user-white.jpg"}
                                            alt="me"
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                        <div className="text-[15px] font-semibold text-black">
                                            {user ? (user.full_name || "User") : "User"}
                                        </div>
                                    </div>

                                    {postMode === "self" ? (
                                        <Check className="w-5 h-5 text-black" />
                                    ) : (
                                        <span className="w-5 h-5 rounded-full border border-black/30 inline-block" />
                                    )}
                                </button>
                            </div>

                            <div className="border-t w-full border-[#AEAEAE]" />

                            {/* Matn maydoni */}
                            <div>
                              <textarea
                                  className="w-full min-h-[180px] rounded-2xl border-none border-black/20 p-4 text-[14px] text-gray-800 resize-y outline-none focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/20"
                                  placeholder={t.placeholder}
                                  value={newPostContent}
                                  onChange={(e) => setNewPostContent(e.target.value)}
                              />
                            </div>
                        </div>

                        {/* Sticky panel ustiga joy qoldirish */}
                        <div className="h-24" />

                        {/* FOOTER (scroll ichida) */}
                        <footer className="mt-0">
                            <div className="relative">
                                {/* bg + overlay */}
                                <img src="/footer-bg.png" alt="Footer" className="w-full h-[520px] object-cover" />
                                <div className="absolute inset-0 bg-[#3066BE]/60" />

                                {/* content */}
                                <div className="absolute inset-0 text-white px-6 pt-8 pb-28">
                                    <h3 className="text-[40px] font-black mb-6">{texts[langCode].logo}</h3>

                                    <ul className="space-y-6">
                                        {texts[langCode].links.map((label, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <svg
                                                    className="w-3 h-3 shrink-0"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                >
                                                    <path d="M8 5l8 7-8 7" />
                                                </svg>
                                                <a href="/login" className="text-[16px] text-white">{label}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* bottom glass panel */}
                                <div className="absolute left-3 right-3 bottom-3 bg-white/10 backdrop-blur-md rounded-2xl text-white px-4 py-4">
                                    <div className="flex items-start justify-between gap-4 text-[13px] leading-tight">
                                        <div>
                                            <p className="opacity-90">
                                                {langCode === "RU" && "© 2025 «HeadHunter – Вакансии»."}
                                                {langCode === "UZ" && "© 2025 «HeadHunter – Vakansiyalar»."}
                                                {langCode === "EN" && "© 2025 “HeadHunter – Vacancies”."}
                                            </p>
                                            <a href="#" className="underline">
                                                {langCode === "RU" ? "Карта сайта" : langCode === "UZ" ? "Sayt xaritasi" : "Sitemap"}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-4">
                                        {/* WhatsApp */}
                                        <a href="#" aria-label="WhatsApp" className="p-1">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                                <path d="M20 12.4A8.4 8.4 0 1 1 6.9 4.6l-1 3.6 3.6-1A8.4 8.4 0 0 1 20 12.4Z" />
                                                <path
                                                    d="M8.5 9.5c.5 1.6 2.4 3.6 4 4l1.4-.7c.3-.2.7 0 .8.3l.7 1.2c.2.4 0 .9-.5 1.1-1.2.6-2.6.8-4.8-.5-2.1-1.3-3.1-3-3.5-4.2-.2-.5 0-1 .5-1.2l1.2-.6c.4-.2.8 0 1 .3l.2.3Z"
                                                    fill="white"
                                                    stroke="none"
                                                />
                                            </svg>
                                        </a>
                                        {/* Instagram */}
                                        <a href="#" aria-label="Instagram" className="p-1">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                                <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
                                                <circle cx="12" cy="12" r="3.5" />
                                                <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                                            </svg>
                                        </a>
                                        {/* Facebook */}
                                        <a href="#" aria-label="Facebook" className="p-1">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                                <path d="M13 22v-8h3l.5-3H13V9.2c0-1 .3-1.7 1.9-1.7H17V4.1C16.6 4 15.5 4 14.3 4 11.7 4 10 5.6 10 8.6V11H7v3h3v8h3Z" />
                                            </svg>
                                        </a>
                                        {/* X */}
                                        <a href="#" aria-label="X" className="p-1">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                                <path d="M3 4l7.7 9.3L3.6 20H6l6-5.6L17.8 20H21l-8-9.3L20.4 4H18L12.4 9.2 8.2 4H3z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>

                    {/* STICKY BOTTOM ACTIONS */}
                    <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t pb-[env(safe-area-inset-bottom)]">
                        <div className="px-4 py-3 flex items-center justify-between">
                            <label className="w-10 h-10 rounded-xl border border-black/20 flex items-center justify-center cursor-pointer">
                                <ImageIcon className="w-5 h-5 text-[#2B50A4]" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                            </label>

                            <button
                                onClick={handleCreatePost}
                                disabled={creating}
                                className="h-10 px-5 rounded-xl bg-[#2B50A4] text-white text-[14px] font-medium active:scale-[0.99] disabled:opacity-60"
                            >
                                {creating ? "…" : t.publish}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER (mobile) */}
            <footer className="mt-8">
                <div className="relative">
                    {/* background image + overlay */}
                    <img src="/footer-bg.png" alt="Footer" className="w-full h-[520px] object-cover" />
                    <div className="absolute inset-0 bg-[#3066BE]/60" />

                    {/* content */}
                    <div className="absolute inset-0 text-white px-6 pt-8 pb-28">
                        {/* Logo */}
                        <h3 className="text-[40px] font-black mb-6">{texts[langCode].logo}</h3>

                        {/* Links */}
                        <ul className="space-y-6">
                            {texts[langCode].links.map((label, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    {/* chevron bullet */}
                                    <svg className="w-3 h-3 shrink-0 mb-[-10px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M8 5l8 7-8 7" />
                                    </svg>
                                    <a href="/login" className="text-[16px] text-white mb-[-10px]">{label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* bottom glass panel */}
                    <div className="absolute left-3 right-3 bottom-3 bg-white/10 backdrop-blur-md rounded-2xl text-white px-4 py-4">
                        <div className="flex items-start justify-between gap-4 text-[13px] leading-tight">
                            {/* left column */}
                            <div>
                                {/* copy line (short i18n) */}
                                <p className="opacity-90">
                                    {langCode === 'RU' && '© 2025 «HeadHunter – Вакансии».'}
                                    {langCode === 'UZ' && '© 2025 «HeadHunter – Vakansiyalar».'}
                                    {langCode === 'EN' && '© 2025 “HeadHunter – Vacancies”.'}
                                </p>
                                <a href="#" className="underline">{langCode === 'RU' ? 'Карта сайта' : langCode === 'UZ' ? 'Sayt xaritasi' : 'Sitemap'}</a>
                            </div>
                        </div>

                        {/* socials */}
                        <div className="mt-3 flex items-center gap-4">
                            {/* WhatsApp */}
                            <a href="#" aria-label="WhatsApp" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                    <path d="M20 12.4A8.4 8.4 0 1 1 6.9 4.6l-1 3.6 3.6-1A8.4 8.4 0 0 1 20 12.4Z"/>
                                    <path d="M8.5 9.5c.5 1.6 2.4 3.6 4 4l1.4-.7c.3-.2.7 0 .8.3l.7 1.2c.2.4 0 .9-.5 1.1-1.2.6-2.6.8-4.8-.5-2.1-1.3-3.1-3-3.5-4.2-.2-.5 0-1 .5-1.2l1.2-.6c.4-.2.8 0 1 .3l.2.3Z" fill="white" stroke="none"/>
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" aria-label="Instagram" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                    <rect x="3.5" y="3.5" width="17" height="17" rx="4"/>
                                    <circle cx="12" cy="12" r="3.5" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a href="#" aria-label="Facebook" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                    <path d="M13 22v-8h3l.5-3H13V9.2c0-1 .3-1.7 1.9-1.7H17V4.1C16.6 4 15.5 4 14.3 4 11.7 4 10 5.6 10 8.6V11H7v3h3v8h3Z"/>
                                </svg>
                            </a>
                            {/* X (Twitter) */}
                            <a href="#" aria-label="X" className="p-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                    <path d="M3 4l7.7 9.3L3.6 20H6l6-5.6L17.8 20H21l-8-9.3L20.4 4H18L12.4 9.2 8.2 4H3z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavItem({ children, href = "#", active = false }) {
    return (
        <a
            href={href}
            className={`block w-full px-3 py-2 rounded-lg text-center ${active ? "text-[#3066BE] bg-[#3066BE]/10" : "text-black hover:bg-gray-50"}`}
        >
            {children}
        </a>
    );
}

const TEXTS = {
    RU: {
        community: "Сообщество",
        vacancies: "Вакансии",
        chat: "Чат",
        companies: "Компании",
        login: "Войти",
        loginWarn: "Пожалуйста, войдите в систему.",
        anonymous: "Разместить пост анонимно",
        asSchoolStudent: "как студент школы",
        asCollegeStudent: "как студент колледжа",
        asUniversityStudent: "как студент университета",
        createPost: "Создать публикацию",
        createPublication: "Создать публикацию",
        placeholder: "Поделитесь опытом или получите совет...",
        publish: "Опубликовать",
        publishing: "Публикую...",
        addImage: "Добавить изображение",
        needTextOrImage: "Нужен текст или изображение.",
        postError: "Ошибка при создании поста.",
        like: "Лайк",
        comment: "Комментарий",
        send: "Отправить",
        search: "Поиск...",
        you: "Вы",
        loadMore: "Показать ещё",
        loading: "Загрузка...",
        topAccounts: "Топ аккаунты",
        seeAll: "Посмотреть все →",
        communityDesc: "Сообщество профессионалов...",
        view: "Смотреть",
        logo: "Logo",
        links: ["Помощь","Наши вакансии","Реклама на сайте","Требования к ПО","Инвесторам","Каталог компаний","Работа по профессиям"],
        copyShort: "© 2025 «HeadHunter – Вакансии».",
        sitemap: "Карта сайта",
        rights: "Все права защищены.",
        createSite: "Создание сайтов",
    },
    UZ: {
        community: "Jamiyat",
        vacancies: "Vakansiyalar",
        chat: "Chat",
        companies: "Kompaniyalar",
        login: "Kirish",
        loginWarn: "Tizimga kiring.",
        anonymous: "Postni anonim joylashtirish",
        asSchoolStudent: "maktab o‘quvchisi sifatida",
        asCollegeStudent: "kollej talabasi sifatida",
        asUniversityStudent: "universitet talabasi sifatida",
        createPost: "Post yaratish",
        createPublication: "Post yaratish",
        placeholder: "Tajriba ulashing yoki maslahat oling...",
        publish: "Yaratish",
        publishing: "Yuklanmoqda...",
        addImage: "Rasm qo‘shish",
        needTextOrImage: "Matn yoki rasm bo‘lishi kerak.",
        postError: "Post yaratishda xatolik.",
        like: "Layk",
        comment: "Izoh",
        send: "Yuborish",
        search: "Qidiruv...",
        you: "Siz",
        loadMore: "Yana ko‘rsatish",
        loading: "Yuklanmoqda...",
        topAccounts: "Top akkauntlar",
        seeAll: "Hammasini ko‘rish →",
        communityDesc: "Konsalting professionallari jamiyati...",
        view: "Ko‘rish",
        logo: "Logo",
        links: ["Yordam","Bizning vakantiyalar","Saytda reklama","Dasturiy ta'minot talablari","Investorlar uchun","Kompaniyalar katalogi","Kasblar bo‘yicha ishlar"],
        copyShort: "© 2025 «HeadHunter – Vakansiyalar».",
        sitemap: "Sayt xaritasi",
        rights: "Barcha huquqlar himoyalangan.",
        createSite: "Sayt yaratish",
    },
    EN: {
        community: "Community",
        vacancies: "Vacancies",
        chat: "Chat",
        companies: "Companies",
        login: "Login",
        loginWarn: "Please log in.",
        anonymous: "Post anonymously",
        asSchoolStudent: "as a school student",
        asCollegeStudent: "as a college student",
        asUniversityStudent: "as a university student",
        createPost: "Create post",
        createPublication: "Create publication",
        placeholder: "Share your experience or ask for advice...",
        publish: "Publish",
        publishing: "Publishing...",
        addImage: "Add image",
        needTextOrImage: "Text or image is required.",
        postError: "Failed to create post.",
        like: "Like",
        comment: "Comment",
        send: "Send",
        search: "Search...",
        you: "You",
        loadMore: "Load more",
        loading: "Loading...",
        topAccounts: "Top accounts",
        seeAll: "See all →",
        communityDesc: "Community of professionals...",
        view: "View",
        logo: "Logo",
        links: ["Help","Our Vacancies","Advertising on site","Software Requirements","For Investors","Company Catalog","Jobs by Profession"],
        copyShort: "© 2025 “HeadHunter – Vacancies”.",
        sitemap: "Sitemap",
        rights: "All rights reserved.",
        createSite: "Website creation",
    },
};

const texts = {
    RU: {
        community: "Сообщество",
        vacancies: "Вакансии",
        chat: "Чат",
        companies: "Компании",
        login: "Войти",
        loginWarn: "Пожалуйста, войдите в систему.",
        anonymous: "Разместить пост анонимно",
        asSchoolStudent: "как студент школы",
        asCollegeStudent: "как студент колледжа",
        asUniversityStudent: "как студент университета",
        createPost: "Создать публикацию",
        createPublication: "Создать публикацию",
        placeholder: "Поделитесь опытом или получите совет...",
        publish: "Опубликовать",
        publishing: "Публикую...",
        addImage: "Добавить изображение",
        needTextOrImage: "Нужен текст или изображение.",
        postError: "Ошибка при создании поста.",
        like: "Лайк",
        comment: "Комментарий",
        send: "Отправить",
        search: "Поиск...",
        you: "Вы",
        loadMore: "Показать ещё",
        loading: "Загрузка...",
        topAccounts: "Топ аккаунты",
        seeAll: "Посмотреть все →",
        communityDesc: "Сообщество профессионалов...",
        view: "Смотреть",
        logo: "Logo",
        links: ["Помощь","Наши вакансии","Реклама на сайте","Требования к ПО","Инвесторам","Каталог компаний","Работа по профессиям"],
        copyShort: "© 2025 «HeadHunter – Вакансии».",
        sitemap: "Карта сайта",
        rights: "Все права защищены.",
        createSite: "Создание сайтов",
    },
    UZ: {
        community: "Jamiyat",
        vacancies: "Vakansiyalar",
        chat: "Chat",
        companies: "Kompaniyalar",
        login: "Kirish",
        loginWarn: "Tizimga kiring.",
        anonymous: "Postni anonim joylashtirish",
        asSchoolStudent: "maktab o‘quvchisi sifatida",
        asCollegeStudent: "kollej talabasi sifatida",
        asUniversityStudent: "universitet talabasi sifatida",
        createPost: "Post yaratish",
        createPublication: "Post yaratish",
        placeholder: "Tajriba ulashing yoki maslahat oling...",
        publish: "Yaratish",
        publishing: "Yuklanmoqda...",
        addImage: "Rasm qo‘shish",
        needTextOrImage: "Matn yoki rasm bo‘lishi kerak.",
        postError: "Post yaratishda xatolik.",
        like: "Layk",
        comment: "Izoh",
        send: "Yuborish",
        search: "Qidiruv...",
        you: "Siz",
        loadMore: "Yana ko‘rsatish",
        loading: "Yuklanmoqda...",
        topAccounts: "Top akkauntlar",
        seeAll: "Hammasini ko‘rish →",
        communityDesc: "Konsalting professionallari jamiyati...",
        view: "Ko‘rish",
        logo: "Logo",
        links: ["Yordam","Bizning vakantiyalar","Saytda reklama","Dasturiy ta'minot talablari","Investorlar uchun","Kompaniyalar katalogi","Kasblar bo‘yicha ishlar"],
        copyShort: "© 2025 «HeadHunter – Vakansiyalar».",
        sitemap: "Sayt xaritasi",
        rights: "Barcha huquqlar himoyalangan.",
        createSite: "Sayt yaratish",
    },
    EN: {
        community: "Community",
        vacancies: "Vacancies",
        chat: "Chat",
        companies: "Companies",
        login: "Login",
        loginWarn: "Please log in.",
        anonymous: "Post anonymously",
        asSchoolStudent: "as a school student",
        asCollegeStudent: "as a college student",
        asUniversityStudent: "as a university student",
        createPost: "Create post",
        createPublication: "Create publication",
        placeholder: "Share your experience or ask for advice...",
        publish: "Publish",
        publishing: "Publishing...",
        addImage: "Add image",
        needTextOrImage: "Text or image is required.",
        postError: "Failed to create post.",
        like: "Like",
        comment: "Comment",
        send: "Send",
        search: "Search...",
        you: "You",
        loadMore: "Load more",
        loading: "Loading...",
        topAccounts: "Top accounts",
        seeAll: "See all →",
        communityDesc: "Community of professionals...",
        view: "View",
        logo: "Logo",
        links: ["Help","Our Vacancies","Advertising on site","Software Requirements","For Investors","Company Catalog","Jobs by Profession"],
        copyShort: "© 2025 “HeadHunter – Vacancies”.",
        sitemap: "Sitemap",
        rights: "All rights reserved.",
        createSite: "Website creation",
    },
};