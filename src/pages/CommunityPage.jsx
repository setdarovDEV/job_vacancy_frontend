// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import FollowButton from "../components/FollowButton.jsx";
import UserSearch from "../components/UserSearch";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import CommunityTablet from "../components/tablet/CommunityTabletPage.jsx";
import CommunityMobile from "../components/mobile/CommunityMobile.jsx";
import CompanyModal from "../components/CompanyModal.jsx";

// API bazasi: axios instance baseURL'idan foydalanamiz.
// Agar u '/api' bilan tugasa, media (avatar/logo) uchun shu '/api' ni olib tashlab, domenni ishlatamiz.
const API_BASE = (api?.defaults?.baseURL || "https://jobvacancy-api.duckdns.org").replace(/\/+$/, "");
const API_ORIGIN = API_BASE.replace(/\/api$/i, "");

// Relative fayl yo‘llarini to‘liq HTTPS URL ga aylantirish
const mediaUrl = (path, fallback = "/company.png") => {
    if (!path) return fallback;
    if (/^https?:\/\//i.test(path)) return path; // to‘liq URL bo‘lsa
    const clean = path.replace(/^\/+/, ""); // boshidagi / ni olib tashlaydi
    return `${API_ORIGIN}/${clean}`; // har doim domen bilan to‘liq bog‘laydi
};


// ==========================
// COMPONENT START
// ==========================
export default function CommunityPage() {
    // ==========================
    // STATE
    // ==========================
    const [showModal, setShowModal] = useState(false);
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [showLang, setShowLang] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [loading, setLoading] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostImage, setNewPostImage] = useState(null);
    const [creating, setCreating] = useState(false);

    const [likePending, setLikePending] = useState({});
    const [commentOpen, setCommentOpen] = useState(null); // qaysi post uchun panel ochiq
    const [commentsMap, setCommentsMap] = useState({}); // { [postId]: {items, count, next, loading} }
    const [newCommentMap, setNewCommentMap] = useState({});
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    const navigate = useNavigate();
    const [profileImage] = useState(localStorage.getItem("profile_image") || null);
    const [user, setUser] = useState(null);

    const [posts, setPosts] = useState([]);
    const [paging, setPaging] = useState({ page: 1, next: null, prev: null, count: 0 });
    const [selectedUser, setSelectedUser] = useState(null);

    // Postlarni olish (ixtiyoriy muallif bo‘yicha)
    const fetchPostList = async ({ authorId = null, page = 1 } = {}) => {
        try {
            setLoading(true);
            const params = { ordering: "-created_at", page };
            if (authorId) params.author = authorId;
            const { data } = await api.get("/api/posts/", { params });
            const items = Array.isArray(data) ? data : data?.results ?? [];
            setPosts(items);
            setPaging({
                page,
                next: data?.next || null,
                prev: data?.previous || null,
                count: data?.count || items.length,
            });
        } catch (e) {
            console.error("Postlarni olishda xatolik:", e);
        } finally {
            setLoading(false);
        }
    };

    // boshlang‘ich yuklash
    useEffect(() => { fetchPostList({ page: 1 }); }, []);

    // user tanlanganda
    const handlePickUser = (u) => {
        setSelectedUser(u);
        fetchPostList({ authorId: u.id, page: 1 });
    };

    // sahifalash misoli:
    const gotoPage = (p) => {
        fetchPostList({ authorId: selectedUser?.id || null, page: p });
    };

    const timeAgo = (iso, langCode = "RU") => {
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

    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files[0]) setNewPostImage(e.target.files[0]);
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim() && !newPostImage) {
            alert("Post matni yoki rasm bo‘lishi shart.");
            return;
        }
        const formData = new FormData();
        formData.append("content", newPostContent);
        if (newPostImage) formData.append("image", newPostImage);

        try {
            setCreating(true);
            const { data } = await api.post("/api/posts/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setPosts((prev) => [data, ...prev]);
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
                p.id === postId ? { ...p, is_liked: !prevLiked, likes_count: Math.max(0, prevCount + (prevLiked ? -1 : 1)) } : p
            )
        );
        setLikePending((s) => ({ ...s, [postId]: true }));

        try {
            const { data } = await api.post(`/api/posts/${postId}/like/`);
            setPosts((cur) => cur.map((p) => (p.id === postId ? { ...p, is_liked: data.liked, likes_count: data.likes_count } : p)));
        } catch (err) {
            // Revert
            setPosts((cur) => cur.map((p) => (p.id === postId ? { ...p, is_liked: prevLiked, likes_count: prevCount } : p)));
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

    // KOMMENTLARNI YUKLASH (next bo‘lsa absolyut ham bo‘lishi mumkin)
    const loadComments = async (postId, pageUrl = null) => {
        setCommentsMap((m) => ({ ...m, [postId]: { ...(m[postId] || {}), loading: true } }));
        try {
            const url = pageUrl
                ? pageUrl // absolyut bo‘lsa axios qabul qiladi
                : `/api/posts/${postId}/comments/`;
            const { data } = await api.get(url);
            setCommentsMap((m) => ({
                ...m,
                [postId]: {
                    items: pageUrl ? [...(m[postId]?.items || []), ...(data.results || [])] : data.results || [],
                    count: data.count,
                    next: data.next,
                    loading: false,
                },
            }));
        } catch (e) {
            console.error("Comments load error:", e);
            setCommentsMap((m) => ({ ...m, [postId]: { ...(m[postId] || {}), loading: false } }));
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
        setCommentsMap((m) => {
            const prev = m[postId]?.items || [];
            return { ...m, [postId]: { ...(m[postId] || {}), items: [temp, ...prev], count: (m[postId]?.count || 0) + 1 } };
        });
        setNewCommentMap((m) => ({ ...m, [postId]: "" }));
        setPosts((cur) => cur.map((p) => (p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p)));

        try {
            const { data } = await api.post(`/api/posts/${postId}/comments/`, { content: text });
            // temp ni haqiqiy kommentga almashtiramiz
            setCommentsMap((m) => {
                const items = (m[postId]?.items || []).map((c) => (c.id === temp.id ? data : c));
                return { ...m, [postId]: { ...(m[postId] || {}), items } };
            });
        } catch (e) {
            // Revert
            setCommentsMap((m) => {
                const items = (m[postId]?.items || []).filter((c) => c.id !== temp.id);
                return { ...m, [postId]: { ...(m[postId] || {}), items, count: Math.max(0, (m[postId]?.count || 1) - 1) } };
            });
            setPosts((cur) => cur.map((p) => (p.id === postId ? { ...p, comments_count: Math.max(0, (p.comments_count || 1) - 1) } : p)));
            if (e?.response?.status === 401) alert("Kommentariya uchun tizimga kiring.");
            console.error("Comment add error:", e);
        }
    };

    const [topCompanies, setTopCompanies] = useState([]);
    useEffect(() => {
        api
            .get("/api/companies/top/", { params: { limit: 5 } })
            .then(({ data }) => setTopCompanies(Array.isArray(data) ? data : data?.results || []))
            .catch((e) => console.error("Top companies error:", e));
    }, []);

    const handleView = (companyId) => {
        if (!companyId) return;
        setSelectedCompanyId(companyId);
    };

    const capitalizeName = (fullName) => {
        if (!fullName) return "";
        return fullName
            .toLowerCase()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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

    // ==========================
    // LANG CODE HANDLING
    // ==========================
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    // ==========================
    // TEXTS (MULTILANGUAGE CONTENT)
    // ==========================
    const texts = {
        RU: {
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            login: "Войти",
            logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО", "Инвесторам", "Каталог компаний", "Работа по профессиям"],
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
            postText:
                "Я сказал, что мой ожидаемый ctc составляет 10 lpa, но я чувствую, что у них есть лучший диапазон зарплат от 12 lpa до 16 lpa... Если честно, я думаю что ожидания могут совпасть с предложениями на рынке. Посмотрим что будет дальше.",
            hour: "2 ч",
            topAccounts: "Топ аккаунты",
            seeAll: "Посмотреть все →",
            communityDesc: "Сообщество профессионалов в области...",
            view: "Смотреть",
            subscribe: "Подписаться",
            loadMore: "Показать ещё",
            commentPlaceholder: "Комментарий...",
            publishing: "Публикуем...",
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            login: "Kirish",
            logo: "Logo",
            links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari", "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo‘yicha ishlar"],
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
            postText:
                "Men aytdimki, mening kutilayotgan ish haqi (ctc) 10 lpa, lekin ular 12 lpa dan 16 lpa gacha yaxshiroq diapazonga ega deb o‘ylayman... Ochig‘i, o‘ylaymanki, kutgan narsalarim bozor takliflari bilan mos kelishi mumkin. Ko‘ramiz, nima bo‘ladi.",
            hour: "2 s",
            topAccounts: "Top akkauntlar",
            seeAll: "Hammasini ko‘rish →",
            communityDesc: "Konsalting sohasidagi professionallar jamiyati...",
            view: "Ko‘rish",
            subscribe: "Obuna bo‘lish",
            loadMore: "Yana ko‘rsatish",
            commentPlaceholder: "Izoh...",
            publishing: "Yuklanmoqda...",
        },
        EN: {
            community: "Community",
            vacancies: "Vacancies",
            chat: "Chat",
            companies: "Companies",
            login: "Login",
            logo: "Logo",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements", "For Investors", "Company Catalog", "Jobs by Profession"],
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
            postText:
                "I said my expected ctc is 10 lpa, but I feel they have a better salary range from 12 lpa to 16 lpa... Honestly, I think my expectations might match the market offers. Let’s see what happens next.",
            hour: "2 h",
            topAccounts: "Top accounts",
            seeAll: "See all →",
            communityDesc: "Community of professionals in consulting...",
            view: "View",
            subscribe: "Subscribe",
            loadMore: "Load more",
            commentPlaceholder: "Comment...",
            publishing: "Publishing...",
        },
    };

    // ==========================
    // RETURN JSX
    // ==========================
    return (
        <>
            <div className="relative hidden font-sans bg-white lg:block">
                {/* NAVBAR */}
                <nav className="fixed top-0 left-0 w-full z-50 bg-[#F4F6FA] shadow-md">
                    <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[70px] md:h-[80px] lg:h-[90px]">
                        {/* Logo */}
                        <a href="/">
                            <img src="/logo.png" alt="Logo" className="w-[80px] h-[55px] md:w-[100px] md:h-[65px] lg:w-[109px] lg:h-[72px] object-contain" />
                        </a>

                        {/* Center links */}
                        <div className="hidden md:flex gap-4 md:gap-5 lg:gap-8 font-semibold text-[13px] md:text-[14px] lg:text-[16px] tracking-wide mx-auto">
                            <a href="" className="text-[#3066BE]  hover:text-[#3066BE] transition">
                                {texts[langCode].community}
                            </a>
                            <a href="/vacancies" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].vacancies}
                            </a>
                            <a href="/chat" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].chat}
                            </a>
                            <a href="/companies" className="text-black hover:text-[#3066BE] transition">
                                {texts[langCode].companies}
                            </a>
                        </div>

                        {/* Right side: flag + profile */}
                        <div className="items-center hidden gap-2 md:flex sm:gap-3 md:gap-4">
                            <ProfileDropdown />
                        </div>

                        {/* mobile flag + burger */}
                        <div className="flex items-center gap-3 pt-2 pr-4 md:hidden sm:pr-6">
                            <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => setShowLang(!showLang)}>
                                <img src={selectedLang.flag} alt={selectedLang.code} className="object-cover w-6 h-4" />
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                </svg>
                            </div>
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 bg-white rounded-md focus:outline-none">
                                <svg className="w-8 h-8" fill="none" stroke="#3066BE" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* mobile dropdown menu */}
                    {showMobileMenu && (
                        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 z-50">
                            <a href="" className="w-full px-4 py-3 text-center text-[#3066BE] hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].community}
                            </a>
                            <a href="/vacancies" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].vacancies}
                            </a>
                            <a href="/chat" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].chat}
                            </a>
                            <a href="/companies" className="w-full px-4 py-3 text-center text-black hover:bg-gray-100 hover:text-[#3066BE] transition">
                                {texts[langCode].companies}
                            </a>
                            <button className="mt-3 bg[#3066BE] text-white px-6 py-2 rounded-md hover:bg-[#274f94] transition text-[15px]">{texts[langCode].login}</button>
                        </div>
                    )}
                </nav>

                {/* SEARCH BLOK NAVBAR TAGIDA */}
                <div className="bg-white py-4 mt-[90px]">
                    <div className="flex items-center justify-between w-full px-4 mx-auto max-w-7xl">

                    </div>
                </div>

                <div className="flex w-full gap-6 px-4 mx-auto mt-10 max-w-7xl">
                    {/* LEFT: create post */}
                    <div className="hidden lg:block w-1/4 ml-[20px]">
                        <div className="bg-[#FFFFFF] focus-within:bg-[#F4F6FA] p-5 rounded-xl shadow-lg">
                            <div className="text-[#AEAEAE] text-[14px] leading-[20px] mb-3">{texts[langCode].anonymous}</div>
                            <select className="w-full mb-5 px-4 py-3 rounded-md bg-[#3066BE]/15 text-black focus:outline-none border-none appearance-none focus:bg-[#3066BE]/15 cursor-pointer">
                                <option>{texts[langCode].asSchoolStudent}</option>
                                <option>{texts[langCode].asCollegeStudent}</option>
                                <option>{texts[langCode].asUniversityStudent}</option>
                            </select>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-[190px] h-[52px] bg-[#3066BE] text-white rounded-[10px] text-[14px] leading-[20px] font-medium hover:bg-[#274f94] transition duration-300 border-none"
                                >
                                    {texts[langCode].createPost}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MODAL */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white rounded-xl p-6 w-[804px] h-[459px] max-w-[95%] relative">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white border border-[#3066BE] rounded-full text-[#3066BE] text-[20px] transition border-none"
                                >
                                    ×
                                </button>

                                <h2 className="text-center text-[18px] font-semibold mb-4">{texts[langCode].createPublication}</h2>

                                <textarea
                                    className="border-[#3066BE] w-full h-[280px] border rounded-md p-3 text-sm text-gray-700 resize-none"
                                    placeholder={texts[langCode].placeholder}
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                ></textarea>

                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={creating}
                                        className="bg-[#3066BE] text-white rounded-md px-5 py-2 text-sm hover:bg-[#264f90] transition border-none"
                                    >
                                        {creating ? texts[langCode].publishing : texts[langCode].publish}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CENTER: postlar listi */}
                    <div className="flex flex-col w-full gap-6 px-4 lg:w-2/4">
                        <div className="w-full h-[1px] bg-gray-300 mb-3"></div>

                        {loading && <div className="text-center text-[#AEAEAE] py-6">Yuklanmoqda...</div>}

                        {!loading && posts.length === 0 && <div className="text-center text-[#AEAEAE] py-6">Hozircha postlar yo‘q</div>}

                        {posts.map((post, idx, arr) => (
                            <div key={post.id ?? idx} className={`${idx === arr.length - 1 ? "mb-[86px]" : ""}`}>
                                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 h-[350px] flex flex-col justify-between">
                                    {/* USTKI QISM */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-[58px] h-[58px] rounded-full overflow-hidden border border-gray-300">
                                                <img
                                                    src={mediaUrl(post.author?.avatar, "/user1.png")}
                                                    alt={post.author?.full_name || "User"}
                                                    className="object-cover w-full h-full border rounded-full"
                                                />
                                            </div>

                                            <h2 className="text-[24px] font-bold text-black mt-2">
                                                {capitalizeName(post.author?.full_name || "Foydalanuvchi")}
                                            </h2>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-[20px] leading-[27px] text-[#AEAEAE]">{timeAgo(post.created_at, langCode)}</div>
                                        </div>
                                    </div>

                                    {/* MARKAZIY QISM */}
                                    <p className="text-[20px] text-gray-800 leading-relaxed mt-4">{post.content}</p>

                                    {/* PASTKI QISM */}
                                    <div className="flex gap-10 text-[#AEAEAE] font-medium mt-4 text-[16px]">
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => toggleLike(post.id)}
                                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleLike(post.id)}
                                            className={`flex items-center gap-2 cursor-pointer transition ${
                                                post.is_liked ? "text-[#3066BE]" : "text-[#AEAEAE] hover:text-[#3066BE]"
                                            } ${likePending[post.id] ? "pointer-events-none opacity-60" : ""}`}
                                            aria-pressed={post.is_liked}
                                        >
                                            <ThumbsUp size={20} />
                                            {texts[langCode].like}
                                        </div>

                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => toggleCommentsOpen(post.id)}
                                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleCommentsOpen(post.id)}
                                            className="flex items-center gap-2 transition cursor-pointer hover:text-blue-600"
                                        >
                                            <MessageCircle size={20} /> {texts[langCode].comment}
                                        </div>
                                    </div>

                                    {commentOpen === post.id && (
                                        <div className="mt-3">
                                            {/* Yangi komment input */}
                                            <div className="flex items-center w-full gap-3 mt-3">
                                                <input
                                                    type="text"
                                                    value={newCommentMap[post.id] || ""}
                                                    onChange={(e) => setNewCommentMap((m) => ({ ...m, [post.id]: e.target.value }))}
                                                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                                                    placeholder={texts[langCode].commentPlaceholder}
                                                    autoComplete="off"
                                                    className="flex-1 h-[44px] border border-gray-300 rounded-md px-3 text-sm text-gray-800 outline-none focus:border-[#3066BE] focus:ring-2 focus:ring-[#3066BE]/30"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post.id)}
                                                    className="shrink-0 h-[44px] px-5 rounded-md bg-[#3066BE] text-white text-sm hover:bg-[#264f90] transition border-none"
                                                >
                                                    {texts[langCode].send}
                                                </button>
                                            </div>

                                            {/* Kommentlar ro‘yxati */}
                                            <div className="mt-3 space-y-3">
                                                {(commentsMap[post.id]?.items || []).map((c) => (
                                                    <div key={c.id} className="text-sm text-gray-800">
                                                        <span className="font-medium">{c.author_name || c.author?.full_name || "User"}: </span>
                                                        <span>{c.content}</span>
                                                    </div>
                                                ))}

                                                {commentsMap[post.id]?.loading && <div className="text-[#AEAEAE] text-sm">Yuklanmoqda...</div>}

                                                {commentsMap[post.id]?.next && !commentsMap[post.id]?.loading && (
                                                    <button onClick={() => loadMoreComments(post.id)} className="text-[#3066BE] text-sm hover:underline">
                                                        {texts[langCode].loadMore}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full h-[1px] bg-gray-300 mt-5"></div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: top аккаунты */}
                    <div className="hidden w-1/4 lg:block">
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-[100px]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold text-black">{texts[langCode].topAccounts}</span>
                                <Link to="/companies" className="text-[#3066BE] text-sm hover:underline">
                                    {texts[langCode].seeAll}
                                </Link>
                            </div>

                            {topCompanies.length === 0 && (
                                <div className="text-[#AEAEAE] text-sm py-2">Данных нет</div>
                            )}

                            {topCompanies.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex flex-col justify-between w-[258px] h-[125px] border border-gray-200 rounded-xl p-3 mb-4 hover:shadow transition"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-[38px] h-[38px] bg-[#D9D9D9] rounded-full overflow-hidden flex items-center justify-center">
                                            <img
                                                src={mediaUrl(c.logo_url || c.logo, "/company.png")}
                                                alt={c.name}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = "/company-default.png";
                                                }}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-[#000000] text-[14px] leading-[21px] font-semibold">
                                              {c.name}
                                            </span>
                                                                            <span className="text-[#AEAEAE] text-[8px] leading-[12px] font-normal">
                                              {texts[langCode].communityDesc}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-3">
                                        {/* 🔹 Смотреть knopkasi */}
                                        <button
                                            className="bg-white text-black rounded-md px-3 py-1 text-[10px] border-none"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleView(
                                                    c?.id ??
                                                    c?.company?.id ??
                                                    c?.company_id ??
                                                    c?.pk ??
                                                    c?._id
                                                );
                                            }}
                                        >
                                            {texts[langCode].view}
                                        </button>

                                        {/* 🔹 Подписаться / Отписаться tugmasi */}
                                        <FollowButton
                                            companyId={c.id}
                                            defaultFollowing={!!(c.is_following ?? c.is_subscribed ?? c.followed)}
                                            defaultCount={c.followers_count}
                                            texts={texts}
                                            langCode={langCode}
                                            onChange={({ following, followers_count }) => {
                                                // ✅ State ni yangilaymiz: topCompanies ichida c.id bo‘yicha
                                                setTopCompanies((prev) =>
                                                    prev.map((item) =>
                                                        item.id === c.id
                                                            ? {
                                                                ...item,
                                                                is_following: following,
                                                                followers_count: followers_count,
                                                            }
                                                            : item
                                                    )
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {selectedCompanyId && (
                    <CompanyModal
                        companyId={selectedCompanyId}
                        onClose={() => setSelectedCompanyId(null)}
                    />
                )}


                {/* FOOTER */}
                <footer className="w-full h-[393px] relative overflow-hidden">
                    <img src="/footer-bg.png" alt="Footer background" className="absolute inset-0 z-0 object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

                    <div className="relative z-20">
                        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8 text-white">
                            <div className="flex gap-[190px]">
                                <div>
                                    <h2 className="text-[48px] leading-[150%] font-black text-white font-gilroy">{texts[langCode].logo}</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-[184px]">
                                    <div className="flex flex-col gap-[20px]">
                                        {texts[langCode].links.slice(0, 4).map((link, idx) => (
                                            <a
                                                key={idx}
                                                href="#"
                                                className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300"
                                            >
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-[20px]">
                                        {texts[langCode].links.slice(4).map((link, idx) => (
                                            <a
                                                key={idx}
                                                href="#"
                                                className="flex items-center gap-2 text-white hover:text-[#3066BE] text-[18px] leading-[120%] font-normal font-gilroy transition-colors duration-300"
                                            >
                                                <span>&gt;</span> {link}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-20 bg-[#3066BE]/70 h-[103px] rounded-[12px] ml-[38px] mr-[38px]">
                            <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center text-white text-[18px] leading-[120%] font-gilroy">
                                <p>{texts[langCode].copyright}</p>

                                <div className="flex gap-[20px] text-[24px] mr-[38px]">
                                    <a href="#" className="text-white">
                                        <i className="fab fa-whatsapp hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-instagram hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-facebook hover:text-[#F2F4FD]"></i>
                                    </a>
                                    <a href="#" className="text-white">
                                        <i className="fab fa-twitter hover:text-[#F2F4FD]"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Tablet */}
            <div className="hidden md:block lg:hidden">
            <CommunityTablet
                posts={posts}
                loading={loading}
                user={user}
                texts={texts}
                langCode={langCode}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                toggleLike={toggleLike}
                toggleCommentsOpen={toggleCommentsOpen}
                commentsMap={commentsMap}
                newCommentMap={newCommentMap}
                setNewCommentMap={setNewCommentMap}
                handleAddComment={handleAddComment}
                loadMoreComments={loadMoreComments}
                likePending={likePending}
                timeAgo={timeAgo}
                handlePickUser={handlePickUser}
                fetchPostList={fetchPostList}
                setShowModal={setShowModal}
                showModal={showModal}
                newPostContent={newPostContent}
                setNewPostContent={setNewPostContent}
                handleImageSelect={handleImageSelect}
                handleCreatePost={handleCreatePost}
                creating={creating}
            />
            </div>


            {/* Mobile */}
            <div className="block md:hidden">
                <CommunityMobile texts={texts} selectedLang={selectedLang} setSelectedLang={setSelectedLang} />
            </div>
        </>
    );
}
