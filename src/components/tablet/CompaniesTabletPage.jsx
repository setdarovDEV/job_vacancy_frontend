import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, Star } from "lucide-react";
import api from "../../utils/api";
import NavbarTabletLogin from "./NavbarTabletLogIn.jsx";
import UserSearch from "./UserSearchTablet.jsx";
import {useNavigate} from "react-router-dom";
import CompanyModal from "./CompanyModalTablet.jsx";

const debounce = (fn, d = 400) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), d); };
};
const toMediaUrl = (p) => (p ? p : "/company-fallback.png");

// ------- Company Card -------
function CompanyCard({ company, onOpen }) {
    return (
        <div className="py-5">
            <div className="flex items-start gap-4">
                <img
                    src={toMediaUrl(company.logo)}
                    alt={`${company.name} Logo`}
                    className="w-[60px] h-[60px] rounded-full object-contain"
                    onError={(e)=>{ e.currentTarget.src="/company-fallback.png"; }}
                />
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            className="text-[20px] md:text-[22px] text-black bg-white ml-[-25px] font-bold hover:text-[#3066BE]"
                            onClick={()=>onOpen(company)}
                        >
                            {company.name}
                        </button>

                        {/* rating */}
                        <div className="flex items-center gap-1 text-[#3066BE]">
                            <span className="text-[14px] font-medium">{company.rating?.toFixed?.(1) ?? "—"}</span>
                            <Star size={16} className="fill-[#3066BE] text-[#3066BE]" />
                        </div>
                    </div>

                    <div className="mt-1 text-[13px] text-[#6B7280]">
                        {company.size_label || `${company.size || "1000+"} сотрудник`}  •  {company.country || "Узбекистан"}
                    </div>

                    <p className="mt-2 text-[13px] leading-5 text-[#7B7B7B] line-clamp-2">
                        {company.description}
                    </p>

                    <div className="mt-3 flex items-center gap-6 text-[13px]">
                        <button className="text-[#3066BE] hover:underline">{company.open_vacancies ?? 0} вакансии</button>
                        <span className="text-[#7B7B7B]">{company.reviews_count ?? 0}+ отзывов</span>
                    </div>
                </div>
            </div>
            <div className="h-px bg-[#E7ECF3] mt-5" />
        </div>
    );
}


// ==========================
// COMPONENT START
// ==========================
export default function CompanyPage() {
    // filters
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [keyword, setKeyword] = useState("");
    const [departments, setDepartments] = useState(new Set());
    const [ratingMin, setRatingMin] = useState(null);
    const [sizes, setSizes] = useState(new Set());
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const [companies, setCompanies] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rating, setRating] = useState(0); // Bosilgan yulduzlar soni
    const [selectedSize, setSelectedSize] = useState("");
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [openCompanyId, setOpenCompanyId] = useState(null);

    const perPage = 10;

    const departmentOptions = [
        "Администрация","Дизайн","Образование"
    ];
    const sizeOptions = [
        {key:"1-50", label:"1-50"},
        {key:"51-200", label:"51-200"},
        {key:"200-500", label:"200-500"},
        {key:"500-1000", label:"500-1000"},
        {key:"1000+", label:"1000+"},
    ];

    const fetchCompanies = async (params) => {
        setLoading(true);
        try {
            const res = await api.get("/api/companies/", { params });
            // kutiladigan response: { results: [...], count: 123 }
            setCompanies(res.data.results || res.data.items || []);
            setCount(res.data.count ?? res.data.total ?? 0);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useMemo(() => debounce(fetchCompanies, 450), []);

    // build query params
    const params = useMemo(() => {
        return {
            page,
            page_size: perPage,
            company: companyName || undefined,
            location: location || undefined,
            q: keyword || undefined,
            rating_min: ratingMin || undefined,
            size: sizes.size ? Array.from(sizes).join(",") : undefined,
            department: departments.size ? Array.from(departments).join(",") : undefined,
        };
        // eslint-disable-next-line
    }, [companyName, location, keyword, ratingMin, sizes, departments, page]);

    useEffect(() => {
        debouncedFetch(params);
    }, [params, debouncedFetch]);

    const handleCloseModal = () => {
        setOpenCompanyId(null);
        const params = new URLSearchParams(location.search);
        params.delete("open");
        navigate({ pathname: "/companies", search: params.toString() ? `?${params}` : "" }, { replace: true });
    };

    const handlePickUser = (u) => {
        setSelectedUser(u);
        fetchPost({ authorId: u.id, page: 1 });   // ✅ page=1 dan boshlaymiz
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // ixtiyoriy: tartiblash va qidiruv
                // const params = { ordering: '-avg_rating', search: searchTerm };

                const { data } = await api.get("api/companies/"); // yoki api.get("api/companies/", { params })
                // Pagination-agnostic: data.results bo‘lsa o‘shani olamiz, bo‘lmasa to‘g‘ridan-to‘g‘ri massiv
                const list = Array.isArray(data) ? data : data?.results || [];
                setCompanies(list);
                console.log("Kelgan kompaniyalar:", list);
            } catch (error) {
                console.error("Xatolik:", error);
            }
        };

        fetchCompanies();
    }, []);

    // const logoSrc = toMediaUrl(company?.logo);

    // ==========================
    // LANG CODE HANDLING
    // ==========================
    const langCode = selectedLang?.code === "GB" ? "EN" : selectedLang?.code || "RU";

    // ==========================
    // TEXTS (MULTILANGUAGE CONTENT)
    // ==========================
    const texts = {
        RU: {
            community: "Сообщество", vacancies: "Вакансии", chat: "Чат", companies: "Компании",
            keyword: "Ключевое слово:", position: "Должность", location: "Местоположение:",
            selectRegion: "Выберите регион", salary: "Зарплата:", selectSalary: "Выберите зарплату",
            plan: "План:", premium: "Выберите план", applicants: "2000 + соискателей, 200 + компаний, 100 + работодателей",
            resume: "ОСТАВЬТЕ РЕЗЮМЕ & ПОЛУЧИТЕ ЖЕЛАЕМУЮ РАБОТУ!", login: "Войти",
            categories: "Выбрать по категории", search: "Поиск...",
            published: "Опубликовано 2 часа назад",
            needed: "Нужен графический дизайнер",
            budget: "Бюджет: 100$-200$",
            description: "Мы ищем художников, которые помогут нам исправить визуализации упаковки, созданные с помощью ИИ. В частности, мы хотим исправить логотипы на каждом рендере. У нас есть большой набор данных логотипов + изображений, созданных с помощью ИИ.",
            tags: ["Лого дизайн", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Платеж подтвержден",
            location_vacancy: "Узбекистан",
            recommendedVacancies: "Рекомендуемые вакансии",
            publishVacancy: "Опубликовать вакансию",
            logo: "Logo",
            links: ["Помощь", "Наши вакансии", "Реклама на сайте", "Требования к ПО",
                "Инвесторам", "Каталог компаний", "Работа по профессиям"],
            copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
            createSite: "Создание сайтов",
            viewMore: "Посмотреть все →"
        },
        UZ: {
            community: "Jamiyat", vacancies: "Vakansiyalar", chat: "Chat", companies: "Kompaniyalar",
            keyword: "Kalit so'z:", position: "Lavozim", location: "Joylashuv:",
            selectRegion: "Hududni tanlang", salary: "Maosh:", selectSalary: "Maoshni tanlang",
            plan: "Reja:", premium: "Rejani tanlang", applicants: "2000 + nomzodlar, 200 + kompaniyalar, 100 + ish beruvchilar",
            resume: "REZYUMENI QOLDIRING & ISTALGAN ISHNI OLING!", login: "Kirish",
            categories: "Kategoriyani tanlang", search: "Qidiruv...",
            published: "2 soat oldin e'lon qilindi",
            needed: "Grafik dizayner kerak",
            budget: "Byudjet: 100$-200$",
            description: "Sun'iy intellekt yordamida yaratilgan qadoqlash vizualizatsiyasini tuzatishga yordam beradigan rassomlarni izlayapmiz. Xususan, biz har bir renderdagi logotiplarni to‘g‘rilamoqchimiz. Bizda sun'iy intellekt bilan yaratilgan katta logotiplar + tasvirlar bazasi bor.",
            tags: ["Logo dizayn", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "To‘lov tasdiqlangan",
            location_vacancy: "O‘zbekiston",
            recommendedVacancies: "Tavsiya etilgan vakansiyalar",
            publishVacancy: "Vakansiya e’lon qilish",
            logo: "Logo",
            links: ["Yordam", "Bizning vakantiyalar", "Saytda reklama", "Dasturiy ta'minot talablari",
                "Investorlar uchun", "Kompaniyalar katalogi", "Kasblar bo‘yicha ishlar"],
            copyright: "© 2025 «HeadHunter – Vakansiyalar». Barcha huquqlar himoyalangan. Sayt xaritasi",
            createSite: "Sayt yaratish",
            viewMore: "Hammasini ko‘rish →"
        },
        EN: {
            community: "Community", vacancies: "Vacancies", chat: "Chat", companies: "Companies",
            keyword: "Keyword:", position: "Position", location: "Location:",
            selectRegion: "Select region", salary: "Salary:", selectSalary: "Select salary",
            plan: "Plan:", premium: "Select plan", applicants: "2000+ applicants, 200+ companies, 100+ employers",
            resume: "LEAVE A RESUME & GET THE JOB YOU WANT!", login: "Login",
            categories: "Choose by category", search: "Search...",
            published: "Published 2 hours ago",
            needed: "Graphic designer needed",
            budget: "Budget: $100-$200",
            description: "We are looking for artists to help fix packaging visualizations created with AI. Specifically, we want to fix the logos on each render. We have a large dataset of logos + images created with AI.",
            tags: ["Logo design", "Adobe Illustrator", "Adobe Photoshop"],
            payment: "Payment verified",
            location_vacancy: "Uzbekistan",
            recommendedVacancies: "Recommended vacancies",
            publishVacancy: "Publish a vacancy",
            logo: "Logo",
            links: ["Help", "Our Vacancies", "Advertising on site", "Software Requirements",
                "For Investors", "Company Catalog", "Jobs by Profession"],
            copyright: "© 2025 «HeadHunter – Vacancies». All rights reserved. Sitemap",
            createSite: "Website creation",
            viewMore: "View all →"
        }
    };

    // ==========================
    // RETURN JSX
    // ==========================
    return (
        <>
            <main className="font-sans relative">
                <NavbarTabletLogin />
                {/* ========================== */}
                {/* SEARCH BLOK — TABLET       */}
                {/* ========================== */}
                <div className="bg-white  md:mt-[90px] md:block mr-[10px] lg:hidden">
                    <div className="mx-auto max-w-[960px] mt-[-80px] px-4 py-3">
                        {/* Qator: qidiruv (markazda) + ikonlar */}
                        <div className="flex items-center justify-between gap-3">
                            {/* Qidiruv */}
                            <div className="flex-1 flex justify-center">
                                <div className="w-full max-w-[420px]">
                                    <UserSearch onSelect={handlePickUser} />
                                </div>
                            </div>

                            {/* O‘ngdagi ikonlar */}
                            <div className="flex items-center gap-3 shrink-0">
                                {/* Bell */}
                                <button className="relative p-2 rounded-md hover:bg-gray-100 bg-white text-black" aria-label="Notifications">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.146.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-red-600 text-white text-[10px] grid place-items-center">
            1
          </span>
                                </button>
                            </div>
                        </div>

                        {/* Tanlangan user filtri (chip) */}
                        {selectedUser && (
                            <div className="mt-2 flex items-center gap-2 text-[13px]">
                                <span className="text-black">Filtr:</span>
                                <img
                                    src={mediaUrl(selectedUser.avatar_url ?? "", "/profile.png")}
                                    className="w-5 h-5 rounded-full object-cover"
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

                {/* BODY */}
                <div className="mx-auto max-w-[1024px] px-3 md:px-4 py-6">
                    <h1 className="text-center text-[28px] font-bold mb-4">Компании</h1>

                    <div className="grid grid-cols-12 gap-5">
                        {/* LEFT – FILTER */}
                        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
                            <div className="w-full flex flex-col gap-6">
                                {/* Компания */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[16px] leading-[24px] text-black font-semibold">
                                        Компания:
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Выберите компанию"
                                        className="w-full h-[44px] md:h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-[13px] md:text-sm outline-none border-none text-black"
                                    />
                                </div>

                                {/* Локация */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[16px] leading-[24px] text-black font-semibold">Локация:</label>
                                    <input
                                        type="text"
                                        placeholder="Выберите локацию"
                                        className="w-full h-[44px] md:h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-[13px] md:text-sm outline-none border-none text-black"
                                    />
                                </div>

                                {/* Ключевое слово */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[16px] leading-[24px] text-black font-semibold">Ключевое слово:</label>
                                    <input
                                        type="text"
                                        placeholder="Образование, интернет"
                                        className="w-full h-[44px] md:h-[49px] bg-[#F4F6FA] rounded-[10px] px-4 text-[13px] md:text-sm outline-none border-none text-black"
                                    />
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-[#AEAEAE]" />

                                {/* Должность */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-black font-semibold">Должность:</label>
                                    <div className="border-none border-[#AEAEAE] rounded-[2px] w-full lg:w-[138px] text-black text-sm max-h-[200px] overflow-y-auto bg-white">
                                        {["Администрация","Дизайн","Образование","Маркетинг","Разработка"].map((item,i)=>(
                                            <label key={i} className="flex items-center gap-2 mb-1">
                                                <input type="checkbox" className="accent-[#3066BE]" />
                                                {item}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Рейтинг компании */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-black font-semibold">Рейтинг компании</label>
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map((star)=>(
                                            <span
                                                key={star}
                                                onClick={()=>setRating(star)}
                                                className="text-[20px] cursor-pointer transition-colors"
                                                style={{ color: star <= rating ? "#FFBF00" : "#D9D9D9" }}
                                            >★</span>
                                        ))}
                                    </div>
                                    <a className="text-[#3066BE] hover:text-[#3066BE]">и выше</a>
                                </div>

                                {/* Размер компании */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-black font-semibold">Размер компании</label>
                                    {["1–50","51–200","200–500","500–1000","1000+","любой размер"].map((size,i)=>(
                                        <label key={i} className="flex items-center gap-2 text-sm text-black">
                                            <input
                                                type="radio"
                                                name="company_size"
                                                value={size}
                                                checked={selectedSize === size}
                                                onChange={()=>setSelectedSize(size)}
                                                className="peer w-[18px] h-[18px] rounded-[2px] border border-[#AEAEAE] checked:bg-[#3066BE] checked:border-[#3066BE] appearance-none"
                                            />
                                            {size}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* RIGHT — LIST */}
                        <section className="col-span-12 md:col-span-8 lg:col-span-9">
                            {/* RIGHT – COMPANY LIST (tablet friendly, dizayn saqlanadi) */}
                            <main className="flex-1 overflow-x-hidden px-4 md:px-8 py-4 md:py-6">
                                {/* BOSHI – chiziq */}
                                <div className="w-full md:w-[1000px] md:ml-[-300px] h-px bg-[#AEAEAE]" />

                                {Array.isArray(companies) && companies.length > 0 ? (
                                    companies.map((company) => {
                                        const logoSrc = toMediaUrl(company?.logo); // ← item ichida hisoblaymiz
                                        return (
                                            <div key={company.id} onClick={() => setSelectedCompany(company)} className="cursor-pointer">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                                        <img
                                                            src={logoSrc}
                                                            alt={`${company.name} Logo`}
                                                            className="w-[56px] h-[56px] md:w-[70px] md:h-[70px] rounded-full object-contain mt-3 md:mt-5"
                                                            onError={(e) => { e.currentTarget.src = "/company-fallback.png"; }}
                                                        />

                                                        <button className="text-[22px] md:text-[30px] bg-white border-none leading-[32px] md:leading-[45px] font-bold text-black ml-[-12px] md:ml-[-20px] mt-3 md:mt-5">
                                                            {company.name}
                                                        </button>

                                                        <div className="flex items-center gap-1">
                                                            <p className="text-[13px] md:text-[15px] leading-[20px] md:leading-[22.5px] font-medium text-[#3066BE] text-center ml-[-12px] md:ml-[-20px] mt-3 md:mt-5">
                                                                {company.hire_rate ?? "0%"}
                                                            </p>
                                                            <img src="/star.png" alt="" className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] mt-3 md:mt-5" />
                                                        </div>
                                                    </div>

                                                    <p className="text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] font-medium text-black">
                                                        {company.employees_label || "10+ сотрудников"} <span className="text-[#3066BE]">•</span> {company.location || "—"}
                                                    </p>

                                                    <p className="text-[14px] md:text-[20px] leading-[21px] md:leading-[30px] text-[#AEAEAE] font-normal max-w-[695px]">
                                                        {company.industry || "Отрасль не указана..."}
                                                    </p>

                                                    <div className="flex gap-4 md:gap-6 mt-1 md:mt-2 text-[13px] md:text-sm font-medium">
                                                        <p className="text-black font-bold">
                                                            {company.open_jobpost_count ?? 0} <span className="text-[#3066BE]">вакансии</span> • {company.jobpost_count ?? 0} <span className="text-[#3066BE]">всего</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="w-full h-px bg-[#AEAEAE] my-5 md:my-6"></div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-400 text-lg mt-4">Компаниялар mavjud emas yoki yuklanmoqda...</p>
                                )}
                            </main>


                            {/* Pagination */}
                            {count > perPage && (
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <button
                                        disabled={page===1}
                                        onClick={()=>setPage(p => Math.max(1, p-1))}
                                        className="px-3 py-1 border rounded-md text-[13px] disabled:opacity-40"
                                    >
                                        Назад
                                    </button>
                                    <div className="text-[13px]">Стр. {page} / {Math.ceil(count / perPage) || 1}</div>
                                    <button
                                        disabled={page >= Math.ceil(count / perPage)}
                                        onClick={()=>setPage(p => p+1)}
                                        className="px-3 py-1 border rounded-md text-[13px] disabled:opacity-40"
                                    >
                                        Вперёд
                                    </button>
                                </div>
                            )}
                        </section>

                        {selectedCompany && (
                            <CompanyModal
                                company={selectedCompany}
                                onClose={() => setSelectedCompany(null)}
                            />
                        )}

                        {openCompanyId && (
                            <CompanyModal
                                companyId={openCompanyId}
                                onClose={handleCloseModal}
                            />
                        )}

                    </div>
                </div>

                <footer className="relative overflow-hidden md:block lg:hidden mt-[50px] w-full">
                    {/* Background */}
                    <img
                        src="/footer-bg.png"
                        alt="Footer background"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

                    {/* Content */}
                    <div className="relative z-20 w-full px-6 py-8 text-white">
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
                        <div className="mt-6 bg-[#3066BE]/70 rounded-[10px] px-4 py-4 w-full">
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
            </main>
        </>
    );
}