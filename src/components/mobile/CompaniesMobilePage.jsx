import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, Star, MapPin, Briefcase, X } from "lucide-react";
import CompanyModal from "../CompanyModal"; // components/CompanyModal.jsx
import api from "../../utils/api";
import MobileNavbar from "./MobileNavbarLogin.jsx";
import MobileFooter from "./MobileFooter.jsx";
import HeaderNotifications from "./HeaderNotifications.jsx";
import CirclePagination from "./CirclePagination.jsx";
import CompaniesFilterFullModal from "./CompaniesFilterFullModal.jsx";
import CompanyDetailFullPage from "../mobile/CompanyDetailFullPage.jsx";

export default function CompaniesMobilePage() {
    // ==========================
    // STATE
    // ==========================
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [keyword, setKeyword] = useState("");
    const [rating, setRating] = useState(0);
    const [size, setSize] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    // sticky shadow on scroll
    const [elevated, setElevated] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const node = scrollRef.current;
        if (!node) return;
        const onScroll = () => setElevated(node.scrollTop > 4);
        node.addEventListener("scroll", onScroll);
        return () => node.removeEventListener("scroll", onScroll);
    }, []);

    // ==========================
    // HELPERS
    // ==========================
    const toMediaUrl = (u, host = window?.location?.origin || "") => {
        if (!u) return "/company-fallback.png";
        try { new URL(u); return u; } catch (_) {}
        return u.startsWith("/") ? `${host}${u}` : `${host}/${u}`;
    };

    const appliedChips = useMemo(() => {
        const chips = [];
        if (query) chips.push({ k: "Компания", v: query, onClear: () => setQuery("") });
        if (location) chips.push({ k: "Локация", v: location, onClear: () => setLocation("") });
        if (keyword) chips.push({ k: "Ключевое слово", v: keyword, onClear: () => setKeyword("") });
        if (rating) chips.push({ k: "Рейтинг", v: `${rating}+`, onClear: () => setRating(0) });
        if (size) chips.push({ k: "Размер", v: size, onClear: () => setSize("") });
        return chips;
    }, [query, location, keyword, rating, size]);

    // ==========================
    // DATA FETCH
    // ==========================
    const fetchCompanies = async ({ append = false, page: p = 1 } = {}) => {
        try {
            if (!append) setLoading(true);
            setError("");

            const params = {
                page: p,
                search: keyword || undefined,
                company: query || undefined,
                location: location || undefined,
                min_rating: rating || undefined,
                size: size || undefined,
                ordering: "-avg_rating", // better results up top on mobile
            };

            const { data } = await api.get("api/companies/", { params });
            const list = Array.isArray(data) ? data : data?.results || [];

            setCompanies((prev) => (append ? [...prev, ...list] : list));
            setHasMore(Boolean(data?.next) || (list.length >= 10)); // heuristic
            setPage(p);
        } catch (e) {
            console.error(e);
            setError("Ма'lumotlarni yuklashda xatolik.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // initial
        fetchCompanies({ append: false, page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // refetch when filters change
    useEffect(() => {
        const t = setTimeout(() => fetchCompanies({ append: false, page: 1 }), 250);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, location, keyword, rating, size]);

    const loadMore = () => {
        if (!hasMore || loading) return;
        fetchCompanies({ append: true, page: page + 1 });
    };

    // CompaniesMobilePage komponenti ichida (hooklar pastida) qo‘shing:
    useEffect(() => {
        const { style } = document.body;
        const prevOverflow = style.overflow;
        const prevOverscroll = style.overscrollBehavior;

        style.overflow = "hidden";           // body scroll yo‘q
        style.overscrollBehavior = "none";   // iOS/Android bounce yo‘q

        return () => {
            style.overflow = prevOverflow;
            style.overscrollBehavior = prevOverscroll;
        };
    }, []);

    if (selectedCompany) {
        return (
            <CompanyDetailFullPage
                company={selectedCompany}
                onClose={() => setSelectedCompany(null)}
            />
        );
    }


    // ==========================
    // UI SUBCOMPONENTS
    // ==========================
    const Header = () => (
        <>
            <MobileNavbar />

            <div className="ml-auto pr-4">
                <HeaderNotifications
                    count={1}
                    onHelpClick={() => console.log("Help clicked")}
                    onBellClick={() => console.log("Bell clicked")}
                />
            </div>

            {/* title */}
            <h1 className="text-center text-[22px] font-extrabold mt-4 text-black">Компании</h1>

            {/* add company (left) + filter (right) */}
            <div className="px-4 mt-8 mb-2 flex items-center justify-between">
                <button
                    onClick={() => console.log('Добавить компанию')}
                    className="text-[16px] font-semibold text-black bg-white border-none"
                >
                    Добавить компанию
                    <span className="block h-[2px] w-[76px] bg-black/20 mt-1" />
                </button>

                <button
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2 text-[16px] font-semibold bg-white border-none text-black"
                >
                    Фильтр
                    <SlidersHorizontal className="w-5 h-5 translate-y-[1px]" />
                </button>
            </div>
            <div className="h-[1px] w-full bg-black/20" />

        </>
    );

    // REPLACE CompanyCard with this
    const CompanyCard = ({ item }) => {
        const logoSrc = toMediaUrl(item?.logo);

        return (
            <>
                <button
                    onClick={() => setSelectedCompany(item)}
                    className="w-full text-left border-none active:opacity-95 bg-white"
                >
                    <div className="px-4 py-6">
                        <div className="flex items-start gap-3">
                            <img
                                src={logoSrc}
                                alt={`${item?.name || "Company"} Logo`}
                                className="w-10 h-10 rounded-full object-contain"
                                onError={(e) => { e.currentTarget.src = "/company-fallback.png"; }}
                            />

                            <div className="flex-1 min-w-0">
                                {/* name + rating 4.0 ★ (blue) */}
                                <div className="flex items-center gap-2">
                                    <p className="text-[20px] text-black font-semibold leading-none truncate">
                                        {item?.name || "—"}
                                    </p>
                                    <div className="flex items-center gap-1 text-[#3066BE]">
                                    <span className="text-[15px] leading-none font-semibold">
                                      {item?.avg_rating ?? "4.0"}
                                    </span>
                                        <Star className="w-4 h-4" color="#3066BE" fill="#3066BE" />
                                    </div>
                                </div>

                                {/* employees + location */}
                                <p className="mt-4 text-[16px] text-black">
                                    {item?.employee_count_label || "1000+ сотрудников"}{" "}
                                    <span className="text-[#3066BE]">•</span>{" "}
                                    {item?.location || "Узбекистан"}
                                </p>

                                {/* grey description, truncated */}
                                <p className="mt-4 text-[16px] text-black/30 line-clamp-2">
                                    {item?.description ||
                                        "С момента своего основания в 1998 году компания Google стремительно развивалась. Начав с двух студентов-компьютерщиков..."}
                                </p>

                                {/* bottom stats */}
                                <div className="mt-6 flex items-center gap-10">
                                    <div className="flex items-baseline gap-2">
                                    <span className="text-[16px] font-semibold text-black">
                                      {item?.open_jobpost_count ?? 10}
                                    </span>
                                        <span className="text-[16px] text-[#3066BE]">вакансии</span>
                                    </div>

                                    <div className="flex items-baseline gap-2">
                    <span className="text-[16px] font-semibold text-black">
                      {item?.reviews_count_label ?? "1000+"}
                    </span>
                                        <span className="text-[16px] text-[#3066BE]">отзывов</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
                <div className="h-[1px] w-full bg-black/20" />
            </>
        );
    };

    return (
        <>
            <div className="relative h-[100dvh] bg-white">
                <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
                    <Header />

                    {/* LIST */}
                    <div className="divide-y divide-black/10">
                        {loading && companies.length === 0 && (
                            <p className="px-4 py-6 text-sm text-black/60">Загрузка компаний…</p>
                        )}
                        {error && <p className="px-4 py-4 text-sm text-red-600">{error}</p>}
                        {!loading && companies.length === 0 && !error && (
                            <p className="px-4 py-6 text-sm text-black/60">Совпадений не найдено</p>
                        )}
                        {companies.map((c) => (
                            <CompanyCard key={c.id} item={c} />
                        ))}
                    </div>

                    <div className="py-6">
                        <CirclePagination current={page} total={5} onChange={setPage} />
                    </div>

                    {hasMore && (
                        <div className="p-4">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="w-full h-11 rounded-xl bg-[#F4F6FA] font-semibold active:scale-[0.99]"
                            >
                                {loading ? "Загрузка…" : "Показать ещё"}
                            </button>
                        </div>
                    )}

                    {/* safe area spaceri */}
                    <div style={{ height: "calc(env(safe-area-inset-bottom) + 8px)" }} />

                    {/* Footer asosiy sahifada qoladi */}
                    <MobileFooter />
                </div>

                {/* Filter to‘liq sahifa modal */}
                <CompaniesFilterFullModal
                    open={showFilters}
                    onClose={() => setShowFilters(false)}
                    query={query} setQuery={setQuery}
                    location={location} setLocation={setLocation}
                    keyword={keyword} setKeyword={setKeyword}
                    rating={rating} setRating={setRating}
                    size={size} setSize={setSize}
                    onClear={() => { setQuery(""); setLocation(""); setKeyword(""); setRating(0); setSize(""); }}
                    onApply={() => { setShowFilters(false); /* fetchCompanies({ append:false, page:1 }) */ }}
                />
            </div>
        </>
    );
}
